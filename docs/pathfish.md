Alright, let's architect this refactor. The goal is to bolt on a slick, tab-based grouping feature to the `DataDemoPage`. We're talking GSAP-powered UI, cohesive UX, and making it work across all existing data views. This isn't just a feature add; it's an upgrade to the entire data exploration experience.

We'll start by forging the new `AnimatedTabs` component the user provided. Then, we'll inject the core grouping logic into the `DataDemoPage`, refactoring its main data processing hook to handle the new dimension of grouping. Finally, we'll pipe this new grouped data structure into the view components, making sure each one—especially the tricky table view—renders the groups beautifully with staggered animations.

This is a full-stack UI refactor. We'll touch state management, data processing, component architecture, and animations. The result will be a far more powerful and "amazing" data showcase. Let's get to it.

```yaml
plan:
  uuid: 'e8a3f9c1-4b7d-4e2f-8a9b-5c0d1e2f3g4h'
  status: 'todo'
  title: 'Implement Data Grouping Feature in Data Demo Page'
  introduction: |
    This master plan outlines the refactoring required to introduce a sophisticated data grouping feature into the `DataDemoPage`. The objective is to allow users to group data by various criteria like status, priority, or category, enhancing data analysis and visualization capabilities.

    The core of this effort involves creating a new, highly-animated `AnimatedTabs` component for group selection, inspired by the user's provided code. We will then refactor the central data processing logic in `DataDemoPage` to handle the transformation of a flat list into a grouped data structure. Finally, we'll update the rendering logic for all views (list, cards, grid, and table) to present this grouped data in an intuitive and visually appealing manner, complete with `gsap`-powered animations for a fluid user experience. This will significantly elevate the interactivity and utility of the data showcase.
  parts:
    - uuid: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d'
      status: 'todo'
      name: 'Part 1: Forge the AnimatedTabs Component'
      reason: |
        Before we can implement the grouping logic, we need the UI component that will control it. This part focuses on creating a new, reusable `AnimatedTabs` component based on the user-provided snippet, ensuring it's well-integrated with our project structure and tooling.
      steps:
        - uuid: 'b1c2d3e4-f5a6-b7c8-d9e0-a1b2c3d4e5f6'
          status: 'todo'
          name: '1. Create and Implement AnimatedTabs Component'
          reason: |
            To create the foundation for our grouping UI, we will first implement the tab component provided by the user. This component will be responsible for the visual selection of the grouping criteria.
          files:
            - 'src/components/ui/animated-tabs.tsx'
          operations:
            - 'Create a new file at `src/components/ui/animated-tabs.tsx`.'
            - 'Paste the user-provided code into the new file.'
            - 'Add necessary imports: `React`, `useState`, `useRef`, `useEffect`, `cn`, and `gsap`.'
            - 'Rename the component to `AnimatedTabs` for clarity and consistency.'
            - 'Ensure the component correctly accepts and uses `tabs`, `activeTab`, and `onTabChange` props for controlled usage.'
        - uuid: 'c2d3e4f5-a6b7-c8d9-e0f1-b2c3d4e5f6a7'
          status: 'todo'
          name: '2. Export the New Component'
          reason: |
            To make the new `AnimatedTabs` component available throughout the application and for potential library consumers, it must be exported from the main entry point.
          files:
            - 'src/index.ts'
          operations:
            - "Add a new export line to `src/index.ts`: `export { AnimatedTabs } from './components/ui/animated-tabs';`"
      context_files:
        compact:
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/index.ts'
        medium:
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/index.ts'
          - 'src/lib/utils.ts'
        extended:
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/index.ts'
          - 'src/lib/utils.ts'
          - 'src/pages/DataDemo/index.tsx'

    - uuid: 'd4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9'
      status: 'todo'
      name: 'Part 2: Integrate Grouping Logic into DataDemoPage'
      reason: |
        This part retrofits the `DataDemoPage` to support grouping. We'll introduce new state for managing the selected group, render the `AnimatedTabs` UI, and overhaul the core data processing hook to transform the flat data array into a grouped structure.
      steps:
        - uuid: 'e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0'
          status: 'todo'
          name: '1. Add Grouping State and UI to DataDemoPage'
          reason: |
            We need to add the state management for the grouping feature and render the `AnimatedTabs` component to allow users to interact with it.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - "Import `AnimatedTabs` from `@/components/ui/animated-tabs`."
            - "Add a new state for the grouping criteria: `const [groupBy, setGroupBy] = useState<string>('none');`."
            - "Define the grouping options: `const groupOptions = [{ id: 'none', label: 'None' }, { id: 'status', label: 'Status' }, { id: 'priority', label: 'Priority' }, { id: 'category', label: 'Category' }];`"
            - 'In the main JSX, render the `<AnimatedTabs />` component above the `<DataToolbar />`. Pass the `groupOptions` as `tabs`, `groupBy` as `activeTab`, and `setGroupBy` as `onTabChange`.'
        - uuid: 'f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1'
          status: 'todo'
          name: '2. Refactor `processedData` Hook for Grouping'
          reason: |
            The main data processing logic must be updated to handle the new `groupBy` state. It will now be responsible for either returning a sorted flat list or a structured object of grouped items.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - "Update the `processedData` `useMemo` hook to depend on `groupBy`."
            - 'Inside the hook, after all filtering and sorting is done, add a condition.'
            - "If `groupBy === 'none'`, return the flat `filteredItems` array as is."
            - "If `groupBy` is set (e.g., 'status'), use `reduce` to group the `filteredItems` into a `Record<string, DataItem[]>`. The key should be the value of the property specified by `groupBy`."
            - 'This hook will now return data of type `DataItem[] | Record<string, DataItem[]>`.'
      context_files:
        compact:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/components/ui/animated-tabs.tsx'
        medium:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/pages/DataDemo/types.ts'
        extended:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/data/mockData.ts'

    - uuid: 'a9b8c7d6-e5f4-a3b2-c1d0-e9f8a7b6c5d4'
      status: 'todo'
      name: 'Part 3: Render and Animate Grouped Views'
      reason: |
        With the data now grouped, we need to update the UI to render it correctly. This involves creating a new animated wrapper for groups and modifying the rendering logic for all views, with special attention given to the `DataTableView` to ensure it displays groups correctly.
      steps:
        - uuid: 'b0c1d2e3-f4a5-b6c7-d8e9-f0a1b2c3d4e5'
          status: 'todo'
          name: '1. Create Animated GroupWrapper and Update Render Logic'
          reason: |
            To provide a cohesive UX, we need to animate the groups as they appear and render them with clear headers. A dedicated wrapper component will handle animations, and the main page will loop through the grouped data.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - "Inside `DataDemoPage.tsx`, create a new local component `GroupWrapper({ title, children, count })`."
            - "Use `gsap` in the `GroupWrapper`'s `useEffect` to animate its entrance (e.g., `gsap.fromTo(ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })`)."
            - "Style a group header within `GroupWrapper` that displays the group `title` and item `count`."
            - "In the main return statement of `DataDemoPage`, check if `processedData` is an object (i.e., grouped)."
            - "If grouped, map over `Object.entries(processedData)`. For each `[groupName, items]`, render a `<GroupWrapper>`."
            - "Inside the `GroupWrapper`, render the appropriate view (`DataListView`, `DataCardView`, or `DataGridView`) passing the `items` array to it. This works for all views except the table."
            - "If not grouped, render the view component once with the full `processedData` array as before."
        - uuid: 'c1d2e3f4-a5b6-c7d8-e9f0-a1b2c3d4e5f6'
          status: 'todo'
          name: '2. Refactor `DataTableView` for Grouped Data'
          reason: |
            The table view cannot simply be repeated for each group; it requires a more integrated approach. We will modify it to render group headers as distinct rows within a single table structure.
          files:
            - 'src/pages/DataDemo/components/DataTableView.tsx'
            - 'src/pages/DataDemo/types.ts'
          operations:
            - "In `types.ts`, update `ViewProps` so the `data` prop can be `DataItem[] | Record<string, DataItem[]>`. Also, pass `groupBy?: string`."
            - "In `DataTableView.tsx`, update the component's props to accept the new data structure."
            - 'Inside the `DataTableView` component, check if `data` is an array or an object.'
            - "If it's an object, map over its entries to render multiple `<tbody>` elements."
            - "For each group, render a `<tbody>`. The first row (`<tr>`) inside the `<tbody>` should be a header for the group (e.g., `<td colSpan={8}>...{groupName}</td>`)."
            - 'Following the header row, map over the items in that group and render their respective `<tr>` elements as before.'
            - "If `data` is a flat array, render a single `<tbody>` with all item rows, maintaining existing functionality."
        - uuid: 'd2e3f4a5-b6c7-d8e9-f0a1-b2c3d4e5f6a7'
          status: 'todo'
          name: '3. Pass Grouped Data to `DataTableView`'
          reason: |
            After refactoring `DataTableView` to accept grouped data, we need to update the parent component (`DataDemoPage`) to pass the correct data structure to it.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - "In `DataDemoPage.tsx`'s `renderView` function, locate the `case 'table'`."
            - 'Instead of looping like the other views, pass the entire `processedData` object (or array) directly to `<DataTableView />`.'
            - "This allows `DataTableView` to handle its own internal group rendering logic."
      context_files:
        compact:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
          - 'src/pages/DataDemo/types.ts'
        medium:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
        extended:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/data/mockData.ts'
  conclusion: |
    Upon completion of this refactoring, the `DataDemoPage` will be significantly more powerful and interactive. Users will be able to fluidly switch between ungrouped and grouped views using a sleek, animated tab interface.

    The new architecture cleanly separates the grouping UI, data processing, and view rendering, making future enhancements easier to implement. The user experience will be greatly improved with clear visual grouping and smooth `gsap` animations, fulfilling the request for an "amazing" and "cohesive" feature.
  context_files:
    compact:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
      - 'src/pages/DataDemo/types.ts'
      - 'src/components/ui/animated-tabs.tsx'
    medium:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
      - 'src/pages/DataDemo/types.ts'
      - 'src/components/ui/animated-tabs.tsx'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
    extended:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
      - 'src/pages/DataDemo/types.ts'
      - 'src/components/ui/animated-tabs.tsx'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/DataDemo/data/mockData.ts'
      - 'src/index.ts'
```
