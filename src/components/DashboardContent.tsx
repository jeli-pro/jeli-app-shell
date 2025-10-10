import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
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
  Plus,
  Filter,
  Search,
  MoreVertical,
  ArrowDown,
  PanelRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DemoContent } from './DemoContent'
import { useAppStore } from '@/store/appStore'
import { BODY_STATES } from '@/lib/utils'

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

interface DashboardContentProps {
  isInSidePane?: boolean;
}

export function DashboardContent({ isInSidePane = false }: DashboardContentProps) {
    const contentRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<(HTMLDivElement | null)[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [showScrollToBottom, setShowScrollToBottom] = useState(false)
    const { bodyState, openSidePane, setTopBarVisible } = useAppStore()
    const lastScrollTop = useRef(0);

    const handleScroll = () => {
      if (!contentRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      
      // Auto-hide top bar logic
      if (!isInSidePane) {
        if (scrollTop > lastScrollTop.current && scrollTop > 200) {
          setTopBarVisible(false);
        } else if (scrollTop < lastScrollTop.current || scrollTop <= 0) {
          setTopBarVisible(true);
        }
      }
      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;

      // Show if scrolled down and not at the bottom
      setShowScrollToBottom(scrollTop > 200 && scrollTop < scrollHeight - clientHeight - 200)
    }

    const scrollToBottom = () => {
      contentRef.current?.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }

    // Animate content based on body state
    useEffect(() => {
      if (!contentRef.current) return

      const content = contentRef.current
      const cards = cardsRef.current.filter(Boolean)

      switch (bodyState) {
        case BODY_STATES.FULLSCREEN:
          gsap.to(content, {
            scale: 1.02,
            duration: 0.4,
            ease: "power3.out"
          })
          break
        default:
          gsap.to(content, {
            scale: 1,
            duration: 0.4,
            ease: "power3.out"
          })
          break
      }

      // Stagger animation for cards
      gsap.fromTo(cards, 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        }
      )

    }, [bodyState])

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
        <div 
          ref={contentRef}
          className="h-full overflow-y-auto space-y-8 p-6 lg:px-12"
          onScroll={handleScroll}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to the amazing app shell demo! Explore all the features and customization options.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border-none rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10">
                <Plus className="w-5 h-5" />
                <span>New Project</span>
              </button>
              {!isInSidePane && (
                <button
                  onClick={() => openSidePane('main')}
                  className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors" title="Move to Side Pane">
                  <PanelRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <div
                key={stat.title}
                ref={el => cardsRef.current[index] = el}
                className="bg-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    {stat.icon}
                  </div>
                  <div className={cn(
                    "text-sm font-medium",
                    stat.trend === 'up' ? "text-green-600" : "text-red-600"
                  )}>
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                </div>
              </div>
              ))}
            </div>

            {/* Demo Content */}
            <DemoContent />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Analytics Chart */}
              <div className="bg-card p-6 rounded-2xl border border-border/50">
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
              </div>

              {/* Recent Projects */}
              <div className="bg-card p-6 rounded-2xl border border-border/50">
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
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-card p-6 rounded-2xl border border-border/50">
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
              </div>

              {/* Recent Activity */}
              <div className="bg-card p-6 rounded-2xl border border-border/50">
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
              </div>
            </div>
          </div>
          {showScrollToBottom && (
            <button
              onClick={scrollToBottom}
              className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all animate-fade-in z-[51]"
              style={{ animation: 'bounce 2s infinite' }}
              title="Scroll to bottom"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
          )}
      </div>
    )
}