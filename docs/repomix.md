# Directory Structure
```
src/
  components/
    auth/
      LoginPage.tsx
    layout/
      ViewModeSwitcher.tsx
  hooks/
    useAppViewManager.hook.ts
  pages/
    DataDemo/
      components/
        DataViewModeSelector.tsx
      index.tsx
  store/
    appShell.store.ts
  App.tsx
  index.css
tailwind.config.js
```

# Files

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

## File: src/components/auth/LoginPage.tsx
```typescript
import { ChangeEvent } from 'react';
import { Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AnimatedInput } from '../effects/AnimatedInput';
import { BoxReveal } from '../effects/BoxReveal';
import { Ripple } from '../effects/Ripple';
import { TechOrbitDisplay } from '../effects/OrbitingCircles';
import { BottomGradient } from '../effects/BottomGradient';
import { useLoginForm } from './useLoginForm.hook';

// ==================== Main LoginPage Component ====================
export function LoginPage() {
	const {
		state,
		setState,
		email,
		setEmail,
		setPassword,
		isLoading,
		errors,
		showPassword,
		setShowPassword,
		handleLoginSubmit,
		handleForgotSubmit,
	} = useLoginForm();


	const renderContent = () => {
		if (state === 'reset-sent') {
			return (
				<div className="w-full max-w-md mx-auto text-center flex flex-col gap-4">
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.5}>
						<div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
							<Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
						</div>
					</BoxReveal>
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.5}>
						<h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
					</BoxReveal>
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.5}>
						<p className="text-muted-foreground">We've sent a password reset link to <strong>{email}</strong></p>
					</BoxReveal>
					<BoxReveal width="100%" boxColor="hsl(var(--skeleton))" duration={0.5}>
						<button onClick={() => setState('login')} className="text-sm text-blue-500 hover:underline">
							<div className="flex items-center justify-center gap-2">
								<ArrowLeft className="w-4 h-4" /> Back to login
							</div>
						</button>
					</BoxReveal>
				</div>
			);
		}

		const isLogin = state === 'login';
		const formFields = isLogin
			? [
				{ label: 'Email', required: true, type: 'email', placeholder: 'Enter your email address', onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) },
				{ label: 'Password', required: true, type: 'password', placeholder: 'Enter your password', onChange: (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) },
			]
			: [{ label: 'Email', required: true, type: 'email', placeholder: 'Enter your email address', onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) }];

		return (
			<div className="w-full max-w-md mx-auto flex flex-col gap-4">
				<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3}>
					<h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">{isLogin ? 'Welcome back' : 'Reset Password'}</h2>
				</BoxReveal>
				<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3} className="pb-2">
					<p className="text-neutral-600 text-sm max-w-sm dark:text-neutral-300">{isLogin ? 'Sign in to your account to continue' : 'Enter your email to receive a reset link'}</p>
				</BoxReveal>
				{isLogin && (
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3} width="100%" className="overflow-visible">
						<button className="g-button group/btn bg-transparent w-full rounded-md border h-10 font-medium outline-hidden hover:cursor-pointer" type="button">
							<span className="flex items-center justify-center w-full h-full gap-3">
								<img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" width={26} height={26} alt="Google Icon" />
								Sign in with Google
							</span>
							<BottomGradient />
						</button>
					</BoxReveal>
				)}
				{isLogin && (
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3} width="100%">
						<div className="flex items-center gap-4">
							<hr className="flex-1 border-1 border-dashed border-neutral-300 dark:border-neutral-700" />
							<p className="text-neutral-700 text-sm dark:text-neutral-300">or</p>
							<hr className="flex-1 border-1 border-dashed border-neutral-300 dark:border-neutral-700" />
						</div>
					</BoxReveal>
				)}
				<form onSubmit={isLogin ? handleLoginSubmit : handleForgotSubmit}>
					{formFields.map((field) => (
						<div key={field.label} className="flex flex-col gap-2 mb-4">
							<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3}>
								<Label htmlFor={field.label}>{field.label} <span className="text-red-500">*</span></Label>
							</BoxReveal>
							<BoxReveal width="100%" boxColor="hsl(var(--skeleton))" duration={0.3} className="flex flex-col space-y-2 w-full">
								<div className="relative">
									<AnimatedInput type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type} id={field.label} placeholder={field.placeholder} onChange={field.onChange} />
									{field.type === 'password' && (
										<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
											{showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
										</button>
									)}
								</div>
								<div className="h-4">{errors[field.label.toLowerCase() as keyof typeof errors] && <p className="text-red-500 text-xs">{errors[field.label.toLowerCase() as keyof typeof errors]}</p>}</div>
							</BoxReveal>
						</div>
					))}

					<BoxReveal width="100%" boxColor="hsl(var(--skeleton))" duration={0.3} className="overflow-visible">
						<button
							className="bg-gradient-to-br relative group/btn from-zinc-200 dark:from-zinc-900 dark:to-zinc-900 to-zinc-200 block dark:bg-zinc-800 w-full text-black dark:text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] outline-hidden hover:cursor-pointer disabled:opacity-50"
							type="submit" disabled={isLoading}
						>
							{isLoading ? (
								<div className="flex items-center justify-center gap-2">
									<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
									<span>Processing...</span>
								</div>
							) : (
								<>{isLogin ? 'Sign in' : 'Send reset link'} &rarr;</>
							)}
							<BottomGradient />
						</button>
					</BoxReveal>
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3}>
						<div className="mt-4 text-center">
							<button type="button" className="text-sm text-blue-500 hover:underline" onClick={() => setState(isLogin ? 'forgot-password' : 'login')}>
								{isLogin ? 'Forgot password?' : 'Back to login'}
							</button>
						</div>
					</BoxReveal>
				</form>
			</div>
		);
	};

	return (
		<section className="flex max-lg:justify-center min-h-screen w-full login-page-theme bg-background text-foreground">
			{/* Left Side */}
			<div className="flex flex-col justify-center w-1/2 max-lg:hidden relative">
				<Ripple />
				<TechOrbitDisplay />
			</div>

			{/* Right Side */}
			<div className="w-1/2 h-screen flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%]">
				{renderContent()}
			</div>
		</section>
	);
}
```

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

