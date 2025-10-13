Here's the master plan, architect.

This thing's got potential, but right now it's a fixed-width dinosaur in a responsive world. When you cram it into a side pane, it just breaks. We're going to rebuild it, stronger, faster, and way more fluid.

We'll start with the biggest offender: the data table. A horizontally scrolling table is a cop-out; we can do better, but for now, we'll make it at least usable. Then, we'll tune the card grids. The current breakpoints are wishful thinking for a side-pane context. We'll make them stack sanely. The detail panel's getting a similar treatment—its guts need to be responsive too. Finally, we'll sync up the loading skeletons so they don't lie to the user about the layout that's coming.

When we're done, this page will look like it was *born* to be in a side pane. It'll be a proper chameleon, adapting to any container you throw it in. Let's get to it.

```yaml
plan:
  uuid: '3a1b9c2f-8d7e-4a6f-9b1c-5d0e3a8b4f6c'
  status: 'todo'
  title: 'Refactor Data Demo Page for Full Responsiveness'
  introduction: |
    The Data Demo page is a key feature but currently lacks the necessary responsiveness to function effectively within the App Shell's dynamic view modes, such as the side pane or split view. The components are designed for full-width screens and do not adapt gracefully to constrained viewports, leading to a degraded user experience with cramped layouts and broken elements.

    This refactoring plan aims to overhaul the Data Demo components, injecting robust, mobile-first responsiveness. We will primarily use Tailwind CSS's responsive utility classes to ensure that layouts, grids, and components adapt fluidly to any container width. The goal is to create a seamless and polished experience whether the user is viewing the page full-screen, in a narrow side pane, or on a smaller device.

    The strategy involves a targeted approach, addressing the most problematic components first: the data table, the card grids, and the detail panel. We will also update the corresponding loading skeletons to prevent layout shifts and provide an accurate representation of the content being loaded. By the end of this refactor, the Data Demo page will be a prime example of a flexible and adaptable UI.
  parts:
    - uuid: 'c1d0e9f3-4a8b-4b2e-9d6c-1e8a0f7c5d3b'
      status: 'todo'
      name: 'Part 1: Enhance Data Table Responsiveness'
      reason: |
        The `DataTableView` is the least responsive component. In narrow viewports like a side pane, its fixed-column layout causes horizontal overflow that breaks the UI. While it has an overflow wrapper, the presentation can be significantly improved by ensuring columns have appropriate minimum widths and don't wrap content in an unreadable way.
      steps:
        - uuid: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0'
          status: 'todo'
          name: '1. Add Minimum Widths and Prevent Wrapping in Table Cells'
          reason: |
            To improve readability when horizontal scrolling is necessary, we need to prevent headers and key content from wrapping awkwardly. Setting minimum widths ensures columns maintain a usable size.
          files:
            - src/pages/DataDemo/components/DataTableView.tsx
          operations:
            - "In `DataTableView.tsx`, add `whitespace-nowrap` to all `<th>` button elements to prevent header text from breaking into multiple lines."
            - "Apply a `min-w-[150px]` class to the 'Project' column's `<th>` and `<td>` to give it adequate space."
            - "Apply a `min-w-[200px]` class to the 'Assignee' and 'Engagement' columns' `<th>` and `<td>` as they contain multiple elements."
            - "Apply a `min-w-[120px]` class to the remaining columns ('Status', 'Priority', 'Progress', 'Last Updated') to ensure consistency."
      context_files:
        compact:
          - src/pages/DataDemo/components/DataTableView.tsx
        medium:
          - src/pages/DataDemo/components/DataTableView.tsx
          - src/pages/DataDemo/index.tsx
        extended:
          - src/pages/DataDemo/components/DataTableView.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/types.ts
    - uuid: 'a2b3c4d5-6e7f-8g9h-0i1j-2k3l4m5n6o7p'
      status: 'todo'
      name: 'Part 2: Adapt Card and Masonry Grids for Narrow Panes'
      reason: |
        The current grid column classes in `DataCardView` are too aggressive for constrained viewports. A 3 or 4-column layout in a narrow side pane makes the cards unreadably small. We need to adjust the responsive breakpoints to use fewer columns in these scenarios.
      steps:
        - uuid: 'b3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8'
          status: 'todo'
          name: '1. Adjust Responsive Breakpoints for Card View'
          reason: |
            The `cards` mode should gracefully reduce columns as the viewport narrows. The current `xl:grid-cols-3 2xl:grid-cols-4` is too dense for typical side pane widths.
          files:
            - src/pages/DataDemo/components/DataCardView.tsx
          operations:
            - "In `DataCardView.tsx`, find the `className` for the main `div`."
            - "Change the grid classes from `md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4` to `md:grid-cols-2 lg:grid-cols-3` to provide a more reasonable layout on large and extra-large screens, especially within panes."
        - uuid: 'c4d5e6f7-g8h9-i0j1-k2l3-m4n5o6p7q8r9'
          status: 'todo'
          name: '2. Adjust Responsive Breakpoints for Masonry Grid View'
          reason: |
            Similarly, the `grid` (masonry) mode needs more conservative column counts at larger breakpoints to work well in constrained spaces.
          files:
            - src/pages/DataDemo/components/DataCardView.tsx
          operations:
            - "In `DataCardView.tsx`, find the `className` for the main `div`."
            - "Change the masonry column classes from `sm:columns-2 lg:columns-3 xl:columns-4` to `md:columns-2 xl:columns-3` to ensure better readability on medium to large screens."
      context_files:
        compact:
          - src/pages/DataDemo/components/DataCardView.tsx
        medium:
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/index.tsx
        extended:
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/components/AnimatedLoadingSkeleton.tsx
    - uuid: 'd5e6f7g8-h9i0-j1k2-l3m4-n5o6p7q8r9s0'
      status: 'todo'
      name: 'Part 3: Make the Data Detail Panel Fully Responsive'
      reason: |
        The `DataDetailPanel` is a critical component that often appears in a constrained side pane. Its internal layouts, particularly the metrics grid and footer action buttons, do not currently adapt to narrow widths, resulting in a cramped appearance.
      steps:
        - uuid: 'e6f7g8h9-i0j1-k2l3-m4n5-o6p7q8r9s0t1'
          status: 'todo'
          name: '1. Make Engagement Metrics Grid Responsive'
          reason: |
            The three-column metrics grid looks squished on narrow screens. It should stack into two columns on smaller viewports.
          files:
            - src/pages/DataDemo/components/DataDetailPanel.tsx
          operations:
            - "In `DataDetailPanel.tsx`, locate the `div` for 'Engagement Metrics'."
            - "Change its class from `grid grid-cols-3 gap-4` to `grid grid-cols-2 sm:grid-cols-3 gap-4`."
        - uuid: 'f7g8h9i0-j1k2-l3m4-n5o6-p7q8r9s0t1u2'
          status: 'todo'
          name: '2. Stack Footer Action Buttons on Small Screens'
          reason: |
            The two action buttons in the footer can appear cramped side-by-side on very narrow screens. Stacking them vertically provides a better user experience.
          files:
            - src/pages/DataDemo/components/DataDetailPanel.tsx
          operations:
            - "In `DataDetailPanel.tsx`, locate the `div` wrapper for the footer buttons."
            - "Change its class from `flex gap-3` to `flex flex-col sm:flex-row gap-3`."
      context_files:
        compact:
          - src/pages/DataDemo/components/DataDetailPanel.tsx
        medium:
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/pages/DataDemo/index.tsx
        extended:
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/types.ts
    - uuid: '0ab1c2d3-e4f5-6a7b-8c9d-0e1f2a3b4c5d'
      status: 'todo'
      name: 'Part 4: Align Loading Skeleton with New Responsive Layouts'
      reason: |
        The `AnimatedLoadingSkeleton` component has hardcoded CSS classes and JavaScript logic for its layout that must be updated to match the new responsive configurations in `DataCardView`. This is crucial to prevent layout shifts and provide an accurate preview of the content being loaded.
      steps:
        - uuid: '1bc2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6'
          status: 'todo'
          name: '1. Update Skeleton CSS Classes'
          reason: |
            The CSS classes that define the skeleton's grid need to mirror the new classes in `DataCardView`.
          files:
            - src/pages/DataDemo/components/AnimatedLoadingSkeleton.tsx
          operations:
            - "In `AnimatedLoadingSkeleton.tsx`, find the `gridClasses` object."
            - "Update the `cards` property to be `'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'`."
            - "Update the `grid` property to be `'columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6'`."
        - uuid: '2cd3e4f5-a6b7-c8d9-e0f1-a2b3c4d5e6f7'
          status: 'todo'
          name: '2. Update Skeleton JavaScript Grid Logic'
          reason: |
            The JavaScript function that calculates the number of skeleton cards to render must be aligned with the new responsive breakpoints to generate an accurate skeleton.
          files:
            - src/pages/DataDemo/components/AnimatedLoadingSkeleton.tsx
          operations:
            - "In `AnimatedLoadingSkeleton.tsx`, locate the `getGridConfig` function."
            - "Modify the logic for calculating `cols` to reflect the new breakpoints. The new logic should be: `const cols = width >= 1024 ? 3 : width >= 768 ? 2 : 1;` for `cards` view, and `const cols = width >= 1280 ? 3 : width >= 768 ? 2 : 1;` for `grid` view."
            - "To simplify, let's use a single conservative logic for both: `const cols = width >= 1280 ? 3 : width >= 768 ? 2 : 1;`."
      context_files:
        compact:
          - src/pages/DataDemo/components/AnimatedLoadingSkeleton.tsx
        medium:
          - src/pages/DataDemo/components/AnimatedLoadingSkeleton.tsx
          - src/pages/DataDemo/components/DataCardView.tsx
        extended:
          - src/pages/DataDemo/components/AnimatedLoadingSkeleton.tsx
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/index.tsx
  conclusion: |
    By executing this plan, we will transform the Data Demo page from a rigid, desktop-centric layout into a fully responsive and fluid experience. The improved layouts will ensure that all components are usable and aesthetically pleasing across the full range of viewports offered by the App Shell, from full-screen to a narrow side pane.

    This refactor will not only fix the immediate UI issues but also establish a robust, responsive foundation for future development. The result will be a more professional, versatile, and user-friendly feature that truly showcases the power and flexibility of the Jeli App Shell.
  context_files:
    compact:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/components/DataTableView.tsx
      - src/pages/DataDemo/components/DataCardView.tsx
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/pages/DataDemo/components/AnimatedLoadingSkeleton.tsx
    medium:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/components/DataTableView.tsx
      - src/pages/DataDemo/components/DataCardView.tsx
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/pages/DataDemo/components/AnimatedLoadingSkeleton.tsx
      - src/pages/DataDemo/types.ts
      - src/components/shared/PageLayout.tsx
    extended:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/components/DataTableView.tsx
      - src/pages/DataDemo/components/DataCardView.tsx
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/pages/DataDemo/components/AnimatedLoadingSkeleton.tsx
      - src/pages/DataDemo/types.ts
      - src/pages/DataDemo/components/DataListView.tsx
      - src/pages/DataDemo/components/DataToolbar.tsx
      - src/components/shared/PageLayout.tsx
      - src/context/AppShellContext.tsx
```
