Here's the master plan to refactor the codebase.

We're diving deep to untangle some gnarly bits. The big offender is a god-hook that's doing way too much—mixing URL parsing, state management, and content mapping. It's a ticking time bomb for maintenance. We're going to dismantle it and create a clean, unidirectional data flow where the URL is the single source of truth and state changes propagate predictably. This isn't just about cleaning house; it's about making the architecture robust and scalable.

We'll also DRY up some animation logic. Redundant code is a drag on velocity, and we've spotted an opportunity to consolidate two similar hooks into one elegant, configurable utility. The outcome will be a leaner, meaner codebase that's easier to reason about and build upon. No UI/UX regressions—just a solid foundation for future features. Let's ship it.

```yaml
plan:
  uuid: 'c8a2b1f3-5d6e-4a9b-8f7c-1e2d3a4b5c6d'
  status: 'todo'
  title: 'Refactor State Management and Animation Hooks for DRYness'
  introduction: |
    Alright, let's ship this refactor. The current architecture has a couple of hotspots that are crying out for simplification. The main target is a "god hook" that's become a bottleneck, tightly coupling URL state with content rendering and business logic. It's brittle and hard to extend. We're going to break it apart, establishing a clean separation of concerns.

    The plan is two-fold. First, we'll dismantle the monolithic `usePageContent` hook, replacing it with a focused utility for syncing URL state with our AppShell context. The responsibility for rendering content will move up to the main App component, making it the central orchestrator. This creates a predictable, top-down data flow that's much easier to reason about.

    Second, we'll tackle some code duplication in our animation hooks. We have two very similar functions for staggered animations; we'll merge them into a single, more powerful and configurable hook. This reduces the API surface and makes our animation system more maintainable.

    This refactor is purely architectural. The goal is a highly DRY, more robust, and scalable codebase without any user-facing regressions.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Decouple URL State from Content Rendering'
      reason: |
        The `usePageContent.hook.tsx` is a violation of the Single Responsibility Principle. It currently handles URL parsing, syncing URL state to the `AppShellContext`, mapping content components, and generating UI elements like the right pane header. This tight coupling makes it difficult to modify or extend any of these features without affecting the others.

        By decoupling these concerns, we'll create a more maintainable and scalable architecture. A dedicated hook for URL syncing will be reusable and testable in isolation. Moving content routing and UI composition to the main `App.tsx` component centralizes control and clarifies the app's structure. This change will eliminate the god-hook and establish a clear, unidirectional data flow from URL to state to UI.
      steps:
        - uuid: 'b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6'
          status: 'todo'
          name: '1. Create a dedicated hook for URL-to-state synchronization'
          reason: |
            To begin decoupling, we'll extract the logic responsible for reading the URL (`useParams`, `useSearchParams`) and updating the `AppShellContext`. This new hook, `useUrlStateSync`, will be a pure "effect" hook with a single responsibility, making our state management more predictable.
          files:
            - 'src/hooks/usePageContent.hook.tsx'
          operations:
            - 'Create a new file `src/hooks/useUrlStateSync.hook.ts`.'
            - 'Move the `useEffect` block from `usePageContent.hook.tsx` into the new `useUrlStateSync` hook.'
            - 'The new hook will use `useAppShell`, `useParams`, and `useSearchParams` to read URL state.'
            - 'Based on `itemId`, `sidePane`, `view`, and `right` params, it will dispatch `SET_BODY_STATE` and `SET_SIDE_PANE_CONTENT` actions to the `AppShellContext`.'
            - 'This hook will not return anything; its only purpose is to synchronize state.'
        - uuid: 'c2d3e4f5-a6b7-c8d9-e0f1-a2b3c4d5e6f7'
          status: 'todo'
          name: '2. Centralize Right Pane logic in `App.tsx`'
          reason: |
            With URL syncing handled, the main `App.tsx` component can now become the orchestrator for what appears in the `RightPane`. This centralizes the "routing" logic for this part of the UI and allows us to remove the large, hardcoded `contentMap` from the old hook.
          files:
            - 'src/App.tsx'
            - 'src/hooks/usePageContent.hook.tsx'
          operations:
            - 'In `ComposedApp` within `App.tsx`, delete the call to `usePageContent()`.'
            - 'Instead, directly use the `useAppShell` hook to get `bodyState`, `sidePaneContent`, etc.'
            - 'Create the logic for `rightPaneContent` and `rightPaneHeader` directly inside `ComposedApp`. Use a `switch` statement or a simple component map based on `sidePaneContent` to determine which component to render (e.g., `SettingsContent`, `DataDetailPanel`).'
            - 'Re-implement the callbacks (`handleCloseSidePane`, `handleToggleSplitView`, `handleMaximize`) inside `ComposedApp` using `navigate` and `setSearchParams`. These will be passed down to the `rightPaneHeader`.'
            - 'Instantiate and call the new `useUrlStateSync()` hook at the top of `ComposedApp`.'
        - uuid: 'd3e4f5a6-b7c8-d9e0-f1a2-b3c4d5e6f7a8'
          status: 'todo'
          name: '3. Delete the old `usePageContent.hook.tsx`'
          reason: |
            All responsibilities of the `usePageContent` hook have now been migrated to more appropriate locations (`useUrlStateSync` and `App.tsx`). The file is now redundant and should be removed to complete the refactor.
          files:
            - 'src/hooks/usePageContent.hook.tsx'
          operations:
            - 'Delete the file `src/hooks/usePageContent.hook.tsx` from the project.'
            - 'Remove any remaining imports pointing to the deleted file.'
      context_files:
        compact:
          - 'src/hooks/usePageContent.hook.tsx'
          - 'src/App.tsx'
          - 'src/context/AppShellContext.tsx'
        medium:
          - 'src/hooks/usePageContent.hook.tsx'
          - 'src/App.tsx'
          - 'src/context/AppShellContext.tsx'
          - 'src/components/layout/RightPane.tsx'
          - 'src/lib/utils.ts'
        extended:
          - 'src/hooks/usePageContent.hook.tsx'
          - 'src/App.tsx'
          - 'src/context/AppShellContext.tsx'
          - 'src/components/layout/RightPane.tsx'
          - 'src/lib/utils.ts'
          - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
          - 'src/features/settings/SettingsContent.tsx'
    - uuid: 'b2c3d4e5-f6a7-b8c9-d0e1-f2a3b4c5d6e7'
      status: 'todo'
      name: 'Part 2: Consolidate Staggered Animation Hooks'
      reason: |
        The file `useStaggeredAnimation.motion.hook.ts` contains two functions, `useIncrementalStaggeredAnimation` and `useStaggeredAnimation`, which share a significant amount of GSAP logic. This represents code duplication that can be eliminated.

        By merging them into a single, more configurable `useStaggeredAnimation` hook, we can reduce the overall code, simplify the hook's API, and make our animation utilities more maintainable and DRY.
      steps:
        - uuid: 'e4f5a6b7-c8d9-e0f1-a2b3-c4d5e6f7a8b9'
          status: 'todo'
          name: '1. Merge animation hooks into one'
          reason: |
            We will combine the logic of both hooks into a single function, controlled by an options parameter. This removes the need for two separate exports and centralizes the stagger animation logic.
          files:
            - 'src/hooks/useStaggeredAnimation.motion.hook.ts'
          operations:
            - 'In `src/hooks/useStaggeredAnimation.motion.hook.ts`, remove the `useIncrementalStaggeredAnimation` export.'
            - 'Modify the remaining `useStaggeredAnimation` hook to accept a new option in its `options` object: `mode?: "full" | "incremental"`, which defaults to `"full"`.'
            - 'Inside the hook, add a conditional block. If `mode` is `"incremental"`, use the logic from the old `useIncrementalStaggeredAnimation` (with `animatedItemsCount`).'
            - 'If `mode` is `"full"`, use the original, simpler GSAP call.'
            - 'Update the hook's documentation to reflect the new `mode` option.'
        - uuid: 'f5a6b7c8-d9e0-f1a2-b3c4-d5e6f7a8b9c0'
          status: 'todo'
          name: '2. Update components to use the consolidated hook'
          reason: |
            With the hook's API changed, we need to update all call sites to use the new unified function and pass the correct `mode` option to ensure animations behave as they did before.
          files:
            - 'src/pages/DataDemo/components/DataListView.tsx'
            - 'src/pages/DataDemo/components/DataCardView.tsx'
            - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
            - 'src/pages/Dashboard/hooks/useDashboardAnimations.motion.hook.ts'
          operations:
            - 'In `DataListView.tsx` and `DataCardView.tsx`, change `useIncrementalStaggeredAnimation(...)` to `useStaggeredAnimation(..., { mode: "incremental", ... })`.'
            - 'In `DataDetailPanel.tsx`, the existing `useStaggeredAnimation` call is for a full animation, so no `mode` option is needed (it will use the default).'
            - 'In `useDashboardAnimations.motion.hook.ts`, the existing `useStaggeredAnimation` calls are also for full animations, so no changes are needed there either. Just verify the import name is correct.'
      context_files:
        compact:
          - 'src/hooks/useStaggeredAnimation.motion.hook.ts'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
        medium:
          - 'src/hooks/useStaggeredAnimation.motion.hook.ts'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
          - 'src/pages/Dashboard/hooks/useDashboardAnimations.motion.hook.ts'
        extended:
          - 'src/hooks/useStaggeredAnimation.motion.hook.ts'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
          - 'src/pages/Dashboard/hooks/useDashboardAnimations.motion.hook.ts'
          - 'src/pages/Dashboard/index.tsx'
  conclusion: |
    Upon completion, this refactor will yield a significantly cleaner and more maintainable codebase. The separation of URL state synchronization from content rendering will make the application's core logic easier to understand and extend. Future developers will be able to add new side panes or modify routing behavior without digging into a complex, monolithic hook.

    Consolidating the animation hooks reduces code duplication and provides a clearer, more consistent API for creating staggered animations throughout the application. These changes, while purely architectural, are crucial for the long-term health and scalability of the project, enabling faster feature development and easier debugging down the line.
  context_files:
    compact:
      - 'src/hooks/usePageContent.hook.tsx'
      - 'src/App.tsx'
      - 'src/hooks/useStaggeredAnimation.motion.hook.ts'
    medium:
      - 'src/hooks/usePageContent.hook.tsx'
      - 'src/App.tsx'
      - 'src/context/AppShellContext.tsx'
      - 'src/hooks/useStaggeredAnimation.motion.hook.ts'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
    extended:
      - 'src/hooks/usePageContent.hook.tsx'
      - 'src/App.tsx'
      - 'src/context/AppShellContext.tsx'
      - 'src/components/layout/RightPane.tsx'
      - 'src/lib/utils.ts'
      - 'src/hooks/useStaggeredAnimation.motion.hook.ts'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/Dashboard/hooks/useDashboardAnimations.motion.hook.ts'
```