## File: src/hooks/useAppViewManager.hook.ts
```typescript
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppShellStore, type AppShellState, type ActivePage } from '@/store/appShell.store';
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField, Status, Priority } from '@/pages/DataDemo/types';
import type { FilterConfig } from '@/pages/DataDemo/components/DataToolbar';
import type { TaskView } from '@/pages/Messaging/types';
import { BODY_STATES, SIDEBAR_STATES } from '@/lib/utils';

const pageToPaneMap: Record<string, AppShellState['sidePaneContent']> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
  messaging: 'messaging',
};

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * A centralized hook to manage and synchronize all URL-based view states.
 * This is the single source of truth for view modes, side panes, split views,
 * and page-specific parameters.
 */
export function useAppViewManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ itemId: string; conversationId: string }>();
  const { itemId, conversationId } = params;
  const { setSidebarState, sidebarState } = useAppShellStore();

  // --- DERIVED STATE FROM URL ---

  const view = searchParams.get('view');
  const sidePane = searchParams.get('sidePane');
  const right = searchParams.get('right');
  const messagingView = searchParams.get('messagingView') as TaskView | null;

  const { bodyState, sidePaneContent } = useMemo(() => {
    const validPanes: AppShellState['sidePaneContent'][] = ['details', 'settings', 'main', 'toaster', 'notifications', 'dataDemo', 'messaging'];
    
    // 1. Priority: Explicit side pane overlay via URL param
    if (sidePane && validPanes.includes(sidePane as AppShellState['sidePaneContent'])) {
      return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: sidePane as AppShellState['sidePaneContent'] };
    }

    // 2. Data item detail view (can be overlay or split)
    if (itemId) {
      if (view === 'split') {
        return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'dataItem' as const };
      }
      return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: 'dataItem' as const };
    }

    // 3. Messaging conversation view (always split)
    if (conversationId) {
      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'messaging' as const };
    }

    // 4. Generic split view via URL param
    if (view === 'split' && right && validPanes.includes(right as AppShellState['sidePaneContent'])) {
      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: right as AppShellState['sidePaneContent'] };
    }

    return { bodyState: BODY_STATES.NORMAL, sidePaneContent: 'details' as const };
  }, [itemId, conversationId, view, sidePane, right]);
  
  const currentActivePage = useMemo(() => (location.pathname.split('/')[1] || 'dashboard') as ActivePage, [location.pathname]);
  const prevActivePage = usePrevious(currentActivePage);

  // --- SIDE EFFECTS ---
  useEffect(() => {
    // On navigating to messaging page, collapse sidebar if it's expanded.
    // This ensures a good default view but allows the user to expand it again if they wish.
    if (currentActivePage === 'messaging' && prevActivePage !== 'messaging' && sidebarState === SIDEBAR_STATES.EXPANDED) {
      setSidebarState(SIDEBAR_STATES.COLLAPSED);
    }
  }, [currentActivePage, prevActivePage, sidebarState, setSidebarState]);

  // DataDemo specific state
  const viewMode = useMemo(() => (searchParams.get('view') as ViewMode) || 'list', [searchParams]);
	const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
	const groupBy = useMemo(() => (searchParams.get('groupBy') as GroupableField | 'none') || 'none', [searchParams]);
	const activeGroupTab = useMemo(() => searchParams.get('tab') || 'all', [searchParams]);
	const filters = useMemo<FilterConfig>(
		() => ({
			searchTerm: searchParams.get('q') || '',
			status: (searchParams.get('status')?.split(',') || []).filter(Boolean) as Status[],
			priority: (searchParams.get('priority')?.split(',') || []).filter(Boolean) as Priority[],
		}),
		[searchParams],
	);
	const sortConfig = useMemo<SortConfig | null>(() => {
		const sortParam = searchParams.get('sort');
		if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
		if (sortParam === 'default') return null;

		const [key, direction] = sortParam.split('-');
		return { key: key as SortableField, direction: direction as 'asc' | 'desc' };
	}, [searchParams]);

  // --- MUTATOR ACTIONS ---

  const handleParamsChange = useCallback(
		(newParams: Record<string, string | string[] | null | undefined>, resetPage = false) => {
			setSearchParams(
				(prev) => {
					const updated = new URLSearchParams(prev);
					
					for (const [key, value] of Object.entries(newParams)) {
						if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === '') {
							updated.delete(key);
						} else if (Array.isArray(value)) {
							updated.set(key, value.join(','));
						} else {
							updated.set(key, String(value));
						}
					}

					if (resetPage) {
						updated.delete('page');
					}
					if ('groupBy' in newParams) {
						updated.delete('tab');
					}

					return updated;
				},
				{ replace: true },
			);
		},
		[setSearchParams],
	);

  const navigateTo = useCallback((page: string, params?: Record<string, string | null>) => {
    const targetPath = page.startsWith('/') ? page : `/${page}`;
    const isSamePage = location.pathname === targetPath;
    
    const newSearchParams = new URLSearchParams(isSamePage ? searchParams : undefined);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      }
    }

    navigate({ pathname: targetPath, search: newSearchParams.toString() });
  }, [navigate, location.pathname, searchParams]);

  const openSidePane = useCallback((pane: AppShellState['sidePaneContent']) => {
    if (location.pathname === `/${Object.keys(pageToPaneMap).find(key => pageToPaneMap[key] === pane)}`) {
        navigate({ pathname: '/dashboard', search: `?sidePane=${pane}` }, { replace: true });
    } else {
        handleParamsChange({ sidePane: pane, view: null, right: null });
    }
  }, [handleParamsChange, navigate, location.pathname]);

  const closeSidePane = useCallback(() => {
    if (itemId) {
      navigate('/data-demo');
    } else {
      handleParamsChange({ sidePane: null, view: null, right: null });
    }
  }, [itemId, navigate, handleParamsChange]);

  const toggleSidePane = useCallback((pane: AppShellState['sidePaneContent']) => {
    if (sidePane === pane) {
      closeSidePane();
    } else {
      openSidePane(pane);
    }
  }, [sidePane, openSidePane, closeSidePane]);

  const toggleSplitView = useCallback(() => {
    if (bodyState === BODY_STATES.SIDE_PANE) {
      handleParamsChange({ view: 'split', right: sidePane, sidePane: null });
    } else if (bodyState === BODY_STATES.SPLIT_VIEW) {
      handleParamsChange({ sidePane: right, view: null, right: null });
    } else { // From normal
      const paneContent = pageToPaneMap[currentActivePage] || 'details';
      handleParamsChange({ view: 'split', right: paneContent, sidePane: null });
    }
  }, [bodyState, sidePane, right, currentActivePage, handleParamsChange]);
  
  const setNormalView = useCallback(() => {
      handleParamsChange({ sidePane: null, view: null, right: null });
  }, [handleParamsChange]);

  const switchSplitPanes = useCallback(() => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW) return;
    const newSidePaneContent = pageToPaneMap[currentActivePage];
    const newActivePage = Object.entries(pageToPaneMap).find(
      ([, value]) => value === sidePaneContent
    )?.[0] as ActivePage | undefined;

    if (newActivePage && newSidePaneContent) {
      navigate(`/${newActivePage}?view=split&right=${newSidePaneContent}`, { replace: true });
    }
  }, [bodyState, currentActivePage, sidePaneContent, navigate]);
  
  const closeSplitPane = useCallback((paneToClose: 'main' | 'right') => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW) return;
    if (paneToClose === 'right') {
      navigate(`/${currentActivePage}`, { replace: true });
    } else { // Closing main pane
      const pageToBecomeActive = Object.entries(pageToPaneMap).find(
        ([, value]) => value === sidePaneContent
      )?.[0] as ActivePage | undefined;
      
      if (pageToBecomeActive) {
        navigate(`/${pageToBecomeActive}`, { replace: true });
      } else {
        navigate(`/dashboard`, { replace: true });
      }
    }
  }, [bodyState, currentActivePage, sidePaneContent, navigate]);
  
  // DataDemo actions
  const setViewMode = (mode: ViewMode) => handleParamsChange({ view: mode });
  const setGroupBy = (val: string) => handleParamsChange({ groupBy: val === 'none' ? null : val }, true);
  const setActiveGroupTab = (tab: string) => handleParamsChange({ tab: tab === 'all' ? null : tab });
  const setFilters = (newFilters: FilterConfig) => {
    handleParamsChange({ q: newFilters.searchTerm, status: newFilters.status, priority: newFilters.priority }, true);
  }
  const setSort = (config: SortConfig | null) => {
    if (!config) {
      handleParamsChange({ sort: 'default' }, true);
    } else {
      handleParamsChange({ sort: `${config.key}-${config.direction}` }, true);
    }
  }
  const setTableSort = (field: SortableField) => {
    let newSort: string | null = `${field}-desc`;
    if (sortConfig?.key === field) {
      if (sortConfig.direction === 'desc') newSort = `${field}-asc`;
      else if (sortConfig.direction === 'asc') newSort = 'default';
    }
    handleParamsChange({ sort: newSort }, true);
  };
  const setPage = (newPage: number) => handleParamsChange({ page: newPage.toString() });

  const onItemSelect = useCallback((item: DataItem) => {
		navigate(`/data-demo/${item.id}${location.search}`);
	}, [navigate, location.search]);

  const setMessagingView = (view: TaskView) => handleParamsChange({ messagingView: view });


  return useMemo(() => ({
    // State
    bodyState,
    sidePaneContent,
    currentActivePage,
    itemId,
    messagingView,
    // DataDemo State
    viewMode,
    page,
    groupBy,
    activeGroupTab,
    filters,
    sortConfig,
    // Actions
    navigateTo,
    openSidePane,
    closeSidePane,
    toggleSidePane,
    toggleSplitView,
    setNormalView,
    switchSplitPanes,
    setMessagingView,
    closeSplitPane,
    // DataDemo Actions
    onItemSelect,
    setViewMode,
    setGroupBy,
    setActiveGroupTab,
    setFilters,
    setSort,
    setTableSort,
    setPage,
  }), [
    bodyState, sidePaneContent, currentActivePage, itemId, messagingView,
    viewMode, page, groupBy, activeGroupTab, filters, sortConfig,
    navigateTo, openSidePane, closeSidePane, toggleSidePane, toggleSplitView, setNormalView, setMessagingView,
    switchSplitPanes, closeSplitPane, onItemSelect, setViewMode, setGroupBy, setActiveGroupTab, setFilters,
    setSort, setTableSort, setPage
  ]);
}
```

