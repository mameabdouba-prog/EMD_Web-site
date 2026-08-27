import { useEffect, useRef, useState } from 'react';

/**
 * Compteur animé : anime une valeur numérique ("95%+", "20+", "4")
 * de 0 jusqu'à sa cible lorsque l'élément entre dans le viewport.
 * Les valeurs non numériques ("Thiès") sont affichées telles quelles.
 */
const EASE_OUT_QUART = (t) => 1 - Math.pow(1 - t, 4);

const parseValue = (value) => {
  const match = String(value).match(/^([\d.,]+)(.*)$/);
  if (!match) return null;
  const raw = match[1].replace(',', '.');
  const num = parseFloat(raw);
  if (Number.isNaN(num)) return null;
  const decimals = (raw.split('.')[1] || '').length;
  return { num, decimals, suffix: match[2] };
};

const CountUp = ({ value, duration = 1600, className = '' }) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(() => {
    const parsed = parseValue(value);
    return parsed ? (0).toFixed(parsed.decimals) : String(value);
  });

  useEffect(() => {
    const el = ref.current;
    const parsed = parseValue(value);
    if (!el || !parsed || typeof IntersectionObserver === 'undefined') {
      if (!parsed) setDisplay(String(value));
      return undefined;
    }

    let rafId;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);

        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = EASE_OUT_QUART(progress);
          setDisplay((parsed.num * eased).toFixed(parsed.decimals));
          if (progress < 1) {
            rafId = requestAnimationFrame(tick);
          } else {
            setDisplay(`${parsed.num.toFixed(parsed.decimals)}${parsed.suffix}`);
          }
        };
        rafId = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

export default CountUp;
