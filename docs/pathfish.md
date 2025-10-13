yo, let's get this done. the `DataDemoPage` is borked when it's not in the main content pane. it's basically a scope issue. the page and its detail panel are too tightly coupled with the main app shell logic, and it breaks when you try to render it somewhere else.

the plan is to make the `DataDemoPage` a self-contained unit. it should handle its own master-detail view internally. if you click an item, it should show the detail view *inside its own container*, not by telling the whole app to open a different component in a different pane. this makes it way more portable and fixes the bug for good. we'll rip out the cross-pane state logic for this feature and just let the component manage itself. cleaner, simpler, works everywhere.

here's the playbook.

```yaml
plan:
  uuid: 'c8a2b1f0-3e9a-4d7c-8f2b-9e4a1b0c6d7a'
  status: 'todo'
  title: 'Refactor DataDemo for Self-Contained Pane Rendering'
  introduction: |
    The `DataDemoPage` currently fails to render correctly when placed in an overlay side pane or a split-view pane. This is due to its detail view logic being improperly coupled with the global `AppShell` state, expecting a cross-pane (master-detail) interaction that isn't set up for when the page itself is in a secondary pane.

    This refactor will decouple this logic by making `DataDemoPage` a fully self-contained component. It will manage its own master-detail view internally, switching between its list/grid view and the detail panel within its own boundaries. This approach resolves the rendering bugs, significantly simplifies state management by removing the need for a shared context item, and improves component encapsulation, allowing `DataDemoPage` to function correctly anywhere in the layout.
  parts:
    - uuid: 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6'
      status: 'todo'
      name: 'Part 1: Internalize Master-Detail Logic in DataDemoPage'
      reason: |
        To make the component independent of the `AppShell`'s pane state, we need to move the master-detail view logic inside `DataDemoPage`. This will allow it to function correctly whether it's in the main content area or a side pane.
      steps:
        - uuid: 'b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6'
          status: 'todo'
          name: '1. Conditionally Render Views'
          reason: |
            The core of this refactor is to switch between the list/grid view and the detail panel based on local state (`selectedItem`), rather than global app shell state.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'Wrap the main return statement in a condition: if `selectedItem` exists, render `<DataDetailPanel />`.'
            - 'If `selectedItem` is `null`, render the existing `PageLayout` containing the list/grid views.'
            - 'Pass `selectedItem` as the `item` prop to `DataDetailPanel`.'
            - 'Pass a callback `() => setSelectedItem(null)` to the `onClose` prop of `DataDetailPanel`.'
        - uuid: 'c2d3e4f5-a6b7-c8d9-e0f1-a2b3c4d5e6f7'
          status: 'todo'
          name: '2. Simplify Item Selection Logic'
          reason: |
            The component should no longer interact with the global `openSidePane` function for its internal navigation. The selection handler should only manage local state.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'In `handleItemSelect`, remove the call to `openSidePane()`.'
            - 'The function should now only call `setSelectedItem(item)`. The `useAppShell` hook might no longer be needed here unless for other reasons.'
        - uuid: 'd3e4f5a6-b7c8-d9e0-f1a2-b3c4d5e6f7a8'
          status: 'todo'
          name: '3. Remove Redundant Detail Panel Instance'
          reason: |
            The `DataDetailPanel` was previously rendered persistently at the bottom of the component, which is now incorrect. It should only be rendered when an item is selected.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'Delete the `<DataDetailPanel />` instance from the bottom of the component JSX, as it is now rendered conditionally at the top level.'
    - uuid: 'e6f7a8b9-c0d1-e2f3-a4b5-c6d7e8f9a0b1'
      status: 'todo'
      name: 'Part 2: Adapt DataDetailPanel for Internal Navigation'
      reason: |
        Since the detail panel is now part of a view stack within its parent, it needs a clear UI element for the user to navigate back to the list.
      steps:
        - uuid: 'f7a8b9c0-d1e2-f3a4-b5c6-d7e8f9a0b1c2'
          status: 'todo'
          name: '1. Add Back Button to Detail Panel'
          reason: |
            To allow users to return to the list/grid view from the detail view, a back button is necessary. This button will trigger the `onClose` callback.
          files:
            - src/pages/DataDemo/components/DataDetailPanel.tsx
          operations:
            - 'Import the `Button` component and the `ArrowLeft` icon from `lucide-react`.'
            - 'In the header section of `DataDetailPanel`, before the main content, add a `Button` with the `ArrowLeft` icon.'
            - 'The `onClick` handler for this button should call the `onClose` prop.'
            - 'Style the button appropriately (e.g., variant `ghost`) and add text like "Back to list".'
    - uuid: 'a0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d5'
      status: 'todo'
      name: 'Part 3: Update App Shell and Context'
      reason: |
        The global shell configuration needs to be updated to remove the old, incorrect logic for handling the data demo detail view and simply treat `DataDemoPage` as a standard page content type.
      steps:
        - uuid: 'b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6'
          status: 'todo'
          name: '1. Simplify sidePaneContent Type'
          reason: |
            The `'data-details'` type is now redundant as the detail view is handled internally. We need a new type for placing the entire `DataDemoPage` in the side pane.
          files:
            - src/context/AppShellContext.tsx
          operations:
            - 'In the `AppShellState` interface, find the `sidePaneContent` union type.'
            - 'Remove the `'data-details'` type and replace it with `'dataDemo'`.'
        - uuid: 'c2d3e4f5-a6b7-c8d9-e0f1-a2b3c4d5e7f8'
          status: 'todo'
          name: '2. Adjust Page-to-Pane Mappings'
          reason: |
            The mapping that tells the app which pane content to open for a given page needs to be updated to use the new `'dataDemo'` type.
          files:
            - src/components/layout/ViewModeSwitcher.tsx
            - src/App.tsx
          operations:
            - "In `src/components/layout/ViewModeSwitcher.tsx`, find `pageToPaneMap` and change the value for `'data-demo'` from `'data-details'` to `'dataDemo'`."
            - "In `src/App.tsx`, find the `pageMap` object and update its `sidePaneContent` for `'data-demo'` to `'dataDemo'`."
        - uuid: 'd3e4f5a6-b7c8-d9e0-f1a2-b3c4d5e6f7a8'
          status: 'todo'
          name: '3. Revise App.tsx Content Map'
          reason: |
            The main application router needs to know what to render when the `sidePaneContent` is set to `'dataDemo'` and must be cleansed of the old `'data-details'` logic.
          files:
            - src/App.tsx
          operations:
            - "In `ComposedApp`, find the `contentMap` object."
            - "Delete the entire entry for `'data-details'`."
            - "Create a new entry for `'dataDemo'` that renders `<DataDemoPage isInSidePane={true} />`."
  conclusion: |
    By executing this plan, we will successfully decouple the `DataDemoPage` from the `AppShell`'s pane-switching logic. The component will become a self-contained module, capable of managing its own master-detail view. This not only fixes the critical bug preventing it from rendering in side panes but also simplifies the overall application state and improves code maintainability. The user experience for the data demo feature will be consistent and reliable, regardless of where it is rendered in the layout.
  context_files:
    compact:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/App.tsx
    medium:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/App.tsx
      - src/context/AppShellContext.tsx
      - src/components/layout/ViewModeSwitcher.tsx
    extended:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/App.tsx
      - src/context/AppShellContext.tsx
      - src/components/layout/ViewModeSwitcher.tsx
      - src/components/layout/EnhancedSidebar.tsx
      - src/components/layout/AppShell.tsx
```