## File: src/pages/DataDemo/components/DataViewModeSelector.tsx
```typescript
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { List, Grid3X3, LayoutGrid, Table } from 'lucide-react'
import type { ViewMode } from '../types'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'

const viewModes = [
  { id: 'list' as ViewMode, label: 'List', icon: List, description: 'Compact list with details' },
  { id: 'cards' as ViewMode, label: 'Cards', icon: LayoutGrid, description: 'Rich card layout' },
  { id: 'grid' as ViewMode, label: 'Grid', icon: Grid3X3, description: 'Masonry grid view' },
  { id: 'table' as ViewMode, label: 'Table', icon: Table, description: 'Structured data table' }
]

export function DataViewModeSelector() {
  const { viewMode, setViewMode } = useAppViewManager();
  const indicatorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const updateIndicatorPosition = useCallback((immediate = false) => {
    if (!indicatorRef.current || !containerRef.current || isTransitioning) return

    const activeButton = containerRef.current.querySelector(`[data-mode="${viewMode}"]`) as HTMLElement
    if (!activeButton) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const buttonRect = activeButton.getBoundingClientRect()
    
    const left = buttonRect.left - containerRect.left
    const width = buttonRect.width

    if (immediate) {
      // Set position immediately without animation for initial load
      gsap.set(indicatorRef.current, {
        x: left,
        width: width
      })
    } else {
      gsap.to(indicatorRef.current, {
        duration: 0.3,
        x: left,
        width: width,
        ease: "power2.out"
      })
    }
  }, [viewMode, isTransitioning])

  // Initial setup - set position immediately without animation
  useEffect(() => {
    const timer = setTimeout(() => {
      updateIndicatorPosition(true)
    }, 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  useEffect(() => {
    if (!isTransitioning) {
      updateIndicatorPosition()
    }
  }, [viewMode, isTransitioning, updateIndicatorPosition])

  const handleMouseEnter = () => {
    setIsTransitioning(true)
    setIsExpanded(true)
    
    // Wait for expand animation to complete
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  const handleMouseLeave = () => {
    setIsTransitioning(true)
    setIsExpanded(false)
    
    // Wait for collapse animation to complete
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-1.5 shadow-lg transition-all duration-500 ease-out",
        "hover:shadow-xl hover:bg-card/70",
        isExpanded ? "gap-1" : "gap-0"
      )}
    >
      {/* Animated indicator */}
      <div
        ref={indicatorRef}
        className="absolute inset-y-1.5 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20 rounded-xl transition-all duration-300"
        style={{ left: 0, width: 0 }}
      />
      
      {/* Mode buttons */}
      {viewModes.map((mode, index) => {
        const IconComponent = mode.icon
        const isActive = viewMode === mode.id
        
        return (
          <button
            key={mode.id}
            data-mode={mode.id}
            onClick={() => setViewMode(mode.id)}
            className={cn(
              "relative flex items-center justify-center rounded-xl transition-all duration-500 ease-out group overflow-hidden",
              "hover:bg-accent/20 active:scale-95",
              isActive && "text-primary",
              isExpanded ? "gap-3 px-4 py-2.5" : "gap-0 px-3 py-2.5"
            )}
            title={mode.description}
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : `${(viewModes.length - index - 1) * 30}ms`
            }}
          >
            <IconComponent className={cn(
              "w-5 h-5 transition-all duration-300 flex-shrink-0",
              isActive && "scale-110",
              "group-hover:scale-105",
              isExpanded ? "rotate-0" : "rotate-0"
            )} />
            
            {/* Label with smooth expand/collapse */}
            <div className={cn(
              "overflow-hidden transition-all duration-500 ease-out",
              isExpanded ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0"
            )}>
              <span className={cn(
                "font-medium whitespace-nowrap transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground",
                "group-hover:text-foreground"
              )}>
                {mode.label}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
```

