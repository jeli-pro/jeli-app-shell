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
  FolderOpen,
  Bookmark,
  Download,
  Star,
  Trash2,
  ChevronDown,
  Component,
  Plus,
  Rocket
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils'
import { 
    Workspaces, 
    WorkspaceTrigger, 
    WorkspaceContent, 
    type Workspace 
} from './WorkspaceSwitcher';

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
  badge?: number
  isActive?: boolean
  children?: NavItem[]
}

interface NavSection {
  title: string
  items: NavItem[]
  collapsible?: boolean
  defaultExpanded?: boolean
}

interface MyWorkspace extends Workspace {
    logo: string;
    plan: string;
}

const mockWorkspaces: MyWorkspace[] = [
    { id: 'ws1', name: 'Acme Inc.', logo: 'https://avatar.vercel.sh/acme.png', plan: 'Pro' },
    { id: 'ws2', name: 'Monsters Inc.', logo: 'https://avatar.vercel.sh/monsters.png', plan: 'Free' },
    { id: 'ws3', name: 'Stark Industries', logo: 'https://avatar.vercel.sh/stark.png', plan: 'Enterprise' },
];

const navigationSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { icon: <Home className="w-4 h-4" />, label: "Dashboard", href: "/" },
      { icon: <Search className="w-4 h-4" />, label: "Search", href: "/search" },
      { icon: <Bell className="w-4 h-4" />, label: "Notifications", href: "/notifications", badge: 3 },
    ]
  },
  {
    title: "Workspace",
    collapsible: true,
    defaultExpanded: true,
    items: [
      { 
        icon: <FileText className="w-4 h-4" />, 
        label: "Documents", 
        href: "/documents",
        children: [
          { icon: <FileText className="w-3 h-3" />, label: "Recent", href: "/documents/recent" },
          { icon: <Star className="w-3 h-3" />, label: "Starred", href: "/documents/starred" },
          { icon: <Trash2 className="w-3 h-3" />, label: "Trash", href: "/documents/trash" },
        ]
      },
      { icon: <FolderOpen className="w-4 h-4" />, label: "Projects", href: "/projects" },
      { icon: <Calendar className="w-4 h-4" />, label: "Calendar", href: "/calendar" },
      { icon: <Mail className="w-4 h-4" />, label: "Messages", href: "/messages", badge: 12 },
    ]
  },
  {
    title: "Personal",
    collapsible: true,
    defaultExpanded: false,
    items: [
      { icon: <Bookmark className="w-4 h-4" />, label: "Bookmarks", href: "/bookmarks" },
      { icon: <Star className="w-4 h-4" />, label: "Favorites", href: "/favorites" },
      { icon: <Download className="w-4 h-4" />, label: "Downloads", href: "/downloads" },
    ]
  },
  {
    title: "Components",
    collapsible: true,
    defaultExpanded: true,
    items: [
      { icon: <Component className="w-4 h-4" />, label: "Toaster", href: "/toaster" }
    ]
  }
]

const bottomNavItems: NavItem[] = [
  { icon: <User className="w-4 h-4" />, label: "Profile", href: "/profile" },
  { icon: <Settings className="w-4 h-4" />, label: "Settings", href: "/settings" },
  { icon: <HelpCircle className="w-4 h-4" />, label: "Help", href: "/help" },
]

