# Directory Structure
```
src/
  features/
    dynamic-view/
      components/
        views/
          KanbanView.tsx
      DynamicView.tsx
      types.ts
  pages/
    DataDemo/
      data/
        DataDemoItem.ts
        mockData.ts
      index.tsx
  index.css
index.html
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: src/index.css
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  :root {
    --primary-hsl: 220 84% 60%;
    --background: 210 40% 96.1%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: var(--primary-hsl);
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: var(--primary-hsl);
    --radius: 1rem;
  }

  .dark {
    --background: 240 6% 9%;
    --foreground: 210 40% 98%;
    --card: 240 6% 14%;
    --card-foreground: 210 40% 98%;
    --popover: 240 6% 12%;
    --popover-foreground: 210 40% 98%;
    --primary: var(--primary-hsl);
    --primary-foreground: 210 40% 98%;
    --secondary: 240 5% 20%;
    --secondary-foreground: 210 40% 98%;
    --muted: 240 5% 20%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 240 5% 20%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 240 5% 20%;
    --input: 240 5% 20%;
    --ring: var(--primary-hsl);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-border rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-muted-foreground/50;
}

/* For UserDropdown */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

@layer base {
  .login-page-theme {
    --background: hsl(0 0% 100%);
    --foreground: hsl(0 0% 0%);
    --skeleton: hsl(0 0% 90%);
    --border: hsl(220 20% 90%);
    --btn-border: hsl(214.3 31.8% 91.4%);
    --input: hsl(220 20% 90%);
    --radius: 0.5rem;
  }
 
  .dark .login-page-theme {
    --background: hsl(222 94% 5%);
    --foreground: hsl(0 0% 100%);
    --skeleton: hsl(218 36% 16%);
    --border: hsl(220 20% 90%);
    --btn-border: hsl(217 32.6% 17.5%);
    --input: hsl(219 63% 16%);
    --radius: 0.5rem;
  }
}

@layer components {
  .g-button {
    @apply rounded-[var(--radius)] border;
    border-color: var(--btn-border);
  }
}
```

## File: postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## File: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
import { resolve } from 'path'
import pkg from './package.json' with { type: 'json' }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'JeliAppShell',
      fileName: (format) => `jeli-app-shell.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: Object.keys(pkg.peerDependencies || {}),
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          tailwindcss: 'tailwindcss',
          gsap: 'gsap',
          'lucide-react': 'lucide-react',
          zustand: 'zustand',
          sonner: 'sonner'
        },
      },
    },
  },
})
```

## File: src/pages/DataDemo/data/DataDemoItem.ts
```typescript
import type { GenericItem, Status, Priority } from '@/features/dynamic-view/types';

export interface DataDemoItem extends GenericItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  status: Status;
  priority: Priority;
  assignee: {
    name: string;
    email: string;
    avatar: string;
  };
  tags: string[];
  metrics: {
    views: number;
    likes: number;
    shares: number;
    completion: number;
  };
  dueDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
```

