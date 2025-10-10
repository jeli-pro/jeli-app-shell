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
    setSidebarState,
    setIsResizing,
    setSidebarWidth,
    toggleSidebar,
    peekSidebar,
    toggleFullscreen,
    toggleSidePane,
    toggleDarkMode,
    reducedMotion,
    autoExpandSidebar
  } = useAppStore()
  
  const appRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)

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

  // GSAP animations for sidebar transitions
  useEffect(() => {
    if (!sidebarRef.current || !mainContentRef.current || !resizeHandleRef.current) return

    const sidebar = sidebarRef.current
    const handle = resizeHandleRef.current
    
    let targetWidth = 0
    let targetOpacity = 1
    let targetX = 0

    switch (sidebarState) {
      case SIDEBAR_STATES.HIDDEN:
        targetWidth = 0
        targetOpacity = 0
        targetX = -100
        break
      case SIDEBAR_STATES.COLLAPSED:
        targetWidth = 64
        targetOpacity = 1
        targetX = 0
        break
      case SIDEBAR_STATES.EXPANDED:
        targetWidth = sidebarWidth
        targetOpacity = 1
        targetX = 0
        break
      case SIDEBAR_STATES.PEEK:
        targetWidth = sidebarWidth * 0.8
        targetOpacity = 0.95
        targetX = 0
        break
    }

    const tl = gsap.timeline({ ease: "power3.out" })
    
    tl.to(sidebar, {
      width: targetWidth,
      opacity: targetOpacity,
      x: `${targetX}%`,
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

    // Sidebar animation for body state changes
    gsap.to(sidebarRef.current, {
      x: isFullscreen ? '-100%' : '0%',
      duration: animationDuration,
      ease,
    })

    // Right pane animation
    gsap.to(rightPaneRef.current, {
      width: isSidePane ? 320 : 0,
      duration: animationDuration,
      ease,
    })
  }, [bodyState, animationDuration])

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
            onMouseDown={() => setIsResizing(true)}
          >
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {/* Top Bar */}
          <TopBar
            bodyState={bodyState}
            isDarkMode={isDarkMode}
            onToggleSidebar={toggleSidebar}
            onToggleFullscreen={toggleFullscreen}
            onToggleSidePane={toggleSidePane}
            onToggleDarkMode={toggleDarkMode}
          />
          
          {/* Main Content */}
          <MainContent
            ref={mainContentRef}
            bodyState={bodyState}
          />
        </div>
        
        <RightPane ref={rightPaneRef} />
      </div>
    </div>
  )
}