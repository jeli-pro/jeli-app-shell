import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAppShell } from '@/context/AppShellContext';
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function useSidebarAnimations(
  sidebarRef: React.RefObject<HTMLDivElement>,
  resizeHandleRef: React.RefObject<HTMLDivElement>
) {
  const { sidebarState, sidebarWidth, bodyState, reducedMotion } = useAppShell();
  const animationDuration = reducedMotion ? 0.1 : 0.4;

  useEffect(() => {
    if (!sidebarRef.current || !resizeHandleRef.current) return;

    const sidebar = sidebarRef.current;
    const handle = resizeHandleRef.current;
    
    let targetWidth = 0;
    let targetOpacity = 1;

    if (bodyState === BODY_STATES.FULLSCREEN) {
      targetWidth = 0;
      targetOpacity = 0;
    } else {
      switch (sidebarState) {
        case SIDEBAR_STATES.HIDDEN:
          targetWidth = 0;
          targetOpacity = 0;
          break;
        case SIDEBAR_STATES.COLLAPSED:
          targetWidth = 64;
          targetOpacity = 1;
          break;
        case SIDEBAR_STATES.EXPANDED:
          targetWidth = sidebarWidth;
          targetOpacity = 1;
          break;
        case SIDEBAR_STATES.PEEK:
          targetWidth = sidebarWidth * 0.8;
          targetOpacity = 0.95;
          break;
      }
    }

    const tl = gsap.timeline({ ease: "power3.out" });
    
    tl.to(sidebar, {
      width: targetWidth,
      opacity: targetOpacity,
      duration: animationDuration,
    });
    tl.to(handle, {
      left: targetWidth,
      duration: animationDuration,
    }, 0);

  }, [sidebarState, sidebarWidth, bodyState, animationDuration, sidebarRef, resizeHandleRef]);
}

export function useBodyStateAnimations(
  appRef: React.RefObject<HTMLDivElement>,
  mainContentRef: React.RefObject<HTMLDivElement>,
  rightPaneRef: React.RefObject<HTMLDivElement>,
  topBarContainerRef: React.RefObject<HTMLDivElement>,
  mainAreaRef: React.RefObject<HTMLDivElement>
) {
  const { bodyState, reducedMotion, rightPaneWidth, isTopBarVisible, closeSidePane, fullscreenTarget } = useAppShell();
  const animationDuration = reducedMotion ? 0.1 : 0.4;
  const prevBodyState = usePrevious(bodyState);

  useEffect(() => {
    if (!mainContentRef.current || !rightPaneRef.current || !topBarContainerRef.current || !mainAreaRef.current) return;

    const ease = "power3.out";
    const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;
    const isSidePane = bodyState === BODY_STATES.SIDE_PANE;
    const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;

    // Right pane animation
    if (isSidePane && prevBodyState !== BODY_STATES.SPLIT_VIEW) {
      // Opening overlay pane. Set width immediately, animate transform for performance.
      gsap.set(rightPaneRef.current, { width: rightPaneWidth });
      gsap.fromTo(rightPaneRef.current, { x: '100%' }, {
          x: '0%',
          duration: animationDuration,
          ease,
      });
    } else if (bodyState === BODY_STATES.NORMAL && prevBodyState === BODY_STATES.SIDE_PANE) {
      // Closing overlay pane. Animate transform.
      gsap.to(rightPaneRef.current, {
          x: '100%',
          duration: animationDuration,
          ease,
      });
    } else {
      // For all other transitions (split view, fullscreen, side_pane -> split_view)
      // the original logic with width animation is acceptable.
      gsap.to(rightPaneRef.current, {
        width: isFullscreen
          ? (fullscreenTarget === 'right' ? '100%' : 0)
          : (isSidePane || isSplitView ? rightPaneWidth : 0),
        x: (isSidePane || isSplitView || (isFullscreen && fullscreenTarget === 'right')) ? 0 : rightPaneWidth + 5, // +5 to hide border
        duration: animationDuration,
        ease,
      });
    }

    // Determine top bar position based on state
    let topBarY = '0%';
    if (bodyState === BODY_STATES.FULLSCREEN) {
      topBarY = '-100%'; // Always hide in fullscreen
    } else if (bodyState === BODY_STATES.NORMAL && !isTopBarVisible) {
      topBarY = '-100%'; // Hide only in normal mode when scrolled
    }

    gsap.to(topBarContainerRef.current, {
      y: topBarY,
      duration: animationDuration,
      ease,
    });
    
    // Add backdrop for side pane
    const backdrop = document.querySelector('.app-backdrop');
    if (isSidePane) { // This is correct because isSidePane is false when bodyState is split_view
      if (!backdrop) {
        const el = document.createElement('div');
        el.className = 'app-backdrop fixed inset-0 bg-black/30 z-[55]';
        appRef.current?.appendChild(el);
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: animationDuration });
        el.onclick = () => closeSidePane();
      }
    } else {
      if (backdrop) {
        gsap.to(backdrop, { opacity: 0, duration: animationDuration, onComplete: () => backdrop.remove() });
      }
    }
  }, [bodyState, prevBodyState, animationDuration, rightPaneWidth, closeSidePane, isTopBarVisible, appRef, mainContentRef, rightPaneRef, topBarContainerRef, mainAreaRef, fullscreenTarget]);
}