## File: src/pages/DataDemo/data/mockData.ts
```typescript
import type { GenericItem } from '@/features/dynamic-view/types';

export const mockDataItems: GenericItem[] = [
  {
    id: '1',
    title: 'Mobile App Redesign Project',
    description: 'Complete overhaul of the mobile application user interface with focus on accessibility and modern design patterns.',
    category: 'Design',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Sarah Chen',
      avatar: '🎨',
      email: 'sarah.chen@company.com'
    },
    metrics: {
      views: 1247,
      likes: 89,
      shares: 23,
      completion: 65
    },
    tags: ['UI/UX', 'Mobile', 'Accessibility', 'Figma'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    dueDate: '2024-02-28T23:59:59Z',
    thumbnail: '🎨',
    content: {
      summary: 'Redesigning the mobile app to improve user experience and accessibility compliance.',
      details: 'This project involves a complete redesign of our mobile application interface. The focus is on creating a more intuitive user experience while ensuring full accessibility compliance. We\'re implementing modern design patterns and conducting extensive user testing.',
      attachments: [
        { name: 'Design_Mockups_v2.fig', type: 'Figma', size: '2.4 MB', url: '#' },
        { name: 'User_Research_Report.pdf', type: 'PDF', size: '1.8 MB', url: '#' },
        { name: 'Accessibility_Guidelines.docx', type: 'Document', size: '850 KB', url: '#' }
      ]
    }
  },
  {
    id: '2',
    title: 'API Performance Optimization',
    description: 'Optimize backend API endpoints to reduce response times and improve scalability for high-traffic scenarios.',
    category: 'Development',
    status: 'pending',
    priority: 'critical',
    assignee: {
      name: 'Marcus Rodriguez',
      avatar: '⚡',
      email: 'marcus.rodriguez@company.com'
    },
    metrics: {
      views: 892,
      likes: 156,
      shares: 45,
      completion: 25
    },
    tags: ['Backend', 'Performance', 'API', 'Optimization'],
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    dueDate: '2024-01-30T23:59:59Z',
    thumbnail: '⚡',
    content: {
      summary: 'Critical performance improvements needed for API endpoints experiencing high latency.',
      details: 'Our API endpoints are experiencing significant performance issues during peak traffic. This optimization project will focus on database query optimization, caching strategies, and implementing rate limiting to ensure consistent performance.',
      attachments: [
        { name: 'Performance_Analysis.xlsx', type: 'Spreadsheet', size: '3.2 MB', url: '#' },
        { name: 'Database_Schema_Updates.sql', type: 'SQL', size: '45 KB', url: '#' }
      ]
    }
  },
  {
    id: '3',
    title: 'Customer Feedback Dashboard',
    description: 'Build a comprehensive dashboard for analyzing customer feedback trends and sentiment analysis.',
    category: 'Analytics',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Emma Thompson',
      avatar: '📊',
      email: 'emma.thompson@company.com'
    },
    metrics: {
      views: 2341,
      likes: 234,
      shares: 67,
      completion: 100
    },
    tags: ['Dashboard', 'Analytics', 'Customer Experience', 'Data Viz'],
    createdAt: '2024-01-05T08:30:00Z',
    updatedAt: '2024-01-19T17:20:00Z',
    thumbnail: '📊',
    content: {
      summary: 'Successfully launched customer feedback dashboard with real-time analytics.',
      details: 'Completed the development of a comprehensive customer feedback dashboard that provides real-time insights into customer sentiment, trending topics, and satisfaction metrics. The dashboard includes interactive visualizations and automated reporting.',
      attachments: [
        { name: 'Dashboard_Demo.mp4', type: 'Video', size: '15.7 MB', url: '#' },
        { name: 'User_Guide.pdf', type: 'PDF', size: '2.1 MB', url: '#' },
        { name: 'Technical_Specs.md', type: 'Markdown', size: '23 KB', url: '#' }
      ]
    }
  },
  {
    id: '4',
    title: 'Security Audit & Compliance',
    description: 'Comprehensive security audit of all systems and implementation of compliance measures for data protection.',
    category: 'Security',
    status: 'active',
    priority: 'critical',
    assignee: {
      name: 'David Kim',
      avatar: '🔒',
      email: 'david.kim@company.com'
    },
    metrics: {
      views: 567,
      likes: 78,
      shares: 12,
      completion: 45
    },
    tags: ['Security', 'Compliance', 'GDPR', 'Audit'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-23T13:15:00Z',
    dueDate: '2024-03-15T23:59:59Z',
    thumbnail: '🔒',
    content: {
      summary: 'Ongoing security audit to ensure compliance with data protection regulations.',
      details: 'Comprehensive security assessment covering all systems, applications, and data handling processes. The audit includes penetration testing, vulnerability assessments, and implementation of GDPR compliance measures.',
      attachments: [
        { name: 'Security_Checklist.xlsx', type: 'Spreadsheet', size: '1.5 MB', url: '#' },
        { name: 'Compliance_Report_Draft.pdf', type: 'PDF', size: '4.2 MB', url: '#' }
      ]
    }
  },
  {
    id: '5',
    title: 'AI-Powered Content Recommendations',
    description: 'Implement machine learning algorithms to provide personalized content recommendations for users.',
    category: 'AI/ML',
    status: 'pending',
    priority: 'medium',
    assignee: {
      name: 'Priya Patel',
      avatar: '🤖',
      email: 'priya.patel@company.com'
    },
    metrics: {
      views: 1456,
      likes: 201,
      shares: 89,
      completion: 15
    },
    tags: ['Machine Learning', 'AI', 'Recommendations', 'Personalization'],
    createdAt: '2024-01-22T14:20:00Z',
    updatedAt: '2024-01-24T09:10:00Z',
    dueDate: '2024-04-10T23:59:59Z',
    thumbnail: '🤖',
    content: {
      summary: 'Building AI-driven recommendation system to enhance user engagement.',
      details: 'Development of a sophisticated recommendation engine using machine learning algorithms. The system will analyze user behavior patterns, content preferences, and engagement metrics to provide highly personalized content suggestions.',
      attachments: [
        { name: 'ML_Model_Proposal.pdf', type: 'PDF', size: '3.8 MB', url: '#' },
        { name: 'Training_Data_Analysis.ipynb', type: 'Jupyter Notebook', size: '892 KB', url: '#' }
      ]
    }
  },
  {
    id: '6',
    title: 'Cloud Infrastructure Migration',
    description: 'Migrate legacy systems to cloud infrastructure for improved scalability and cost efficiency.',
    category: 'Infrastructure',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Alex Johnson',
      avatar: '☁️',
      email: 'alex.johnson@company.com'
    },
    metrics: {
      views: 734,
      likes: 92,
      shares: 34,
      completion: 70
    },
    tags: ['Cloud', 'Migration', 'AWS', 'Infrastructure'],
    createdAt: '2024-01-10T07:45:00Z',
    updatedAt: '2024-01-24T11:30:00Z',
    dueDate: '2024-02-15T23:59:59Z',
    thumbnail: '☁️',
    content: {
      summary: 'Migrating critical systems to cloud infrastructure for better performance and scalability.',
      details: 'Comprehensive migration of our legacy on-premise infrastructure to AWS cloud services. This includes database migration, application containerization, and implementation of auto-scaling capabilities.',
      attachments: [
        { name: 'Migration_Plan.pdf', type: 'PDF', size: '5.1 MB', url: '#' },
        { name: 'Cost_Analysis.xlsx', type: 'Spreadsheet', size: '1.9 MB', url: '#' },
        { name: 'Architecture_Diagram.png', type: 'Image', size: '2.3 MB', url: '#' }
      ]
    }
  },
  {
    id: '7',
    title: 'User Onboarding Experience',
    description: 'Design and implement an intuitive onboarding flow to improve new user activation rates.',
    category: 'Product',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Lisa Zhang',
      avatar: '🚀',
      email: 'lisa.zhang@company.com'
    },
    metrics: {
      views: 1876,
      likes: 298,
      shares: 156,
      completion: 100
    },
    tags: ['Onboarding', 'UX', 'Product', 'Conversion'],
    createdAt: '2024-01-02T12:00:00Z',
    updatedAt: '2024-01-16T18:45:00Z',
    thumbnail: '🚀',
    content: {
      summary: 'Successfully launched new user onboarding experience with 40% improvement in activation rates.',
      details: 'Designed and implemented a streamlined onboarding flow that guides new users through key product features. The new experience includes interactive tutorials, progress tracking, and personalized setup recommendations.',
      attachments: [
        { name: 'Onboarding_Flow.sketch', type: 'Sketch', size: '4.7 MB', url: '#' },
        { name: 'A_B_Test_Results.pdf', type: 'PDF', size: '1.4 MB', url: '#' },
        { name: 'User_Journey_Map.png', type: 'Image', size: '3.2 MB', url: '#' }
      ]
    }
  },
  {
    id: '8',
    title: 'Real-time Collaboration Features',
    description: 'Implement real-time collaborative editing and communication features for team productivity.',
    category: 'Development',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Jordan Miller',
      avatar: '👥',
      email: 'jordan.miller@company.com'
    },
    metrics: {
      views: 1123,
      likes: 167,
      shares: 78,
      completion: 55
    },
    tags: ['Collaboration', 'Real-time', 'WebSocket', 'Team Tools'],
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-25T10:20:00Z',
    dueDate: '2024-03-01T23:59:59Z',
    thumbnail: '👥',
    content: {
      summary: 'Building real-time collaboration features to enhance team productivity and communication.',
      details: 'Development of real-time collaborative editing capabilities using WebSocket technology. Features include live cursor tracking, simultaneous editing, instant messaging, and presence indicators for team members.',
      attachments: [
        { name: 'Technical_Architecture.pdf', type: 'PDF', size: '2.8 MB', url: '#' },
        { name: 'WebSocket_Implementation.js', type: 'JavaScript', size: '67 KB', url: '#' },
        { name: 'UI_Mockups.fig', type: 'Figma', size: '3.1 MB', url: '#' }
      ]
    }
  },
  {
    id: '9',
    title: 'Mobile App Redesign Project',
    description: 'Complete overhaul of the mobile application user interface with focus on accessibility and modern design patterns.',
    category: 'Design',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Sarah Chen',
      avatar: '🎨',
      email: 'sarah.chen@company.com'
    },
    metrics: {
      views: 1247,
      likes: 89,
      shares: 23,
      completion: 65
    },
    tags: ['UI/UX', 'Mobile', 'Accessibility', 'Figma'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    dueDate: '2024-02-28T23:59:59Z',
    thumbnail: '🎨',
    content: {
      summary: 'Redesigning the mobile app to improve user experience and accessibility compliance.',
      details: 'This project involves a complete redesign of our mobile application interface. The focus is on creating a more intuitive user experience while ensuring full accessibility compliance. We\'re implementing modern design patterns and conducting extensive user testing.',
      attachments: [
        { name: 'Design_Mockups_v2.fig', type: 'Figma', size: '2.4 MB', url: '#' },
        { name: 'User_Research_Report.pdf', type: 'PDF', size: '1.8 MB', url: '#' },
        { name: 'Accessibility_Guidelines.docx', type: 'Document', size: '850 KB', url: '#' }
      ]
    }
  },
  {
    id: '10',
    title: 'API Performance Optimization',
    description: 'Optimize backend API endpoints to reduce response times and improve scalability for high-traffic scenarios.',
    category: 'Development',
    status: 'pending',
    priority: 'critical',
    assignee: {
      name: 'Marcus Rodriguez',
      avatar: '⚡',
      email: 'marcus.rodriguez@company.com'
    },
    metrics: {
      views: 892,
      likes: 156,
      shares: 45,
      completion: 25
    },
    tags: ['Backend', 'Performance', 'API', 'Optimization'],
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    dueDate: '2024-01-30T23:59:59Z',
    thumbnail: '⚡',
    content: {
      summary: 'Critical performance improvements needed for API endpoints experiencing high latency.',
      details: 'Our API endpoints are experiencing significant performance issues during peak traffic. This optimization project will focus on database query optimization, caching strategies, and implementing rate limiting to ensure consistent performance.',
      attachments: [
        { name: 'Performance_Analysis.xlsx', type: 'Spreadsheet', size: '3.2 MB', url: '#' },
        { name: 'Database_Schema_Updates.sql', type: 'SQL', size: '45 KB', url: '#' }
      ]
    }
  },
  {
    id: '11',
    title: 'Customer Feedback Dashboard',
    description: 'Build a comprehensive dashboard for analyzing customer feedback trends and sentiment analysis.',
    category: 'Analytics',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Emma Thompson',
      avatar: '📊',
      email: 'emma.thompson@company.com'
    },
    metrics: {
      views: 2341,
      likes: 234,
      shares: 67,
      completion: 100
    },
    tags: ['Dashboard', 'Analytics', 'Customer Experience', 'Data Viz'],
    createdAt: '2024-01-05T08:30:00Z',
    updatedAt: '2024-01-19T17:20:00Z',
    thumbnail: '📊',
    content: {
      summary: 'Successfully launched customer feedback dashboard with real-time analytics.',
      details: 'Completed the development of a comprehensive customer feedback dashboard that provides real-time insights into customer sentiment, trending topics, and satisfaction metrics. The dashboard includes interactive visualizations and automated reporting.',
      attachments: [
        { name: 'Dashboard_Demo.mp4', type: 'Video', size: '15.7 MB', url: '#' },
        { name: 'User_Guide.pdf', type: 'PDF', size: '2.1 MB', url: '#' },
        { name: 'Technical_Specs.md', type: 'Markdown', size: '23 KB', url: '#' }
      ]
    }
  },
  {
    id: '12',
    title: 'Security Audit & Compliance',
    description: 'Comprehensive security audit of all systems and implementation of compliance measures for data protection.',
    category: 'Security',
    status: 'active',
    priority: 'critical',
    assignee: {
      name: 'David Kim',
      avatar: '🔒',
      email: 'david.kim@company.com'
    },
    metrics: {
      views: 567,
      likes: 78,
      shares: 12,
      completion: 45
    },
    tags: ['Security', 'Compliance', 'GDPR', 'Audit'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-23T13:15:00Z',
    dueDate: '2024-03-15T23:59:59Z',
    thumbnail: '🔒',
    content: {
      summary: 'Ongoing security audit to ensure compliance with data protection regulations.',
      details: 'Comprehensive security assessment covering all systems, applications, and data handling processes. The audit includes penetration testing, vulnerability assessments, and implementation of GDPR compliance measures.',
      attachments: [
        { name: 'Security_Checklist.xlsx', type: 'Spreadsheet', size: '1.5 MB', url: '#' },
        { name: 'Compliance_Report_Draft.pdf', type: 'PDF', size: '4.2 MB', url: '#' }
      ]
    }
  },
  {
    id: '13',
    title: 'AI-Powered Content Recommendations',
    description: 'Implement machine learning algorithms to provide personalized content recommendations for users.',
    category: 'AI/ML',
    status: 'pending',
    priority: 'medium',
    assignee: {
      name: 'Priya Patel',
      avatar: '🤖',
      email: 'priya.patel@company.com'
    },
    metrics: {
      views: 1456,
      likes: 201,
      shares: 89,
      completion: 15
    },
    tags: ['Machine Learning', 'AI', 'Recommendations', 'Personalization'],
    createdAt: '2024-01-22T14:20:00Z',
    updatedAt: '2024-01-24T09:10:00Z',
    dueDate: '2024-04-10T23:59:59Z',
    thumbnail: '🤖',
    content: {
      summary: 'Building AI-driven recommendation system to enhance user engagement.',
      details: 'Development of a sophisticated recommendation engine using machine learning algorithms. The system will analyze user behavior patterns, content preferences, and engagement metrics to provide highly personalized content suggestions.',
      attachments: [
        { name: 'ML_Model_Proposal.pdf', type: 'PDF', size: '3.8 MB', url: '#' },
        { name: 'Training_Data_Analysis.ipynb', type: 'Jupyter Notebook', size: '892 KB', url: '#' }
      ]
    }
  },
  {
    id: '14',
    title: 'Cloud Infrastructure Migration',
    description: 'Migrate legacy systems to cloud infrastructure for improved scalability and cost efficiency.',
    category: 'Infrastructure',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Alex Johnson',
      avatar: '☁️',
      email: 'alex.johnson@company.com'
    },
    metrics: {
      views: 734,
      likes: 92,
      shares: 34,
      completion: 70
    },
    tags: ['Cloud', 'Migration', 'AWS', 'Infrastructure'],
    createdAt: '2024-01-10T07:45:00Z',
    updatedAt: '2024-01-24T11:30:00Z',
    dueDate: '2024-02-15T23:59:59Z',
    thumbnail: '☁️',
    content: {
      summary: 'Migrating critical systems to cloud infrastructure for better performance and scalability.',
      details: 'Comprehensive migration of our legacy on-premise infrastructure to AWS cloud services. This includes database migration, application containerization, and implementation of auto-scaling capabilities.',
      attachments: [
        { name: 'Migration_Plan.pdf', type: 'PDF', size: '5.1 MB', url: '#' },
        { name: 'Cost_Analysis.xlsx', type: 'Spreadsheet', size: '1.9 MB', url: '#' },
        { name: 'Architecture_Diagram.png', type: 'Image', size: '2.3 MB', url: '#' }
      ]
    }
  },
  {
    id: '15',
    title: 'User Onboarding Experience',
    description: 'Design and implement an intuitive onboarding flow to improve new user activation rates.',
    category: 'Product',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Lisa Zhang',
      avatar: '🚀',
      email: 'lisa.zhang@company.com'
    },
    metrics: {
      views: 1876,
      likes: 298,
      shares: 156,
      completion: 100
    },
    tags: ['Onboarding', 'UX', 'Product', 'Conversion'],
    createdAt: '2024-01-02T12:00:00Z',
    updatedAt: '2024-01-16T18:45:00Z',
    thumbnail: '🚀',
    content: {
      summary: 'Successfully launched new user onboarding experience with 40% improvement in activation rates.',
      details: 'Designed and implemented a streamlined onboarding flow that guides new users through key product features. The new experience includes interactive tutorials, progress tracking, and personalized setup recommendations.',
      attachments: [
        { name: 'Onboarding_Flow.sketch', type: 'Sketch', size: '4.7 MB', url: '#' },
        { name: 'A_B_Test_Results.pdf', type: 'PDF', size: '1.4 MB', url: '#' },
        { name: 'User_Journey_Map.png', type: 'Image', size: '3.2 MB', url: '#' }
      ]
    }
  },
  {
    id: '16',
    title: 'Real-time Collaboration Features',
    description: 'Implement real-time collaborative editing and communication features for team productivity.',
    category: 'Development',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Jordan Miller',
      avatar: '👥',
      email: 'jordan.miller@company.com'
    },
    metrics: {
      views: 1123,
      likes: 167,
      shares: 78,
      completion: 55
    },
    tags: ['Collaboration', 'Real-time', 'WebSocket', 'Team Tools'],
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-25T10:20:00Z',
    dueDate: '2024-03-01T23:59:59Z',
    thumbnail: '👥',
    content: {
      summary: 'Building real-time collaboration features to enhance team productivity and communication.',
      details: 'Development of real-time collaborative editing capabilities using WebSocket technology. Features include live cursor tracking, simultaneous editing, instant messaging, and presence indicators for team members.',
      attachments: [
        { name: 'Technical_Architecture.pdf', type: 'PDF', size: '2.8 MB', url: '#' },
        { name: 'WebSocket_Implementation.js', type: 'JavaScript', size: '67 KB', url: '#' },
        { name: 'UI_Mockups.fig', type: 'Figma', size: '3.1 MB', url: '#' }
      ]
    }
  },
  {
    id: '17',
    title: 'Mobile App Redesign Project',
    description: 'Complete overhaul of the mobile application user interface with focus on accessibility and modern design patterns.',
    category: 'Design',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Sarah Chen',
      avatar: '🎨',
      email: 'sarah.chen@company.com'
    },
    metrics: {
      views: 1247,
      likes: 89,
      shares: 23,
      completion: 65
    },
    tags: ['UI/UX', 'Mobile', 'Accessibility', 'Figma'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    dueDate: '2024-02-28T23:59:59Z',
    thumbnail: '🎨',
    content: {
      summary: 'Redesigning the mobile app to improve user experience and accessibility compliance.',
      details: 'This project involves a complete redesign of our mobile application interface. The focus is on creating a more intuitive user experience while ensuring full accessibility compliance. We\'re implementing modern design patterns and conducting extensive user testing.',
      attachments: [
        { name: 'Design_Mockups_v2.fig', type: 'Figma', size: '2.4 MB', url: '#' },
        { name: 'User_Research_Report.pdf', type: 'PDF', size: '1.8 MB', url: '#' },
        { name: 'Accessibility_Guidelines.docx', type: 'Document', size: '850 KB', url: '#' }
      ]
    }
  },
  {
    id: '18',
    title: 'API Performance Optimization',
    description: 'Optimize backend API endpoints to reduce response times and improve scalability for high-traffic scenarios.',
    category: 'Development',
    status: 'pending',
    priority: 'critical',
    assignee: {
      name: 'Marcus Rodriguez',
      avatar: '⚡',
      email: 'marcus.rodriguez@company.com'
    },
    metrics: {
      views: 892,
      likes: 156,
      shares: 45,
      completion: 25
    },
    tags: ['Backend', 'Performance', 'API', 'Optimization'],
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    dueDate: '2024-01-30T23:59:59Z',
    thumbnail: '⚡',
    content: {
      summary: 'Critical performance improvements needed for API endpoints experiencing high latency.',
      details: 'Our API endpoints are experiencing significant performance issues during peak traffic. This optimization project will focus on database query optimization, caching strategies, and implementing rate limiting to ensure consistent performance.',
      attachments: [
        { name: 'Performance_Analysis.xlsx', type: 'Spreadsheet', size: '3.2 MB', url: '#' },
        { name: 'Database_Schema_Updates.sql', type: 'SQL', size: '45 KB', url: '#' }
      ]
    }
  },
  {
    id: '19',
    title: 'Customer Feedback Dashboard',
    description: 'Build a comprehensive dashboard for analyzing customer feedback trends and sentiment analysis.',
    category: 'Analytics',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Emma Thompson',
      avatar: '📊',
      email: 'emma.thompson@company.com'
    },
    metrics: {
      views: 2341,
      likes: 234,
      shares: 67,
      completion: 100
    },
    tags: ['Dashboard', 'Analytics', 'Customer Experience', 'Data Viz'],
    createdAt: '2024-01-05T08:30:00Z',
    updatedAt: '2024-01-19T17:20:00Z',
    thumbnail: '📊',
    content: {
      summary: 'Successfully launched customer feedback dashboard with real-time analytics.',
      details: 'Completed the development of a comprehensive customer feedback dashboard that provides real-time insights into customer sentiment, trending topics, and satisfaction metrics. The dashboard includes interactive visualizations and automated reporting.',
      attachments: [
        { name: 'Dashboard_Demo.mp4', type: 'Video', size: '15.7 MB', url: '#' },
        { name: 'User_Guide.pdf', type: 'PDF', size: '2.1 MB', url: '#' },
        { name: 'Technical_Specs.md', type: 'Markdown', size: '23 KB', url: '#' }
      ]
    }
  },
  {
    id: '20',
    title: 'Security Audit & Compliance',
    description: 'Comprehensive security audit of all systems and implementation of compliance measures for data protection.',
    category: 'Security',
    status: 'active',
    priority: 'critical',
    assignee: {
      name: 'David Kim',
      avatar: '🔒',
      email: 'david.kim@company.com'
    },
    metrics: {
      views: 567,
      likes: 78,
      shares: 12,
      completion: 45
    },
    tags: ['Security', 'Compliance', 'GDPR', 'Audit'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-23T13:15:00Z',
    dueDate: '2024-03-15T23:59:59Z',
    thumbnail: '🔒',
    content: {
      summary: 'Ongoing security audit to ensure compliance with data protection regulations.',
      details: 'Comprehensive security assessment covering all systems, applications, and data handling processes. The audit includes penetration testing, vulnerability assessments, and implementation of GDPR compliance measures.',
      attachments: [
        { name: 'Security_Checklist.xlsx', type: 'Spreadsheet', size: '1.5 MB', url: '#' },
        { name: 'Compliance_Report_Draft.pdf', type: 'PDF', size: '4.2 MB', url: '#' }
      ]
    }
  },
  {
    id: '21',
    title: 'AI-Powered Content Recommendations',
    description: 'Implement machine learning algorithms to provide personalized content recommendations for users.',
    category: 'AI/ML',
    status: 'pending',
    priority: 'medium',
    assignee: {
      name: 'Priya Patel',
      avatar: '🤖',
      email: 'priya.patel@company.com'
    },
    metrics: {
      views: 1456,
      likes: 201,
      shares: 89,
      completion: 15
    },
    tags: ['Machine Learning', 'AI', 'Recommendations', 'Personalization'],
    createdAt: '2024-01-22T14:20:00Z',
    updatedAt: '2024-01-24T09:10:00Z',
    dueDate: '2024-04-10T23:59:59Z',
    thumbnail: '🤖',
    content: {
      summary: 'Building AI-driven recommendation system to enhance user engagement.',
      details: 'Development of a sophisticated recommendation engine using machine learning algorithms. The system will analyze user behavior patterns, content preferences, and engagement metrics to provide highly personalized content suggestions.',
      attachments: [
        { name: 'ML_Model_Proposal.pdf', type: 'PDF', size: '3.8 MB', url: '#' },
        { name: 'Training_Data_Analysis.ipynb', type: 'Jupyter Notebook', size: '892 KB', url: '#' }
      ]
    }
  },
  {
    id: '22',
    title: 'Cloud Infrastructure Migration',
    description: 'Migrate legacy systems to cloud infrastructure for improved scalability and cost efficiency.',
    category: 'Infrastructure',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Alex Johnson',
      avatar: '☁️',
      email: 'alex.johnson@company.com'
    },
    metrics: {
      views: 734,
      likes: 92,
      shares: 34,
      completion: 70
    },
    tags: ['Cloud', 'Migration', 'AWS', 'Infrastructure'],
    createdAt: '2024-01-10T07:45:00Z',
    updatedAt: '2024-01-24T11:30:00Z',
    dueDate: '2024-02-15T23:59:59Z',
    thumbnail: '☁️',
    content: {
      summary: 'Migrating critical systems to cloud infrastructure for better performance and scalability.',
      details: 'Comprehensive migration of our legacy on-premise infrastructure to AWS cloud services. This includes database migration, application containerization, and implementation of auto-scaling capabilities.',
      attachments: [
        { name: 'Migration_Plan.pdf', type: 'PDF', size: '5.1 MB', url: '#' },
        { name: 'Cost_Analysis.xlsx', type: 'Spreadsheet', size: '1.9 MB', url: '#' },
        { name: 'Architecture_Diagram.png', type: 'Image', size: '2.3 MB', url: '#' }
      ]
    }
  },
  {
    id: '23',
    title: 'User Onboarding Experience',
    description: 'Design and implement an intuitive onboarding flow to improve new user activation rates.',
    category: 'Product',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Lisa Zhang',
      avatar: '🚀',
      email: 'lisa.zhang@company.com'
    },
    metrics: {
      views: 1876,
      likes: 298,
      shares: 156,
      completion: 100
    },
    tags: ['Onboarding', 'UX', 'Product', 'Conversion'],
    createdAt: '2024-01-02T12:00:00Z',
    updatedAt: '2024-01-16T18:45:00Z',
    thumbnail: '🚀',
    content: {
      summary: 'Successfully launched new user onboarding experience with 40% improvement in activation rates.',
      details: 'Designed and implemented a streamlined onboarding flow that guides new users through key product features. The new experience includes interactive tutorials, progress tracking, and personalized setup recommendations.',
      attachments: [
        { name: 'Onboarding_Flow.sketch', type: 'Sketch', size: '4.7 MB', url: '#' },
        { name: 'A_B_Test_Results.pdf', type: 'PDF', size: '1.4 MB', url: '#' },
        { name: 'User_Journey_Map.png', type: 'Image', size: '3.2 MB', url: '#' }
      ]
    }
  },
  {
    id: '24',
    title: 'Real-time Collaboration Features',
    description: 'Implement real-time collaborative editing and communication features for team productivity.',
    category: 'Development',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Jordan Miller',
      avatar: '👥',
      email: 'jordan.miller@company.com'
    },
    metrics: {
      views: 1123,
      likes: 167,
      shares: 78,
      completion: 55
    },
    tags: ['Collaboration', 'Real-time', 'WebSocket', 'Team Tools'],
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-25T10:20:00Z',
    dueDate: '2024-03-01T23:59:59Z',
    thumbnail: '👥',
    content: {
      summary: 'Building real-time collaboration features to enhance team productivity and communication.',
      details: 'Development of real-time collaborative editing capabilities using WebSocket technology. Features include live cursor tracking, simultaneous editing, instant messaging, and presence indicators for team members.',
      attachments: [
        { name: 'Technical_Architecture.pdf', type: 'PDF', size: '2.8 MB', url: '#' },
        { name: 'WebSocket_Implementation.js', type: 'JavaScript', size: '67 KB', url: '#' },
        { name: 'UI_Mockups.fig', type: 'Figma', size: '3.1 MB', url: '#' }
      ]
    }
  }
]
```