## File: src/store/appShell.store.ts
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ReactElement } from 'react';
import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils';

export type ActivePage = 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | 'messaging';

// --- State and Action Types ---

export interface AppShellState {
  sidebarState: SidebarState;
  bodyState: BodyState;
  sidePaneContent: 'details' | 'settings' | 'main' | 'toaster' | 'notifications' | 'dataDemo' | 'dataItem' | 'messaging';
  sidebarWidth: number;
  sidePaneWidth: number;
  splitPaneWidth: number;
  defaultSidePaneWidth: number;
  defaultSplitPaneWidth: number;
  defaultWidthsSet: boolean;
  previousBodyState: BodyState;
  fullscreenTarget: 'main' | 'right' | null;
  isResizing: boolean;
  isResizingRightPane: boolean;
  isTopBarVisible: boolean;
  isTopBarHovered: boolean;
  autoExpandSidebar: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
  primaryColor: string;
  isCommandPaletteOpen: boolean;
  isDarkMode: boolean;
  appName?: string;
  appLogo?: ReactElement;
  draggedPage: 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | 'messaging' | null;
  dragHoverTarget: 'left' | 'right' | null;
  hoveredPane: 'left' | 'right' | null;
}

export interface AppShellActions {
    // Initialization
    init: (config: { appName?: string; appLogo?: ReactElement; defaultSplitPaneWidth?: number }) => void;
    
    // Direct state setters
    setSidebarState: (payload: SidebarState) => void;
    setBodyState: (payload: BodyState) => void;
    setSidePaneContent: (payload: AppShellState['sidePaneContent']) => void;
    setSidebarWidth: (payload: number) => void;
    setSidePaneWidth: (payload: number) => void;
    setDefaultPaneWidths: () => void;
    resetPaneWidths: () => void;
    setSplitPaneWidth: (payload: number) => void;
    setIsResizing: (payload: boolean) => void;
    setFullscreenTarget: (payload: 'main' | 'right' | null) => void;
    setIsResizingRightPane: (payload: boolean) => void;
    setTopBarVisible: (payload: boolean) => void;
    setAutoExpandSidebar: (payload: boolean) => void;
    setReducedMotion: (payload: boolean) => void;
    setCompactMode: (payload: boolean) => void;
    setPrimaryColor: (payload: string) => void;
    setDraggedPage: (payload: AppShellState['draggedPage']) => void;
    setCommandPaletteOpen: (open: boolean) => void;
    toggleDarkMode: () => void;
    setDragHoverTarget: (payload: 'left' | 'right' | null) => void;
    setTopBarHovered: (isHovered: boolean) => void;
    setHoveredPane: (payload: 'left' | 'right' | null) => void;
    
