Ah, the classic "it works, but not everywhere" scenario. The new `AnimatedTabs` is slick, but the `DataDemo` page is still doing a full refresh because it's tearing down and rebuilding its content on every tab switch. We need to teach it to keep its children alive and just slide them around.

The root of the issue is that `DataDemoContent` calculates a single filtered list (`dataToRender`) and passes it to a single instance of `DataListView` (or `CardView`, etc.). When you click a tab, that hook returns a new list, and the whole view component re-renders from scratch, triggering its stagger animation instead of a slide.

To fix this, we need to restructure `DataDemoContent` to render *all* the panes at once and let `AnimatedTabs` handle the sliding, just like we did for `MessagingContent`. This will involve making the view components (`DataListView`, `DataCardView`, `DataTableView`) "dumber" by having them accept data via props instead of fetching it themselves with hooks. This makes them more reusable and fixes our animation problem.

Here's the master plan to get those smooth slides working in the Data Demo.

```yaml
plan:
  uuid: 'a4b1c2d3-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
  status: 'todo'
  title: 'Implement Sliding Content Panes in DataDemo Grouped Views'
  introduction: |
    Following the successful enhancement of `AnimatedTabs`, the DataDemo page's "Group by" feature still exhibits a full content refresh on tab switching instead of the desired sliding animation. This is because the view components (`DataListView`, etc.) are being re-rendered with new data, rather than being persistent panes managed by `AnimatedTabs`.

    This plan will refactor the DataDemo page to fully adopt the new sliding pane pattern. We will modify the view components to be "pure" components that receive data via props, and then restructure the main `DataDemoContent` component to render all tab panes simultaneously as children of `AnimatedTabs`. This will enable the smooth GSAP-powered sliding animation and align the DataDemo page with the new, improved UX pattern.
  parts:
    - uuid: 'f1e2d3c4-b5a6-4987-8d9e-1f2a3b4c5d6e'
      status: 'todo'
      name: 'Part 1: Refactor Data View Components to Accept Data Props'
      reason: |
        To render all panes at once, the view components (`DataListView`, `DataCardView`, `DataTableView`) can no longer fetch their own filtered data using the `useDataToRender` hook. They need to be converted into purer components that simply render the data passed to them via props. This makes them more flexible and is a prerequisite for the sliding pane implementation.
      steps:
        - uuid: 'e2d3c4b5-a6f7-4876-9e8d-2f3a4b5c6d7f'
          status: 'todo'
          name: '1. Modify `DataListView` to accept a `data` prop'
          reason: |
            Centralize data fetching logic in the parent component.
          files:
            - 'src/pages/DataDemo/components/DataListView.tsx'
          operations:
            - "Update the component signature to accept `({ data }: { data: DataItem[] })`."
            - "Remove the `useDataToRender` and `useAppViewManager` hooks for `groupBy` and `activeGroupTab`."
            - 'Change `const items = Array.isArray(data) ? data : [];` to `const items = data;`.'
        - uuid: 'd3c4b5a6-f7e8-4765-8d9c-3f4a5b6c7d8e'
          status: 'todo'
          name: '2. Modify `DataCardView` to accept a `data` prop'
          reason: |
            Ensure consistency and prepare the component for use inside sliding panes.
          files:
            - 'src/pages/DataDemo/components/DataCardView.tsx'
          operations:
            - "Update the component signature to accept `({ isGrid = false, data }: { isGrid?: boolean, data: DataItem[] })`."
            - "Remove the `useDataToRender` and `useAppViewManager` hooks for `groupBy` and `activeGroupTab`."
            - 'Change `const items = Array.isArray(data) ? data : [];` to `const items = data;`.'
        - uuid: 'c4b5a6f7-e8d9-4654-9c8b-4f5a6b7c8d9f'
          status: 'todo'
          name: '3. Modify `DataTableView` to accept a `data` prop'
          reason: |
            Complete the refactoring of all view components to the new data-prop pattern.
          files:
            - 'src/pages/DataDemo/components/DataTableView.tsx'
          operations:
            - "Update the component signature to accept `({ data }: { data: DataItem[] })`."
            - "Remove the `useDataToRender` and `useAppViewManager` hooks for `groupBy` and `activeGroupTab`."
            - 'Update the `useMemo` for `groupedData` to use the `data` prop directly.'
            - 'Update the main render return to use `data.map` when not grouped, instead of the `useDataToRender` hook result.'
      context_files:
        compact:
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
        medium:
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
          - 'src/pages/DataDemo/index.tsx'
        extended:
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'
    - uuid: 'b6a5f4e3-d2c1-4b3a-a987-6e5f4d3c2b1a'
      status: 'todo'
      name: 'Part 2: Re-architect `DataDemoContent` to Use Sliding Panes'
      reason: |
        With the view components ready, we can now restructure the main `DataDemoContent` component. It will render the `AnimatedTabs` with all content panes as children for grouped views, enabling the sliding animation, while preserving the existing logic for the non-grouped view to maintain infinite scroll functionality.
      steps:
        - uuid: 'a5f4e3d2-c1b0-4a29-b876-5e4f3d2c1b09'
          status: 'todo'
          name: '1. Update `DataDemoContent` to handle grouped and non-grouped views differently'
          reason: |
            The component needs to manage two rendering strategies: one for the standard list with infinite scroll, and a new one for the grouped view with sliding panes.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - 'Remove the `useDataToRender` hook call. We will get data differently.'
            - 'Get the full list of items directly from the store: `const allItems = useDataDemoStore(state => state.items);`'
            - 'Inside the main content `div` (after `isInitialLoading` is false), create a conditional check: `if (groupBy !== "none" && groupTabs.length > 1)`.'
            - 'In the `if` block, render the `<AnimatedTabs>` component configured for content panes.'
            - 'In the `else` block, render the view components as before (for the non-grouped view).'
        - uuid: 'f4e3d2c1-b0a9-4918-a765-4d3c2b1a09f8'
          status: 'todo'
          name: '2. Implement the `AnimatedTabs` for grouped view'
          reason: |
            This is where we construct the sliding panes by passing each group's filtered data to its own view component instance.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - "Inside the `if (groupBy !== 'none')` block, render `<AnimatedTabs>`."
            - "Pass the required props: `tabs={groupTabs}`, `activeTab={activeGroupTab}`, `onTabChange={setActiveGroupTab}`."
            - 'As children of `<AnimatedTabs>`, map over `groupTabs`: `{groupTabs.map(tab => ...)}`.'
            - "Inside the map, filter `allItems` based on `tab.id` to get `dataForPane`."
            - 'Create a helper function or switch statement `renderView(data)` that returns the correct view component (`DataListView`, `DataCardView`, etc.) based on the current `viewMode`, passing the provided `data` as a prop.'
            - "For each tab in the map, return a container `div` with a unique `key={tab.id}` containing the result of `renderView(dataForPane)`."
        - uuid: 'e3d2c1b0-a9f8-4807-b654-3c2b1a09f8e7'
          status: 'todo'
          name: '3. Update the non-grouped view logic'
          reason: |
            Since we removed `useDataToRender` and refactored the view components, we need to ensure the default, non-grouped view still receives its data correctly.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - 'In the `else` block (for `groupBy === "none"`), render the view components directly.'
            - "Pass the `allItems` array from the store directly to the `data` prop of `DataListView`, `DataCardView`, and `DataTableView`."
      context_files:
        compact:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
        medium:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
        extended:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
          - 'src/hooks/useAppViewManager.hook.ts'
  conclusion: |
    By executing this plan, the DataDemo page will be significantly improved. The "Group by" tabs will now feature the same fluid, sliding content animations as the rest of the application, creating a consistent and polished user experience.

    This refactor also improves the codebase by promoting a cleaner separation of concerns. Data-fetching and filtering logic will be centralized in the main page component, while the view components become simpler, reusable, and purely presentational. This makes the code easier to understand, maintain, and test.
  context_files:
    compact:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/components/ui/animated-tabs.tsx'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
    medium:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/components/ui/animated-tabs.tsx'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
      - 'src/pages/DataDemo/store/dataDemo.store.tsx'
    extended:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/components/ui/animated-tabs.tsx'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
      - 'src/pages/DataDemo/store/dataDemo.store.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'
      - 'src/pages/Messaging/components/MessagingContent.tsx'
```
