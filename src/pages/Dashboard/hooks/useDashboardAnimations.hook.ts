import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useAppShell } from '@/context/AppShellContext';
import { BODY_STATES } from '@/lib/utils';

export function useDashboardAnimations(
  contentRef: React.RefObject<HTMLDivElement>,
  cardsRef: React.MutableRefObject<(HTMLDivElement | null)[]>
) {
  const { bodyState } = useAppShell();

  useEffect(() => {
    if (!contentRef.current) return;

    const content = contentRef.current;
    const cards = cardsRef.current.filter(Boolean);

    switch (bodyState) {
      case BODY_STATES.FULLSCREEN:
        gsap.to(content, {
          scale: 1.02,
          duration: 0.4,
          ease: "power3.out"
        });
        break;
      default:
        gsap.to(content, {
          scale: 1,
          duration: 0.4,
          ease: "power3.out"
        });
        break;
    }

    // Stagger animation for cards
    gsap.fromTo(cards, 
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
      }
    );

  }, [bodyState, contentRef, cardsRef]);
}