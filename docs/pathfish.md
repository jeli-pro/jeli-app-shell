Here's the master plan for refactoring the codebase.

```yaml
plan:
  uuid: 'e8a1b4c2-9f3d-4e6a-8b0c-1d2a3f4b5c6d'
  status: 'todo'
  title: 'Radical DRY Refactor: State, Logic, and Props'
  introduction: |
    Alright, let's ship this refactor. The current architecture is a mix of contexts, props, and local state. It works, but it's not DRY and will get gnarly as we scale. The plan is to go all-in on a centralized state management pattern using Zustand, making our state logic predictable, easy to trace, and accessible from anywhere without prop drilling.

    We'll rip out the bulky `AppShellContext` and `DataDemoContext` and replace them with lean, domain-specific Zustand stores. This move centralizes our app's brainpower. We'll also extract component logic into dedicated hooks and stores, stripping our TSX files down to what they do best: rendering UI. This separation of concerns will make components dumber, simpler, and way easier to reason about.

    The outcome? A codebase that's radically DRY, more modular, and a hell of a lot more fun to build on. No more chasing props through the component tree. Just pure, clean, state-driven UI. Let's do this.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Unify Layout State into `appShell.store.ts`'
      reason: |
        The `AppShellContext` is the heart of the layout but using React Context for this much high-frequency state is a performance bottleneck waiting to happen. It also forces a provider/consumer pattern that we can simplify.

        By migrating this critical state into a Zustand store (`appShell.store.ts`), we get a single source of truth for the entire application shell. This makes state accessible to any component, deep in the tree, without prop drilling or context wrappers. It's the foundation for decoupling our components from the layout's implementation details.
      steps:
        - uuid: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'
          status: 'todo'
          name: '1. Create `appShell.store.ts` and Migrate Context Logic'
          reason: |
            We need to centralize the state management logic from `AppShellContext.tsx`. This step creates the new Zustand store and moves all the state, actions, and reducer logic into it. We'll use Zustand's `redux` middleware to keep the existing reducer pattern, which is solid for complex state transitions.
          files:
            - src/context/AppShellContext.tsx
          operations:
            - 'Create a new file `src/store/appShell.store.ts`.'
            - 'Move the `AppShellState` and `AppShellAction` types from `src/context/AppShellContext.tsx` to the new store file.'
            - 'Move the `appShellReducer` function and the `defaultState` object to `src/store/appShell.store.ts`.'
            - 'In the new store, create a `useAppShellStore` using `create(redux(appShellReducer, defaultState))` from Zustand.'
            - 'Migrate the composite actions (`toggleSidebar`, `toggleFullscreen`, etc.) from `AppShellProvider` into the store as callable actions on the store instance.'
            - 'Export the new `useAppShellStore` hook.'
        - uuid: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d'
          status: 'todo'
          name: '2. Refactor `AppShellProvider` and Deprecate Context'
          reason: |
            With the logic moved to a global store, the `AppShellProvider` becomes a shell of its former self. We'll simplify it to just initialize the store with any top-level props like `appName` and `appLogo`, effectively decoupling the application from the old context pattern.
          files:
            - src/context/AppShellContext.tsx
            - src/App.tsx
          operations:
            - 'In `src/context/AppShellContext.tsx`, gut the `AppShellProvider`. Remove the `useReducer` hook.'
            - 'Add a `useEffect` inside the provider to initialize the `useAppShellStore` with props (`appName`, `appLogo`) on mount.'
            - 'Remove the `AppShellContext` object itself and the `useAppShell` hook from this file. The hook will now live in the store file.'
            - 'Update `App.tsx` to ensure `AppShellProvider` still wraps the app, but now it serves as an initializer, not a state provider.'
        - uuid: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f'
          status: 'todo'
          name: '3. Update All `useAppShell` Consumers'
          reason: |
            This is the final step to complete the migration. We need to find every component and hook that was using the old `useAppShell` context hook and switch it to use the new `useAppShellStore` Zustand hook. This will verify our new state management is wired up correctly across the app.
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
            - src/index.ts
          operations:
            - 'Search and replace all instances of `useAppShell()` with `useAppShellStore()`.'
            - 'Update how actions are called. Change `dispatch({ type: "...", payload: ... })` to direct action calls like `useAppShellStore.getState().setSidebarState(...)` or by destructuring actions from the store hook.'
            - 'Update `src/index.ts` to export `useAppShellStore` from `src/store/appShell.store.ts` instead of `useAppShell` from the context file.'
            - 'Delete the now-empty `src/context/AppShellContext.tsx` file.'
      context_files:
        compact:
          - src/context/AppShellContext.tsx
          - src/components/layout/AppShell.tsx
        medium:
          - src/context/AppShellContext.tsx
          - src/components/layout/AppShell.tsx
          - src/components/layout/EnhancedSidebar.tsx
          - src/features/settings/SettingsContent.tsx
          - src/hooks/useAppShellAnimations.hook.ts
        extended:
          - src/context/AppShellContext.tsx
          - src/components/layout/AppShell.tsx
          - src/components/layout/EnhancedSidebar.tsx
          - src/features/settings/SettingsContent.tsx
          - src/hooks/useAppShellAnimations.hook.ts
          - src/hooks/useResizablePanes.hook.ts
          - src/App.tsx
    - uuid: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1'
      status: 'todo'
      name: 'Part 2: Extract Domain Logic into Dedicated Stores'
      reason: |
        Local component state and contexts are great for isolated features, but they lead to prop drilling and repeated logic. By creating dedicated stores for `notifications` and `dataDemo`, we are creating single sources of truth for these domains.

        This move will encapsulate all the state and business logic (filtering, sorting, marking as read) within the stores themselves, making the components purely presentational. It also kills `DataDemoContext` and its provider, simplifying the component tree.
      steps:
        - uuid: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a'
          status: 'todo'
          name: '1. Create `notifications.store.ts` for Notification State'
          reason: |
            The `NotificationsPage` component currently manages its own state. To make this state globally accessible (e.g., for a notification count in the sidebar) and to clean up the component, we need to extract this logic into a store.
          files:
            - src/pages/Notifications/index.tsx
          operations:
            - 'Create a new file `src/pages/Notifications/notifications.store.ts`.'
            - 'Move the `initialNotifications` data and `Notification` type into the store file (or a separate types file).'
            - 'Create a `useNotificationsStore` with state for `notifications` and `activeTab`.'
            - 'Implement actions in the store: `markAsRead(id)`, `markAllAsRead()`, `setActiveTab(tab)`.'
            - 'Create derived state (selectors) for `unreadCount` and `filteredNotifications` using selectors for memoization.'
            - 'Refactor `NotificationsPage.tsx`: remove all `useState` and handler functions. Pull state and actions from `useNotificationsStore` instead.'
        - uuid: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b'
          status: 'todo'
          name: '2. Create `dataDemo.store.ts` and Absorb `useDataManagement`'
          reason: |
            The `useDataManagement` hook is a behemoth of business logic that's tightly coupled to the `DataDemo` feature. Moving this logic into a `dataDemo.store.ts` makes it more reusable, testable, and decouples it from the React component lifecycle. This store will become the single source of truth for all data, filtering, sorting, and loading states for the entire feature.
          files:
            - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
            - src/pages/DataDemo/context/DataDemoContext.tsx
            - src/pages/DataDemo/index.tsx
          operations:
            - 'Create a new file `src/pages/DataDemo/store/dataDemo.store.ts`.'
            - 'Move state from `useDataManagement.hook.tsx` like `items`, `hasMore`, `isLoading` into the store.'
            - 'Re-implement the data processing logic (filtering, sorting from `filteredAndSortedData` memo) as actions or internal logic within the store. The store will react to URL changes managed by `useAppViewManager`.'
            - 'Create an `init` or `syncWithUrl` action in the store that takes params from `useAppViewManager` and updates the store state accordingly.'
            - 'Create derived state for `dataToRender`, `groupTabs`, etc.'
        - uuid: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c'
          status: 'todo'
          name: '3. Remove `DataDemoContext` and its Provider'
          reason: |
            With the new `dataDemo.store.ts` in place, the `DataDemoContext` is now redundant. Removing it and its provider simplifies the component tree and removes a layer of abstraction, allowing components to connect directly to the global store.
          files:
            - src/pages/DataDemo/context/DataDemoContext.tsx
            - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
            - src/pages/DataDemo/index.tsx
          operations:
            - 'Delete the file `src/pages/DataDemo/context/DataDemoContext.tsx`.'
            - 'Delete the file `src/pages/DataDemo/hooks/useDataManagement.hook.tsx`.'
            - 'In `src/pages/DataDemo/index.tsx`, remove the `DataDemoProvider` wrapper.'
            - 'Create a new lightweight hook, `useSyncDataWithUrl.hook.ts`, which will call `useAppViewManager` and trigger the main action in `useDataDemoStore` whenever URL params change. This hook will be used once in `DataDemoPage`.'
      context_files:
        compact:
          - src/pages/Notifications/index.tsx
          - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
          - src/pages/DataDemo/context/DataDemoContext.tsx
        medium:
          - src/pages/Notifications/index.tsx
          - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
          - src/pages/DataDemo/context/DataDemoContext.tsx
          - src/pages/DataDemo/index.tsx
          - src/hooks/useAppViewManager.hook.ts
        extended:
          - src/pages/Notifications/index.tsx
          - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
          - src/pages/DataDemo/context/DataDemoContext.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/components/DataListView.tsx
          - src/hooks/useAppViewManager.hook.ts
    - uuid: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12'
      status: 'todo'
      name: 'Part 3: Purify Components and Eliminate Prop Drilling'
      reason: |
        Now that our state is centralized, we can do the satisfying work of cleaning up the components. This part is about making our `.tsx` files as dumb as possible, focused solely on rendering. We'll eliminate prop drilling by connecting leaf components directly to our stores.

        We'll also extract any remaining complex logic, like form handling or drag-and-drop interactions, into dedicated hooks. This adheres to the "TSX for renders only" principle and makes both the UI and the logic more modular and reusable.
      steps:
        - uuid: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'
          status: 'todo'
          name: '1. Refactor `LoginPage` to be Self-Contained'
          reason: |
            The `LoginPage` passes `onLogin` callbacks up the tree, which is classic prop drilling. We can make this component fully self-sufficient by having it call the `useAuthStore` actions directly. The form logic itself can be extracted to a hook to keep the component file clean.
          files:
            - src/components/auth/LoginPage.tsx
            - src/App.tsx
          operations:
            - 'Create a new hook `src/components/auth/useLoginForm.hook.ts`.'
            - 'Move form state (`email`, `password`, `isLoading`, `errors`) and submission handlers (`handleLoginSubmit`, `handleForgotSubmit`) from `LoginPage.tsx` into the new hook.'
            - 'Inside `useLoginForm.hook.ts`, use `useAuthStore` to call the `login` and `forgotPassword` actions.'
            - 'In `LoginPage.tsx`, remove the `onLogin` and `onForgotPassword` props.'
            - 'Call `useLoginForm()` in `LoginPage.tsx` to get state and handlers for the JSX.'
        - uuid: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e'
          status: 'todo'
          name: '2. Connect `DataDemo` Sub-components to Store'
          reason: |
            Components like `DataToolbar`, `DataListView`, and `DataViewModeSelector` currently get data and callbacks via props or the now-deleted context. We will refactor them to pull everything they need directly from `useDataDemoStore`.
          files:
            - src/pages/DataDemo/components/DataToolbar.tsx
            - src/pages/DataDemo/components/DataListView.tsx
            - src/pages/DataDemo/components/DataCardView.tsx
            - src/pages/DataDemo/components/DataTableView.tsx
            - src/pages/DataDemo/components/DataViewModeSelector.tsx
          operations:
            - 'In each `DataDemo` sub-component, import and use `useDataDemoStore`.'
            - 'Remove props related to data, filters, sorting, and their respective handlers (`onFiltersChange`, `onSort`, etc.).'
            - 'Connect UI elements directly to the store state (e.g., `value={filters.searchTerm}`) and actions (e.g., `onClick={() => setFilters(...) }`).'
        - uuid: '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f'
          status: 'todo'
          name: '3. Eliminate `isInSidePane` Prop'
          reason: |
            The `isInSidePane` prop is a prime example of prop drilling for layout-aware rendering. Since our new `useAppShellStore` holds the global `bodyState`, any component can determine this for itself without needing the prop passed down.
          files:
            - src/components/shared/PageLayout.tsx
            - src/pages/Dashboard/index.tsx
            - src/pages/ToasterDemo/index.tsx
            - src/pages/Notifications/index.tsx
          operations:
            - 'In every component that accepts an `isInSidePane` prop, remove it from the function signature.'
            - 'Inside those components, derive the value locally: `const { bodyState } = useAppShellStore(); const isInSidePane = bodyState === BODY_STATES.SIDE_PANE;`.'
            - 'Update all call sites to remove the `isInSidePane` prop.'
        - uuid: '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a'
          status: 'todo'
          name: '4. Extract Drag-and-Drop Logic from `AppShell`'
          reason: |
            `AppShell.tsx` contains complex logic for handling drag-and-drop to dock pages. This logic is a perfect candidate for extraction into a dedicated hook, making the `AppShell` component significantly cleaner and more focused on its layout role.
          files:
            - src/components/layout/AppShell.tsx
          operations:
            - 'Create a new hook `src/hooks/usePaneDnd.hook.ts`.'
            - 'Move all drag-and-drop handler functions (`handleDragOverLeft`, `handleDropLeft`, etc.) from `AppShell.tsx` into this new hook.'
            - 'The hook will use `useAppShellStore` to access state like `draggedPage` and dispatch actions to update `dragHoverTarget`.'
            - 'The hook will return the handler functions to be spread onto the dropzone elements in `AppShell.tsx`.'
            - 'Refactor `AppShell.tsx` to use the new `usePaneDnd()` hook, simplifying its implementation.'
      context_files:
        compact:
          - src/components/auth/LoginPage.tsx
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/components/shared/PageLayout.tsx
          - src/components/layout/AppShell.tsx
        medium:
          - src/components/auth/LoginPage.tsx
          - src/store/authStore.ts
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/store/dataDemo.store.ts
          - src/components/shared/PageLayout.tsx
          - src/pages/Dashboard/index.tsx
          - src/components/layout/AppShell.tsx
          - src/store/appShell.store.ts
        extended:
          - src/components/auth/LoginPage.tsx
          - src/store/authStore.ts
          - src/App.tsx
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/store/dataDemo.store.ts
          - src/pages/DataDemo/index.tsx
          - src/components/shared/PageLayout.tsx
          - src/pages/Dashboard/index.tsx
          - src/pages/ToasterDemo/index.tsx
          - src/components/layout/AppShell.tsx
          - src/store/appShell.store.ts
  conclusion: |
    Once this plan is executed, the codebase will be transformed. We'll have a clear, centralized state architecture that's easy to reason about and extend. Prop drilling will be a thing of the past, and our components will be lean, mean, rendering machines.

    The new structure, with domain-specific stores and logic-filled hooks, establishes a robust pattern for future development. It improves testability, maintainability, and developer experience. This isn't just a cleanup; it's a strategic investment in the project's long-term health.
  context_files:
    compact:
      - src/context/AppShellContext.tsx
      - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
      - src/pages/Notifications/index.tsx
      - src/components/layout/AppShell.tsx
    medium:
      - src/context/AppShellContext.tsx
      - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
      - src/pages/DataDemo/context/DataDemoContext.tsx
      - src/pages/Notifications/index.tsx
      - src/components/layout/AppShell.tsx
      - src/components/auth/LoginPage.tsx
      - src/store/appStore.ts
    extended:
      - src/context/AppShellContext.tsx
      - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
      - src/pages/DataDemo/context/DataDemoContext.tsx
      - src/pages/DataDemo/index.tsx
      - src/pages/Notifications/index.tsx
      - src/components/layout/AppShell.tsx
      - src/components/auth/LoginPage.tsx
      - src/store/appStore.ts
      - src/store/authStore.ts
      - src/App.tsx
      - package.json
```
