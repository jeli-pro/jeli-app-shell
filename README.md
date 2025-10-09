# Amazing App Shell ✨

A super amazing application shell built with modern web technologies, featuring a resizable sidebar, multiple body states, beautiful animations, and comprehensive customization options.

## 🚀 Features

### Core Features
- **Resizable Sidebar**: Drag to resize between 200px and 500px
- **Multiple Sidebar States**: Hidden, Collapsed, Expanded, and Peek modes
- **Body View States**: Normal, Fullscreen, and Side Pane modes
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Works beautifully on desktop and mobile

### Advanced Features
- **GSAP Animations**: Smooth, professional animations throughout
- **Zustand State Management**: Lightweight and efficient state management
- **Persistent Settings**: User preferences saved to localStorage
- **Accessibility Options**: Reduced motion and compact mode settings
- **Settings Panel**: Comprehensive customization options

### Developer Experience
- **TypeScript**: Fully typed for excellent DX
- **Modern Stack**: React 18, Vite, Tailwind CSS
- **Component Library**: Shadcn/ui components
- **Fast Development**: Hot reload with Vite
- **Clean Code**: Well-organized and documented

## 🛠️ Technology Stack

- **React 18**: Latest React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **GSAP**: Professional-grade animations
- **Zustand**: Simple and scalable state management
- **Shadcn/ui**: Beautiful and accessible components
- **Lucide Icons**: Consistent and beautiful icons

## 🎮 Usage

### Sidebar Controls
- **Toggle**: Click the menu button to cycle through states
- **Hide**: Completely hide the sidebar
- **Peek**: Hover over collapsed sidebar to preview
- **Resize**: Drag the edge to resize (200px - 500px)

### Body States
- **Normal**: Standard layout with sidebar
- **Fullscreen**: Hide sidebar for maximum content space
- **Side Pane**: Compact layout for focused work

### Customization
- **Settings Panel**: Click the settings icon in top bar
- **Theme Toggle**: Switch between dark and light modes
- **Compact Mode**: Reduce spacing for dense layouts
- **Reduced Motion**: Minimize animations for accessibility
- **Auto Expand**: Control sidebar hover behavior

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd amazing-app-shell

# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

### Development
```bash
# Start dev server
bun run dev

# Type checking
bun run typecheck

# Linting
bun run lint

# Preview production build
bun run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AppShell.tsx    # Main app shell component
│   ├── EnhancedSidebar.tsx # Advanced sidebar with features
│   ├── MainContent.tsx # Main content area
│   ├── TopBar.tsx      # Navigation bar
│   ├── SettingsPanel.tsx # Settings configuration
│   └── DemoContent.tsx # Demo showcase content
├── store/              # Zustand stores
│   └── appStore.ts     # Main application state
├── lib/                # Utilities and helpers
│   └── utils.ts        # Utility functions and constants
├── App.tsx             # Root app component
├── main.tsx           # Application entry point
└── index.css          # Global styles and CSS variables
```

## 🎨 Customization

### Theme Colors
The app uses CSS custom properties for theming. Modify `src/index.css` to customize colors:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* ... other colors */
}
```

### Animation Settings
Animations respect the user's motion preferences and can be disabled via settings:

```typescript
const { reducedMotion } = useAppStore()
const duration = reducedMotion ? 0.1 : 0.4
```

### Adding New States
Extend the sidebar and body states in `src/lib/utils.ts`:

```typescript
export const SIDEBAR_STATES = {
  HIDDEN: 'hidden',
  COLLAPSED: 'collapsed',
  EXPANDED: 'expanded',
  PEEK: 'peek',
  // Add new states here
} as const
```

## 🔧 Configuration

### Vite Configuration
The project uses Vite with React plugin and path aliasing configured in `vite.config.ts`.

### Tailwind Configuration
Custom animations and extended theme configured in `tailwind.config.js`.

### TypeScript Configuration
Strict TypeScript configuration with path mapping in `tsconfig.json`.

## 📱 Responsive Design

The app shell is fully responsive with:
- Mobile-first design approach
- Adaptive sidebar behavior
- Touch-friendly interactions
- Optimized for various screen sizes

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and semantics
- **Reduced Motion**: Respects user motion preferences
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Clear focus indicators

## 🚀 Performance

- **Bundle Splitting**: Automatic code splitting with Vite
- **Tree Shaking**: Eliminates unused code
- **Optimized Assets**: Compressed and optimized resources
- **Lazy Loading**: Components loaded on demand
- **Efficient Animations**: Hardware-accelerated GSAP animations

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using modern web technologies.