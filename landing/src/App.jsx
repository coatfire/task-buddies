import { useState, useEffect, useCallback } from 'react';

function Spark({ style, size = 24, opacity = 0.55 }) {
  return (
    <svg
      width={size}
      height={size * 0.86}
      viewBox="-28 -24 56 48"
      className="deco-spark"
      style={style}
      aria-hidden="true"
    >
      <g fill="#F0A275" opacity={opacity}>
        <path d="M0,-18 C3,-6 6,-3 18,0 C6,3 3,6 0,18 C-3,6 -6,3 -18,0 C-6,-3 -3,-6 0,-18 Z" />
        <circle cx="24" cy="-17" r="4" />
        <circle cx="-22" cy="20" r="3.5" />
      </g>
    </svg>
  );
}

const APP_URL = 'https://app.taskbuddies.app/';
const LOVOU_URL = 'https://www.lovou.app/?utm_source=taskbuddies&utm_medium=landing';
const SUPPORT_EMAIL = 'hello@lovou.app';
const SUPPORT_URL = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Task Buddies support')}`;

function LegalPage({ title, children }) {
  return (
    <div className="relative min-h-screen bg-cream-gradient text-cocoa-text">
      <div className="fixed inset-0 bg-cream-glow pointer-events-none" aria-hidden="true" />
      <main className="relative max-w-2xl mx-auto px-5 py-10 sm:py-16">
        <a href="/" className="inline-flex mb-8" aria-label="Task Buddies home">
          <img src="/logo.svg" alt="Task Buddies" width="240" height="120" className="w-52" />
        </a>
        <article className="glass-card legal-content">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-2">{title}</h1>
          {children}
        </article>
        <footer className="mt-8 text-sm opacity-60 flex gap-4">
          <a href="/privacy">Privacy</a>
          <a href="/support">Support</a>
        </footer>
      </main>
    </div>
  );
}

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p><strong>Last updated:</strong> September 22, 2026</p>
      <p>
        Task Buddies is made by{' '}
        <a className="underline underline-offset-2" href="https://coatfire.com/" target="_blank" rel="noopener noreferrer">Coatfire Limited</a>,
        Ireland. It is designed for children and families. The app does not require an account and
        does not include advertising, analytics, tracking, or in-app purchases.
      </p>
      <h2>Information the app handles</h2>
      <p>
        Routine choices, custom routines, timer progress, buddy choices, and reward settings are
        stored on your device. Task Buddies does not send this information to us or to a backend.
        Your device platform may include app data in its own device backup according to your Apple
        or Google account settings.
      </p>
      <p>
        The web version at app.taskbuddies.app stores the same settings in your browser&apos;s local
        storage. This is needed for the app to work and is not used for tracking. The web version is
        served by Vercel, whose servers keep standard access logs (IP address and browser type) for
        a short period to operate the service. We do not use these logs to identify anyone.
      </p>
      <h2>Permissions</h2>
      <p>
        The app may ask for notification permission so it can alert you when a routine step ends.
        Notifications are optional, and denying permission does not prevent the timer from working.
      </p>
      <h2>External links</h2>
      <p>
        Links to this privacy policy, to support, and to Lovou (our bedtime story app) open only
        after a grown-ups-only gate. Opening a link uses your device browser, where the
        destination&apos;s own privacy policy applies.
      </p>
      <h2>Children&apos;s privacy</h2>
      <p>
        Task Buddies does not knowingly collect personal information from children. Because the
        app does not collect or transmit user data, there is no child profile or account to delete.
        App data can be removed by clearing app storage or uninstalling the app.
      </p>
      <p>
        Parents and guardians can contact us with any question about their child&apos;s use of the
        app. Because we hold no data, there is nothing for us to access, correct, or delete, but we
        will confirm this in writing on request.
      </p>
      <h2>Changes to this policy</h2>
      <p>
        If the app ever changes in a way that affects your privacy, we will update this page and
        the date at the top before the change reaches the app stores.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy questions, email us at{' '}
        <a href={SUPPORT_URL}>{SUPPORT_EMAIL}</a>. Please don&apos;t include personal or sensitive
        information about your child.
      </p>
    </LegalPage>
  );
}

