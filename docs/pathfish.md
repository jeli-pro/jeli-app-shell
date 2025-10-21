Alright, let's get this done. The data detail view is a mess – it's bolted into the side pane and breaks in every other context. We're going to architect this properly. The goal is a clean, reusable detail component that works seamlessly across all of the AppShell's view modes: normal, side pane, split, and fullscreen. No more jank, no more double scrollbars.

Here's the master plan. We're breaking this down into three parts. First, we'll extract the detail view logic into its own component. Second, we'll fix the routing and main page logic to render this new component correctly in a "normal" view. Finally, we'll refactor the right pane to handle content with its own scrolling, which will kill the double scrollbar bug for good.

This approach follows the "Don't Repeat Yourself" principle by creating a single, reusable `DataDetailContent` component. By making the `RightPane` smarter about its content, we create a more flexible and robust layout system that will prevent similar issues in the future. The fix to the "normal view" routing makes the detail page a first-class citizen, which is critical for a good user experience and bookmarkable URLs.

When we're done, the detail view will feel native to the shell, not like a hack. It will be fast, responsive, and work exactly as a user would expect in any layout configuration.

```yaml
plan:
  uuid: 'f3a9e1d2-5b8c-4f7a-8b6d-9c4e2a1b0f3e'
  status: 'todo'
  title: 'Refactor Data Detail View for AppShell Architecture Compliance'
  introduction: |
    The current data detail view implementation is tightly coupled with the side pane, causing architectural issues. It fails to render in a standard "normal" view, has a broken fullscreen mode, and exhibits layout problems like double scrollbars when displayed in an overlay.

    This refactoring plan will decouple the detail view into a reusable component, enabling it to function correctly as a main page content, within a side pane, or in a split view. We will fix the routing logic in the `DataDemoPage` to properly display the detail view when an item ID is present in the URL.

    Furthermore, we will enhance the `RightPane` component to intelligently handle content that manages its own scrolling. This will resolve the layout and scrollbar issues, leading to a clean, predictable, and architecturally sound user experience across all of the AppShell's view modes.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Create a Reusable Data Detail Component'
      reason: |
        To fix the "Don't Repeat Yourself" violation, we'll extract the detail view logic from `useRightPaneContent.hook.tsx` into a new, reusable component. This component will be the single source of truth for rendering an item's details and can be used in any context (main content, side pane, etc.).
      steps:
        - uuid: 'b1c2d3e4-f5g6-7890-1234-567890abcdef'
          status: 'todo'
          name: '1. Create DataDetailContent Component'
          reason: |
            A new component, `DataDetailContent`, will encapsulate the rendering of the `DetailPanel` and its associated context provider and action buttons. This centralizes the detail view logic.
          files:
            - src/pages/DataDemo/components/DataDetailContent.tsx
          operations:
            - 'Create a new file `src/pages/DataDemo/components/DataDetailContent.tsx`.'
            - 'Define a new component `DataDetailContent` that accepts an `item` prop of type `DataDemoItem`.'
            - 'Wrap the component''s content in a `<DynamicViewProvider>`, passing necessary props like `viewConfig` and an `onItemUpdate` callback retrieved from `useDataDemoStore`.'
            - 'The component''s layout will be a flex column (`h-full flex flex-col`) with a background color (`bg-card`).'
            - 'Inside, render the `<DetailPanel>` component. It should be configured to be flexible (`flex-1 min-h-0`).'
            - 'Below the `DetailPanel`, add a footer `div` containing action buttons (e.g., "Open Project", "Share"). This footer should not grow (`flex-shrink-0`).'
        - uuid: 'c2d3e4f5-g6h7-8901-2345-67890abcdef'
          status: 'todo'
          name: '2. Adjust DetailPanel Layout'
          reason: |
            To ensure the `DetailPanel` correctly fills the available space within its new flexbox parent and manages its own internal scrolling without causing parent overflow, its root element needs to be adjusted.
          files:
            - src/features/dynamic-view/components/shared/DetailPanel.tsx
          operations:
            - 'In `src/features/dynamic-view/components/shared/DetailPanel.tsx`, find the root `div`.'
            - 'Change its `className` from `"h-full flex flex-col"` to `"flex-1 flex flex-col min-h-0"` to make it a flexible child that doesn''t overflow its parent.'
        - uuid: 'd3e4f5g6-h7i8-9012-3456-7890abcdef'
          status: 'todo'
          name: '3. Create a Selector for the Selected Item'
          reason: |
            To provide a clean way for components to retrieve the currently selected item based on the URL parameter, we will add a utility hook/selector to the data store.
          files:
            - src/pages/DataDemo/store/dataDemo.store.tsx
          operations:
            - 'In `src/pages/DataDemo/store/dataDemo.store.tsx`, export a new function `useSelectedItem(itemId?: string)`.'
            - 'This function will check if an `itemId` is provided. If so, it will find and return the corresponding item from the `typedMockData` array. If not, it returns `null`.'
      context_files:
        compact:
          - src/features/dynamic-view/components/shared/DetailPanel.tsx
          - src/hooks/useRightPaneContent.hook.tsx
        medium:
          - src/features/dynamic-view/components/shared/DetailPanel.tsx
          - src/hooks/useRightPaneContent.hook.tsx
          - src/pages/DataDemo/store/dataDemo.store.tsx
        extended:
          - src/features/dynamic-view/components/shared/DetailPanel.tsx
          - src/hooks/useRightPaneContent.hook.tsx
          - src/pages/DataDemo/store/dataDemo.store.tsx
          - src/pages/DataDemo/DataDemo.config.tsx
          - src/features/dynamic-view/DynamicViewContext.tsx
    - uuid: 'e6f7g8h9-i0j1-2345-6789-012345abcdef'
      status: 'todo'
      name: 'Part 2: Fix Normal View Routing and Right Pane Content'
      reason: |
        Currently, `DataDemoPage` only shows the list view, and `useRightPaneContent.hook.tsx` contains hardcoded detail view logic. We need to fix `DataDemoPage` to render the detail component when an item is selected, and refactor the `RightPane` to consume this new component cleanly.
      steps:
        - uuid: 'f7g8h9i0-j1k2-3456-7890-12345abcdef'
          status: 'todo'
          name: '1. Update DataDemoPage to Render Detail View'
          reason: |
            The main page for the data demo needs to conditionally render either the `DynamicView` (list) or the `DataDetailContent` based on the presence of an `itemId` in the URL. This will enable the "normal view" for item details.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'In `src/pages/DataDemo/index.tsx`, use the `useAppViewManager` hook to get the `itemId` from the URL params.'
            - 'Use the new `useSelectedItem` hook to fetch the selected item data.'
            - 'Add a conditional check at the top of the component: if `itemId` and `selectedItem` exist, return the `<DataDetailContent item={selectedItem} />` component directly.'
            - 'The `DataDetailContent` component should not be wrapped in `<PageLayout>`, as it manages its own full-page layout.'
            - 'If `itemId` does not exist, the component should proceed to render the existing `<PageLayout>` with the `<DynamicView>` component as it does now.'
        - uuid: 'g8h9i0j1-k2l3-4567-8901-23456abcdef'
          status: 'todo'
          name: '2. Refactor useRightPaneContent Hook'
          reason: |
            This hook should no longer contain complex rendering logic. It should be simplified to use the new `DataDetailContent` component and to provide metadata indicating that the content handles its own scrolling.
          files:
            - src/hooks/useRightPaneContent.hook.tsx
          operations:
            - 'In `useRightPaneContent.hook.tsx`, import the new `DataDetailContent` component.'
            - 'Find the logic for `sidePaneContent === ''dataItem''`.'
            - 'Replace the large block of JSX with a single line: `content: <DataDetailContent item={selectedItem} />`.'
            - 'In the `meta` object for this case, add a new property: `hasOwnScrolling: true`.'
      context_files:
        compact:
          - src/pages/DataDemo/index.tsx
          - src/hooks/useRightPaneContent.hook.tsx
        medium:
          - src/pages/DataDemo/index.tsx
          - src/hooks/useRightPaneContent.hook.tsx
          - src/pages/DataDemo/components/DataDetailContent.tsx
          - src/hooks/useAppViewManager.hook.ts
        extended:
          - src/pages/DataDemo/index.tsx
          - src/hooks/useRightPaneContent.hook.tsx
          - src/pages/DataDemo/components/DataDetailContent.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/components/layout/RightPane.tsx
          - src/App.tsx
    - uuid: 'h9i0j1k2-l3m4-5678-9012-34567abcdef'
      status: 'todo'
      name: 'Part 3: Eliminate Double Scrollbar in RightPane'
      reason: |
        The `RightPane` component currently wraps all content in a scrollable container, which clashes with content that has its own internal scrolling (like our new `DataDetailContent`). We need to make the `RightPane` smart enough to disable its own scrollbar when the content provides one.
      steps:
        - uuid: 'i0j1k2l3-m4n5-6789-0123-45678abcdef'
          status: 'todo'
          name: '1. Update RightPane to Handle Custom Scrolling'
          reason: |
            By checking for the `hasOwnScrolling` flag from `useRightPaneContent`, the `RightPane` can conditionally apply its `overflow-y-auto` wrapper, solving the double scrollbar issue permanently.
          files:
            - src/components/layout/RightPane.tsx
          operations:
            - 'In `src/components/layout/RightPane.tsx`, ensure the `meta` object is retrieved from the `useRightPaneContent` hook.'
            - 'Locate the `div` that wraps `{children}` and has the class `flex-1 overflow-y-auto`.'
            - 'Wrap this `div` and the direct `{children}` in a conditional render.'
            - 'If `meta.hasOwnScrolling` is true, render `{children}` directly (which will now fill the flex container).'
            - 'If `meta.hasOwnScrolling` is false or undefined, render the original wrapper: `<div className="flex-1 overflow-y-auto">{children}</div>`.'
      context_files:
        compact:
          - src/components/layout/RightPane.tsx
        medium:
          - src/components/layout/RightPane.tsx
          - src/hooks/useRightPaneContent.hook.tsx
        extended:
          - src/components/layout/RightPane.tsx
          - src/hooks/useRightPaneContent.hook.tsx
          - src/pages/DataDemo/components/DataDetailContent.tsx
  conclusion: |
    By executing this plan, we will have successfully decoupled the data detail view from the UI's pane structure. The `DataDemoPage` will correctly function as a standalone detail page, complete with proper routing and fullscreen support. The creation of a reusable `DataDetailContent` component improves maintainability and adheres to DRY principles.

    Most importantly, the architectural enhancement to the `RightPane` component resolves the persistent double scrollbar issue and establishes a robust pattern for integrating complex components with their own layouts into the AppShell. The user experience will be significantly improved, with smooth, predictable transitions between view states and a polished, professional feel.
  context_files:
    compact:
      - src/pages/DataDemo/index.tsx
      - src/features/dynamic-view/components/shared/DetailPanel.tsx
      - src/hooks/useRightPaneContent.hook.tsx
      - src/components/layout/RightPane.tsx
    medium:
      - src/pages/DataDemo/index.tsx
      - src/features/dynamic-view/components/shared/DetailPanel.tsx
      - src/hooks/useRightPaneContent.hook.tsx
      - src/components/layout/RightPane.tsx
      - src/pages/DataDemo/store/dataDemo.store.tsx
      - src/hooks/useAppViewManager.hook.ts
    extended:
      - src/pages/DataDemo/index.tsx
      - src/features/dynamic-view/components/shared/DetailPanel.tsx
      - src/hooks/useRightPaneContent.hook.tsx
      - src/components/layout/RightPane.tsx
      - src/pages/DataDemo/store/dataDemo.store.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/App.tsx
      - src/components/layout/MainContent.tsx
      - src/components/shared/PageLayout.tsx
```
