import React, { forwardRef, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { 
  Home, 
  Search, 
  Bell, 
  User, 
  Settings, 
  HelpCircle, 
  FileText, 
  Calendar, 
  Mail, 
  MessageSquare,
  FolderOpen,
  Bookmark,
  Download,
  Star,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SIDEBAR_STATES, type SidebarState } from '@/lib/utils'

interface SidebarProps {
  state: SidebarState
  width: number
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
  badge?: number
  isActive?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigationSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { icon: <Home className="w-4 h-4" />, label: "Dashboard", href: "/", isActive: true },
      { icon: <Search className="w-4 h-4" />, label: "Search", href: "/search" },
      { icon: <Bell className="w-4 h-4" />, label: "Notifications", href: "/notifications", badge: 3 },
    ]
  },
  {
    title: "Workspace",
    items: [
      { icon: <FileText className="w-4 h-4" />, label: "Documents", href: "/documents" },
      { icon: <FolderOpen className="w-4 h-4" />, label: "Projects", href: "/projects" },
      { icon: <Calendar className="w-4 h-4" />, label: "Calendar", href: "/calendar" },
      { icon: <Mail className="w-4 h-4" />, label: "Messages", href: "/messages", badge: 12 },
    ]
  },
  {
    title: "Personal",
    items: [
      { icon: <Bookmark className="w-4 h-4" />, label: "Bookmarks", href: "/bookmarks" },
      { icon: <Star className="w-4 h-4" />, label: "Favorites", href: "/favorites" },
      { icon: <Download className="w-4 h-4" />, label: "Downloads", href: "/downloads" },
      { icon: <Trash2 className="w-4 h-4" />, label: "Trash", href: "/trash" },
    ]
  }
]

const bottomNavItems: NavItem[] = [
  { icon: <User className="w-4 h-4" />, label: "Profile", href: "/profile" },
  { icon: <Settings className="w-4 h-4" />, label: "Settings", href: "/settings" },
  { icon: <HelpCircle className="w-4 h-4" />, label: "Help", href: "/help" },
]

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ state, width, onMouseEnter, onMouseLeave }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
    const itemsRef = useRef<(HTMLDivElement | null)[]>([])

    const isCollapsed = state === SIDEBAR_STATES.COLLAPSED
    const isHidden = state === SIDEBAR_STATES.HIDDEN
    const isPeek = state === SIDEBAR_STATES.PEEK

    // Animate content visibility
    useEffect(() => {
      if (!contentRef.current) return

      const labels = contentRef.current.querySelectorAll('.nav-label')
      const badges = contentRef.current.querySelectorAll('.nav-badge')
      const sectionTitles = contentRef.current.querySelectorAll('.section-title')

      if (isCollapsed) {
        gsap.to([labels, badges, sectionTitles], {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          ease: "power2.out"
        })
      } else {
        gsap.to([labels, badges, sectionTitles], {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          delay: 0.1,
          ease: "power2.out"
        })
      }
    }, [isCollapsed])

    // Hover animations for nav items
    const handleItemHover = (index: number, isHovering: boolean) => {
      const item = itemsRef.current[index]
      if (!item) return

      gsap.to(item, {
        scale: isHovering ? 1.02 : 1,
        x: isHovering ? 4 : 0,
        duration: 0.2,
        ease: "power2.out"
      })
    }

    if (isHidden) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-card border-r border-border flex-shrink-0 transition-all duration-300",
          "h-full overflow-hidden",
          isPeek && "shadow-xl z-40"
        )}
        style={{ width }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Background blur effect for peek mode */}
        {isPeek && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        )}

        <div 
          ref={contentRef}
          className="relative z-10 h-full flex flex-col py-6"
        >
          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-6">
            {navigationSections.map((section, sectionIndex) => (
              <div 
                key={section.title}
                ref={el => sectionsRef.current[sectionIndex] = el}
                className="space-y-1"
              >
                {!isCollapsed && (
                  <h3 className="section-title px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                
                <nav className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const globalIndex = sectionIndex * 10 + itemIndex
                    return (
                      <div
                        key={item.label}
                        ref={el => itemsRef.current[globalIndex] = el}
                        className={cn(
                          "group relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200",
                          "hover:bg-accent/50",
                          item.isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                        onMouseEnter={() => handleItemHover(globalIndex, true)}
                        onMouseLeave={() => handleItemHover(globalIndex, false)}
                      >
                        <div className="flex-shrink-0">
                          {item.icon}
                        </div>
                        
                        {!isCollapsed && (
                          <>
                            <span className="nav-label flex-1 text-sm font-medium truncate">
                              {item.label}
                            </span>
                            
                            {item.badge && (
                              <span className="nav-badge bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                {item.badge > 99 ? '99+' : item.badge}
                              </span>
                            )}
                          </>
                        )}

                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            {item.label}
                            {item.badge && (
                              <span className="ml-2 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                                {item.badge > 99 ? '99+' : item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="px-3 pt-6 border-t border-border">
            <nav className="space-y-1">
              {bottomNavItems.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200",
                    "hover:bg-accent/50"
                  )}
                  onMouseEnter={() => handleItemHover(100 + index, true)}
                  onMouseLeave={() => handleItemHover(100 + index, false)}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  
                  {!isCollapsed && (
                    <span className="nav-label flex-1 text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* User Profile */}
            {!isCollapsed && (
              <div className="mt-6 p-3 bg-accent/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">John Doe</p>
                    <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)