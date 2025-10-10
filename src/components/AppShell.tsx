import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { EnhancedSidebar } from './EnhancedSidebar'
import { MainContent } from './MainContent'
import { RightPane } from './RightPane'
import { TopBar } from './TopBar'
import { useAppStore } from '@/store/appStore'
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils'

export function AppShell() {
  const {
    sidebarState,
    bodyState,
    sidebarWidth,
    isDarkMode,
    isResizing,
    rightPaneWidth,
    isResizingRightPane,
    setRightPaneWidth,
    isTopBarVisible,
    setSidebarState,
    closeSidePane,
    setIsResizing,
    setSidebarWidth,
    toggleSidebar,
    peekSidebar,
    toggleFullscreen,
    setIsResizingRightPane,
    toggleDarkMode,
    reducedMotion,
    autoExpandSidebar
  } = useAppStore()
  
  const appRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const topBarContainerRef = useRef<HTMLDivElement>(null)

  // Animation duration based on reduced motion preference
  const animationDuration = reducedMotion ? 0.1 : 0.4

  // Resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const newWidth = Math.max(200, Math.min(500, e.clientX))
      setSidebarWidth(newWidth)
      
      if (sidebarRef.current) {
        gsap.set(sidebarRef.current, { width: newWidth })
      }
      if (resizeHandleRef.current) {
        gsap.set(resizeHandleRef.current, { left: newWidth })
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizing) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, setIsResizing, setSidebarWidth])

  // Resize functionality for Right Pane
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRightPane) return
      
      const newWidth = window.innerWidth - e.clientX
      setRightPaneWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizingRightPane(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizingRightPane) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
    }
  }, [isResizingRightPane, setIsResizingRightPane, setRightPaneWidth])

  // GSAP animations for sidebar transitions
  useEffect(() => {
    if (!sidebarRef.current || !mainContentRef.current || !resizeHandleRef.current) return

    const sidebar = sidebarRef.current
    const handle = resizeHandleRef.current
    
    let targetWidth = 0
    let targetOpacity = 1

    if (bodyState === BODY_STATES.FULLSCREEN) {
      targetWidth = 0;
      targetOpacity = 0;
    } else {
      switch (sidebarState) {
        case SIDEBAR_STATES.HIDDEN:
          targetWidth = 0
          targetOpacity = 0
          break
        case SIDEBAR_STATES.COLLAPSED:
          targetWidth = 64
          targetOpacity = 1
          break
        case SIDEBAR_STATES.EXPANDED:
          targetWidth = sidebarWidth
          targetOpacity = 1
          break
        case SIDEBAR_STATES.PEEK:
          targetWidth = sidebarWidth * 0.8
          targetOpacity = 0.95
          break
      }
    }

    const tl = gsap.timeline({ ease: "power3.out" })
    
    tl.to(sidebar, {
      width: targetWidth,
      opacity: targetOpacity,
      duration: animationDuration,
    })
    tl.to(handle, {
      left: targetWidth,
      duration: animationDuration,
    }, 0)

  }, [sidebarState, sidebarWidth, bodyState, animationDuration])

  // GSAP animations for body state transitions
  useEffect(() => {
    if (!mainContentRef.current || !sidebarRef.current || !rightPaneRef.current) return

    const ease = "power3.out"
    const isFullscreen = bodyState === BODY_STATES.FULLSCREEN

    const isSidePane = bodyState === BODY_STATES.SIDE_PANE

    // Right pane animation
    gsap.to(rightPaneRef.current, {
      width: rightPaneWidth,
      x: isSidePane ? 0 : rightPaneWidth + 5, // +5 to hide border
      duration: animationDuration,
      ease,
    })

    gsap.to(mainContentRef.current, {
      paddingTop: isFullscreen ? '0rem' : isTopBarVisible ? '5rem' : '0rem', // h-20 is 5rem
      duration: animationDuration,
      ease,
    })

    gsap.to(topBarContainerRef.current, {
      y: (isFullscreen || !isTopBarVisible) ? '-100%' : '0%',
      duration: animationDuration,
      ease,
    })
    
    // Add backdrop for side pane
    const backdrop = document.querySelector('.app-backdrop')
    if (isSidePane) {
      if (!backdrop) {
        const el = document.createElement('div')
        el.className = 'app-backdrop fixed inset-0 bg-black/30 z-[55]'
        appRef.current?.appendChild(el)
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: animationDuration })
        el.onclick = () => closeSidePane()
      }
    } else {
      if (backdrop) {
        gsap.to(backdrop, { opacity: 0, duration: animationDuration, onComplete: () => backdrop.remove() })
      }
    }
  }, [bodyState, animationDuration, rightPaneWidth, closeSidePane, isTopBarVisible])

  return (
    <div 
      ref={appRef}
      className={cn(
        "relative h-screen w-screen overflow-hidden bg-background transition-colors duration-300",
        isDarkMode && "dark"
      )}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Enhanced Sidebar */}
        <EnhancedSidebar
          ref={sidebarRef}
          onMouseEnter={() => {
            if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.COLLAPSED) {
              peekSidebar()
            }
          }}
          onMouseLeave={() => {
            if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.PEEK) {
              setSidebarState(SIDEBAR_STATES.COLLAPSED)
            }
          }}
        />

        {/* Resize Handle */}
        {sidebarState !== SIDEBAR_STATES.HIDDEN && (
          <div
            ref={resizeHandleRef}
            className={cn(
              "absolute top-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
            )}
            onMouseDown={(e) => {
              e.preventDefault()
              setIsResizing(true)
            }}
          >
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
          </div>
        )}

        {/* Main Content Area */}
        <div className="relative flex-1 overflow-hidden bg-background">
          <div ref={topBarContainerRef} className="absolute inset-x-0 top-0 z-30">
            <TopBar
              onToggleSidebar={toggleSidebar}
              onToggleFullscreen={toggleFullscreen}
              onToggleDarkMode={toggleDarkMode}
            />
          </div>
          
          {/* Main Content */}
          <MainContent
            ref={mainContentRef}
            bodyState={bodyState}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      </div>
      <RightPane ref={rightPaneRef} />
    </div>
  )
}