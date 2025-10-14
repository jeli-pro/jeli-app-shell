Hell yeah, we shipped the DRY refactor. Code's cleaner, state's centralized. But now we're dropping frames and the UI feels like it's wading through molasses. Classic trade-off. We optimized for maintainability, now we gotta optimize for the metal.

The culprit is classic over-rendering. Our new global stores are telling *everything* to update on *every* little change. A mouse move during resize shouldn't cause the entire UI tree to rethink its life.

The plan is to go surgical. We'll switch from broad state subscriptions to granular selectors, ensuring components only listen for the exact slice of state they care about. We'll stabilize our animation hooks so they don't re-fire on every render. And we'll merge our UI state stores to cut down on noise. This is about making our components selectively deaf to irrelevant state changes.

Let's tune this engine.

```yaml
plan:
  uuid: 'c5d8a3f1-7b9e-4a0f-8d2c-1e9f4a7b6c3d'
  status: 'todo'
  title: 'Performance Tuning: Optimizing Renders and Animations'
  introduction: |
    We executed the radical DRY refactor, centralizing state with Zustand. The architecture is solid, but the user experience took a performance hit. Animations are lagging and interactions feel heavy. This is a classic symptom of excessive re-renders caused by components over-subscribing to our shiny new global stores. High-frequency updates (like resizing or scrolling) are triggering a cascade of unnecessary renders across the entire app.

    This plan addresses the performance degradation head-on without sacrificing the benefits of the new architecture. The strategy is to surgically optimize our state subscriptions and stabilize our animation triggers. We will refactor components to select only the minimal, necessary slices of state from Zustand. This ensures they only re-render when their specific data changes.

    Furthermore, we will audit our animation hooks (`useEffect`/`useLayoutEffect`) to guarantee they have stable dependencies, preventing them from re-running on every render. We'll also merge our UI state stores to simplify state management and reduce cross-store updates. The goal is to transform our application from a performance bottleneck into a buttery-smooth, responsive experience that is both maintainable and fast.
  parts:
    - uuid: 'd1e2f3a4-5b6c-7d8e-9f0a-1b2c3d4e5f6a'
      status: 'todo'
      name: 'Part 1: Implement Granular State Selection & Consolidate Stores'
      reason: |
        The primary cause of our performance issue is that components are subscribing to entire store objects. Any change to any property in the store triggers a re-render in every subscribed component. By switching to granular selectors (e.g., `useAppShellStore(state => state.sidebarState)`), we ensure components only update when the specific data they care about changes.

        Additionally, `useAppStore` and `useAppShellStore` manage closely related UI state. Merging them simplifies our state architecture, reduces the number of store subscriptions, and makes the overall state easier to reason about.
      steps:
        - uuid: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'
          status: 'todo'
          name: '1. Merge `appStore.ts` into `appShell.store.ts`'
          reason: |
            State like `isDarkMode` and `isCommandPaletteOpen` are fundamentally part of the application shell's UI state. Consolidating them into `appShell.store.ts` reduces complexity and the number of separate global stores to manage.
          files:
            - src/store/appStore.ts
            - src/store/appShell.store.ts
          operations:
            - 'Move the state properties (`isCommandPaletteOpen`, `isDarkMode`) and actions (`setCommandPaletteOpen`, `toggleDarkMode`) from `appStore.ts` into `appShell.store.ts`.'
            - 'Remove `searchTerm` and `setSearchTerm` from the store logic; this is better handled by `useAppViewManager` with URL state.'
            - 'Update all components that were using `useAppStore` to now use `useAppShellStore` with the appropriate selectors.'
            - 'Delete the now-redundant `src/store/appStore.ts` file.'
            - 'Update `src/index.ts` to stop exporting anything from the deleted `appStore.ts`.'
        - uuid: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d'
          status: 'todo'
          name: '2. Audit and Refactor All Store Subscriptions to Use Granular Selectors'
          reason: |
            This is the most critical performance optimization. We must change every instance of `useAppShellStore()` that selects the entire state object to use a selector for only the needed properties. This will slash the number of re-renders.
          files:
            - src/components/layout/AppShell.tsx
            - src/components/layout/EnhancedSidebar.tsx
            - src/components/layout/MainContent.tsx
            - src/components/layout/RightPane.tsx
            - src/components/layout/Sidebar.tsx
            - src/components/layout/TopBar.tsx
            - src/components/layout/ViewModeSwitcher.tsx
            - src/components/global/CommandPalette.tsx
            - src/features/settings/SettingsContent.tsx
            - src/hooks/useAppShellAnimations.hook.ts
            - src/hooks/useResizablePanes.hook.ts
            - src/hooks/useAutoAnimateTopBar.ts
            - src/pages/Dashboard/hooks/useDashboardAnimations.motion.hook.ts
            - src/components/shared/PageLayout.tsx
          operations:
            - 'In `AppShell.tsx`, instead of destructuring from a single `useAppShellStore(state => ({...}))` call, use individual selectors for each piece of state: `const sidebarState = useAppShellStore(s => s.sidebarState);`, `const bodyState = useAppShellStore(s => s.bodyState);`, etc.'
            - 'Apply the same pattern to all other components and hooks listed in `files`. For example, `EnhancedSidebar` only needs `sidebarWidth` and `compactMode`, so it should select only those.'
            - 'In `SettingsContent.tsx`, which uses many properties, select them individually to prevent re-renders when, for example, `sidebarWidth` is changing.'
            - 'For components that need both state and actions, destructure actions from `useAppShellStore.getState()` or select them separately to ensure render stability.'
    - uuid: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f'
      status: 'todo'
      name: 'Part 2: Stabilize Animation and High-Frequency Hooks'
      reason: |
        Our animation logic is tied to React's lifecycle via `useEffect` and `useLayoutEffect`. If the dependencies for these effects are not stable, the animations will be needlessly re-initialized, causing jank and stuttering. Hooks that run on high-frequency events like scrolling also need to be optimized to prevent them from triggering expensive operations on every event.
      steps:
        - uuid: 'd4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9'
          status: 'todo'
          name: '1. Stabilize `useAppShellAnimations.hook.ts` Dependencies'
          reason: |
            This hook controls the core layout animations. It currently subscribes to multiple state properties, potentially re-running the entire animation setup when only one minor thing changes.
          files:
            - src/hooks/useAppShellAnimations.hook.ts
          operations:
            - 'In `useSidebarAnimations`, ensure the dependency array is minimal: `[sidebarState, sidebarWidth, bodyState, animationDuration, sidebarRef, resizeHandleRef]`. The values are primitives or stable refs, which is good.'
            - 'In `useBodyStateAnimations`, the dependency array is large. Let''s confirm it''s necessary. The main trigger should be `bodyState`. We can use `useRef` to store previous values if needed to avoid including them in the deps array.'
            - 'For store actions like `setSearchParams` that are used inside an effect, if they are not stable, they can cause re-runs. We should use the functional update form (`setSearchParams(prev => ...)`), which often has a stable identity, or wrap our logic in a `useCallback` in the parent hook.'
        - uuid: 'e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0'
          status: 'todo'
          name: '2. Optimize `useAutoAnimateTopBar` for High-Frequency Scrolling'
          reason: |
            This hook attaches a listener to the `onScroll` event. The callback function needs to be stable, and its dependencies must be minimal to avoid re-attaching the listener and to ensure the logic inside is efficient.
          files:
            - src/hooks/useAutoAnimateTopBar.ts
          operations:
            - 'Wrap the `onScroll` function in a `useCallback`.'
            - 'The dependencies for the `useCallback` should be minimal. Instead of including `setTopBarVisible` directly, we can access it via `useAppShellStore.getState().setTopBarVisible()` inside the scroll handler. This removes the store action from the dependency list.'
            - 'Ensure the hook correctly cleans up its `setTimeout` timer on unmount and on re-render.'
        - uuid: 'f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1'
          status: 'todo'
          name: '3. Add `reducedMotion` Check to Animation Hooks'
          reason: |
            Our animation hooks should respect the user's `reducedMotion` setting and bail out early to avoid any unnecessary calculations or DOM manipulations.
          files:
            - src/hooks/useStaggeredAnimation.motion.hook.ts
            - src/hooks/useAppShellAnimations.hook.ts
            - src/pages/Dashboard/hooks/useDashboardAnimations.motion.hook.ts
          operations:
            - 'In each animation hook, get the `reducedMotion` state from `useAppShellStore`.'
            - 'Add a check at the beginning of the `useLayoutEffect`/`useEffect`: `if (reducedMotion || !containerRef.current) return;`.'
            - 'This ensures no GSAP code runs if the user prefers reduced motion, improving performance and accessibility.'
    - uuid: 'a7b8c9d0-e1f2-a3b4-c5d6-e7f8a9b0c1d2'
      status: 'todo'
      name: 'Part 3: Memoize Components and Refine Logic Hooks'
      reason: |
        Even with selective subscriptions, some components might re-render because their parent does. We can use `React.memo` to prevent this for components that are "pure" (same props, same output). We also need to ensure our logic hooks are not causing downstream re-renders by returning new object references on every render.
      steps:
        - uuid: 'b8c9d0e1-f2a3-b4c5-d6e7-f8a9b0c1d2e3'
          status: 'todo'
          name: '1. Wrap Pure Layout Components with `React.memo`'
          reason: |
            Components like `EnhancedSidebar` and `TopBar` are complex and their re-rendering can be expensive. Since they are primarily driven by global state, we can memoize them to prevent re-renders caused by their parent, `AppShell`.
          files:
            - src/components/layout/EnhancedSidebar.tsx
            - src/components/layout/TopBar.tsx
            - src/components/layout/RightPane.tsx
          operations:
            - 'Wrap the component exports in `EnhancedSidebar`, `TopBar`, and `RightPane` with `React.memo`.'
            - 'Example: `export const EnhancedSidebar = React.memo(forwardRef<...>(...))`'
        - uuid: 'c9d0e1f2-a3b4-c5d6-e7f8-a9b0c1d2e3f4'
          status: 'todo'
          name: '2. Stabilize Return Value of `useAppViewManager`'
          reason: |
            This hook returns a large object of state and functions. If the object reference changes on every render, any component that uses the hook will re-render, even if the specific properties it uses haven't changed.
          files:
            - src/hooks/useAppViewManager.hook.ts
          operations:
            - 'Wrap the entire return object of `useAppViewManager` in a `useMemo` hook.'
            - 'Carefully craft the dependency array for this `useMemo` to include all the individual state values (`bodyState`, `viewMode`, etc.) and stable callbacks.'
            - 'This ensures that the hook returns the same object reference unless one of its core values actually changes, preventing unnecessary re-renders in consumer components.'
  conclusion: |
    By executing this performance-focused plan, we will eliminate the jank and lag introduced after our initial refactor. The application will not only retain its new, clean architecture but will also feel fast and responsive.

    We will have achieved the best of both worlds: a highly maintainable codebase with a centralized state model, and a user interface with buttery-smooth animations and interactions. This process of hardening our architecture for performance is a critical step in building a production-ready application.
  context_files:
    compact:
      - src/store/appStore.ts
      - src/store/appShell.store.ts
      - src/hooks/useAppShellAnimations.hook.ts
      - src/hooks/useAutoAnimateTopBar.ts
    medium:
      - src/store/appStore.ts
      - src/store/appShell.store.ts
      - src/hooks/useAppShellAnimations.hook.ts
      - src/hooks/useAutoAnimateTopBar.ts
      - src/components/layout/AppShell.tsx
      - src/features/settings/SettingsContent.tsx
    extended:
      - src/store/appStore.ts
      - src/store/appShell.store.ts
      - src/hooks/useAppShellAnimations.hook.ts
      - src/hooks/useAutoAnimateTopBar.ts
      - src/components/layout/AppShell.tsx
      - src/features/settings/SettingsContent.tsx
      - src/components/layout/EnhancedSidebar.tsx
      - src/components/layout/TopBar.tsx
      - src/hooks/useAppViewManager.hook.ts
```
