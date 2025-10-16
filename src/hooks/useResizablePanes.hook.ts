import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';

export function useResizableSidebar(
  sidebarRef: React.RefObject<HTMLDivElement>,
  resizeHandleRef: React.RefObject<HTMLDivElement>
) {
  const isResizing = useAppShellStore(s => s.isResizing);
  const { setSidebarWidth, setIsResizing } = useAppShellStore.getState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = Math.max(200, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);

      if (sidebarRef.current) {
        gsap.set(sidebarRef.current, { width: newWidth });
      }
      if (resizeHandleRef.current) {
        gsap.set(resizeHandleRef.current, { left: newWidth });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setSidebarWidth, setIsResizing, sidebarRef, resizeHandleRef]);
}

export function useResizableRightPane(
  rightPaneRef: React.RefObject<HTMLDivElement>
) {
  const isResizingRightPane = useAppShellStore(s => s.isResizingRightPane);
  const bodyState = useAppShellStore(s => s.bodyState);
  const { setSplitPaneWidth, setSidePaneWidth, setIsResizingRightPane, setReducedMotion } = useAppShellStore.getState();
  const finalWidthRef = useRef<number | null>(null);
  const originalReducedMotionRef = useRef<boolean | null>(null);

  // This effect temporarily disables animations during resizing to prevent the
  // pane's enter/exit animation from firing incorrectly.
  useEffect(() => {
    if (isResizingRightPane) {
      // When resizing starts, store the original setting and disable animations.
      if (originalReducedMotionRef.current === null) {
        originalReducedMotionRef.current = useAppShellStore.getState().reducedMotion;
        setReducedMotion(true);
      }
    } else {
      // When resizing ends, restore the original setting after a brief delay.
      // This ensures the final width is rendered before animations are re-enabled.
      if (originalReducedMotionRef.current !== null) {
        // Use requestAnimationFrame to ensure we re-enable animations *after* the browser
        // has painted the new, non-animated pane width. This is more reliable than setTimeout(0).
        requestAnimationFrame(() => {
          setReducedMotion(originalReducedMotionRef.current!);
          originalReducedMotionRef.current = null;
        });
      }
    }
  }, [isResizingRightPane, setReducedMotion]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRightPane) return;

      const newWidth = window.innerWidth - e.clientX;
      finalWidthRef.current = newWidth;
      if (rightPaneRef.current) {
        gsap.set(rightPaneRef.current, { width: newWidth });
      }
    };

    const handleMouseUp = () => {
      if (finalWidthRef.current !== null) {
        if (bodyState === BODY_STATES.SPLIT_VIEW) {
          setSplitPaneWidth(finalWidthRef.current);
        } else {
          setSidePaneWidth(finalWidthRef.current);
        }
        finalWidthRef.current = null;
      }
      setIsResizingRightPane(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizingRightPane) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isResizingRightPane, setSplitPaneWidth, setSidePaneWidth, setIsResizingRightPane, bodyState, rightPaneRef]);
}