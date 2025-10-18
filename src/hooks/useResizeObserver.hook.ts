import { useState, useEffect } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

export function useResizeObserver<T extends HTMLElement>(
  ref: React.RefObject<T>
): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [ref]);

  return dimensions;
}