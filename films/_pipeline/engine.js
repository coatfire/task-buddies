// Deterministic timeline renderer. window.setup(timeline, layoutName) then await window.renderAt(t).
// Every visual is a pure function of t, so any frame can be rendered in any order.
(() => {
  const SHOT = 1170 / 2532; // captured screen aspect

  function cardRect(area, maxW, aspect = SHOT) {
    let h = area.h, w = h * aspect;
    if (w > (maxW ?? area.w)) { w = maxW ?? area.w; h = w / aspect; }
    return { x: area.x + (area.w - w) / 2, y: area.y + (area.h - h) / 2, w, h };
  }

  const LAYOUTS = {
    '9x16': { W: 1080, H: 1920, caption: { x: 80, y: 120, w: 920, h: 300 }, screenArea: { x: 0, y: 440, w: 1080, h: 1420 }, font: 68, radius: 46, align: 'center' },
    '4x5': { W: 1080, H: 1350, caption: { x: 80, y: 50, w: 920, h: 220 }, screenArea: { x: 0, y: 290, w: 1080, h: 1010 }, font: 56, radius: 34, align: 'center' },
    '1x1': { W: 1080, H: 1080, caption: { x: 70, y: 0, w: 450, h: 1080 }, screenArea: { x: 560, y: 60, w: 470, h: 960 }, font: 52, radius: 32, align: 'left' },
    'store886': { W: 886, H: 1920, caption: { x: 60, y: 150, w: 766, h: 240 }, screenFull: true, font: 64, radius: 0, align: 'center' },
    'store1080': { W: 1080, H: 1920, caption: { x: 70, y: 150, w: 940, h: 260 }, screenFull: true, font: 72, radius: 0, align: 'center' },
  };

  let TL = null, L = null, els = [];

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  // Keyframe track: [[t, value], ...] where value is a number or an array of numbers.
  function sample(track, t) {
    if (!track || !track.length) return undefined;
    if (t <= track[0][0]) return track[0][1];
    for (let i = 1; i < track.length; i++) {
      const [t1, v1] = track[i];
      if (t <= t1) {
        const [t0, v0] = track[i - 1];
        const k = ease((t - t0) / Math.max(1e-6, t1 - t0));
        return Array.isArray(v0) ? v0.map((a, j) => a + (v1[j] - a) * k) : v0 + (v1 - v0) * k;
      }
    }
    return track[track.length - 1][1];
  }

  function regionRect(name) {
    if (name === 'full') return { x: 0, y: 0, w: L.W, h: L.H };
    if (name === 'caption') return L.caption;
    if (name === 'captionTop') return L.caption;
    if (name === 'captionBottom') return L.screenFull ? { ...L.caption, y: L.H - L.caption.y - L.caption.h - 40 } : L.caption;
    if (name === 'screen') return L.screenFull ? { x: 0, y: 0, w: L.W, h: L.H } : cardRect(L.screenArea);
    if (name === 'screenLeft' || name === 'screenRight') {
      if (L.screenFull) return { x: name === 'screenLeft' ? 0 : L.W / 2, y: 0, w: L.W / 2, h: L.H };
      const a = L.screenArea, half = { x: a.x + (name === 'screenRight' ? a.w / 2 : 0), y: a.y, w: a.w / 2, h: a.h };
      const r = cardRect({ x: half.x + 16, y: half.y, w: half.w - 32, h: half.h });
      return r;
    }
    if (typeof name === 'object') return name; // explicit rect in stage pixels
    throw new Error('unknown region ' + name);
  }

  function build(spec) {
    const root = document.createElement('div');
    root.className = 'el';
    let r = { ...regionRect(spec.region || 'full') };
    // A cropped capture (mw x mh device px) keeps its own aspect: inside the screen card area, or pinned to the top when full frame.
    if (spec.kind === 'screen' && spec.mh && (spec.region || 'screen') === 'screen') {
      r = L.screenFull ? { x: 0, y: 0, w: L.W, h: L.W * spec.mh / spec.mw } : cardRect(L.screenArea, undefined, spec.mw / spec.mh);
    }
    if (spec.band === 'top') r.h *= 0.62;
    if (spec.band === 'bottom') { r.y += r.h * 0.62; r.h *= 0.38; }
    Object.assign(root.style, { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' });
    const e = { spec, root, r };
    const scale = r.w / 656; // relative to the 9x16 card width

    if (spec.kind === 'screen') {
      root.classList.add('card');
      if (!L.screenFull || spec.region === 'screenLeft' || spec.region === 'screenRight') root.style.borderRadius = (L.radius * (r.w / regionRect('screen').w || 1)) + 'px';
      const media = document.createElement(spec.video ? 'video' : 'img');
      media.src = spec.video || spec.src;
      if (spec.video) { media.muted = true; media.preload = 'auto'; media.playsInline = true; }
      e.IW = spec.mw || 1170; e.IH = spec.mh || 2532;
      media.style.width = e.IW + 'px'; media.style.height = e.IH + 'px';
      root.appendChild(media);
      e.media = media;
    } else if (spec.kind === 'text') {
      root.classList.add('caption');
      if (L.align === 'left' && (spec.region || 'caption').startsWith('caption')) root.classList.add('left');
      root.style.fontSize = (L.font * (spec.size || 1)) + 'px';
      if (spec.color) root.style.color = spec.color;
      root.innerHTML = spec.text.split('\n').map((l) => `<span style="display:block">${l}</span>`).join('');
      root.style.flexDirection = 'column';
    } else if (spec.kind === 'placeholder') {
      root.classList.add('placeholder');
      root.style.borderRadius = (L.radius || 24) + 'px';
      root.style.fontSize = (34 * scale) + 'px';
      root.innerHTML = `<div class="tag" style="font-size:0.7em">Screen not captured</div><div class="label" style="font-size:1.25em;padding:0 1em">${spec.label}</div>${spec.sub ? `<div class="sub" style="font-size:0.75em;padding:0 1.4em">${spec.sub}</div>` : ''}`;
    } else if (spec.kind === 'endcard') {
      root.classList.add('endcard');
      const base = Math.min(L.W, L.H);
      root.innerHTML = `<img src="${spec.logo}" style="width:${base * 0.5}px"><div class="url" style="font-size:${base * 0.045}px;margin-top:${base * 0.07}px">${spec.url}</div>${spec.label ? `<div class="ea" style="font-size:${base * 0.028}px;margin-top:${base * 0.03}px">${spec.label}</div>` : ''}`;
    } else if (spec.kind === 'sprite') {
      // Frames stepped straight from a 4x4 sheet, as the app does (src/components/rex/PixelRexCharacter.jsx).
      const layer = (extra) => `<div style="position:absolute;inset:0;${extra}"></div>`;
      const pos = 'background-size:400% 400%;background-repeat:no-repeat;';
      root.innerHTML = layer(`background-image:url('${spec.sheet}');${pos}`)
        + layer(`background:${spec.inkColor || '#4A3426'};-webkit-mask-image:url('${spec.sheet}');mask-image:url('${spec.sheet}');-webkit-mask-size:400% 400%;mask-size:400% 400%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;opacity:0`);
      e.layers = [...root.children];
    } else if (spec.kind === 'html') {
      root.innerHTML = spec.html.replaceAll('{{S}}', String(scale));
      if (spec.css) Object.assign(root.style, spec.css);
    } else if (spec.kind === 'blur') {
      Object.assign(root.style, { backdropFilter: `blur(${spec.amount || 14}px)`, WebkitBackdropFilter: `blur(${spec.amount || 14}px)`, borderRadius: '12px' });
      const fr = spec.rect; // fraction of the referenced screen element
      e.blurOf = spec.of; e.frac = fr;
    }
    document.getElementById('stage').appendChild(root);
    return e;
  }

  function focusTransform(e, t) {
    const f = sample(e.spec.focus, t) || [0, 0, 1, 1];
    const [fx, fy, fw, fh] = f;
    const IW = e.IW || 1170, IH = e.IH || 2532, W = e.r.w, H = e.r.h;
    const s = Math.max(W / (fw * IW), H / (fh * IH));
    let tx = W / 2 - (fx + fw / 2) * IW * s;
    let ty = H / 2 - (fy + fh / 2) * IH * s;
    tx = clamp(tx, W - IW * s, 0);
    ty = clamp(ty, H - IH * s, 0);
    return { s, tx, ty };
  }

  window.setup = async (timeline, layoutName) => {
    TL = timeline; L = LAYOUTS[layoutName];
    if (!L) throw new Error('unknown layout ' + layoutName);
    const stage = document.getElementById('stage');
    stage.style.width = L.W + 'px'; stage.style.height = L.H + 'px';
    stage.innerHTML = '';
    els = timeline.elements.filter((s) => !s.layouts || s.layouts.includes(layoutName)).map(build);
    await document.fonts.ready;
    await Promise.all(els.flatMap((e) => {
      const ps = [...e.root.querySelectorAll('img')].map((i) => (i.complete ? null : new Promise((r) => { i.onload = r; i.onerror = r; })));
      if (e.media?.tagName === 'VIDEO') ps.push(new Promise((r) => { if (e.media.readyState >= 2) r(); else e.media.addEventListener('loadeddata', r, { once: true }); }));
      return ps;
    }));
    return { W: L.W, H: L.H };
  };

  window.renderAt = async (t) => {
    const seeks = [];
    for (const e of els) {
      const s = e.spec;
      const tin = s.in ?? 0, tout = s.out ?? TL.duration;
      const fi = s.fadeIn ?? 0.35, fo = s.fadeOut ?? 0.35;
      if (t < tin - 0.0001 || t > tout + 0.0001) { e.root.style.display = 'none'; continue; }
      e.root.style.display = '';
      let op = 1;
      if (fi > 0 && t < tin + fi) op = ease(clamp((t - tin) / fi, 0, 1));
      if (fo > 0 && t > tout - fo) op = Math.min(op, ease(clamp((tout - t) / fo, 0, 1)));
      const kop = sample(s.opacity, t);
      if (kop !== undefined) op *= kop;
      let dy = 0, dx = 0, sc = 1;
      if (s.enter === 'up' && t < tin + fi) dy += (1 - ease(clamp((t - tin) / fi, 0, 1))) * 40;
      if (s.enter === 'scale' && t < tin + fi) sc *= 0.94 + 0.06 * ease(clamp((t - tin) / fi, 0, 1));
      dx += sample(s.x, t) || 0; dy += sample(s.y, t) || 0;
      const ks = sample(s.scale, t); if (ks !== undefined) sc *= ks;
      e.root.style.opacity = op;
      const ry = sample(s.rotY, t);
      e.root.style.transform = `${ry !== undefined ? 'perspective(2400px) ' : ''}translate(${dx}px, ${dy}px) scale(${sc})${ry !== undefined ? ` rotateY(${ry}deg)` : ''}`;
      if (s.innerY) { const n = e.root.querySelector('[data-scroll]'); if (n) n.style.transform = `translateY(${sample(s.innerY, t)}%)`; }
      if (s.filter) e.root.style.filter = sample(s.filter, t) !== undefined ? `blur(${sample(s.filter, t)}px)` : '';
      if (e.media) {
        const { s: k, tx, ty } = focusTransform(e, t);
        e.media.style.transform = `translate(${tx}px, ${ty}px) scale(${k})`;
        if (e.media.tagName === 'VIDEO') {
          const rate = s.rate || 1;
          const target = clamp((s.start || 0) + (t - tin) * rate, 0, Math.max(0, e.media.duration - 0.05));
          if (Math.abs(e.media.currentTime - target) > 0.001) {
            seeks.push(new Promise((r) => { e.media.addEventListener('seeked', r, { once: true }); e.media.currentTime = target; }));
          }
        }
      }
      if (e.layers) {
        const fps = s.fps || 10, n = 16;
        const raw = Math.floor((t - tin + (s.offset || 0)) * fps + 1e-6);
        const f = s.loop === false ? Math.min(raw, n - 1) : ((raw % n) + n) % n;
        const p = `${(f % 4) * 100 / 3}% ${Math.floor(f / 4) * 100 / 3}%`;
        e.layers[0].style.backgroundPosition = p;
        e.layers[1].style.webkitMaskPosition = p; e.layers[1].style.maskPosition = p;
        e.layers[1].style.opacity = sample(s.ink, t) ?? 0;
      }
      if (e.blurOf) {
        const tgt = els.find((x) => x.spec.id === e.blurOf);
        const { s: k, tx, ty } = focusTransform(tgt, t);
        const [bx, by, bw, bh] = e.frac;
        Object.assign(e.root.style, { left: (tgt.r.x + tx + bx * tgt.IW * k) + 'px', top: (tgt.r.y + ty + by * tgt.IH * k) + 'px', width: (bw * tgt.IW * k) + 'px', height: (bh * tgt.IH * k) + 'px' });
      }
    }
    await Promise.all(seeks);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  };
})();
