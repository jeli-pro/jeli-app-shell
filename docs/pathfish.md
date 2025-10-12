Ah, a classic case of UI entropy. Components drifting apart, logic getting copy-pasted all over the place. We're gonna tighten this ship up, nuke the boilerplate, and ship a layout that actually makes sense.

Right now, the `DataDemoPage` feels like a garage sale—stuff is just kinda... there. The view switcher is floating in the middle, the results count is hiding at the bottom, and we've got color-logic spaghetti smeared across four different files. Not on my watch.

The plan is simple but effective. First, we'll refactor the blatant code duplication. We'll extract all that color-picking logic and the "empty state" view into their own modules. DRY principle, people. Then, the main event: we'll forge a proper, cohesive header for the `DataDemoPage`. Title, stats, and view controls, all lined up in one clean, responsive block. No more disconnected UI elements. We're turning this disjointed page into a unified, professional-looking dashboard. Let's get it done.

```yaml
plan:
  uuid: 'c8a2b1f3-9d4e-4f6a-8b1c-7e3d0f5a9b21'
  status: 'todo'
  title: 'Refactor DataDemo UI for Cohesion and Cleanliness'
  introduction: |
    This plan aims to refactor the `DataDemoPage` to create a more cohesive and professional user interface. The current implementation suffers from scattered UI elements and significant code duplication across its view components.

    Our strategy is twofold. First, we'll apply the DRY (Don't Repeat Yourself) principle by extracting duplicated logic and JSX into shared modules. This includes centralizing the status/priority color helpers and creating a reusable `EmptyState` component. This will clean up the codebase and make future maintenance a breeze.

    Second, we'll overhaul the layout of the `DataDemoPage` itself. We will construct a unified header section that consolidates the page title, results count, and view mode selector into a single, responsive block. This will replace the current disjointed layout, providing users with a clear, organized, and intuitive control area right above the data content.
  parts:
    - uuid: 'a1b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d'
      status: 'todo'
      name: 'Part 1: Nuke Boilerplate and Centralize Shared Logic'
      reason: |
        Currently, multiple view components (`DataCardView`, `DataListView`, etc.) contain duplicated helper functions for determining status/priority colors and identical JSX for the "empty state". This violates the DRY principle, making the code harder to maintain and prone to inconsistencies. This part will consolidate that shared code.
      steps:
        - uuid: 'f1e2d3c4-b5a6-9878-6f5e-4d3c2b1a0987'
          status: 'todo'
          name: '1. Extract Color Utility Functions'
          reason: |
            The `getStatusColor` and `getPriorityColor` functions are copy-pasted across four different components. They should live in a single utility file to be imported where needed.
          files:
            - 'src/pages/DataDemo/utils.ts' # new file
            - 'src/pages/DataDemo/components/DataCardView.tsx'
            - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
            - 'src/pages/DataDemo/components/DataListView.tsx'
            - 'src/pages/DataDemo/components/DataTableView.tsx'
          operations:
            - 'Create a new file at `src/pages/DataDemo/utils.ts`.'
            - 'Cut the `getStatusColor` and `getPriorityColor` functions from `DataCardView.tsx` and paste them into `utils.ts`.'
            - 'Export both functions from `utils.ts`.'
            - 'In `DataCardView.tsx`, `DataDetailPanel.tsx`, `DataListView.tsx`, and `DataTableView.tsx`, remove the local definitions of these functions.'
            - 'Import `{ getStatusColor, getPriorityColor }` from `../utils` in `DataCardView.tsx`, `DataListView.tsx`, and `DataTableView.tsx`.'
            - 'Import `{ getStatusColor, getPriorityColor }` from `../utils` in `DataDetailPanel.tsx` (adjust path if needed, should be `../utils`).'
        - uuid: 'a0b9c8d7-e6f5-a4b3-c2d1-e0f9a8b7c6d5'
          status: 'todo'
          name: '2. Create a Shared EmptyState Component'
          reason: |
            The "No items found" view is duplicated in `DataCardView`, `DataListView`, and `DataTableView`. This should be a reusable component.
          files:
            - 'src/pages/DataDemo/components/EmptyState.tsx' # new file
            - 'src/pages/DataDemo/components/DataCardView.tsx'
            - 'src/pages/DataDemo/components/DataListView.tsx'
            - 'src/pages/DataDemo/components/DataTableView.tsx'
          operations:
            - 'Create a new file at `src/pages/DataDemo/components/EmptyState.tsx`.'
            - 'Copy the "No items found" JSX block from `DataCardView.tsx` and create a React component `EmptyState` in the new file.'
            - 'Import `Eye` from `lucide-react` in `EmptyState.tsx`.'
            - 'In `DataCardView.tsx`, `DataListView.tsx`, and `DataTableView.tsx`, replace the entire "No items found" `div` with `<EmptyState />` and import the new component.'
      context_files:
        compact:
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
        medium:
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
          - 'src/pages/DataDemo/types.ts'
        extended:
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/index.tsx'
    - uuid: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e'
      status: 'todo'
      name: 'Part 2: Forge a Cohesive Page Header'
      reason: |
        The `DataDemoPage` layout is fragmented. The view controls, page context (like item count), and title are not grouped together, leading to a poor user experience. This part will restructure the page to create a unified and responsive header.
      steps:
        - uuid: 'c3d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e7f8'
          status: 'todo'
          name: '1. Clean Up Extraneous PageLayout Props'
          reason: |
            The `<PageLayout>` component in `DataDemoPage` is being called with several props (`title`, `subtitle`, `rightContent`, etc.) that are not defined in the actual `PageLayout.tsx` component. This is dead code and should be removed.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - 'In the `DataDemoPage` component, remove the following props from the `<PageLayout>` element: `title`, `subtitle`, `rightContent`, `searchValue`, `onSearchChange`, `searchPlaceholder`.'
        - uuid: 'd4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9'
          status: 'todo'
          name: '2. Implement the New Unified Header Layout'
          reason: |
            To improve cohesion, the page title, results count, and view mode selector will be grouped into a single header element at the top of the content area.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - "Inside the `<PageLayout>` component, replace the direct child `div`'s `space-y-6` with `space-y-8` for better separation."
            - 'Create a new header `div` above the `DataViewModeSelector` wrapper.'
            - 'Give the new header `div` the following classes: `className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"`.'
            - 'Inside this header, create a `div` for the text content on the left.'
            - 'Add `<h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>` inside the text `div`.'
            - 'Add `<p className="text-muted-foreground">Showing {filteredData.length} of {mockDataItems.length} items</p>` below the `h1`.'
            - 'Move the `<DataViewModeSelector ... />` component into the right side of the main header `div`.'
            - 'Remove the now-empty `<div className="flex justify-center">` that used to wrap the selector.'
            - 'Remove the `<div className="text-center text-sm text-muted-foreground">` block from the bottom of the page that shows the results count.'
      context_files:
        compact:
          - 'src/pages/DataDemo/index.tsx'
        medium:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/components/shared/PageLayout.tsx'
        extended:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/components/shared/PageLayout.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
  conclusion: |
    Upon completion, this refactor will yield significant improvements. The codebase will be cleaner, more maintainable, and less prone to bugs thanks to the removal of duplicated logic.

    Most importantly, the user experience on the `DataDemoPage` will be markedly improved. The new, cohesive header will provide a clear and organized control center for the user, making the interface feel more intuitive and professional. This lays a stronger foundation for any future features to be added to this page.
  context_files:
    compact:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
    medium:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
      - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
      - 'src/components/shared/PageLayout.tsx'
    extended:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
      - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
      - 'src/components/shared/PageLayout.tsx'
      - 'src/pages/DataDemo/types.ts'
```
