Ahoy. Let's sharpen our tools and dive into this codebase. We've got a classic performance bottleneck: the main content is re-rendering when an overlay side pane pops up. That's just lazy state management. The main view is just sitting there, minding its own business behind the overlay; it has no reason to churn.

Our target is the `useRightPaneContent` hook. It's the central nervous system for what gets displayed where, but it's currently got its wires crossed. A twitch in the side-pane state is causing a full-body spasm. We're going to perform some precision surgery on its memoization logic. By decoupling the main content's lifecycle from the side pane's, we'll stop the unnecessary renders dead in their tracks. This isn't just a bug fix; it's about making the UI feel instantaneous and respecting the component lifecycle.

We'll split one monolithic, over-sensitive `useMemo` into several smaller, specialized ones. The main content will only listen for changes to the main page route. The side pane will listen for its own signals. Clean separation, no more wasted cycles. Let's get this done.

```yaml
plan:
  uuid: 'c8a3f9b1-7e6d-4c5a-8b1f-9d4e2f7b6c0a'
  status: 'todo'
  title: 'Decouple Main and Side Pane Rendering for Performance'
  introduction: |
    We're seeing unnecessary re-renders in the main content area whenever an overlay side pane is activated. This is a classic performance drag, making the UI feel sluggish. The root cause is a state management flaw in the `useRightPaneContent` hook, where the memoization logic for the main content is improperly tied to the side pane's state.

    The plan is to refactor this hook to create a clean separation of concerns. We will split a single, overly-broad `useMemo` into distinct, focused memoization blocks. One block will handle the main content, depending *only* on the primary page route. Another will handle the side pane content, depending on its specific state triggers.

    This surgical change will ensure the main content component remains stable and does not re-render when its view is simply obscured by an overlay. The result will be a snappier, more efficient UI and a more maintainable and logical hook.
  parts:
    - uuid: 'e0d9b1c2-3a4b-4f5c-8a6b-1d7c0f8e9a1b'
      status: 'todo'
      name: 'Part 1: Refactor `useRightPaneContent` Hook Memoization'
      reason: |
        The core issue lies within the `useRightPaneContent` hook. Its primary `useMemo` has a dependency array that includes state for both the main content and the side pane. Consequently, any change to the side pane's visibility or content (e.g., adding `?side-pane=settings`) forces a recalculation of the `mainContentComponent`, generating a new component reference and triggering a wasteful re-render.

        By isolating the memoization logic, we ensure each piece of content only updates when its specific dependencies change, adhering to React's performance best practices.
      steps:
        - uuid: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
          status: 'todo'
          name: '1. Isolate Main Content Component Memoization'
          reason: |
            To prevent the main content from re-rendering, we must ensure its component reference is stable. This is achieved by creating a dedicated `useMemo` block for it that only depends on `activePage`, the state variable that dictates which main page is currently visible.
          files:
            - src/hooks/useRightPaneContent.hook.tsx
          operations:
            - 'Locate the primary `useMemo` block inside the `useRightPaneContent` hook.'
            - 'Extract the `switch (activePage)` logic responsible for selecting the main content component (e.g., `<DashboardContent />`, `<DataDemoPage />`).'
            - 'Wrap this extracted logic in a new, separate `useMemo` hook, assigning its result to a `mainContentComponent` variable.'
            - 'Ensure the dependency array for this new `useMemo` is `[activePage]`, making it independent of side pane state.'
        - uuid: 'f7e8d9c0-b1a2-4c3d-8e4f-5a6b7c8d9e0f'
          status: 'todo'
          name: '2. Refactor Side Pane and Other Content Memoization'
          reason: |
            With the main content memoized correctly, we need to ensure the side pane and other derived values (like page titles and icons) also have their own correct memoization logic. The side pane component *should* update when its state changes.
          files:
            - src/hooks/useRightPaneContent.hook.tsx
          operations:
            - "Identify all state variables from `useAppViewManager` that affect the right pane's content: `sidePanePage`, `dataItemId`, `conversationId`."
            - 'Create a new `useMemo` block for the `rightPaneComponent`.'
            - 'Move all logic for determining the side pane content into this new block.'
            - 'Set its dependency array to include all relevant variables, such as `[sidePanePage, dataItemId, conversationId, mockDataItems]`. Note: `mockDataItems` is needed for the `DataDetailPanel`.'
            - "Update the original `useMemo` to handle the remaining values like `pageTitle` and `pageIcon`, or create new memoization blocks for them as well. Ensure their dependency arrays are minimal and correct."
        - uuid: 'b3c4d5e6-f7a8-4b9c-8d0e-1f2a3b4c5d6e'
          status: 'todo'
          name: '3. Update Hook Return Value'
          reason: |
            Finally, the hook must be updated to return the newly created, separately memoized values.
          files:
            - src/hooks/useRightPaneContent.hook.tsx
          operations:
            - 'Modify the `return` statement of the hook to be an object that includes the `mainContentComponent` and `rightPaneComponent` from their respective `useMemo` blocks.'
            - 'Ensure all previously returned values (`pageTitle`, `pageIcon`, etc.) are still present in the returned object.'
            - 'Remove the now-redundant logic for main and side pane components from the original `useMemo`, cleaning up the hook.'
      context_files:
        compact:
          - src/hooks/useRightPaneContent.hook.tsx
        medium:
          - src/hooks/useRightPaneContent.hook.tsx
          - src/App.tsx
          - src/hooks/useAppViewManager.hook.ts
        extended:
          - src/hooks/useRightPaneContent.hook.tsx
          - src/App.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/components/layout/MainContent.tsx
          - src/components/layout/RightPane.tsx
  conclusion: |
    Upon completion, this refactoring will eliminate the unnecessary re-rendering of the main content when overlay side panes are used. This yields a significant performance improvement, making the application feel more responsive and fluid.

    Beyond the immediate performance gain, this change establishes a cleaner, more robust state management pattern within the `useRightPaneContent` hook. The logic becomes more self-contained and easier to reason about, reducing the likelihood of similar bugs in the future.
  context_files:
    compact:
      - src/hooks/useRightPaneContent.hook.tsx
    medium:
      - src/hooks/useRightPaneContent.hook.tsx
      - src/App.tsx
      - src/hooks/useAppViewManager.hook.ts
    extended:
      - src/hooks/useRightPaneContent.hook.tsx
      - src/App.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/components/layout/MainContent.tsx
      - src/components/layout/RightPane.tsx
      - src/store/appShell.store.ts
```