function SupportPage() {
  return (
    <LegalPage title="Task Buddies Support">
      <p>
        Task Buddies works offline and stores routines and settings on your device. No account is
        required.
      </p>
      <h2>Quick troubleshooting</h2>
      <ul>
        <li>If a timer alert does not appear, enable notifications for Task Buddies in device settings.</li>
        <li>If haptics are unavailable, check device accessibility and vibration settings.</li>
        <li>Restart the app if a timer screen does not refresh after returning from the background.</li>
        <li>Uninstalling the app removes locally stored routines and settings.</li>
      </ul>
      <h2>Get help</h2>
      <p>
        Email us at <a href={SUPPORT_URL}>{SUPPORT_EMAIL}</a> and we&apos;ll get back to you. Please
        don&apos;t include a child&apos;s name, screenshots containing personal information, or other
        sensitive data.
      </p>
      <a className="legal-link" href={SUPPORT_URL}>
        Email support
      </a>
    </LegalPage>
  );
}

/* ── Sprite sheet constants (matches app's PixelRexCharacter) ── */
const FRAME_SIZE   = 128;
const FRAME_COLS   = 4;
const FRAME_ROWS   = 4;
const FRAME_COUNT  = 16;
const FRAME_MS     = 100; // 1600ms / 16 frames

const SIZE_MULT = {
  hoppy: 1.56, snapper: 1.74, snoozy: 1.56, flutty: 1.62, buddy: 1.44,
};

