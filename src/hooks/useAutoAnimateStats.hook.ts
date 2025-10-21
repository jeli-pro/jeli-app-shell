import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * A hook that animates a stats container in and out of view based on scroll direction.
 * It creates a "sliver app bar" effect for the stats section.
 * @param scrollContainerRef Ref to the main scrolling element.
 * @param statsContainerRef Ref to the stats container element to be animated.
 */
export function useAutoAnimateStats(
  scrollContainerRef: React.RefObject<HTMLElement>,
  statsContainerRef: React.RefObject<HTMLElement>
) {
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);
  const originalMarginTop = useRef<string | null>(null);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !statsContainerRef.current) return;

    const scrollY = scrollContainerRef.current.scrollTop;
    
    // Initialize original margin on first scroll event if not set
    if (originalMarginTop.current === null) {
      const computedStyle = getComputedStyle(statsContainerRef.current);
      originalMarginTop.current = computedStyle.getPropertyValue('margin-top');
    }

    // On any significant scroll down, hide the stats.
    // The small 10px threshold prevents firing on minor scroll-jiggles.
    if (scrollY > lastScrollY.current && scrollY > 10 && !isHidden.current) {
      isHidden.current = true;
      gsap.to(statsContainerRef.current, {
        duration: 0.4,
        height: 0,
        autoAlpha: 0,
        marginTop: 0,
        ease: 'power2.inOut',
        overwrite: true,
      });
    } 

    lastScrollY.current = scrollY < 0 ? 0 : scrollY;
  }, [scrollContainerRef, statsContainerRef]);

  const handleWheel = useCallback((event: WheelEvent) => {
    if (!scrollContainerRef.current || !statsContainerRef.current) return;
    
    const isAtTop = scrollContainerRef.current.scrollTop === 0;
    const isScrollingUp = event.deltaY < 0;

    // Only reveal if we are at the top, scrolling up, and stats are hidden.
    // This creates the "pull to reveal" effect.
    if (isAtTop && isScrollingUp && isHidden.current) {
        isHidden.current = false;
        gsap.to(statsContainerRef.current, {
          duration: 0.4,
          height: 'auto',
          autoAlpha: 1,
          marginTop: originalMarginTop.current || 0,
          ease: 'power2.out',
          overwrite: true,
        });
    }
  }, [scrollContainerRef, statsContainerRef]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      scrollContainer.addEventListener('wheel', handleWheel, { passive: true });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
        scrollContainer.removeEventListener('wheel', handleWheel);
      }
      // When component unmounts, kill any running animations on the stats ref
      if (statsContainerRef.current) {
        gsap.killTweensOf(statsContainerRef.current);
      }
    };
  }, [scrollContainerRef, statsContainerRef, handleScroll, handleWheel]);
}