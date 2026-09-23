import { useEffect, useState } from 'react';

const BASE_FONT_PX = 16;

function readViewport() {
  if (typeof window === 'undefined') return { scale: 1, rem: BASE_FONT_PX, vw: 390, vh: 844 };
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || BASE_FONT_PX;
  return { scale: rem / BASE_FONT_PX, rem, vw: window.innerWidth, vh: window.innerHeight };
}

/**
 * Root font scale (1 on phones, follows the tablet scaling in index.css) plus viewport size,
 * so pixel-sized props (sprites) can grow in step with the rem-based layout.
 */
export function useRootScale() {
  const [viewport, setViewport] = useState(readViewport);

  useEffect(() => {
    const update = () => setViewport(readViewport());
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return viewport;
}

export const scaled = (px, scale) => Math.round(px * scale);
