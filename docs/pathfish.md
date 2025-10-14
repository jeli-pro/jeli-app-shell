```yaml
plan:
  uuid: 'e8a3c1b9-4f2d-4e9a-8c77-01b4c3b1a0d5'
  status: 'todo'
  title: 'Refactor to Eliminate Prop Drilling via Global State & Context'
  introduction: |
    Alright, we're diving deep to refactor this app shell. The goal is to crank up the DRY principle and kill prop drilling dead. Right now, state is being passed down through component trees like a hot potato, which makes maintenance a headache and components brittle.

    The plan is simple but powerful: we'll leverage the existing global state managers (Zustand, React Context) to their full potential. Components at the leaf of the tree will pull their own state and actions from these global hooks, making them self-sufficient and decoupled from their parents. We'll also spin up a feature-specific context for the complex "Data Demo" page to keep its state contained but accessible.

    The outcome? A cleaner, more maintainable codebase where components are truly reusable and the flow of data is obvious. It's about making the architecture smarter, not just the components. Let's get this done.
  parts:
    - uuid: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d'
      status: 'todo'
      name: 'Part 1: Encapsulate Data Demo State with a Dedicated Context'
      reason: |
        The `DataDemoPage` component is currently a "props factory," funneling state and handlers from `useDataManagement` down to a whole squad of child components. This is classic prop drilling and it's fragile. A minor change in a child's needs forces updates all the way up the chain.

        We'll build a dedicated `DataDemoContext` to encapsulate all state and logic for this feature. This creates a clean boundary, makes the components within the feature more modular, and keeps the global `AppShellContext` from getting bloated with feature-specific cruft.
      steps:
        - uuid: 'b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6'
          status: 'todo'
          name: '1. Create DataDemoContext and Provider'
          reason: |
            We need a new context to hold the state from the `useDataManagement` hook. The provider will initialize the hook once and make its value available to all descendant components.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'Create a new file `src/pages/DataDemo/context/DataDemoContext.tsx` (you will have to create it).'
            - 'In this new file, define `DataDemoContext` and a `useDataDemo` hook for consumers.'
            - 'Create a `DataDemoProvider` component that internally calls the `useDataManagement` hook and provides its return value through the context.'
            - 'In `src/pages/DataDemo/index.tsx`, wrap the main content (`PageLayout`) with your new `DataDemoProvider`.'
        - uuid: 'c2d3e4f5-a6b7-c8d9-e0f1-a2b3c4d5e6f7'
          status: 'todo'
          name: '2. Refactor DataDemoPage to remove prop drilling'
          reason: |
            With the provider in place, the `DataDemoPage` component no longer needs to pass down dozens of props. It becomes a much simpler layout component.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'In `DataDemoPage`, remove the props being passed to `DataToolbar`, `DataViewModeSelector`, `DataListView`, `DataCardView`, and `DataTableView`.'
            - 'The component should now primarily be responsible for layout and rendering the child components within the context provider.'
        - uuid: 'd3e4f5a6-b7c8-d9e0-f1a2-b3c4d5e6f7a8'
          status: 'todo'
          name: '3. Update Child Components to Consume Context'
          reason: |
            The child components will now pull state and actions directly from our new `useDataDemo` hook, making them self-sufficient and decoupled from `DataDemoPage`.
          files:
            - src/pages/DataDemo/components/DataToolbar.tsx
            - src/pages/DataDemo/components/DataViewModeSelector.tsx
            - src/pages/DataDemo/components/DataListView.tsx
            - src/pages/DataDemo/components/DataCardView.tsx
            - src/pages/DataDemo/components/DataTableView.tsx
          operations:
            - 'For each file, import and call the `useDataDemo` hook to get the necessary state (`viewMode`, `filters`, `sortConfig`, etc.) and actions (`setViewMode`, `setFilters`, etc.).'
            - 'Remove the corresponding props from each component''s interface and function signature.'
      context_files:
        compact:
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
        medium:
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/components/DataViewModeSelector.tsx
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
          - src/pages/DataDemo/components/DataCardView.tsx
        extended:
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/components/DataViewModeSelector.tsx
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/hooks/useAppViewManager.hook.ts

    - uuid: 'f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1'
      status: 'todo'
      name: 'Part 2: Make Core Layout Components Self-Sufficient'
      reason: |
        Core layout components like `TopBar` and `RightPane` are tightly coupled to `App.tsx` because they receive their actions and data via props. This is unnecessary when that same information is available from global hooks. Making these components self-sufficient will dramatically simplify `App.tsx` and improve encapsulation.
      steps:
        - uuid: '0a1b2c3d-e4f5-a6b7-c8d9-e0f1a2b3c4d5'
          status: 'todo'
          name: '1. Refactor TopBar to use global hooks'
          reason: |
            The `TopBar` receives `onToggleSidebar` and `onToggleDarkMode` as props, but it can get these functions directly from the `useAppShell` and `useAppStore` hooks.
          files:
            - src/components/layout/TopBar.tsx
            - src/App.tsx
          operations:
            - 'In `TopBar.tsx`, remove the `onToggleSidebar` and `onToggleDarkMode` props.'
            - 'Use the `useAppShell()` hook to get the `toggleSidebar` function and use it in the menu button''s `onClick`.'
            - 'Use the `useAppStore()` hook to get the `toggleDarkMode` function and use it in the theme toggle button''s `onClick`.'
            - 'In `App.tsx`, remove the corresponding props from the `<TopBar>` component inside `ComposedApp`.'
        - uuid: '1b2c3d4e-f5a6-b7c8-d9e0-f1a2b3c4d5e6'
          status: 'todo'
          name: '2. Encapsulate RightPane logic'
          reason: |
            The `RightPane` is a prime example of logic bleeding out. Its header content and close behavior are being managed by its parent, `ComposedApp`. We will move all of that logic inside `RightPane` itself, making it a true self-contained component.
          files:
            - src/components/layout/RightPane.tsx
            - src/App.tsx
          operations:
            - 'In `RightPane.tsx`, remove the `header` and `onClose` props.'
            - 'Import and use the `useAppViewManager` hook to get `closeSidePane`, `toggleSplitView` etc.'
            - 'Import and use the `useRightPaneContent` hook to get the `meta` object containing the title and icon.'
            - 'Construct the header UI *inside* the `RightPane` component using the data from the hooks. This includes the title, icon, and the view-mode buttons.'
            - 'Update the main close button''s `onClick` to call `closeSidePane()` from the hook.'
            - 'In `App.tsx`, inside `ComposedApp`, find the `<RightPane>` component. Remove the `header` and `onClose` props. The `rightPaneHeader` constant and its associated `useMemo` can be deleted entirely.'
      context_files:
        compact:
          - src/App.tsx
          - src/components/layout/RightPane.tsx
          - src/components/layout/TopBar.tsx
        medium:
          - src/App.tsx
          - src/components/layout/RightPane.tsx
          - src/components/layout/TopBar.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/hooks/useRightPaneContent.hook.tsx
          - src/context/AppShellContext.tsx
          - src/store/appStore.ts
        extended:
          - src/App.tsx
          - src/components/layout/RightPane.tsx
          - src/components/layout/TopBar.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/hooks/useRightPaneContent.hook.tsx
          - src/context/AppShellContext.tsx
          - src/store/appStore.ts
          - src/components/layout/ViewModeSwitcher.tsx

    - uuid: '2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f'
      status: 'todo'
      name: 'Part 3: Enhance Reusability of Shared Components'
      reason: |
        Small inconsistencies between components that do similar things lead to code duplication. The progress bar in the table view is slightly different from the shared one. We can make the shared component more flexible to cover both use cases.
      steps:
        - uuid: '3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a'
          status: 'todo'
          name: '1. Generalize ItemProgressBar'
          reason: |
            `DataTableView` has its own progress bar implementation just to add a percentage label. We can add an optional prop to the shared `ItemProgressBar` to handle this, making it more reusable.
          files:
            - src/pages/DataDemo/components/shared/DataItemParts.tsx
            - src/pages/DataDemo/components/DataTableView.tsx
          operations:
            - 'In `DataItemParts.tsx`, modify the `ItemProgressBar` component. Add a new prop `showPercentage?: boolean`.'
            - 'When `showPercentage` is true, wrap the progress bar in a flex container and add a `<span>` to display the `{completion}%` text.'
            - 'In `DataTableView.tsx`, replace the custom progress bar `div` with the shared `<ItemProgressBar completion={item.metrics.completion} showPercentage />` component.'
      context_files:
        compact:
          - src/pages/DataDemo/components/shared/DataItemParts.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
        medium:
          - src/pages/DataDemo/components/shared/DataItemParts.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
        extended:
          - src/pages/DataDemo/components/shared/DataItemParts.tsx
          - src/pages/DataDemo/components/DataTableView.tsx

  conclusion: |
    Once this refactor is complete, the codebase will be in a much stronger position. We'll have obliterated major instances of prop drilling, leading to cleaner component APIs and a more intuitive data flow.

    Components will be more self-reliant and truly reusable, as they fetch their own dependencies from the global state. The separation of concerns will be clearer, especially with the `DataDemo` feature being neatly encapsulated in its own context. This makes the system easier to reason about, debug, and extend in the future. It's a solid architectural win.
  context_files:
    compact:
      - src/App.tsx
      - src/pages/DataDemo/index.tsx
      - src/components/layout/RightPane.tsx
    medium:
      - src/App.tsx
      - src/pages/DataDemo/index.tsx
      - src/components/layout/RightPane.tsx
      - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
      - src/hooks/useAppViewManager.hook.ts
    extended:
      - src/App.tsx
      - src/pages/DataDemo/index.tsx
      - src/components/layout/RightPane.tsx
      - src/pages/DataDemo/hooks/useDataManagement.hook.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/context/AppShellContext.tsx
      - src/store/appStore.ts
      - src/components/layout/TopBar.tsx
      - src/pages/DataDemo/components/DataToolbar.tsx
```