    // Composite actions
    toggleSidebar: () => void;
    hideSidebar: () => void;
    showSidebar: () => void;
    peekSidebar: () => void;
    toggleFullscreen: (target?: 'main' | 'right' | null) => void;
    resetToDefaults: () => void;
}

const defaultState: AppShellState = {
  sidebarState: SIDEBAR_STATES.EXPANDED,
  bodyState: BODY_STATES.NORMAL,
  sidePaneContent: 'details',
  sidebarWidth: 280,
  sidePaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.6)) : 400,
  splitPaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.35)) : 400,
  defaultSidePaneWidth: 400,
  defaultSplitPaneWidth: 400,
  defaultWidthsSet: false,
  previousBodyState: BODY_STATES.NORMAL,
  fullscreenTarget: null,
  isResizing: false,
  isResizingRightPane: false,
  isTopBarVisible: true,
  isTopBarHovered: false,
  autoExpandSidebar: true,
  reducedMotion: false,
  compactMode: false,
  primaryColor: '220 84% 60%',
  isCommandPaletteOpen: false,
  isDarkMode: false,
  appName: 'Jeli App',
  appLogo: undefined,
  draggedPage: null,
  dragHoverTarget: null,
  hoveredPane: null,
};


export const useAppShellStore = create<AppShellState & AppShellActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      init: ({ appName, appLogo, defaultSplitPaneWidth }) => set(state => ({
        ...state,
        ...(appName && { appName }),
        ...(appLogo && { appLogo }),
        ...(defaultSplitPaneWidth && { splitPaneWidth: defaultSplitPaneWidth }),
      })),
      
      setSidebarState: (payload) => set({ sidebarState: payload }),
      setBodyState: (payload) => {
        // If we're leaving fullscreen, reset the target and previous state
        if (get().bodyState === BODY_STATES.FULLSCREEN && payload !== BODY_STATES.FULLSCREEN) {
          set({ bodyState: payload, fullscreenTarget: null, previousBodyState: BODY_STATES.NORMAL });
        } else {
          set({ bodyState: payload });
        }
      },
      setSidePaneContent: (payload) => set({ sidePaneContent: payload }),
      setSidebarWidth: (payload) => set({ sidebarWidth: Math.max(200, Math.min(500, payload)) }),
      setSidePaneWidth: (payload) => set({ sidePaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, payload)) }),
      setDefaultPaneWidths: () => {
        if (get().defaultWidthsSet) return;
        set(state => ({
            defaultSidePaneWidth: state.sidePaneWidth,
            defaultSplitPaneWidth: state.splitPaneWidth,
            defaultWidthsSet: true,
        }));
      },
      resetPaneWidths: () => set(state => ({
        sidePaneWidth: state.defaultSidePaneWidth,
        splitPaneWidth: state.defaultSplitPaneWidth,
      })),
      setSplitPaneWidth: (payload) => set({ splitPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, payload)) }),
      setIsResizing: (payload) => set({ isResizing: payload }),
      setFullscreenTarget: (payload) => set({ fullscreenTarget: payload }),
      setIsResizingRightPane: (payload) => set({ isResizingRightPane: payload }),
      setTopBarVisible: (payload) => set({ isTopBarVisible: payload }),
      setAutoExpandSidebar: (payload) => set({ autoExpandSidebar: payload }),
      setReducedMotion: (payload) => set({ reducedMotion: payload }),
      setCompactMode: (payload) => set({ compactMode: payload }),
      setPrimaryColor: (payload) => {
        if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--primary-hsl', payload);
        }
        set({ primaryColor: payload });
      },
      setDraggedPage: (payload) => set({ draggedPage: payload }),
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDragHoverTarget: (payload) => set({ dragHoverTarget: payload }),
      setTopBarHovered: (isHovered) => set({ isTopBarHovered: isHovered }),
      setHoveredPane: (payload) => set({ hoveredPane: payload }),
      
      toggleSidebar: () => {
        const current = get().sidebarState;
        if (current === SIDEBAR_STATES.HIDDEN) set({ sidebarState: SIDEBAR_STATES.COLLAPSED });
        else if (current === SIDEBAR_STATES.COLLAPSED) set({ sidebarState: SIDEBAR_STATES.EXPANDED });
        else if (current === SIDEBAR_STATES.EXPANDED) set({ sidebarState: SIDEBAR_STATES.COLLAPSED });
      },
      hideSidebar: () => set({ sidebarState: SIDEBAR_STATES.HIDDEN }),
      showSidebar: () => set({ sidebarState: SIDEBAR_STATES.EXPANDED }),
      peekSidebar: () => set({ sidebarState: SIDEBAR_STATES.PEEK }),
      
      toggleFullscreen: (target = null) => {
        const { bodyState, previousBodyState } = get();
        if (bodyState === BODY_STATES.FULLSCREEN) {
          set({ 
            bodyState: previousBodyState || BODY_STATES.NORMAL,
            fullscreenTarget: null,
            previousBodyState: BODY_STATES.NORMAL,
          });
        } else {
          set({ 
            previousBodyState: bodyState, 
            bodyState: BODY_STATES.FULLSCREEN, 
            fullscreenTarget: target 
          });
        }
      },
      
      resetToDefaults: () => {
        // Preserve props passed to provider and session defaults
        set(state => {
          const currentPrimaryColor = defaultState.primaryColor;
          if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--primary-hsl', currentPrimaryColor);
          }
          return {
            ...defaultState,
            primaryColor: currentPrimaryColor,
            appName: state.appName,
            appLogo: state.appLogo,
            defaultSidePaneWidth: state.defaultSidePaneWidth,
            defaultSplitPaneWidth: state.defaultSplitPaneWidth,
            defaultWidthsSet: state.defaultWidthsSet,
            // Also reset current widths to the defaults
            sidePaneWidth: state.defaultSidePaneWidth,
            splitPaneWidth: state.defaultSplitPaneWidth,
          };
        });
      },
    }),
    {
      name: 'app-shell-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        sidebarState: state.sidebarState,
        sidebarWidth: state.sidebarWidth,
        sidePaneWidth: state.sidePaneWidth,
        splitPaneWidth: state.splitPaneWidth,
        autoExpandSidebar: state.autoExpandSidebar,
        reducedMotion: state.reducedMotion,
        compactMode: state.compactMode,
        primaryColor: state.primaryColor,
      }),
    }
  )
);

