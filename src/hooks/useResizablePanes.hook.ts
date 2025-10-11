import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useAppStore } from '@/store/appStore';

export function useResizableSidebar(
  sidebarRef: React.RefObject<HTMLDivElement>,
  resizeHandleRef: React.RefObject<HTMLDivElement>
) {
  const { isResizing, setIsResizing, setSidebarWidth } = useAppStore(
    (state) => ({
      isResizing: state.isResizing,
      setIsResizing: state.setIsResizing,
      setSidebarWidth: state.setSidebarWidth,
    })
  );

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
  }, [isResizing, setIsResizing, setSidebarWidth, sidebarRef, resizeHandleRef]);
}

export function useResizableRightPane() {
  const {
    isResizingRightPane,
    setIsResizingRightPane,
    setRightPaneWidth,
  } = useAppStore((state) => ({
    isResizingRightPane: state.isResizingRightPane,
    setIsResizingRightPane: state.setIsResizingRightPane,
    setRightPaneWidth: state.setRightPaneWidth,
  }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRightPane) return;

      const newWidth = window.innerWidth - e.clientX;
      setRightPaneWidth(newWidth);
    };

    const handleMouseUp = () => {
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
  }, [isResizingRightPane, setIsResizingRightPane, setRightPaneWidth]);
}