function BuddySprite({ buddyId, size = 160 }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setFrame(f => (f + 1) % FRAME_COUNT), FRAME_MS);
    return () => clearInterval(timer);
  }, []);

  const scale  = (size / FRAME_SIZE) * (SIZE_MULT[buddyId] || 1);
  const col    = frame % FRAME_COLS;
  const row    = Math.floor(frame / FRAME_COLS);
  const bgPos  = `-${col * FRAME_SIZE}px -${row * FRAME_SIZE}px`;
  const bgSize = `${FRAME_SIZE * FRAME_COLS}px ${FRAME_SIZE * FRAME_ROWS}px`;

  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
      <div
        style={{
          width: FRAME_SIZE,
          height: FRAME_SIZE,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          backgroundImage: `url('/buddy-watercolor/${buddyId}-celebrate.webp')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
          willChange: 'background-position',
          imageRendering: 'auto',
        }}
      />
    </div>
  );
}

// Keep in sync with CHARACTERS in ../src/data/characters.js
const buddies = [
  { id: 'hoppy',   name: 'Hoppy'   },
  { id: 'snapper', name: 'Snapper' },
  { id: 'snoozy',  name: 'Snoozy'  },
  { id: 'flutty',  name: 'Flutty'  },
  { id: 'buddy',   name: 'Buddy'   },
];

const routines = [
  { emoji: '🌙', name: 'Bedtime',  tagline: 'Wind down without the battle' },
  { emoji: '☀️', name: 'Morning',  tagline: 'Out the door without the chaos' },
  { emoji: '📚', name: 'Homework', tagline: 'Focus without the meltdown' },
  { emoji: '⭐', name: 'Custom',   tagline: 'Build any routine that fits your child' },
];

const steps = [
  { n: 1, title: 'Pick a buddy and a routine', body: 'Five buddies. Bedtime, morning and homework come ready to go, or build your own.' },
  { n: 2, title: 'Your child does one task at a time', body: 'A ring slowly empties while the buddy waits. Finish the task, tap Done, and the buddy gets fed.' },
  { n: 3, title: 'Open the reward chest together', body: 'When the last task is done: confetti, a proud buddy, and a small reward you actually want to give.' },
];

function BuddyCarousel() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback((next) => {
    setVisible(false);
    setTimeout(() => {
      setIdx(next);
      setVisible(true);
    }, 250);
  }, []);

  const prev = () => goTo((idx - 1 + buddies.length) % buddies.length);
  const next = () => goTo((idx + 1) % buddies.length);

  useEffect(() => {
    const id = setInterval(() => {
      goTo((idx + 1) % buddies.length);
    }, 2800);
    return () => clearInterval(id);
  }, [idx, goTo]);

  const buddy = buddies[idx];

  return (
    <div className="flex flex-col items-center gap-3 mb-5">
      <a
        href={APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="buddy-carousel-link"
        aria-label={`Meet ${buddy.name} in the app`}
      >
        <div
          className="buddy-float"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease' }}
        >
          <BuddySprite buddyId={buddy.id} size={160} />
        </div>
        <p
          className="text-center font-display font-bold text-sm mt-1"
          style={{ opacity: visible ? 0.6 : 0, transition: 'opacity 0.25s ease' }}
        >
          {buddy.name}
        </p>
      </a>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button onClick={prev} className="carousel-arrow" aria-label="Previous buddy">&#8249;</button>
        <div className="flex gap-1.5">
          {buddies.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`View ${buddies[i].name}`}
              className={`carousel-dot${i === idx ? ' carousel-dot-active' : ''}`}
            />
          ))}
        </div>
        <button onClick={next} className="carousel-arrow" aria-label="Next buddy">&#8250;</button>
      </div>
    </div>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/privacy') return <PrivacyPage />;
  if (path === '/support') return <SupportPage />;

  return (
    <div className="relative min-h-screen bg-cream-gradient text-cocoa-text overflow-x-hidden">
      <div className="fixed inset-0 bg-cream-glow pointer-events-none" aria-hidden="true" />

      {/* Decorative sparks */}
      <Spark style={{ top: '6%',    left: '8%'   }} size={26} opacity={0.5}  />
      <Spark style={{ top: '16%',   right: '9%'  }} size={18} opacity={0.38} />
      <Spark style={{ top: '48%',   left: '5%'   }} size={14} opacity={0.25} />
      <Spark style={{ bottom: '18%',right: '7%'  }} size={20} opacity={0.3}  />

      <main className="relative max-w-[440px] mx-auto px-5 pt-10 pb-16 flex flex-col items-center">

        {/* ── Logo ── */}
        <div className="w-full flex justify-center mb-6">
          <img
            src="/logo.svg"
            alt="Task Buddies"
            width="480"
            height="240"
            className="w-64 sm:w-72"
          />
        </div>

        {/* ── Buddy carousel ── */}
        <BuddyCarousel />

        {/* ── Eyebrow ── */}
        <div className="eyebrow-pill mb-5">
          Free. No signup. Works offline.
        </div>

        {/* ── Headline ── */}
        <h1 className="font-display font-extrabold text-[2.5rem] sm:text-5xl text-center leading-[1.1] mb-4">
          Routines are hard.
          <br />
          Buddies help.
        </h1>

        {/* ── Subheadline ── */}
        <p className="text-center text-[1.0625rem] leading-relaxed opacity-75 max-w-xs mb-8">
          A cozy companion that sits with your child through bedtime, mornings
          and homework, one step at a time. You stop nagging. They keep going.
        </p>

        {/* ── Primary CTA (above the fold) ── */}
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-launch w-full mb-12"
        >
          Meet Your Buddy
        </a>

        {/* ── How a routine works ── */}
        <section className="w-full mb-10" aria-label="How it works">
          <h2 className="font-display font-bold text-xl text-center mb-5">How a routine works</h2>
          <ol className="space-y-3">
            {steps.map(({ n, title, body }) => (
              <li key={n} className="glass-card !p-4 flex gap-4 items-start">
                <span className="step-num">{n}</span>
                <div>
                  <p className="font-display font-bold text-[0.95rem] leading-snug">{title}</p>
                  <p className="text-[0.875rem] leading-relaxed opacity-70 mt-0.5">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Why it works ── */}
        <section className="glass-card w-full mb-10" aria-label="Why it works">
          <h2 className="font-display font-bold text-xl mb-3">Why it works</h2>
          <div className="space-y-4 text-[0.9375rem] leading-relaxed">
            <p>
              Nothing here is clever. It's the boring stuff that occupational therapists
              and teachers have used for years, wrapped in something a five-year-old wants
              to look at.
            </p>
            <ul className="why-list">
              <li><strong>Time you can see.</strong> A ring slowly empties around the buddy. Kids don't read clocks; they read shapes.</li>
              <li><strong>One step at a time.</strong> Only the current task is on screen. The rest of the routine can wait.</li>
              <li><strong>A reward that always arrives.</strong> Finishing a task feeds the buddy, every time, straight away.</li>
              <li><strong>No way to fail.</strong> When time runs out, nothing beeps and nothing is lost. The buddy just gets hungry and waits.</li>
            </ul>
            <p>
              Some parents call it body doubling: it's easier to do a hard thing when
              someone friendly is sitting with you. A buddy isn't a person, but for a lot of
              kids that little face is enough to get started.
            </p>
          </div>
        </section>

        {/* ── Rewards ── */}
        <section className="glass-card w-full mb-10" aria-label="About rewards">
          <h2 className="font-display font-bold text-xl mb-3">The reward is you</h2>
          <div className="space-y-4 text-[0.9375rem] leading-relaxed">
            <p>
              When the routine is done, a chest appears. Inside isn't screen time or
              sugar. It's a secret handshake. Sixty seconds of freeze dance. One minute of
              silly faces, together.
            </p>
            <p>
              Small enough that you'll always say yes. Big enough that they'll remember.
              You can edit the list to suit your family. The chest is the excuse; the
              minute together is the point.
            </p>
          </div>
        </section>

        {/* ── Routine types ── */}
        <section className="w-full mb-10" aria-label="Routine types">
          <div className="grid grid-cols-2 gap-3">
            {routines.map(({ emoji, name, tagline }) => (
              <div key={name} className="routine-card">
                <span className="text-2xl leading-none mb-1" role="img" aria-label={name}>{emoji}</span>
                <span className="font-display font-bold text-sm">{name}</span>
                <span className="text-[0.75rem] leading-snug opacity-60">{tagline}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Lovou bridge ── */}
        <section className="glass-card w-full mb-10 lovou-card" aria-label="About Lovou">
          <p className="eyebrow-pill inline-block mb-3">From the makers of Lovou</p>
          <h2 className="font-display font-bold text-xl mb-2">The other half of our bedtime</h2>
          <p className="text-[0.9375rem] leading-relaxed mb-4">
            Task Buddies gets you through the routine. Lovou is the story after it,
            made with your child and played back in the voices they choose. No ads,
            nothing sold to anyone.
          </p>
          <a className="legal-link !mt-0" href={LOVOU_URL} target="_blank" rel="noopener noreferrer">
            Have a look at Lovou
          </a>
        </section>

        {/* ── Trust line ── */}
        <p className="text-[0.8125rem] text-center opacity-50 leading-relaxed mb-8 max-w-[280px]">
          Free. No data collected. No cookies. No account.
          <br />
          Works offline. Just open it and go.
        </p>

        {/* ── CTA ── */}
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-launch w-full mb-12"
        >
          Meet Your Buddy
        </a>

        {/* ── Footer ── */}
        <footer className="text-xs text-center opacity-50 flex flex-wrap justify-center gap-x-3 gap-y-2">
          <span>Coatfire Limited, makers of Lovou &nbsp;&middot;&nbsp; taskbuddies.app</span>
          <a href="/privacy">Privacy</a>
          <a href="/support">Support</a>
        </footer>

      </main>
    </div>
  );
}
