import { useEffect } from 'react';
import { gsap } from 'gsap';

export function useDemoContentAnimations(
  cardsRef: React.MutableRefObject<(HTMLDivElement | null)[]>
) {
  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    
    // Animate cards on mount
    gsap.fromTo(cards, 
      { y: 30, opacity: 0, scale: 0.95 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
      }
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}