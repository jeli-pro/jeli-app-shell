import React from 'react';
import {
  Home,
  Settings,
  HelpCircle,
  Component,
  Rocket,
  MoreHorizontal,
  Bell,
  Search,
  FileText,
  Star,
  Trash2,
  FolderOpen,
  Calendar,
  Mail,
  Bookmark,
  Download,
  User,
  Plus
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { BODY_STATES } from '@/lib/utils';
import {
  Workspaces,
  WorkspaceTrigger,
  WorkspaceContent,
  type Workspace,
} from './WorkspaceSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
  SidebarBody,
  SidebarFooter,
  SidebarSection,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarLabel,
  SidebarBadge,
  SidebarTooltip,
  SidebarIcon,
  useSidebar,
} from './Sidebar';
import { cn } from '@/lib/utils';

interface MyWorkspace extends Workspace {
  logo: string;
  plan: string;
}

const mockWorkspaces: MyWorkspace[] = [
  { id: 'ws1', name: 'Acme Inc.', logo: 'https://avatar.vercel.sh/acme.png', plan: 'Pro' },
  { id: 'ws2', name: 'Monsters Inc.', logo: 'https://avatar.vercel.sh/monsters.png', plan: 'Free' },
  { id: 'ws3', name: 'Stark Industries', logo: 'https://avatar.vercel.sh/stark.png', plan: 'Enterprise' },
];

interface SidebarProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Helper to determine if a menu item should be active
const useIsActive = (pageName: string) => {
  const { activePage, bodyState, sidePaneContent } = useAppStore();
  const lowerCasePageName = pageName.toLowerCase();

  switch (lowerCasePageName) {
    case 'dashboard':
      return activePage === 'dashboard';
    case 'settings':
      return activePage === 'settings' || (bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'settings');
    case 'toaster':
      return activePage === 'toaster' || (bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'toaster');
    default:
      return false;
  }
};

// Helper to handle navigation clicks
const useHandleClick = (pageName: string) => {
  const { setActivePage, openSidePane, activePage: currentPage, bodyState, sidePaneContent } = useAppStore();
  const lowerCasePageName = pageName.toLowerCase();

  return () => {
    switch (lowerCasePageName) {
      case 'dashboard':
        setActivePage('dashboard');
        break;
      case 'settings': {
        const isSettingsInSidePane = bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'settings';
        if (currentPage === 'settings' && !isSettingsInSidePane) {
          openSidePane('settings');
          setActivePage('dashboard');
        } else {
          openSidePane('settings');
        }
        break;
      }
      case 'toaster': {
        const isToasterInSidePane = bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'toaster';
        if (currentPage === 'toaster' && !isToasterInSidePane) {
          openSidePane('toaster');
          setActivePage('dashboard');
        } else {
          openSidePane('toaster');
        }
        break;
      }
      // Handle other navigation items if routing is implemented
    }
  };
};

const SidebarWorkspaceTrigger = () => {
  const { isCollapsed, compactMode } = useSidebar();

  return (
    <WorkspaceTrigger
      collapsed={isCollapsed}
      className={cn(
        'rounded-xl transition-colors hover:bg-accent/50 w-full',
        isCollapsed ? 'p-2' : 'p-3 bg-accent/50',
      )}
      avatarClassName={cn(compactMode ? 'h-8 w-8' : 'h-10 w-10')}
    />
  );
};

export const EnhancedSidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ onMouseEnter, onMouseLeave }, ref) => {
    const { sidebarWidth, compactMode } = useAppStore();
    const [selectedWorkspace, setSelectedWorkspace] = React.useState(mockWorkspaces[0]);

    return (
      <Sidebar
        ref={ref}
        style={{ width: sidebarWidth }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <SidebarContent>
          <SidebarHeader>
            <div className="p-2 bg-primary/20 rounded-lg">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <SidebarTitle>Amazing App</SidebarTitle>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection title="Main">
              <AppMenuItem icon={Home} label="Dashboard" />
              <AppMenuItem icon={Search} label="Search" />
              <AppMenuItem icon={Bell} label="Notifications" badge={3} />
            </SidebarSection>
            
            <SidebarSection title="Workspace" collapsible defaultExpanded>
              <AppMenuItem icon={FileText} label="Documents" hasActions>
                <AppMenuItem icon={FileText} label="Recent" isSubItem />
                <AppMenuItem icon={Star} label="Starred" isSubItem />
                <AppMenuItem icon={Trash2} label="Trash" isSubItem />
              </AppMenuItem>
              <AppMenuItem icon={FolderOpen} label="Projects" hasActions />
              <AppMenuItem icon={Calendar} label="Calendar" />
              <AppMenuItem icon={Mail} label="Messages" badge={12} />
            </SidebarSection>
            
            <SidebarSection title="Personal" collapsible>
              <AppMenuItem icon={Bookmark} label="Bookmarks" />
              <AppMenuItem icon={Star} label="Favorites" />
              <AppMenuItem icon={Download} label="Downloads" />
            </SidebarSection>

            <SidebarSection title="Components" collapsible defaultExpanded>
              <AppMenuItem icon={Component} label="Toaster" />
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter>
            <SidebarSection>
              <AppMenuItem icon={User} label="Profile" />
              <AppMenuItem icon={Settings} label="Settings" />
              <AppMenuItem icon={HelpCircle} label="Help" />
            </SidebarSection>

            <div className={cn(compactMode ? 'mt-4' : 'mt-6')}>
              <Workspaces
                workspaces={mockWorkspaces}
                selectedWorkspaceId={selectedWorkspace.id}
                onWorkspaceChange={setSelectedWorkspace}
              >
                <SidebarWorkspaceTrigger />
                <WorkspaceContent>
                  <button className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none">
                    <Plus className="h-4 w-4" />
                    <span>Create Workspace</span>
                  </button>
                </WorkspaceContent>
              </Workspaces>
            </div>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
    );
  },
);
EnhancedSidebar.displayName = 'EnhancedSidebar';


// Example of a reusable menu item component built with the new Sidebar primitives
interface AppMenuItemProps {
  icon: React.ElementType;
  label: string;
  badge?: number;
  hasActions?: boolean;
  children?: React.ReactNode;
  isSubItem?: boolean;
}

const AppMenuItem: React.FC<AppMenuItemProps> = ({ icon: Icon, label, badge, hasActions, children, isSubItem = false }) => {
  const isActive = useIsActive(label);
  const handleClick = useHandleClick(label);
  const { compactMode } = useAppStore();
  const { isCollapsed } = useSidebar();

  return (
    <div className={isSubItem ? (compactMode ? 'ml-4' : 'ml-6') : ''}>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleClick} isActive={isActive}>
          <SidebarIcon>
            <Icon className={isSubItem ? "w-3 h-3" : "w-4 h-4"}/>
          </SidebarIcon>
          <SidebarLabel>{label}</SidebarLabel>
          {badge && <SidebarBadge>{badge}</SidebarBadge>}
          <SidebarTooltip label={label} badge={badge} />
        </SidebarMenuButton>

        {hasActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction>
                <MoreHorizontal className="h-4 w-4" />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem>
                <span>Edit {label}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Delete {label}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
      {!isCollapsed && children && (
        <div className="space-y-1 mt-1">{children}</div>
      )}
    </div>
  );
};