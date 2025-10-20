import { useRef, useCallback } from 'react'
import {
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  Star,
  ChevronRight,
  MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DemoContent } from './DemoContent';
import { useDashboardAnimations } from './hooks/useDashboardAnimations.motion.hook'
import { useAutoAnimateTopBar } from '@/hooks/useAutoAnimateTopBar';
import { useScrollToBottom } from '@/hooks/useScrollToBottom.hook';
import { useAppShellStore } from '@/store/appShell.store'
import { BODY_STATES } from '@/lib/utils'
import { PageHeader } from '@/components/shared/PageHeader';
import { ScrollToBottomButton } from '@/components/shared/ScrollToBottomButton';
import { StatCard } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { PageLayout } from '@/components/shared/PageLayout';

interface StatsCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
}

interface ActivityItem {
  id: string
  type: 'comment' | 'file' | 'meeting' | 'task'
  title: string
  description: string
  time: string
  user: string
}

const statsCards: StatsCard[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: <Users className="w-5 h-5" />
  },
  {
    title: "Conversion Rate",
    value: "12.5%",
    change: "+19%",
    trend: "up",
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    title: "Performance",
    value: "573ms",
    change: "-5.3%",
    trend: "down",
    icon: <Activity className="w-5 h-5" />
  }
]

const recentActivity: ActivityItem[] = [
  {
    id: "1",
    type: "comment",
    title: "New comment on Project Alpha",
    description: "Sarah Johnson added a comment to the design review",
    time: "2 minutes ago",
    user: "SJ"
  },
  {
    id: "2",
    type: "file",
    title: "Document uploaded",
    description: "quarterly-report.pdf was uploaded to Documents",
    time: "15 minutes ago",
    user: "MD"
  },
  {
    id: "3",
    type: "meeting",
    title: "Meeting scheduled",
    description: "Weekly standup meeting scheduled for tomorrow 9 AM",
    time: "1 hour ago",
    user: "RW"
  },
  {
    id: "4",
    type: "task",
    title: "Task completed",
    description: "UI wireframes for mobile app completed",
    time: "2 hours ago",
    user: "AL"
  }
]

export function DashboardContent() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null);
    const statsCardsContainerRef = useRef<HTMLDivElement>(null);
    const featureCardsContainerRef = useRef<HTMLDivElement>(null);
    const bodyState = useAppShellStore(s => s.bodyState);
    const isInSidePane = bodyState === BODY_STATES.SIDE_PANE;
    
    const { onScroll: handleTopBarScroll } = useAutoAnimateTopBar(isInSidePane);
    const { showScrollToBottom, scrollToBottom, handleScroll: handleScrollToBottom } = useScrollToBottom(scrollRef);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        handleTopBarScroll(e);
        handleScrollToBottom();
    }, [handleTopBarScroll, handleScrollToBottom]);

    useDashboardAnimations(contentRef, statsCardsContainerRef, featureCardsContainerRef);

    const getTypeIcon = (type: ActivityItem['type']) => {
      switch (type) {
        case 'comment':
          return <MessageSquare className="w-4 h-4" />
        case 'file':
          return <FileText className="w-4 h-4" />
        case 'meeting':
          return <Calendar className="w-4 h-4" />
        case 'task':
          return <Star className="w-4 h-4" />
        default:
          return <Activity className="w-4 h-4" />
      }
    }

    return (
      <PageLayout scrollRef={scrollRef} onScroll={handleScroll} ref={contentRef}>
        {/* Header */}
        {!isInSidePane && (
          <PageHeader
            title="Dashboard"
            description="Welcome to the Jeli App Shell demo! Explore all the features and customization options."
          />
        )}
          {/* Stats Cards */}
        <div ref={statsCardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Demo Content */}
        <DemoContent ref={featureCardsContainerRef} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Analytics Chart */}
          <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Analytics Overview</h3>
              <button className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            {/* Mock Chart */}
            <div className="h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-xl flex items-center justify-center border border-border/50">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Chart visualization would go here</p>
              </div>
            </div>
          </Card>

          {/* Recent Projects */}
          <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Projects</h3>
              <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "E-commerce Platform", progress: 75, team: 5, deadline: "Dec 15" },
                { name: "Mobile App Redesign", progress: 45, team: 3, deadline: "Jan 20" },
                { name: "Marketing Website", progress: 90, team: 4, deadline: "Dec 5" }
              ].map((project) => (
                <div key={project.name} className="p-4 bg-accent/30 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-3">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{project.team} team members</span>
                    <span>Due {project.deadline}</span>
                    </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { icon: <FileText className="w-4 h-4" />, label: "Create Document", color: "bg-blue-500/10 text-blue-600" },
                { icon: <Calendar className="w-4 h-4" />, label: "Schedule Meeting", color: "bg-green-500/10 text-green-600" },
                { icon: <Users className="w-4 h-4" />, label: "Invite Team", color: "bg-purple-500/10 text-purple-600" },
                { icon: <BarChart3 className="w-4 h-4" />, label: "View Reports", color: "bg-orange-500/10 text-orange-600" }
              ].map((action) => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left"
                >
                  <div className={cn("p-2 rounded-full", action.color)}>
                    {action.icon}
                  </div>
                  <span className="font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-accent/30 rounded-xl transition-colors cursor-pointer">
                  <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                    {getTypeIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">
                        {activity.user}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <ScrollToBottomButton isVisible={showScrollToBottom} onClick={scrollToBottom} />
      </PageLayout>
    )
}