interface SidebarProps {
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const EnhancedSidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ onMouseEnter, onMouseLeave }, ref) => {
    const { sidebarState, sidebarWidth, reducedMotion, compactMode, activePage, setActivePage, openSidePane, bodyState, sidePaneContent } = useAppStore()
    const contentRef = useRef<HTMLDivElement>(null)
    const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
    const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
      new Set(navigationSections.filter(s => s.defaultExpanded).map(s => s.title))
    )

    const [selectedWorkspace, setSelectedWorkspace] = React.useState(mockWorkspaces[0]);
    const isCollapsed = sidebarState === SIDEBAR_STATES.COLLAPSED
    const isHidden = sidebarState === SIDEBAR_STATES.HIDDEN
    const isPeek = sidebarState === SIDEBAR_STATES.PEEK
    const animationDuration = reducedMotion ? 0.1 : 0.3

    // Toggle section expansion
    const toggleSection = (sectionTitle: string) => {
      setExpandedSections(prev => {
        const newSet = new Set(prev)
        if (newSet.has(sectionTitle)) {
          newSet.delete(sectionTitle)
        } else {
          newSet.add(sectionTitle)
        }
        return newSet
      })
    }

    // Animate content visibility
    useEffect(() => {
      if (!contentRef.current) return

      const labels = contentRef.current.querySelectorAll('.nav-label')
      const badges = contentRef.current.querySelectorAll('.nav-badge')
      const sectionTitles = contentRef.current.querySelectorAll('.section-title')
      const chevrons = contentRef.current.querySelectorAll('.section-chevron')

      if (isCollapsed) {
        gsap.to([labels, badges, sectionTitles, chevrons], {
          opacity: 0,
          scale: 0.8,
          duration: animationDuration,
          ease: "power2.out"
        })
      } else {
        gsap.to([labels, badges, sectionTitles, chevrons], {
          opacity: 1,
          scale: 1,
          duration: animationDuration,
          delay: 0.1,
          ease: "power2.out"
        })
      }
    }, [isCollapsed, animationDuration])

    // Hover animations for nav items
    const handleItemHover = (element: HTMLElement, isHovering: boolean) => {
      if (!element) return

      gsap.to(element, {
        scale: isHovering ? 1.02 : 1,
        x: isHovering ? 4 : 0,
        duration: animationDuration,
        ease: "power2.out"
      })
    }

    if (isHidden) {
      return null
    }

    const renderNavItem = (item: NavItem, depth = 0) => {
      const pageName = item.label.toLowerCase();
      const isDashboard = pageName === 'dashboard';
      const isSettings = pageName === 'settings';
      const isToaster = pageName === 'toaster';

      const isDashboardActive = activePage === 'dashboard';
      const isSettingsActive = activePage === 'settings' || (bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'settings');
      const isToasterActive = activePage === 'toaster' || (bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'toaster');
      const isPageActive = (isDashboard && isDashboardActive) || (isSettings && isSettingsActive) || (isToaster && isToasterActive);

      const handleClick = () => {
        if (isDashboard) {
          setActivePage('dashboard');
        } else if (isSettings) {
          const isSettingsInSidePane = bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'settings'
          // If we're on the settings page and it's not in the side pane, treat this as a "minimize" action.
          if (activePage === 'settings' && !isSettingsInSidePane) {
            openSidePane('settings');
            setActivePage('dashboard');
          } else {
            // In all other cases (on dashboard page, or settings already in pane), just toggle the settings side pane.
            openSidePane('settings');
          }
        } else if (isToaster) {
          const isToasterInSidePane = bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'toaster'
          // If we're on the toaster page and it's not in the side pane, treat this as a "minimize" action.
          if (activePage === 'toaster' && !isToasterInSidePane) {
            openSidePane('toaster');
            setActivePage('dashboard');
          } else {
            // In all other cases (on dashboard page, or toaster already in pane), just toggle the toaster side pane.
            openSidePane('toaster');
          }
        }
        // Could add logic for other links here if routing was implemented
      };

      return (
        <div key={item.label} className={cn("space-y-1", depth > 0 && "ml-6")}>
        <button
          className={cn(
            "group relative flex items-center gap-3 rounded-lg cursor-pointer transition-all duration-200 w-full text-left",
            compactMode ? "px-2 py-1.5" : "px-4 py-2.5",
            "hover:bg-accent",
            (item.isActive || isPageActive) && "bg-primary text-primary-foreground hover:bg-primary/90",
            depth > 0 && "text-sm",
            isCollapsed && "justify-center"
          )}
          onMouseEnter={(e) => handleItemHover(e.currentTarget, true)}
          onMouseLeave={(e) => handleItemHover(e.currentTarget, false)}
          onClick={handleClick}
        >
          <div className="flex-shrink-0">
            {item.icon}
          </div>
          
          {!isCollapsed && (
            <>
              <span className="nav-label flex-1 font-medium truncate">
                {item.label}
              </span>
              
              {item.badge && (
                <span className="nav-badge bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}

              {item.children && (
                <ChevronDown className="w-3 h-3 transition-transform" />
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
        </button>

        {/* Children items */}
        {item.children && !isCollapsed && (
          <div className="space-y-1">
            {item.children.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-card flex-shrink-0",
          "h-full overflow-hidden",
          isPeek && "shadow-xl z-40",
          compactMode && "text-sm"
        )}
        style={{ width: sidebarWidth }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Background blur effect for peek mode */}
        {isPeek && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        )}

        <div 
          ref={contentRef}
          className={cn(
            "relative z-10 h-full flex flex-col",
            compactMode ? "p-3" : "p-4"
          )}
        >
          {/* App Header */}
          <div 
            className={cn(
              "flex items-center gap-3",
              isCollapsed ? "justify-center" : "px-3",
              compactMode ? "h-10" : "h-16"
            )}
          >
            <div className="p-2 bg-primary/20 rounded-lg">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            {!isCollapsed && <h1 className="text-lg font-bold nav-label">Amazing App</h1>}
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-6 pt-4">
            {navigationSections.map((section, sectionIndex) => {
              const isExpanded = expandedSections.has(section.title)

              return (
                <div 
                  key={section.title}
                  ref={el => sectionsRef.current[sectionIndex] = el}
                  className="space-y-1"
                >
                  {!isCollapsed && (
                    <div 
                      className={cn(
                        "flex items-center justify-between px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider",
                        section.collapsible && "cursor-pointer hover:text-foreground transition-colors"
                      )}
                      onClick={() => section.collapsible && toggleSection(section.title)}
                    >
                      <span className="section-title">{section.title}</span>
                      {section.collapsible && (
                        <ChevronDown 
                          className={cn(
                            "section-chevron w-3 h-3 transition-transform",
                            isExpanded ? "rotate-0" : "-rotate-90"
                          )} 
                        />
                      )}
                    </div>
                  )}
                  
                  {(!section.collapsible || isExpanded || isCollapsed) && (
                    <nav className="space-y-1">
                      {section.items.map(item => renderNavItem(item))}
                    </nav>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom Navigation */}
          <div className={cn("pt-4 border-t border-border", compactMode && "pt-3")}>
            <nav className="space-y-1">
              {bottomNavItems.map((item) => renderNavItem(item))}
            </nav>

            {/* Workspace Switcher */}
            <div className={cn("mt-6", compactMode && "mt-4")}>
              <Workspaces
                workspaces={mockWorkspaces}
                selectedWorkspaceId={selectedWorkspace.id}
                onWorkspaceChange={setSelectedWorkspace}
              >
                <WorkspaceTrigger
                  collapsed={isCollapsed}
                  className={cn(
                    "rounded-xl transition-colors hover:bg-accent/50 w-full",
                    isCollapsed ? "p-2" : "p-3 bg-accent/50"
                  )}
                  avatarClassName={cn(compactMode ? "h-8 w-8" : "h-10 w-10")}
                />
                <WorkspaceContent>
                  <button className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none">
                    <Plus className="h-4 w-4" />
                    <span>Create Workspace</span>
                  </button>
                </WorkspaceContent>
              </Workspaces>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

EnhancedSidebar.displayName = "EnhancedSidebar"