## File: index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jeli App Shell</title>
    <script>
      (function() {
        try {
          const storageKey = 'app-shell-storage';
          const storageValue = localStorage.getItem(storageKey);
          let isDarkMode;

          if (storageValue) {
            isDarkMode = JSON.parse(storageValue)?.state?.isDarkMode;
          }
          
          if (typeof isDarkMode !== 'boolean') {
            isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          }
          
          document.documentElement.classList.toggle('dark', isDarkMode);
        } catch (e) { /* Fails safely */ }
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <div id="toaster-container"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## File: tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        DEFAULT: "0.5rem",
      },
      boxShadow: {
        input: [
          "0px 2px 3px -1px rgba(0, 0, 0, 0.1)",
          "0px 1px 0px 0px rgba(25, 28, 33, 0.02)",
          "0px 0px 0px 1px rgba(25, 28, 33, 0.08)",
        ].join(", "),
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        ripple: "ripple 2s ease calc(var(--i, 0) * 0.2s) infinite",
        orbit: "orbit calc(var(--duration) * 1s) linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        ripple: {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -50%) scale(0.9)" },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        }
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss/plugin")(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    }),
  ],
}
```

## File: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Library Build */
    "declaration": true,
    "emitDeclarationOnly": true,
    "declarationDir": "dist",

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": [
    "dist",
    "src/App.tsx",
    "src/main.tsx",
    "src/pages"
  ]
}
```

