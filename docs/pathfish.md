Here's the master plan to make this codebase highly DRY. We're gonna slash the boilerplate, crush duplication, and ship a leaner, meaner, more maintainable app shell.

```yaml
plan:
  uuid: 'c8f7b1a0-3e5d-4f8a-9b1c-2d6f7e9b0a4e'
  status: 'todo'
  title: 'Refactor for DRYness: Consolidate UI and Logic'
  introduction: |
    Alright, we've got a solid app shell here, but it's got some serious copy-pasta issues, especially in the data display components. The goal of this refactor is to ruthlessly eliminate duplication, create reusable, atomic components, and centralize logic. We'll be hitting the data views, stats cards, and core app composition hard.

    The plan is four-pronged. First, we'll break down the monolithic data view components (`DataListView`, `DataCardView`, etc.) into a library of small, reusable parts. This is our biggest win for DRY. Second, we'll merge the two different implementations of "stat cards" into a single, flexible component. Third, we'll centralize some utility functions that are currently siloed. Finally, we'll clean up the main `App.tsx` by extracting its complex content-routing logic into a dedicated hook, adhering to the Single Responsibility Principle.

    When we're done, the codebase will be more modular, easier to maintain, and faster to build upon. No UI/UX regressions allowed. Let's ship it.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Atomize Data Display Components'
      reason: |
        The `DataListView`, `DataCardView`, `DataTableView`, and `DataDetailPanel` components are a hot mess of repeated JSX for rendering things like assignee info, metrics, progress bars, and status badges. It's a maintenance nightmare.

        We're going to create a set of small, focused components for each of these repeated UI blocks. This will nuke the duplication, ensure consistency across all data views, and make future updates a one-line change.
      steps:
        - uuid: 'b1c2d3e4-f5g6-7890-1234-567890abcdef'
          status: 'todo'
          name: '1. Create Shared Data Item Components'
          reason: |
            To begin, we need a place for these new atomic components to live. We'll create a new directory and populate it with components for each distinct, repeated piece of a `DataItem`.
          files:
            - src/pages/DataDemo/components/shared/DataItemParts.tsx # new file
          operations:
            - "Create a new file `src/pages/DataDemo/components/shared/DataItemParts.tsx`."
            - "In this file, create and export the following React components:"
            - "  - `AssigneeInfo({ assignee })`: Renders an `Avatar` with the assignee's name and email. Should accept `DataItem['assignee']`."
            - "  - `ItemMetrics({ metrics })`: Renders the `Eye`, `Heart`, and `Share` icons with their corresponding counts. Should accept `DataItem['metrics']`."
            - "  - `ItemProgressBar({ completion })`: Renders the progress bar UI. Should accept `completion` as a number."
            - "  - `ItemStatusBadge({ status })`: Renders a `Badge` with the correct color for the status, using `getStatusColor`. Should accept `DataItem['status']`."
            - "  - `ItemPriorityBadge({ priority })`: Renders a `Badge` with the correct color for the priority, using `getPriorityColor`. Should accept `DataItem['priority']`."
            - "  - `ItemTags({ tags })`: Renders a list of tags, handling truncation (e.g., showing the first 3 and a '+N' indicator)."
            - "  - `ItemDateInfo({ date, icon: Icon })`: A generic component to show a date with a leading icon (e.g., Calendar for updatedAt)."
        - uuid: 'c2d3e4f5-g6h7-8901-2345-67890abcdef'
          status: 'todo'
          name: '2. Refactor Data View Components'
          reason: |
            With our new atomic components in hand, it's time to rip out the duplicated code from the high-level view components and replace it with our new, clean abstractions.
          files:
            - src/pages/DataDemo/components/DataListView.tsx
            - src/pages/DataDemo/components/DataCardView.tsx
            - src/pages/DataDemo/components/DataTableView.tsx
            - src/pages/DataDemo/components/DataDetailPanel.tsx
          operations:
            - "In `DataListView.tsx`, `DataCardView.tsx`, `DataTableView.tsx`, and `DataDetailPanel.tsx`, import the new components from `DataItemParts.tsx`."
            - "Replace the JSX for assignee info with `<AssigneeInfo assignee={item.assignee} />`."
            - "Replace the JSX for metrics with `<ItemMetrics metrics={item.metrics} />`."
            - "Replace the JSX for the progress bar with `<ItemProgressBar completion={item.metrics.completion} />`."
            - "Replace the status `Badge` with `<ItemStatusBadge status={item.status} />`."
            - "Replace the priority `Badge` with `<ItemPriorityBadge priority={item.priority} />` in `DataListView.tsx` and `DataTableView.tsx`."
            - "In `DataDetailPanel.tsx`, replace the detailed metrics display with the new `ItemMetrics` component, adapting the layout as needed."
            - "Ensure all views now use the shared components, drastically reducing the lines of code in each file."
      context_files:
        compact:
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/pages/DataDemo/utils.ts
          - src/pages/DataDemo/types.ts
        medium:
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/pages/DataDemo/utils.ts
          - src/pages/DataDemo/types.ts
          - src/components/ui/badge.tsx
          - src/components/ui/avatar.tsx
        extended:
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/pages/DataDemo/utils.ts
          - src/pages/DataDemo/types.ts
          - src/components/ui/badge.tsx
          - src/components/ui/avatar.tsx
          - src/lib/utils.ts
    - uuid: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6qrstuv'
      status: 'todo'
      name: 'Part 2: Consolidate Stat Cards'
      reason: |
        We have two different stat card implementations: a simple one in `Dashboard/index.tsx` and a more complex one with a chart in `DataDemo/components/StatChartCard.tsx`. This is redundant. We will create a single, powerful `StatCard` component that can handle both cases.
      steps:
        - uuid: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6qrstuvw'
          status: 'todo'
          name: '1. Create a Unified StatCard Component'
          reason: |
            We'll build a new `StatCard` component in the shared UI directory that can conditionally render a chart, making it versatile for both the dashboard and data demo pages.
          files:
            - src/components/shared/StatCard.tsx # new file
            - src/pages/DataDemo/components/StatChartCard.tsx
          operations:
            - "Create a new file `src/components/shared/StatCard.tsx`."
            - "Merge the logic and JSX from `StatChartCard.tsx` and the simple stat card from `Dashboard/index.tsx` into this new component."
            - "The new `StatCard` component's props should include an optional `chartData` array. If `chartData` is provided, the component will render the line chart. Otherwise, it will render the simpler version."
            - "Move the GSAP animation logic for the chart into the new `StatCard` component."
        - uuid: 'f6g7h8i9-j0k1-l2m3-n4o5-p6qrstuvwx'
          status: 'todo'
          name: '2. Refactor Pages to Use the New StatCard'
          reason: |
            Now we'll replace the old implementations with our new unified component and delete the redundant file.
          files:
            - src/pages/Dashboard/index.tsx
            - src/pages/DataDemo/index.tsx
            - src/pages/DataDemo/components/StatChartCard.tsx
          operations:
            - "In `Dashboard/index.tsx`, replace the `Card` components used for stats with the new `<StatCard />`."
            - "In `DataDemo/index.tsx`, replace `<StatChartCard />` with the new `<StatCard />`, passing the `chartData` prop."
            - "Delete the now-redundant file `src/pages/DataDemo/components/StatChartCard.tsx`."
      context_files:
        compact:
          - src/pages/Dashboard/index.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/components/StatChartCard.tsx
          - src/components/ui/card.tsx
        medium:
          - src/pages/Dashboard/index.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/components/StatChartCard.tsx
          - src/components/ui/card.tsx
          - src/lib/utils.ts
        extended:
          - src/pages/Dashboard/index.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/components/StatChartCard.tsx
          - src/components/ui/card.tsx
          - src/lib/utils.ts
          - src/pages/DataDemo/types.ts
    - uuid: 'g7h8i9j0-k1l2-m3n4-o5p6-qrstuvwxyz'
      status: 'todo'
      name: 'Part 3: Centralize UI Utilities'
      reason: |
        The `getStatusColor` and `getPriorityColor` functions are utility functions that define UI logic. They are currently siloed inside `DataDemo/utils.ts`, but could be useful elsewhere. They belong in the global `lib/utils.ts`.
      steps:
        - uuid: 'h8i9j0k1-l2m3-n4o5-p6q7-rstuvwxyz1'
          status: 'todo'
          name: '1. Relocate Color Utility Functions'
          reason: |
            Move the color utility functions to a central location to promote reusability across the entire application.
          files:
            - src/pages/DataDemo/utils.ts
            - src/lib/utils.ts
            - src/pages/DataDemo/components/DataListView.tsx
            - src/pages/DataDemo/components/DataCardView.tsx
            - src/pages/DataDemo/components/DataTableView.tsx
            - src/pages/DataDemo/components/DataDetailPanel.tsx
          operations:
            - "Cut the `getStatusColor` and `getPriorityColor` functions from `src/pages/DataDemo/utils.ts`."
            - "Paste these functions into `src/lib/utils.ts` and export them."
            - "Update all files that were importing these functions (like the Data View components and the new `DataItemParts.tsx`) to import them from `@/lib/utils` instead."
            - "Delete the file `src/pages/DataDemo/utils.ts` as it is now empty."
      context_files:
        compact:
          - src/pages/DataDemo/utils.ts
          - src/lib/utils.ts
        medium:
          - src/pages/DataDemo/utils.ts
          - src/lib/utils.ts
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
        extended:
          - src/pages/DataDemo/utils.ts
          - src/lib/utils.ts
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
    - uuid: 'i9j0k1l2-m3n4-o5p6-q7r8-stuvwxyz12'
      status: 'todo'
      name: 'Part 4: Decouple App Composition Logic'
      reason: |
        The `ComposedApp` component in `App.tsx` is overloaded. It contains complex logic for mapping routes and URL params to the content displayed in the main and right panes. This violates the Single Responsibility Principle and makes the component hard to read and maintain.

        We'll extract this logic into a dedicated custom hook, `usePageContent`. This will make `ComposedApp` a pure layout component, and the logic for what to display will be centralized and easier to manage.
      steps:
        - uuid: 'j0k1l2m3-n4o5-p6q7-r8s9-tuvwxyz123'
          status: 'todo'
          name: '1. Create usePageContent Hook'
          reason: |
            Create a hook to encapsulate all the logic for determining what content and headers to render based on the current URL.
          files:
            - src/hooks/usePageContent.hook.ts # new file
            - src/App.tsx
          operations:
            - "Create a new file `src/hooks/usePageContent.hook.ts`."
            - "Move the `contentMap` object from `App.tsx` into this new hook."
            - "Move all logic for determining `rightPaneContent`, `currentContent`, and `rightPaneHeader` from `ComposedApp` into the `usePageContent` hook."
            - "The hook should use `useLocation`, `useParams`, `useNavigate`, and `useSearchParams` internally."
            - "The hook should return an object containing `mainContentComponent`, `rightPaneComponent`, `rightPaneHeaderComponent`, and any necessary callbacks like `handleCloseSidePane`."
        - uuid: 'k1l2m3n4-o5p6-q7r8-s9t0-uvwxyz1234'
          status: 'todo'
          name: '2. Simplify ComposedApp in App.tsx'
          reason: |
            Refactor `ComposedApp` to be a declarative layout component that gets its state and content from the new hook.
          files:
            - src/App.tsx
            - src/hooks/usePageContent.hook.ts
          operations:
            - "In `App.tsx`, import and call the `usePageContent` hook at the top of the `ComposedApp` component."
            - "Remove all the logic that was moved to the hook."
            - "Use the returned values from the hook to render the content in the `RightPane` and its header."
            - "The `<Outlet />` will continue to render the main page content as determined by the router."
            - "Ensure the `App.tsx` file is significantly smaller and more focused on the composition of the `AppShell`."
      context_files:
        compact:
          - src/App.tsx
          - src/context/AppShellContext.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
        medium:
          - src/App.tsx
          - src/context/AppShellContext.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/pages/Settings/index.tsx
          - src/pages/Notifications/index.tsx
        extended:
          - src/App.tsx
          - src/context/AppShellContext.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/pages/Settings/index.tsx
          - src/pages/Notifications/index.tsx
          - src/pages/ToasterDemo/index.tsx
          - src/features/settings/SettingsContent.tsx
  conclusion: |
    By executing this plan, we'll have fundamentally improved the architecture of the application. The codebase will be significantly more DRY, making it easier to reason about, maintain, and extend.

    Future feature development will be faster, as developers can compose UIs from our new atomic components. Consistency across the application will be enforced by design. This refactor is a major investment in the long-term health and velocity of the project.
  context_files:
    compact:
      - src/pages/DataDemo/components/DataListView.tsx
      - src/pages/DataDemo/components/DataCardView.tsx
      - src/pages/DataDemo/components/StatChartCard.tsx
      - src/pages/Dashboard/index.tsx
      - src/App.tsx
    medium:
      - src/pages/DataDemo/components/DataListView.tsx
      - src/pages/DataDemo/components/DataCardView.tsx
      - src/pages/DataDemo/components/DataTableView.tsx
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/pages/DataDemo/components/StatChartCard.tsx
      - src/pages/Dashboard/index.tsx
      - src/App.tsx
      - src/lib/utils.ts
    extended:
      - src/pages/DataDemo/components/DataListView.tsx
      - src/pages/DataDemo/components/DataCardView.tsx
      - src/pages/DataDemo/components/DataTableView.tsx
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/pages/DataDemo/components/StatChartCard.tsx
      - src/pages/DataDemo/utils.ts
      - src/pages/Dashboard/index.tsx
      - src/App.tsx
      - src/lib/utils.ts
      - src/context/AppShellContext.tsx
      - src/pages/DataDemo/types.ts
```