// Add a selector for the derived rightPaneWidth
export const useRightPaneWidth = () => useAppShellStore(state => 
    state.bodyState === BODY_STATES.SPLIT_VIEW ? state.splitPaneWidth : state.sidePaneWidth
);
```

## File: src/components/layout/ViewModeSwitcher.tsx
```typescript
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils'
import { useAppShellStore, type AppShellState, type ActivePage } from '@/store/appShell.store'
import { BODY_STATES } from '@/lib/utils'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import {
  Columns,
  PanelRightOpen,
  SplitSquareHorizontal,
  Maximize,
  Minimize,
  Layers,
  X,
  ArrowLeftRight
} from 'lucide-react'

export function ViewModeSwitcher({ pane, targetPage }: { pane?: 'main' | 'right', targetPage?: ActivePage }) {
  const bodyState = useAppShellStore(s => s.bodyState);
  const fullscreenTarget = useAppShellStore(s => s.fullscreenTarget);
  const { toggleFullscreen } = useAppShellStore.getState();
  const {
    currentActivePage,
    toggleSidePane,
    toggleSplitView,
    setNormalView,
    navigateTo,
    switchSplitPanes,
    closeSplitPane,
  } = useAppViewManager();

  const activePage = targetPage || currentActivePage;
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;
  const isThisPaneFullscreen = isFullscreen && (
    (pane === 'main' && fullscreenTarget !== 'right') ||
    (pane === 'right' && fullscreenTarget === 'right') ||
    (!pane && !fullscreenTarget) // Global switcher, global fullscreen
  );

  useEffect(() => {
    const buttonsToAnimate = buttonRefs.current.filter(Boolean) as HTMLButtonElement[];
    if (buttonsToAnimate.length === 0) return;

    gsap.killTweensOf(buttonsToAnimate);

    if (isExpanded) {
        gsap.to(buttonsToAnimate, {
            width: 32, // h-8 w-8
            opacity: 1,
            pointerEvents: 'auto',
            marginLeft: 4, // from gap-1 in original
            duration: 0.2,
            stagger: {
                each: 0.05,
                from: 'start'
            },
            ease: 'power2.out'
        });
    } else {
        gsap.to(buttonsToAnimate, {
            width: 0,
            opacity: 0,
            pointerEvents: 'none',
            marginLeft: 0,
            duration: 0.2,
            stagger: {
                each: 0.05,
                from: 'end'
            },
            ease: 'power2.in'
        });
    }
  }, [isExpanded, bodyState]); // re-run if bodyState changes to recalc buttons

  const handlePaneClick = (type: 'side-pane' | 'split-view') => {
    const pageToPaneMap: Record<ActivePage, AppShellState['sidePaneContent']> = { // This type is now stricter because ActivePage includes messaging
      dashboard: 'main', settings: 'settings', toaster: 'toaster', notifications: 'notifications', 'data-demo': 'dataDemo',
      messaging: 'messaging',
    };
    const paneContent = pageToPaneMap[activePage];
    if (type === 'side-pane') toggleSidePane(paneContent);
    else toggleSplitView();
  }

  const handleNormalViewClick = () => {
    if (isFullscreen) {
      toggleFullscreen();
    }
    if (targetPage && targetPage !== currentActivePage) {
      navigateTo(targetPage);
    } else {
      setNormalView();
    }
  }

  const buttons = [
    {
      id: 'normal',
      onClick: handleNormalViewClick,
      active: bodyState === BODY_STATES.NORMAL,
      title: "Normal View",
      icon: <Columns className="w-4 h-4" />
    },
    {
      id: 'side-pane',
      onClick: () => handlePaneClick('side-pane'),
      active: bodyState === BODY_STATES.SIDE_PANE,
      title: "Side Pane View",
      icon: <PanelRightOpen className="w-4 h-4" />
    },
    {
      id: 'split-view',
      onClick: () => handlePaneClick('split-view'),
      active: bodyState === BODY_STATES.SPLIT_VIEW,
      title: bodyState === BODY_STATES.SPLIT_VIEW ? 'Switch to Overlay View' : 'Switch to Split View',
      icon: bodyState === BODY_STATES.SPLIT_VIEW ? <Layers className="w-4 h-4" /> : <SplitSquareHorizontal className="w-4 h-4" />
    },
    {
      id: 'fullscreen',
      onClick: () => {
        if (targetPage && targetPage !== currentActivePage ) {
          navigateTo(targetPage);
          setTimeout(() => toggleFullscreen(pane), 50);
        } else {
          toggleFullscreen(pane);
        }
      },
      active: isThisPaneFullscreen,
      title: "Toggle Fullscreen",
      icon: isThisPaneFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />
    }
  ];

  if (bodyState === BODY_STATES.SPLIT_VIEW) {
    buttons.push({
      id: 'switch',
      onClick: switchSplitPanes,
      active: false,
      title: "Switch Panes",
      icon: <ArrowLeftRight className="w-4 h-4" />
    });
    buttons.push({
      id: 'close',
      onClick: () => closeSplitPane(pane || 'right'),
      active: false,
      title: "Close Pane",
      icon: <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
    });
  }

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="flex items-center gap-0 p-1 bg-card rounded-full border border-border"
    >
        <button
            className='h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-accent transition-colors'
            title="View Modes"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <Layers className="w-4 h-4" />
        </button>
      
      {buttons.map((btn, index) => (
        <button
          key={btn.id}
          ref={el => buttonRefs.current[index] = el}
          onClick={btn.onClick}
          className={cn(
            'h-8 w-0 flex items-center justify-center rounded-full hover:bg-accent transition-colors group opacity-0',
            btn.active && 'bg-accent text-accent-foreground',
            btn.id === 'close' && 'hover:bg-destructive/20'
          )}
          style={{ pointerEvents: 'none', marginLeft: 0, overflow: 'hidden' }}
          title={btn.title}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  )
}
```

## File: src/pages/DataDemo/index.tsx
```typescript
import { useRef, useEffect, useCallback } from 'react'
import {
  Layers, 
  AlertTriangle, 
  PlayCircle, 
  TrendingUp,
  Loader2,
  ChevronsUpDown
} from 'lucide-react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { PageLayout } from '@/components/shared/PageLayout'
import { DataListView } from './components/DataListView'
import { DataCardView } from './components/DataCardView'
import { DataTableView } from './components/DataTableView'
import { DataViewModeSelector } from './components/DataViewModeSelector'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { StatCard } from '@/components/shared/StatCard'
import { AnimatedLoadingSkeleton } from './components/AnimatedLoadingSkeleton'
import { DataToolbar } from './components/DataToolbar'
import { mockDataItems } from './data/mockData'
import type { GroupableField } from './types'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { 
  useDataDemoStore,
  useGroupTabs,
  useDataToRender,
} from './store/dataDemo.store'

type Stat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  type?: 'card';
};

type ChartStat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  type: 'chart';
  chartData: number[];
};

