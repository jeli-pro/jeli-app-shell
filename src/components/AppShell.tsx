import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { EnhancedSidebar } from './EnhancedSidebar'
import { MainContent } from './MainContent'
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
    hideSidebar,
    showSidebar,
    peekSidebar,
    toggleFullscreen,
    toggleSidePane,
    toggleDarkMode,
    reducedMotion
  } = useAppStore()
  
  const appRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
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
  }, [isResizing])

  // GSAP animations for sidebar transitions
  useEffect(() => {
    if (!sidebarRef.current || !mainContentRef.current) return

    const sidebar = sidebarRef.current
    const mainContent = mainContentRef.current
    
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
    // Don't animate margin in the new layout structure

  }, [sidebarState, sidebarWidth, bodyState])

  // GSAP animations for body state transitions
  useEffect(() => {
    if (!mainContentRef.current) return

    const mainContent = mainContentRef.current
    
    switch (bodyState) {
      case BODY_STATES.FULLSCREEN:
        // In fullscreen, hide sidebar completely
        if (sidebarRef.current) {
          gsap.to(sidebarRef.current, {
            x: '-100%',
            duration: animationDuration,
            ease: "power3.out"
          })
        }
        break
      case BODY_STATES.SIDE_PANE:
        // In side pane, make sidebar narrower and content takes remaining space
        if (sidebarRef.current) {
          const narrowWidth = Math.min(sidebarWidth * 0.7, 200)
          gsap.to(sidebarRef.current, {
            width: narrowWidth,
            x: 0,
            duration: animationDuration,
            ease: "power3.out"
          })
        }
        break
      default:
        // Normal state - restore sidebar
        if (sidebarRef.current) {
          gsap.to(sidebarRef.current, {
            x: 0,
            duration: animationDuration,
            ease: "power3.out"
          })
        }
        break
    }
  }, [bodyState, sidebarState, sidebarWidth, animationDuration])

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
            if (sidebarState === SIDEBAR_STATES.COLLAPSED) {
              peekSidebar()
            }
          }}
          onMouseLeave={() => {
            if (sidebarState === SIDEBAR_STATES.PEEK) {
              setSidebarState(SIDEBAR_STATES.COLLAPSED)
            }
          }}
        />

        {/* Resize Handle */}
        {sidebarState !== SIDEBAR_STATES.HIDDEN && (
          <div
            ref={resizeHandleRef}
            className={cn(
              "absolute top-0 w-1 h-full bg-transparent hover:bg-emerald-500/20 cursor-col-resize z-50 transition-colors",
              "group"
            )}
            style={{ 
              left: sidebarState === SIDEBAR_STATES.COLLAPSED ? 64 : sidebarWidth 
            }}
            onMouseDown={() => setIsResizing(true)}
          >
            <div className="w-full h-full bg-transparent group-hover:bg-emerald-500/40 transition-colors" />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <TopBar
            sidebarState={sidebarState}
            bodyState={bodyState}
            isDarkMode={isDarkMode}
            onToggleSidebar={toggleSidebar}
            onToggleFullscreen={toggleFullscreen}
            onToggleSidePane={toggleSidePane}
            onToggleDarkMode={toggleDarkMode}
            onHideSidebar={hideSidebar}
            onShowSidebar={showSidebar}
            onPeekSidebar={peekSidebar}
          />
          
          {/* Main Content */}
          <MainContent
            ref={mainContentRef}
            bodyState={bodyState}
            sidebarState={sidebarState}
          />
        </div>
      </div>
    </div>
  )
}