## File: tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

## File: src/features/dynamic-view/components/views/KanbanView.tsx
```typescript
import { useState, useEffect, Fragment } from "react";
import {
  GripVertical,
  Plus,
} from "lucide-react";
import type { GenericItem } from '../../types'
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/EmptyState";
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

interface KanbanCardProps {
  item: GenericItem;
  isDragging: boolean;
}

function KanbanCard({ item, isDragging, ...props }: KanbanCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const { config, onItemSelect } = useDynamicView<string, GenericItem>();
  const { kanbanView: viewConfig } = config;

  return (
    <Card
      {...props}
      data-draggable-id={item.id}
      onClick={() => onItemSelect(item)}
      className={cn(
        "cursor-pointer transition-all duration-300 border bg-card/60 dark:bg-neutral-800/60 backdrop-blur-sm hover:bg-card/70 dark:hover:bg-neutral-700/70 active:cursor-grabbing",
        isDragging && "opacity-50 ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-card-foreground dark:text-neutral-100 leading-tight">
              <FieldRenderer item={item} fieldId={viewConfig.cardFields.titleField} />
            </h4>
            <GripVertical className="w-5 h-5 text-muted-foreground/60 dark:text-neutral-400 cursor-grab flex-shrink-0" />
          </div>

          <p className="text-sm text-muted-foreground dark:text-neutral-300 leading-relaxed line-clamp-2">
            <FieldRenderer item={item} fieldId={viewConfig.cardFields.descriptionField} />
          </p>

          <div className="flex flex-wrap gap-2">
            <FieldRenderer item={item} fieldId={viewConfig.cardFields.priorityField} />
            <FieldRenderer item={item} fieldId={viewConfig.cardFields.tagsField} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/30 dark:border-neutral-700/30">
            <div className="flex items-center gap-4 text-muted-foreground/80 dark:text-neutral-400">
              <FieldRenderer item={item} fieldId={viewConfig.cardFields.dateField} />
              <FieldRenderer item={item} fieldId={viewConfig.cardFields.metricsField} />
            </div>
            <FieldRenderer item={item} fieldId={viewConfig.cardFields.assigneeField} options={{ compact: true, avatarClassName: 'w-8 h-8 ring-2 ring-white/50 dark:ring-neutral-700/50' }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DataKanbanViewProps {
  data: Record<string, GenericItem[]>;
}

export function KanbanView({ data }: DataKanbanViewProps) {
  const [columns, setColumns] = useState(data);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ columnId: string; index: number } | null>(null);
  const { groupBy, onItemUpdate } = useDynamicView<string, GenericItem>();

  useEffect(() => {
    setColumns(data);
  }, [data]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: GenericItem, sourceColumnId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ itemId: item.id, sourceColumnId }));
    setDraggedItemId(item.id);
  };

  const getDropIndicatorIndex = (e: React.DragEvent, elements: HTMLElement[]) => {
    const mouseY = e.clientY;
    let closestIndex = elements.length;

    elements.forEach((el, index) => {
      const { top, height } = el.getBoundingClientRect();
      const offset = mouseY - (top + height / 2);
      if (offset < 0 && index < closestIndex) {
        closestIndex = index;
      }
    });
    return closestIndex;
  };

  const handleDragOverCardsContainer = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    const container = e.currentTarget;
    const draggableElements = Array.from(container.querySelectorAll('[data-draggable-id]')) as HTMLElement[];
    const index = getDropIndicatorIndex(e, draggableElements);

    if (dropIndicator?.columnId === columnId && dropIndicator.index === index) return;
    setDropIndicator({ columnId, index });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    setDropIndicator(null);
    try {
      const { itemId, sourceColumnId } = JSON.parse(e.dataTransfer.getData('text/plain'));

      const droppedItem = columns[sourceColumnId]?.find(i => i.id === itemId);
      if (!droppedItem) return;

      // Update local state for immediate feedback
      setColumns(prev => {
        const newColumns = { ...prev };
        const sourceCol = prev[sourceColumnId].filter(i => i.id !== itemId);

        if (sourceColumnId === targetColumnId) {
          const dropIndex = dropIndicator?.columnId === targetColumnId ? dropIndicator.index : sourceCol.length;
          sourceCol.splice(dropIndex, 0, droppedItem);
          newColumns[sourceColumnId] = sourceCol;
        } else {
          const targetCol = [...prev[targetColumnId]];
          const dropIndex = dropIndicator?.columnId === targetColumnId ? dropIndicator.index : targetCol.length;
          targetCol.splice(dropIndex, 0, droppedItem);
          
          newColumns[sourceColumnId] = sourceCol;
          newColumns[targetColumnId] = targetCol;
        }
        return newColumns;
      });
      
      // Persist change to global store. The groupBy value tells us which property to update.
      if (groupBy !== 'none' && sourceColumnId !== targetColumnId) {
        onItemUpdate?.(itemId, { [groupBy]: targetColumnId } as Partial<GenericItem>);
      }

    } catch (err) {
      console.error("Failed to parse drag data", err)
    } finally {
      setDraggedItemId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDropIndicator(null);
  };

  const initialColumns = Object.entries(data);

  if (!initialColumns || initialColumns.length === 0) {
    return <EmptyState />;
  }

  const statusColors: Record<string, string> = {
    active: "bg-blue-500", pending: "bg-yellow-500", completed: "bg-green-500", archived: "bg-gray-500",
    low: "bg-green-500", medium: "bg-blue-500", high: "bg-orange-500", critical: "bg-red-500",
  };

  const DropIndicator = () => <div className="h-1 my-2 rounded-full bg-primary/60" />;

  return (
    <div className="flex items-start gap-6 pb-4 overflow-x-auto -mx-6 px-6">
      {Object.entries(columns).map(([columnId, items]) => (
        <div
          key={columnId}
          className={cn(
            "w-80 flex-shrink-0 bg-card/20 dark:bg-neutral-900/20 backdrop-blur-xl rounded-3xl p-5 border border-border dark:border-neutral-700/50 transition-all duration-300",
            dropIndicator?.columnId === columnId && "bg-primary/10 border-primary/30"
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn("w-3.5 h-3.5 rounded-full", statusColors[columnId] || "bg-muted-foreground")} />
              <h3 className="font-semibold text-card-foreground dark:text-neutral-100 capitalize truncate">{columnId}</h3>
              <span className="text-sm font-medium text-muted-foreground bg-background/50 rounded-full px-2 py-0.5">{items.length}</span>
            </div>
            <button className="p-1 rounded-full bg-card/30 dark:bg-neutral-800/30 hover:bg-card/50 dark:hover:bg-neutral-700/50 transition-colors">
              <Plus className="w-4 h-4 text-muted-foreground dark:text-neutral-300" />
            </button>
          </div>

          <div
            onDragOver={(e) => handleDragOverCardsContainer(e, columnId)}
            onDrop={(e) => handleDrop(e, columnId)}
            onDragLeave={() => setDropIndicator(null)}
            className="space-y-4 min-h-[100px]"
          >
            {items.map((item, index) => (
              <Fragment key={item.id}>
                {dropIndicator?.columnId === columnId && dropIndicator.index === index && (
                  <DropIndicator />
                )}
                <KanbanCard
                  item={item}
                  isDragging={draggedItemId === item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, columnId)}
                  onDragEnd={handleDragEnd}
                />
              </Fragment>
            ))}
            {dropIndicator?.columnId === columnId && dropIndicator.index === items.length && (
              <DropIndicator />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## File: src/features/dynamic-view/DynamicView.tsx
```typescript
import { useMemo, useCallback, type ReactNode, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { DynamicViewProvider } from '@/features/dynamic-view/DynamicViewContext';
import type { ViewConfig, GenericItem, ViewMode, FilterConfig, SortConfig, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, StatItem, GroupableField } from './types';
import { ViewControls } from './components/controls/ViewControls';
import { ViewModeSelector } from './components/controls/ViewModeSelector';
import { AnimatedLoadingSkeleton } from './components/shared/AnimatedLoadingSkeleton';
import { ListView } from './components/views/ListView';
import { CardView } from './components/views/CardView';
import { TableView } from './components/views/TableView';
import { KanbanView } from './components/views/KanbanView';
import { CalendarView } from './components/views/CalendarView';
import { EmptyState } from './components/shared/EmptyState';
import { useAutoAnimateStats } from '@/hooks/useAutoAnimateStats.hook';
import { StatCard } from '@/components/shared/StatCard';

// Define the props for the controlled DynamicView component
export interface DynamicViewProps<TFieldId extends string, TItem extends GenericItem> {
  // Config
  viewConfig: ViewConfig<TFieldId, TItem>;
  
  // Data & State
  items: TItem[];
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
  hasMore: boolean;
  
  // Controlled State Props
  viewMode: ViewMode;
  filters: FilterConfig;
  sortConfig: SortConfig<TFieldId> | null;
  groupBy: GroupableField<TFieldId>;
  activeGroupTab: string;
  page: number;
  selectedItemId?: string;
  // Calendar-specific state
  calendarDateProp?: CalendarDateProp<TFieldId>;
  calendarDisplayProps?: CalendarDisplayProp<TFieldId>[];
  calendarItemLimit?: 'all' | number;
  calendarColorProp?: CalendarColorProp<TFieldId>;
  calendarDate?: Date;
  statsData?: StatItem[];

  // State Change Callbacks
  onViewModeChange: (mode: ViewMode) => void;
  onFiltersChange: (filters: FilterConfig) => void;
  onSortChange: (sort: SortConfig<TFieldId> | null) => void;
  onGroupByChange: (group: GroupableField<TFieldId>) => void;
  onActiveGroupTabChange: (tab: string) => void;
  onPageChange: (page: number) => void;
  onItemSelect: (item: TItem) => void;
  onItemUpdate?: (itemId: string, updates: Partial<TItem>) => void;
  // Calendar-specific callbacks
  onCalendarDatePropChange?: (prop: CalendarDateProp<TFieldId>) => void;
  onCalendarDisplayPropsChange?: (props: CalendarDisplayProp<TFieldId>[]) => void;
  onCalendarItemLimitChange?: (limit: 'all' | number) => void;
  onCalendarColorPropChange?: (prop: CalendarColorProp<TFieldId>) => void;
  onCalendarDateChange?: (date: Date) => void;
  
  // Custom Renderers
  renderHeaderControls?: () => ReactNode;
  renderCta?: (viewMode: ViewMode, ctaProps: { colSpan?: number }) => ReactNode;
  loaderRef?: React.Ref<HTMLDivElement>;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export function DynamicView<TFieldId extends string, TItem extends GenericItem>({ viewConfig, ...rest }: DynamicViewProps<TFieldId, TItem>) {
  
  const { viewMode, isInitialLoading, isLoading, hasMore, items, groupBy, statsData, scrollContainerRef } = rest;
  const statsRef = useRef<HTMLDivElement>(null);

  // Auto-hide stats container on scroll down
  useAutoAnimateStats(scrollContainerRef!, statsRef);

  useEffect(() => {
    // Animate stats cards in
    if (!isInitialLoading && statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { y: 30, opacity: 0 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power2.out"
        }
      )
    }
  }, [isInitialLoading]);

  const groupedData = useMemo(() => {
    if (groupBy === 'none' || viewMode !== 'kanban') {
        return null;
    }
    return (items as TItem[]).reduce((acc, item) => {
        const groupKey = String(item[groupBy as keyof TItem]) || 'N/A';
        if (!acc[groupKey]) {
            acc[groupKey] = [] as TItem[];
        }
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, TItem[]>);
  }, [items, groupBy, viewMode]);

  const renderViewForData = useCallback((data: TItem[], cta: ReactNode) => {
    switch (viewMode) {
        case 'table': return <TableView data={data} ctaElement={cta} />;
        case 'cards': return <CardView data={data} ctaElement={cta} />;
        case 'grid': return <CardView data={data} isGrid ctaElement={cta} />;
        case 'list': default: return <ListView data={data} ctaElement={cta} />;
    }
  }, [viewMode]);

  const renderContent = () => {
    if (isInitialLoading) {
      return <AnimatedLoadingSkeleton viewMode={viewMode} />;
    }

    if (viewMode === 'calendar') {
        return <CalendarView data={items} />;
    }

    if (viewMode === 'kanban') {
        return groupedData ? (
          <KanbanView data={groupedData} />
        ) : (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            Group data by a metric to use the Kanban view.
          </div>
        );
    }
    
    if (items.length === 0 && !isInitialLoading) {
        return <EmptyState />;
    }
    
    const ctaProps = {
        colSpan: viewMode === 'table' ? viewConfig.tableView.columns.length + 1 : undefined,
    };
    const ctaElement = rest.renderCta
        ? rest.renderCta(viewMode, ctaProps)
        : null;
    
    // This will be expanded later to handle group tabs
    return renderViewForData(items, ctaElement);
  };

  return (
    <DynamicViewProvider<TFieldId, TItem> viewConfig={viewConfig} {...rest}>
      <div className="space-y-6">
          <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                      {rest.renderHeaderControls ? rest.renderHeaderControls() : (
                          <>
                              <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
                              <p className="text-muted-foreground">
                                  {isInitialLoading 
                                      ? "Loading projects..." 
                                      : `Showing ${items.length} of ${rest.totalItemCount} item(s)`}
                              </p>
                          </>
                      )}
                  </div>
                  <ViewModeSelector />
              </div>
              <ViewControls />
          </div>

          {!isInitialLoading && statsData && statsData.length > 0 && (
            <div ref={statsRef} className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
              {statsData.map((stat) => (
                <StatCard
                  className="w-64 md:w-72 flex-shrink-0"
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                  chartData={stat.chartData}
                />
              ))}
            </div>
          )}
          
          <div className="min-h-[500px]">
              {renderContent()}
          </div>

          {/* Loader for infinite scroll */}
          <div ref={rest.loaderRef} className="flex justify-center items-center py-6">
            {isLoading && !isInitialLoading && groupBy === 'none' && viewMode !== 'calendar' && viewMode !== 'kanban' && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
            {!isLoading && !hasMore && items.length > 0 && !isInitialLoading && groupBy === 'none' && viewMode !== 'calendar' && viewMode !== 'kanban' && (
              <p className="text-muted-foreground">You've reached the end.</p>
            )}
          </div>
      </div>
    </DynamicViewProvider>
  );
}
```

## File: src/features/dynamic-view/types.ts
```typescript
import type { ReactNode } from 'react';

// --- GENERIC DATA & ITEM ---
export type GenericItem = Record<string, any> & { id: string };

// --- FIELD DEFINITIONS ---
// Describes a single piece of data within a GenericItem.
export type FieldType =
  | 'string'
  | 'longtext'
  | 'badge'
  | 'avatar'
  | 'progress'
  | 'date'
  | 'tags'
  | 'metrics'
  | 'thumbnail'
  | 'custom';

export interface BaseFieldDefinition<TFieldId extends string, TItem extends GenericItem> {
  id: TFieldId; // Corresponds to a key in GenericItem
  label: string;
  type: FieldType;
  // Optional custom render function for ultimate flexibility.
  render?: (item: TItem, options?: Record<string, any>) => ReactNode;
}

export interface BadgeFieldDefinition<TFieldId extends string, TItem extends GenericItem>
  extends BaseFieldDefinition<TFieldId, TItem> {
  type: 'badge';
  colorMap?: Record<string, string>; // e.g., { 'active': 'bg-green-500', 'pending': 'bg-yellow-500' }
  indicatorColorMap?: Record<string, string>; // e.g., { 'critical': 'bg-red-500' }
}

// Add other specific field types if they need unique properties
// For now, most can be handled by the base definition.

export type FieldDefinition<TFieldId extends string, TItem extends GenericItem> =
  | BaseFieldDefinition<TFieldId, TItem>
  | BadgeFieldDefinition<TFieldId, TItem>;

// --- VIEW CONFIGURATION ---
// The master configuration object that defines the entire view.

export type ViewMode = 'list' | 'cards' | 'grid' | 'table' | 'kanban' | 'calendar';

export interface ListViewConfig<TFieldId extends string> {
  iconField: TFieldId;
  titleField: TFieldId;
  metaFields: readonly {
    fieldId: TFieldId;
    className?: string;
  }[];
}

export interface CardViewConfig<TFieldId extends string> {
  thumbnailField: TFieldId;
  titleField: TFieldId;
  descriptionField: TFieldId;
  headerFields: readonly TFieldId[];
  // Specific fields to recreate the original layout
  statusField: TFieldId;
  categoryField: TFieldId;
  tagsField: TFieldId;
  progressField: TFieldId;
  assigneeField: TFieldId;
  metricsField: TFieldId;
  dateField: TFieldId;
}

export interface TableColumnConfig<TFieldId extends string> {
  fieldId: TFieldId;
  label: string;
  isSortable: boolean;
}

export interface TableViewConfig<TFieldId extends string> {
  columns: readonly TableColumnConfig<TFieldId>[];
}

export interface KanbanViewConfig<TFieldId extends string> {
  groupByField: TFieldId; // Field ID to group by (e.g., 'status')
  cardFields: {
    titleField: TFieldId;
    descriptionField: TFieldId;
    priorityField: TFieldId;
    tagsField: TFieldId;
    // footer fields
    dateField: TFieldId;
    metricsField: TFieldId; // for comments/attachments
    assigneeField: TFieldId;
  };
}

export interface CalendarViewConfig<TFieldId extends string> {
  dateField: TFieldId;
  titleField: TFieldId;
  displayFields: readonly TFieldId[];
  colorByField?: TFieldId; // Field ID to color events by (e.g., 'priority', 'status')
}

export interface ControlOption<TId extends string> {
  id: TId;
  label: string;
}

export interface FilterableFieldConfig<TFieldId extends string> {
  id: TFieldId; // fieldId
  label: string;
  options: readonly ControlOption<string>[];
}

export interface ViewConfig<
  TFieldId extends string,
  TItem extends GenericItem,
> {
  fields: readonly FieldDefinition<TFieldId, TItem>[];
  sortableFields: readonly ControlOption<TFieldId>[];
  groupableFields: readonly ControlOption<TFieldId | 'none'>[];
  filterableFields: readonly FilterableFieldConfig<TFieldId>[];

  // Layouts for each view mode
  listView: ListViewConfig<TFieldId>;
  cardView: CardViewConfig<TFieldId>;
  tableView: TableViewConfig<TFieldId>;
  kanbanView: KanbanViewConfig<TFieldId>;
  calendarView: CalendarViewConfig<TFieldId>;
  detailView: DetailViewConfig<TFieldId>;
}

// --- DETAIL VIEW ---
export interface DetailViewSection<TFieldId extends string> {
  title: string;
  fields: readonly TFieldId[];
}

export interface DetailViewConfig<TFieldId extends string> {
  header: {
    thumbnailField: TFieldId;
    titleField: TFieldId;
    descriptionField: TFieldId;
    badgeFields: readonly TFieldId[];
    progressField: TFieldId;
  };
  body: {
    sections: readonly DetailViewSection<TFieldId>[];
  };
}

// --- GENERIC CONTROL & DATA TYPES ---

export type Status = 'active' | 'pending' | 'completed' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface FilterConfig {
  searchTerm: string;
  [key: string]: any; // For dynamic filter keys like status, priority
}

export interface SortConfig<TFieldId extends string> {
  key: TFieldId;
  direction: 'asc' | 'desc';
}

export type GroupableField<TFieldId extends string> = TFieldId | 'none';

export type CalendarDateProp<TFieldId extends string> = TFieldId;
export type CalendarDisplayProp<TFieldId extends string> = TFieldId;
export type CalendarColorProp<TFieldId extends string> = TFieldId | 'none';

// --- STATS ---
export type StatItem = {
  title: string;
  value: string;
  icon: ReactNode;
  change: string;
  trend: 'up' | 'down';
  chartData?: number[];
};
```

## File: package.json
```json
{
  "name": "jeli-app-shell",
  "private": false,
  "version": "1.0.1",
  "type": "module",
  "files": [
    "dist"
  ],
  "main": "./dist/jeli-app-shell.umd.js",
  "module": "./dist/jeli-app-shell.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/jeli-app-shell.es.js",
      "require": "./dist/jeli-app-shell.umd.js"
    },
    "./dist/style.css": "./dist/style.css"
  },
  "sideEffects": [
    "**/*.css"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "peerDependencies": {
    "@iconify/react": "^4.1.1",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cmdk": "^0.2.0",
    "date-fns": "^3.6.0",
    "gsap": "^3.13.0",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "sonner": "^1.2.4",
    "tailwind-merge": "^2.0.0",
    "tailwindcss": "^3.3.5",
    "zustand": "^4.5.7"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@faker-js/faker": "^10.1.0",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.2.8"
  }
}
```

## File: src/pages/DataDemo/index.tsx
```typescript
import { useRef, useEffect, useCallback } from "react";
import {
  Layers,
  AlertTriangle,
  PlayCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  Archive,
  PlusCircle,
} from "lucide-react";
import { DynamicView } from "@/features/dynamic-view/DynamicView";
import { PageLayout } from "@/components/shared/PageLayout";
import { useScrollToBottom } from "@/hooks/useScrollToBottom.hook";
import { ScrollToBottomButton } from "@/components/shared/ScrollToBottomButton";
import { mockDataItems } from "./data/mockData";
import { useAppViewManager } from "@/hooks/useAppViewManager.hook";
import { useDataDemoStore, useSelectedItem } from "./store/dataDemo.store";
import { AddDataItemCta } from "@/features/dynamic-view/components/shared/AddDataItemCta";
import { DataDetailContent } from "./components/DataDetailContent";

import { dataDemoViewConfig } from "./DataDemo.config";
import type { StatItem } from "@/features/dynamic-view/types";

export default function DataDemoPage() {
  const {
    viewMode,
    groupBy,
    activeGroupTab,
    setGroupBy,
    setSort,
    setActiveGroupTab,
    page,
    filters,
    sortConfig,
    setPage,
    setFilters,
    setViewMode,
    onItemSelect,
    pathItemId,
    calendarDate,
    setCalendarDate,
  } = useAppViewManager();

  const selectedItem = useSelectedItem(pathItemId);

  const {
    items: allItems,
    hasMore,
    isLoading,
    isInitialLoading,
    totalItemCount,
    loadData,
    updateItem,
  } = useDataDemoStore((state) => ({
    items: state.items,
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    isInitialLoading: state.isInitialLoading,
    totalItemCount: state.totalItemCount,
    loadData: state.loadData,
    updateItem: state.updateItem,
  }));

  const scrollRef = useRef<HTMLDivElement>(null);

  // Note: The `DynamicViewProvider` needs `GenericItem[]`.
  // Our store uses `GenericItem` so no cast is needed.

  // Calculate stats from data
  const totalItems = mockDataItems.length;
  const { showScrollToBottom, scrollToBottom, handleScroll } =
    useScrollToBottom(scrollRef);

  const activeItems = mockDataItems.filter(
    (item) => item.status === "active",
  ).length;
  const highPriorityItems = mockDataItems.filter(
    (item) => item.priority === "high" || item.priority === "critical",
  ).length;
  const avgCompletion =
    totalItems > 0
      ? Math.round(
          mockDataItems.reduce(
            (acc, item) => acc + item.metrics.completion,
            0,
          ) / totalItems,
        )
      : 0;

  const stats: StatItem[] = [
    {
      title: "Total Projects",
      value: totalItems.toString(),
      icon: <Layers className="w-5 h-5" />,
      change: "+5.2% this month",
      trend: "up" as const,
      chartData: [120, 125, 122, 130, 135, 138, 142],
    },
    {
      title: "Active Projects",
      value: activeItems.toString(),
      icon: <PlayCircle className="w-5 h-5" />,
      change: "+2 this week",
      trend: "up" as const,
      chartData: [45, 50, 48, 55, 53, 60, 58],
    },
    {
      title: "High Priority",
      value: highPriorityItems.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      change: "-1 from last week",
      trend: "down" as const,
      chartData: [25, 26, 28, 27, 26, 24, 23],
    },
    {
      title: "Avg. Completion",
      value: `${avgCompletion}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+3.2%",
      trend: "up" as const,
      chartData: [65, 68, 70, 69, 72, 75, 78],
    },
    {
      title: "Completion Rate",
      value: "88%",
      icon: <CheckCircle className="w-5 h-5" />,
      change: "+1.5% this month",
      trend: "up" as const,
      chartData: [80, 82, 81, 84, 85, 87, 88],
    },
    {
      title: "Overdue Items",
      value: "8",
      icon: <Clock className="w-5 h-5" />,
      change: "-3 this week",
      trend: "down" as const,
    },
    {
      title: "New This Week",
      value: "12",
      icon: <PlusCircle className="w-5 h-5" />,
      change: "+2 from last week",
      trend: "up" as const,
    },
    {
      title: "Archived Projects",
      value: "153",
      icon: <Archive className="w-5 h-5" />,
      change: "+20 this month",
      trend: "up" as const,
    },
  ];

  useEffect(() => {
    loadData({
      page,
      groupBy,
      filters,
      sortConfig,
      isFullLoad: viewMode === "calendar" || viewMode === "kanban",
    });
  }, [page, groupBy, filters, sortConfig, loadData, viewMode]);

  const observer = useRef<IntersectionObserver>();
  const loaderRef = useCallback(
    (node: Element | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, setPage],
  );

  if (pathItemId && selectedItem) {
    // Render detail view as the main content
    return <DataDetailContent item={selectedItem} />;
  }

  return (
    <PageLayout scrollRef={scrollRef} onScroll={handleScroll}>
      <DynamicView
        viewConfig={dataDemoViewConfig}
        items={allItems}
        isLoading={isLoading}
        isInitialLoading={isInitialLoading}
        totalItemCount={totalItemCount}
        hasMore={hasMore}
        // Controlled state
        viewMode={viewMode}
        filters={filters}
        sortConfig={sortConfig}
        groupBy={groupBy}
        activeGroupTab={activeGroupTab}
        page={page}
        // Callbacks
        calendarDate={calendarDate}
        onCalendarDateChange={setCalendarDate}
        onViewModeChange={setViewMode}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        onGroupByChange={setGroupBy}
        onActiveGroupTabChange={setActiveGroupTab}
        onPageChange={setPage}
        onItemUpdate={updateItem}
        onItemSelect={onItemSelect}
        loaderRef={loaderRef}
        scrollContainerRef={scrollRef}
        statsData={stats}
        // Custom Renderers
        renderCta={(viewMode, ctaProps) => (
          <AddDataItemCta viewMode={viewMode} colSpan={ctaProps.colSpan} />
        )}
      />

      <ScrollToBottomButton
        isVisible={showScrollToBottom}
        onClick={scrollToBottom}
      />
    </PageLayout>
  );
}
```
