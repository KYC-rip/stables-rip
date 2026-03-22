import { useState, useEffect } from 'react';

interface CounterProps {
  value: number;
  duration?: number;
  formatter: (val: number) => string;
}

export function Counter({ value, duration = 2000, formatter }: CounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(eased * value);
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(value);
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{formatter(display)}</span>;
}