type StatItem = Stat | ChartStat;

function DataDemoContent() {
  const {
    viewMode,
    groupBy,
    activeGroupTab,
    setGroupBy,
    setActiveGroupTab,
    page,
    filters,
    sortConfig,
    setPage,
  } = useAppViewManager();

  const { hasMore, isLoading, isInitialLoading, totalItemCount, loadData } = useDataDemoStore(state => ({
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    isInitialLoading: state.isInitialLoading,
    totalItemCount: state.totalItemCount,
    loadData: state.loadData,
  }));

  const groupTabs = useGroupTabs(groupBy, activeGroupTab);
  const dataToRender = useDataToRender(groupBy, activeGroupTab);

  const groupOptions: { id: GroupableField | 'none'; label: string }[] = [
    { id: 'none', label: 'None' }, { id: 'status', label: 'Status' }, { id: 'priority', label: 'Priority' }, { id: 'category', label: 'Category' }
  ]
  const statsRef = useRef<HTMLDivElement>(null)

  // Calculate stats from data
  const totalItems = mockDataItems.length
  const activeItems = mockDataItems.filter(item => item.status === 'active').length
  const highPriorityItems = mockDataItems.filter(item => item.priority === 'high' || item.priority === 'critical').length
  const avgCompletion = totalItems > 0 ? Math.round(
    mockDataItems.reduce((acc, item) => acc + item.metrics.completion, 0) / totalItems
  ) : 0

  const stats: StatItem[] = [
    {
      title: "Total Projects",
      value: totalItems.toString(),
      icon: <Layers className="w-5 h-5" />,
      change: "+5.2% this month",
      trend: "up" as const,
      type: 'chart',
      chartData: [120, 125, 122, 130, 135, 138, 142]
    },
    {
      title: "Active Projects",
      value: activeItems.toString(),
      icon: <PlayCircle className="w-5 h-5" />,
      change: "+2 this week", 
      trend: "up" as const,
      type: 'chart',
      chartData: [45, 50, 48, 55, 53, 60, 58]
    },
    {
      title: "High Priority",
      value: highPriorityItems.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      change: "-1 from last week",
      trend: "down" as const,
      type: 'chart',
      chartData: [25, 26, 28, 27, 26, 24, 23]
    },
    {
      title: "Avg. Completion",
      value: `${avgCompletion}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+3.2%",
      trend: "up" as const,
      type: 'chart',
      chartData: [65, 68, 70, 69, 72, 75, 78]
    }
  ]

  useEffect(() => {
    // Animate stats cards in
    if (!isInitialLoading && statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { y: 30, opacity: 0 },
        {
          duration: 0.6,
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out"
        }
      )
    }
  }, [isInitialLoading]);

  useEffect(() => {
    loadData({ page, groupBy, filters, sortConfig });
  }, [page, groupBy, filters, sortConfig, loadData]);

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

  return (
    <PageLayout
      // Note: Search functionality is handled by a separate SearchBar in the TopBar
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
            <p className="text-muted-foreground">
              {isInitialLoading 
                ? "Loading projects..." 
                : `Showing ${dataToRender.length} of ${totalItemCount} item(s)`}
            </p>
          </div>
          <DataViewModeSelector />
        </div>

        {/* Stats Section */}
        {!isInitialLoading && (
          <div ref={statsRef} className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                icon={stat.icon}
                chartData={stat.type === 'chart' ? stat.chartData : undefined}
              />
            ))}
          </div>
        )}

        {/* Controls Area */}
        <div className="space-y-6">
          <DataToolbar />
        </div>

        {/* Group by and Tabs section */}
        <div className={cn(
          "flex items-center justify-between gap-4",
          groupBy !== 'none' && "border-b"
        )}>
          {/* Tabs on the left, takes up available space */}
          {groupBy !== 'none' && groupTabs.length > 1 ? (
            <AnimatedTabs
              tabs={groupTabs}
              activeTab={activeGroupTab}
              onTabChange={setActiveGroupTab}
              className="flex-grow"
            />
          ) : (
            <div className="h-[68px] flex-grow" /> // Placeholder for consistent height.
          )}
          
          {/* Group by dropdown on the right */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-medium text-muted-foreground shrink-0">Group by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between">
                  {groupOptions.find(o => o.id === groupBy)?.label}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[180px]">
                <DropdownMenuRadioGroup value={groupBy} onValueChange={setGroupBy}>
                  {groupOptions.map(option => (
                    <DropdownMenuRadioItem key={option.id} value={option.id}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="min-h-[500px]">
          {isInitialLoading ? <AnimatedLoadingSkeleton viewMode={viewMode} /> : (
            <div>
              {viewMode === 'table' ? <DataTableView /> : (
                <>
                  {viewMode === 'list' && <DataListView />}
                  {viewMode === 'cards' && <DataCardView />}
                  {viewMode === 'grid' && <DataCardView isGrid />}
                </>
              )}
            </div>
          )}
        </div>

        {/* Loader for infinite scroll */}
        <div ref={loaderRef} className="flex justify-center items-center py-6">
          {isLoading && !isInitialLoading && groupBy === 'none' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
          {!isLoading && !hasMore && dataToRender.length > 0 && !isInitialLoading && groupBy === 'none' && (
            <p className="text-muted-foreground">You've reached the end.</p>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default function DataDemoPage() {
  return <DataDemoContent />;
}
```

## File: src/App.tsx
```typescript
import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate, // used in LoginPageWrapper
  useLocation,
} from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { AppShellProvider } from "./providers/AppShellProvider";
import { useAppShellStore } from "./store/appShell.store";
import { useAuthStore } from "./store/authStore";
import "./index.css";

// Import library components
import { EnhancedSidebar } from "./components/layout/EnhancedSidebar";
import { MainContent } from "./components/layout/MainContent";
import { RightPane } from "./components/layout/RightPane";
import { TopBar } from "./components/layout/TopBar";
import { CommandPalette } from "./components/global/CommandPalette";
import { ToasterProvider } from "./components/ui/toast";

// --- Page/Content Components for Pages and Panes ---
import { DashboardContent } from "./pages/Dashboard";
import { SettingsPage } from "./pages/Settings";
import { ToasterDemo } from "./pages/ToasterDemo";
import { NotificationsPage } from "./pages/Notifications";
import DataDemoPage from "./pages/DataDemo";
import MessagingPage from "./pages/Messaging";
import { LoginPage } from "./components/auth/LoginPage";

// --- Icons ---
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  Rocket,
} from "lucide-react";

// --- Utils & Hooks ---
import { cn } from "./lib/utils";
import { useAppViewManager } from "./hooks/useAppViewManager.hook";
import { useRightPaneContent } from "./hooks/useRightPaneContent.hook";
import { BODY_STATES } from "./lib/utils";

// Checks for authentication and redirects to login if needed
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

// A root component to apply global styles and effects
function Root() {
  const isDarkMode = useAppShellStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return <Outlet />;
}

// The main layout for authenticated parts of the application
function ProtectedLayout() {

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <AppShellProvider
        appName="Jeli App"
        appLogo={
          <div className="p-2 bg-primary/20 rounded-lg">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
        }
      >
        <ComposedApp />
      </AppShellProvider>
    </div>
  );
}

// Content for the Top Bar (will be fully refactored in Part 2)
function AppTopBar() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const location = useLocation();
  const activePage = location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'dashboard';

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "hidden md:flex items-center gap-2 text-sm transition-opacity",
          {
            "opacity-0 pointer-events-none":
              isSearchFocused && activePage === "dashboard",
          },
        )}
      >
        <a
          href="#"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Home
        </a>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground capitalize">
          {activePage}
        </span>
      </div>

      {/* Page-specific: Dashboard search and actions */}
      {activePage === "dashboard" && (
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div
            className={cn(
              "relative transition-all duration-300 ease-in-out",
              isSearchFocused ? "flex-1 max-w-lg" : "w-auto",
            )}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "pl-9 pr-4 py-2 h-10 border-none rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out w-full",
                isSearchFocused ? "bg-background" : "w-48",
              )}
            />
          </div>
          <button className="h-10 w-10 flex-shrink-0 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10 flex-shrink-0">
            <Plus className="w-5 h-5" />
            <span
              className={cn(isSearchFocused ? "hidden sm:inline" : "inline")}
            >
              New Project
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// The main App component that composes the shell
function ComposedApp() {
  const { setBodyState, setSidePaneContent } = useAppShellStore();
  const viewManager = useAppViewManager();

  // Sync URL state with AppShellStore
  useEffect(() => {
    setBodyState(viewManager.bodyState);
    setSidePaneContent(viewManager.sidePaneContent);
  }, [viewManager.bodyState, viewManager.sidePaneContent, setBodyState, setSidePaneContent]);

  return (
    <AppShell
      sidebar={<EnhancedSidebar />}
      onOverlayClick={viewManager.closeSidePane}
      topBar={
        <TopBar>
          <AppTopBar />
        </TopBar>
      }
      mainContent={
        <MainContent>
          <Outlet />
        </MainContent>
      }
      rightPane={<RightPane />}
      commandPalette={<CommandPalette />}
    />
  );
}

function App() {
  const router = createBrowserRouter([
    {
      element: <Root />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/",
              element: <ProtectedLayout />,
              children: [
                { index: true, element: <Navigate to="/dashboard" replace /> },
                { path: "dashboard", element: <DashboardContent /> },
                { path: "settings", element: <SettingsPage /> },
                { path: "toaster", element: <ToasterDemo /> },
                { path: "notifications", element: <NotificationsPage /> },
                { path: "data-demo", element: <DataDemoPage /> },
                { path: "data-demo/:itemId", element: <DataDemoPage /> },
                { path: "messaging", element: <MessagingPage /> },
                { path: "messaging/:conversationId", element: <MessagingPage /> },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return (
    <ToasterProvider>
      <RouterProvider router={router} />
    </ToasterProvider>
  );
}

export default App;
```
