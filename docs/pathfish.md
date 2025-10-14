Here's the master plan, crafted in hacker news style.

---

Alright, team. We've got a decent amount of React code here, but it's starting to smell. The same bits of URL-munging logic are popping up all over the place like whack-a-mole. Every time we want to open a side pane or switch a view, we're hand-rolling `URLSearchParams`. It's a recipe for drift and bugs. This is classic tech debt.

The plan is to mercilessly refactor this into a DRY, state-driven machine. We're going to introduce a single source of truth for all view-state mutations—a `useAppViewManager` hook. This little beast will be our gatekeeper for the URL. Components will no longer talk to the router directly; they'll talk to our manager, which speaks router on their behalf. This makes components dumb and declarative, which is exactly what we want.

We'll then gut all the redundant logic from the components and replace it with clean calls to our new hook. We'll also clean up the main `App` component, which is doing way too much thinking about what goes in the right pane. We'll delegate that to a dedicated hook. By the end, our codebase will be leaner, meaner, and a hell of a lot easier to reason about. Let's ship it.

```yaml
plan:
  uuid: 'f4b9c1d8-3e5a-4f7b-8a1e-9c0d2a3b4c5d'
  status: 'todo'
  title: 'Refactor URL State Management to be DRY'
  introduction: |
    The current codebase has logic for manipulating URL search parameters scattered across multiple components (`TopBar`, `CommandPalette`, `EnhancedSidebar`, `App`, `DataDemo`). This repetition makes the system difficult to maintain, reason about, and extend. State transitions are imperative and error-prone.

    This master plan will centralize all URL-based view state management into a single custom hook: `useAppViewManager`. This hook will provide a declarative API for components to request state changes (e.g., `openSidePane('settings')`), abstracting away the underlying implementation of `useSearchParams` and `useNavigate`.

    By refactoring components to use this centralized hook, we will significantly reduce code duplication, improve separation of concerns, and make the application's state flow predictable and robust. We will also streamline content rendering logic in the main `App` component for better clarity.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Create a Centralized View Manager Hook'
      reason: |
        To eliminate redundant URL manipulation logic by creating a single, authoritative hook that manages all view-state changes. This is the cornerstone of the entire refactoring effort, establishing a DRY pattern for state management.
      steps:
        - uuid: 'c9d8e7f6-5b4a-3c2b-1a09-f8e7d6c5b4a3'
          status: 'todo'
          name: '1. Create `useAppViewManager` Hook'
          reason: |
            This new hook will encapsulate all interactions with `react-router-dom`'s `useSearchParams`, `useLocation`, and `useNavigate`. It will serve as the single interface for components to query and modify the application's view state.
          files:
            - 'src/hooks/useAppViewManager.hook.ts' # New file
          operations:
            - 'Create a new file `src/hooks/useAppViewManager.hook.ts`.'
            - 'Inside the hook, import and use `useSearchParams`, `useLocation`, and `useNavigate`.'
            - 'Derive state from the URL: `viewMode`, `sidePaneContent`, `splitViewContent`, `itemId`, `filters`, `sortConfig`, etc.'
            - 'Create and export functions for every state mutation, e.g., `openSidePane(pane)`, `toggleSplitView(pane)`, `navigateTo(page)`, `setFilters(filters)`. These functions will contain the logic for creating and setting new `URLSearchParams`.'
            - 'Ensure mutation functions handle edge cases correctly, like clearing `view` and `right` params when `sidePane` is set, or resetting the page number when filters change.'
            - 'The hook should return both the derived state and the mutator functions.'
      context_files:
        compact:
          - src/hooks/useUrlStateSync.hook.ts
          - src/context/AppShellContext.tsx
        medium:
          - src/hooks/useUrlStateSync.hook.ts
          - src/context/AppShellContext.tsx
          - src/App.tsx
        extended:
          - src/hooks/useUrlStateSync.hook.ts
          - src/context/AppShellContext.tsx
          - src/App.tsx
          - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
          - src/components/layout/TopBar.tsx

    - uuid: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1'
      status: 'todo'
      name: 'Part 2: Integrate View Manager and Purge Redundant Logic'
      reason: |
        With the central hook in place, we need to refactor all components that currently perform manual URL manipulation. This will enforce the new DRY pattern, simplify component logic, and make them more declarative.
      steps:
        - uuid: '1a2b3c4d-5e6f-7890-1234-567890abcdef'
          status: 'todo'
          name: '1. Refactor `EnhancedSidebar`'
          reason: |
            The `AppMenuItem` component contains complex logic to determine how to navigate or open a side pane. This will be replaced with simple calls to the new hook.
          files:
            - src/components/layout/EnhancedSidebar.tsx
          operations:
            - 'In `AppMenuItem`, call `useAppViewManager()`.'
            - "Simplify the `handleClick` function. Replace the conditional `setSearchParams` and `navigate` logic with calls like `viewManager.navigateTo('settings')` or `viewManager.toggleSidePane('notifications')`."
            - 'Determine `isActive` state by using the state values returned from `useAppViewManager()`.'

        - uuid: '2b3c4d5e-6f7a-8901-2345-67890abcdef1'
          status: 'todo'
          name: '2. Refactor `TopBar` and `CommandPalette`'
          reason: |
            These components have hardcoded logic for opening the settings side pane, which is a prime example of repeated code.
          files:
            - src/components/layout/TopBar.tsx
            - src/components/global/CommandPalette.tsx
          operations:
            - 'In `TopBar`, import and use `useAppViewManager()`.'
            - "Replace the `handleSettingsClick` body with a single call: `viewManager.toggleSidePane('settings')`."
            - 'In `CommandPalette`, import and use `useAppViewManager()`.'
            - "Replace navigation logic with `viewManager.navigateTo(...)` and side pane logic with `viewManager.openSidePane(...)`."

        - uuid: '3c4d5e6f-7a8b-9012-3456-7890abcdef12'
          status: 'todo'
          name: '3. Refactor `ViewModeSwitcher`'
          reason: |
            This component's handlers are mini-implementations of the logic that now belongs in the view manager hook.
          files:
            - src/components/layout/ViewModeSwitcher.tsx
          operations:
            - 'In `ViewModeSwitcher`, call `useAppViewManager()` to get the current state and action functions.'
            - "Rewrite all click handlers (`handleSidePaneClick`, `handleSplitViewClick`, etc.) to call the corresponding functions from the view manager, e.g., `viewManager.toggleSidePane()`, `viewManager.toggleSplitView()`."

        - uuid: 'd3e4f5a6-b7c8-d9e0-f1a2-b3c4d5e6f7a8'
          status: 'todo'
          name: '4. Refactor `useDataManagement` hook'
          reason: |
            This hook manages its own URL state. It should instead use the new view manager to stay in sync with the rest of the application and simplify its implementation.
          files:
            - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
          operations:
            - 'Remove the direct usage of `useSearchParams` from `useDataManagement`.'
            - 'Call `useAppViewManager()` inside `useDataManagement` to get derived state (`filters`, `sortConfig`, `page`, etc.).'
            - "Update the hook's setter functions (`setFilters`, `setSort`, `setViewMode`, etc.) to call the corresponding setter functions from the `useAppViewManager` hook."
            - 'The `handleParamsChange` utility function can now be removed entirely.'

        - uuid: 'e8a9b0c1-d2e3-f4a5-b6c7-d8e9f0a1b2c3'
          status: 'todo'
          name: '5. Deprecate `useUrlStateSync` Hook'
          reason: |
            The new `useAppViewManager` hook will provide the derived state, and the `AppShellContext` will be updated directly from the `App.tsx` component. `useUrlStateSync` becomes redundant.
          files:
            - src/hooks/useUrlStateSync.hook.ts
            - src/App.tsx
          operations:
            - 'Delete the `src/hooks/useUrlStateSync.hook.ts` file.'
            - 'In `App.tsx`, inside `ComposedApp`, use `useAppViewManager()` to get the current state.'
            - "Add a `useEffect` that listens to changes from the view manager's state and dispatches actions to the `AppShellContext`, e.g., `dispatch({ type: 'SET_BODY_STATE', payload: viewManager.bodyState })`."

      context_files:
        compact:
          - src/hooks/useAppViewManager.hook.ts
          - src/components/layout/EnhancedSidebar.tsx
          - src/components/layout/TopBar.tsx
          - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
        medium:
          - src/hooks/useAppViewManager.hook.ts
          - src/components/layout/EnhancedSidebar.tsx
          - src/components/layout/TopBar.tsx
          - src/components/global/CommandPalette.tsx
          - src/components/layout/ViewModeSwitcher.tsx
          - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
          - src/App.tsx
        extended:
          - src/hooks/useAppViewManager.hook.ts
          - src/components/layout/EnhancedSidebar.tsx
          - src/components/layout/TopBar.tsx
          - src/components/global/CommandPalette.tsx
          - src/components/layout/ViewModeSwitcher.tsx
          - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
          - src/App.tsx
          - src/hooks/useUrlStateSync.hook.ts

    - uuid: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12'
      status: 'todo'
      name: 'Part 3: Simplify Right Pane Content Logic in `App.tsx`'
      reason: |
        The `ComposedApp` component is cluttered with complex `useMemo` hooks to determine what content and header to display in the `RightPane`. This logic can be extracted for better readability and separation of concerns.
      steps:
        - uuid: '4d5e6f7a-8b9c-0123-4567-890abcdef123'
          status: 'todo'
          name: '1. Create `useRightPaneContent` Hook'
          reason: |
            To encapsulate the logic for mapping `sidePaneContent` and `itemId` to the correct React components and header elements.
          files:
            - 'src/hooks/useRightPaneContent.hook.ts' # New file
            - src/App.tsx
          operations:
            - 'Create a new file `src/hooks/useRightPaneContent.hook.ts`.'
            - 'Move the `contentMap` and the `useMemo` blocks for `selectedItem`, `currentContent`, and `rightPaneContent` from `App.tsx` into this new hook.'
            - 'The hook should take `sidePaneContent` and `itemId` as arguments.'
            - 'It should return an object containing the resolved `{ header, content }` for the right pane.'
            - 'In `ComposedApp` (`App.tsx`), call `useRightPaneContent()` to get the header and content, and pass them as props to the `<RightPane>` component.'
            - 'The callbacks for pane actions (`handleMaximize`, `handleCloseSidePane`, etc.) will also be simplified, as they will use the `useAppViewManager` hook.'

      context_files:
        compact:
          - src/App.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
        medium:
          - src/App.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/features/settings/SettingsContent.tsx
          - src/pages/ToasterDemo/index.tsx
        extended:
          - src/App.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/features/settings/SettingsContent.tsx
          - src/pages/ToasterDemo/index.tsx
          - src/pages/Notifications/index.tsx
          - src/pages/Dashboard/index.tsx

  conclusion: |
    Upon completion, the codebase will be significantly more maintainable. The introduction of `useAppViewManager` provides a single, clear API for state transitions, eliminating scattered and duplicated logic. Components will become simpler and more focused on their rendering responsibilities.

    This refactoring improves developer experience by making the state flow explicit and predictable. Future features involving new views or panes can be added with minimal effort by extending the view manager, ensuring the architecture remains clean and scalable.
  context_files:
    compact:
      - src/App.tsx
      - src/hooks/useUrlStateSync.hook.ts
      - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
      - src/components/layout/EnhancedSidebar.tsx
    medium:
      - src/App.tsx
      - src/hooks/useUrlStateSync.hook.ts
      - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
      - src/components/layout/EnhancedSidebar.tsx
      - src/components/layout/TopBar.tsx
      - src/components/global/CommandPalette.tsx
    extended:
      - src/App.tsx
      - src/hooks/useUrlStateSync.hook.ts
      - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
      - src/components/layout/EnhancedSidebar.tsx
      - src/components/layout/TopBar.tsx
      - src/components/global/CommandPalette.tsx
      - src/components/layout/ViewModeSwitcher.tsx
      - src/context/AppShellContext.tsx
```
