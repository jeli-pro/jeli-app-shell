import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export function useAutoAnimateStats(
  scrollContainerRef: React.RefObject<HTMLElement>,
  statsContainerRef: React.RefObject<HTMLElement>
) {
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);
  const animation = useRef<gsap.core.Tween | null>(null);
  const originalDisplay = useRef<string>('');

  useEffect(() => {
    // On mount, store the original display property if the ref is available
    if (statsContainerRef.current) {
        originalDisplay.current = window.getComputedStyle(statsContainerRef.current).display;
    }
  }, [statsContainerRef]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !statsContainerRef.current) return;

    // Ensure we have originalDisplay. It might not be available on first scroll if ref isn't ready.
    if (!originalDisplay.current && statsContainerRef.current) {
        originalDisplay.current = window.getComputedStyle(statsContainerRef.current).display;
        if (!originalDisplay.current || originalDisplay.current === 'none') {
          // Fallback if it's still none (e.g. initially hidden)
          originalDisplay.current = 'grid';
        }
    }
    
    const scrollY = scrollContainerRef.current.scrollTop;

    if (animation.current && animation.current.isActive()) {
      return;
    }

    // Scroll down past threshold
    if (scrollY > lastScrollY.current && scrollY > 150 && !isHidden.current) {
      isHidden.current = true;
      animation.current = gsap.to(statsContainerRef.current, {
        height: 0,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        overwrite: true,
        onComplete: () => {
            if (statsContainerRef.current) {
                statsContainerRef.current.style.display = 'none';
            }
        }
      });
    } 
    // Scroll up
    else if (scrollY < lastScrollY.current && isHidden.current) {
      isHidden.current = false;
      
      if (statsContainerRef.current) {
        statsContainerRef.current.style.display = originalDisplay.current;
        
        animation.current = gsap.from(statsContainerRef.current, {
          height: 0,
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: true,
          clearProps: 'all' // Clean up inline styles after animation
        });
      }
    }

    lastScrollY.current = scrollY < 0 ? 0 : scrollY;
  }, [scrollContainerRef, statsContainerRef]);

  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener('scroll', handleScroll);
      }
      if (animation.current) {
        animation.current.kill();
      }
    };
  }, [handleScroll, scrollContainerRef]);
}