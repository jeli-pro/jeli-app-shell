Yo, what's up HN. We're about to inject some serious calendar-view goodness into our `DataDemo` page. The current views are solid, but a calendar is a game-changer for visualizing time-based data. Think GitHub contribution graph, but for our data items.

We're going to build this out component-first, keeping it clean and leveraging the existing UI primitives. The plan is to create a new `DataCalendarView.tsx` that's a self-contained beast, handling its own month/week/day views. It'll hook into the existing data store and view manager like a first-class citizen. No janky iframes or heavy libs, just pure React, zustand, and Tailwind artistry. We'll reuse everything we can to keep the footprint small and the UI consistent.

The final result will be a slick, responsive calendar view that feels native to the app shell. Users will be able to visualize their data items based on due dates or creation dates, with color-coding for priority. It's gonna be a massive UX win. Let's get this diff ready to ship.

```yaml
plan:
  uuid: '9e7b4c1a-5f0e-4d6c-8a2b-1f8d3e9c0a1b'
  status: 'todo'
  title: 'Implement Advanced Calendar View for Data Demo Page'
  introduction: |
    This plan outlines the refactoring required to introduce a new 'Calendar' view mode to the Data Demo page. The goal is to provide a rich, interactive way for users to visualize data items based on their timestamps, such as due dates or creation dates.

    The approach involves creating a new, highly-reusable `DataCalendarView` component that encapsulates multiple sub-views (Month, Week, Day, List). We will integrate this new view mode into the existing application architecture, including the view mode selector, URL-based state management via `useAppViewManager`, and the main page layout. The new component will leverage existing UI primitives (`Card`, `Button`, `Badge`, etc.) and utility functions (`getPriorityColor`) to ensure a consistent look and feel with the rest of the application.

    This effort will significantly enhance the data visualization capabilities of the demo, making it more intuitive to track items over time. We will focus on a clean implementation that is both performant and maintainable, adapting patterns from the existing view components.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Foundational Integration for Calendar View'
      reason: |
        Before building the main component, we need to update the existing application infrastructure to recognize and handle the new 'calendar' view mode. This involves updating type definitions, UI controls, and state management hooks to ensure the new view can be selected and rendered correctly.
      steps:
        - uuid: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1'
          status: 'todo'
          name: '1. Update Type Definitions'
          reason: |
            To formally introduce the 'calendar' view, we must add it to the `ViewMode` union type. This provides type safety throughout the application when dealing with view modes.
          files:
            - src/pages/DataDemo/types.ts
          operations:
            - "In `src/pages/DataDemo/types.ts`, find the `ViewMode` type definition."
            - "Add `'calendar'` as one of the possible literal types. The new type should look like: `export type ViewMode = 'list' | 'cards' | 'grid' | 'table' | 'kanban' | 'calendar'`."
        - uuid: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12'
          status: 'todo'
          name: '2. Add Calendar to View Mode Selector'
          reason: |
            The user needs a way to switch to the new calendar view. This step adds the corresponding icon and button to the `DataViewModeSelector` component.
          files:
            - src/pages/DataDemo/components/DataViewModeSelector.tsx
          operations:
            - "In `src/pages/DataDemo/components/DataViewModeSelector.tsx`, import the `Calendar` icon from `lucide-react`."
            - "Add a new entry to the `modes` array for the calendar view. It should have `id: 'calendar'`, `label: 'Calendar'`, and `icon: Calendar`."
            - "Ensure the `onClick` handler for this new button correctly calls `setViewMode('calendar')`."
        - uuid: 'd4e5f6a7-b8c9-0123-4567-890abcdef123'
          status: 'todo'
          name: '3. Update Page to Render Calendar View'
          reason: |
            The main `DataDemoPage` component needs to know how to render the new view. This step adds the conditional rendering logic for `DataCalendarView`.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - "In `src/pages/DataDemo/index.tsx`, import the yet-to-be-created `DataCalendarView` component from `'./components/DataCalendarView'`."
            - "In the `renderContent` function, add a new case for `'calendar'`. It should return `<DataCalendarView data={currentItems} onItemSelect={handleItemSelect} selectedItem={selectedItem} />`."
            - "When `viewMode` is `'calendar'`, disable sorting by calling `setSort(null)` if it isn't already, similar to the kanban view logic. Also ensure the group by selector is hidden or disabled for calendar view."
        - uuid: 'e5f6a7b8-c9d0-1234-5678-90abcdef1234'
          status: 'todo'
          name: '4. Register Calendar View in App View Manager'
          reason: |
            Our app state is driven by URL params. The `useAppViewManager` hook must be updated to correctly parse and set the `viewMode=calendar` param.
          files:
            - src/hooks/useAppViewManager.hook.ts
          operations:
            - "Review `src/hooks/useAppViewManager.hook.ts` to ensure that the `setViewMode` function can handle `'calendar'` as a valid value. No specific code change is likely needed if it's already generic, but it's important to verify."
      context_files:
        compact:
          - src/pages/DataDemo/types.ts
          - src/pages/DataDemo/components/DataViewModeSelector.tsx
          - src/pages/DataDemo/index.tsx
        medium:
          - src/pages/DataDemo/types.ts
          - src/pages/DataDemo/components/DataViewModeSelector.tsx
          - src/pages/DataDemo/index.tsx
          - src/hooks/useAppViewManager.hook.ts
        extended:
          - src/pages/DataDemo/types.ts
          - src/pages/DataDemo/components/DataViewModeSelector.tsx
          - src/pages/DataDemo/index.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/pages/DataDemo/components/DataKanbanView.tsx
    - uuid: 'b2c3d4e5-f6a7-8901-2345-67890abcdef2'
      status: 'todo'
      name: 'Part 2: Build the DataCalendarView Component'
      reason: |
        This is the core of the feature. We will create a new file, `DataCalendarView.tsx`, which will contain the entire logic and structure for displaying data items in a calendar format. This component will be feature-rich, with multiple internal views (Month, Week, Day, List) and will be styled to match the application's aesthetic.
      steps:
        - uuid: 'f6a7b8c9-d0e1-2345-6789-0abcdef12345'
          status: 'todo'
          name: '1. Create `DataCalendarView.tsx` and Main Component'
          reason: |
            Establish the file structure and the main component, which will manage the calendar's internal state and render its sub-components.
          files:
            - src/pages/DataDemo/components/DataCalendarView.tsx
          operations:
            - "Create a new file at `src/pages/DataDemo/components/DataCalendarView.tsx`."
            - "Import React, `useState`, `useCallback`, `useMemo`, and necessary UI components (`Button`, `Card`, `Badge`, `Select`, etc.)."
            - "Import `DataItem` and `ViewProps` types from `../types`."
            - "Define the main `DataCalendarView: React.FC<ViewProps>` component. It will receive `data`, `onItemSelect`, and `selectedItem` as props."
            - "Inside `DataCalendarView`, set up state for `currentDate` (defaulting to `new Date()`) and `calendarView` (a new state for `'month' | 'week' | 'day' | 'list'`, defaulting to `'month'`)."
        - uuid: 'a7b8c9d0-e1f2-3456-7890-bcdef1234567'
          status: 'todo'
          name: '2. Implement Calendar Header and Controls'
          reason: |
            The calendar needs a header for navigation (previous/next month) and for switching between the internal month, week, day, and list views. This makes the component self-contained and user-friendly.
          files:
            - src/pages/DataDemo/components/DataCalendarView.tsx
          operations:
            - "Inside `DataCalendarView`, create a header section."
            - "Display the current date range (e.g., 'October 2024') which changes based on `currentDate` and `calendarView`."
            - "Add a button group on the right for navigation: `< ChevronLeft />`, `Today`, `< ChevronRight />`. These buttons will update the `currentDate` state."
            - "Add another button group to switch the `calendarView` state between 'Month', 'Week', 'Day', and 'List'. This should use existing `Button` components and style them as a segmented control, similar to `DataViewModeSelector`."
        - uuid: 'b8c9d0e1-f2a3-4567-8901-cdef12345678'
          status: 'todo'
          name: '3. Implement Month View'
          reason: |
            The month view is the most common calendar layout and will serve as the default. It needs to render a grid of days and place data items within them.
          files:
            - src/pages/DataDemo/components/DataCalendarView.tsx
          operations:
            - "Create a `MonthView` sub-component inside `DataCalendarView.tsx`."
            - "It should calculate and render a 6x7 grid of days for the given `currentDate`."
            - "For each day in the grid, filter the `data` prop to find items where `dueDate` or `createdAt` matches that day."
            - "Render a small, clickable representation of each `DataItem` within its corresponding day cell. Use the `EventItem` component (to be created next)."
            - "Style non-current-month days with a muted background. Highlight the current day."
        - uuid: 'c9d0e1f2-a3b4-5678-9012-def123456789'
          status: 'todo'
          name: '4. Implement Week, Day, and List Views'
          reason: |
            To provide a comprehensive calendar experience, we need to add week, day, and list views, each offering a different level of granularity.
          files:
            - src/pages/DataDemo/components/DataCalendarView.tsx
          operations:
            - "Create `WeekView`, `DayView`, and `ListView` sub-components."
            - "`WeekView`: Render a grid with 7 days as columns and 24 hours as rows. Place items in the correct day column. Since items lack a specific time, they can be displayed as 'all-day' events at the top of each column."
            - "`DayView`: Similar to Week view but for a single day, showing a list of items for that day."
            - "`ListView`: Group items by date and render them in a chronological list, with date headings. This is the most accessible view."
        - uuid: 'd0e1f2a3-b4c5-6789-0123-ef1234567890'
          status: 'todo'
          name: '5. Create Reusable EventItem Component'
          reason: |
            A dedicated component to represent a `DataItem` inside the calendar views will keep the code DRY and styling consistent. It will handle color-coding and click events.
          files:
            - src/pages/DataDemo/components/DataCalendarView.tsx
          operations:
            - "Create an `EventItem` sub-component inside `DataCalendarView.tsx`."
            - "It should accept a `DataItem` as a prop."
            - "The component should display the item's `title`."
            - "Its background color should be determined by the item's `priority` using the existing `getPriorityColor` utility from `@/lib/utils`."
            - "Make the component clickable, triggering the `onItemSelect(item)` callback on click."
            - "Add a `Tooltip` on hover to show more details, like the full title or description."
      context_files:
        compact:
          - src/pages/DataDemo/components/DataCalendarView.tsx
          - src/pages/DataDemo/types.ts
          - src/lib/utils.ts
        medium:
          - src/pages/DataDemo/components/DataCalendarView.tsx
          - src/pages/DataDemo/types.ts
          - src/lib/utils.ts
          - src/pages/DataDemo/components/DataKanbanView.tsx
          - src/components/ui/button.tsx
          - src/components/ui/card.tsx
        extended:
          - src/pages/DataDemo/components/DataCalendarView.tsx
          - src/pages/DataDemo/types.ts
          - src/lib/utils.ts
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/components/DataKanbanView.tsx
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/components/ui/button.tsx
          - src/components/ui/card.tsx
          - src/components/ui/badge.tsx
          - src/components/ui/tooltip.tsx
  conclusion: |
    Upon completion, the Data Demo page will be equipped with a fully functional and visually appealing calendar view. This new feature will be seamlessly integrated into the existing application, enhancing user experience by offering a powerful new way to visualize and interact with time-sensitive data.

    The modular design of the `DataCalendarView` component ensures it is maintainable and extensible for future enhancements, such as drag-and-drop event rescheduling. By adhering to the project's established coding patterns and design system, we will maintain a high level of code quality and UI consistency.
  context_files:
    compact:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/types.ts
      - src/pages/DataDemo/components/DataViewModeSelector.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/pages/DataDemo/components/DataCalendarView.tsx
    medium:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/types.ts
      - src/pages/DataDemo/components/DataViewModeSelector.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/lib/utils.ts
      - src/pages/DataDemo/components/DataKanbanView.tsx
      - src/pages/DataDemo/components/DataCalendarView.tsx
    extended:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/types.ts
      - src/pages/DataDemo/components/DataViewModeSelector.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/lib/utils.ts
      - src/pages/DataDemo/components/DataKanbanView.tsx
      - src/pages/DataDemo/components/DataToolbar.tsx
      - src/pages/DataDemo/store/dataDemo.store.tsx
      - src/components/ui/button.tsx
      - src/components/ui/card.tsx
      - src/components/ui/badge.tsx
      - src/pages/DataDemo/components/DataCalendarView.tsx
```
