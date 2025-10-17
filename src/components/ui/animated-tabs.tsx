"use client"

import React, { useState, useRef, useEffect, useLayoutEffect, useId } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: React.ReactNode
}

interface AnimatedTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void,
  size?: 'default' | 'sm',
  children?: React.ReactNode,
  wrapperClassName?: string,
  contentClassName?: string
}

const AnimatedTabs = React.forwardRef<HTMLDivElement, AnimatedTabsProps>(
  ({ className, tabs, activeTab, onTabChange, size = 'default', children, wrapperClassName, contentClassName, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const contentTrackRef = useRef<HTMLDivElement>(null)
    const uniqueId = useId()
    const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

    // Update active index when controlled prop changes
    useEffect(() => {
      const newActiveIndex = tabs.findIndex(tab => tab.id === activeTab)
      if (newActiveIndex !== -1 && newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex)
      }
    }, [activeTab, tabs, activeIndex])
    
    // Update active indicator position
    useLayoutEffect(() => {
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
        activeElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }, [activeIndex, tabs]);

    // Animate content track position
    useLayoutEffect(() => {
      if (contentTrackRef.current) {
        gsap.to(contentTrackRef.current, {
          xPercent: -100 * activeIndex,
          duration: 0.4,
          ease: "power3.inOut",
        })
      }
    }, [activeIndex]);

    // Set initial position of active indicator
    useLayoutEffect(() => {
        const initialActiveIndex = activeTab ? tabs.findIndex(tab => tab.id === activeTab) : 0
        const indexToUse = initialActiveIndex !== -1 ? initialActiveIndex : 0
        
        const firstElement = tabRefs.current[indexToUse]
        if (firstElement) {
          const { offsetLeft, offsetWidth } = firstElement
          setActiveStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          })
        }
    }, [tabs, activeTab])

    const tabHeadersRootProps = {
      className: cn("overflow-x-auto overflow-y-hidden no-scrollbar", className),
      role: "tablist",
      ...props
    };

    const TabHeadersContent = (
      <div className="relative flex w-max items-center whitespace-nowrap">
        {/* Active Indicator */}
        <div
          className="absolute -bottom-px h-0.5 bg-primary transition-all duration-300 ease-out"
          style={activeStyle}
        />

        {/* Tabs */}
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`tab-${uniqueId}-${tab.id}`}
            ref={(el) => (tabRefs.current[index] = el)}
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls={`tabpanel-${uniqueId}-${tab.id}`}
            className={cn(
              "group relative cursor-pointer text-center transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              size === 'default' ? "px-4 py-5" : "px-3 py-2.5",
              index === activeIndex 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <span className={cn(
              "flex items-center gap-2",
              size === 'default' 
                ? "text-lg font-semibold"
                : "text-sm font-medium"
            )}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    );

    if (!children) {
      return (
        <div ref={ref} {...tabHeadersRootProps}>
          {TabHeadersContent}
        </div>
      );
    }

    return (
      <div ref={ref} className={wrapperClassName}>
        <div {...tabHeadersRootProps}>{TabHeadersContent}</div>
        <div className={cn("relative overflow-hidden", contentClassName)}>
          <div ref={contentTrackRef} className="flex h-full w-full">
            {React.Children.map(children, (child, index) => (
              <div
                key={tabs[index].id}
                id={`tabpanel-${uniqueId}-${tabs[index].id}`}
                role="tabpanel"
                aria-labelledby={`tab-${uniqueId}-${tabs[index].id}`}
                aria-hidden={activeIndex !== index}
                className="h-full w-full flex-shrink-0"
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)
AnimatedTabs.displayName = "AnimatedTabs"

export { AnimatedTabs }