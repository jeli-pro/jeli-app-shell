Alright, listen up. We're gonna juice up the calendar view. Right now, it's a black box - you can't link to a specific month, and hovering on an event tells you zilch. That's weak. The plan is to make it route-aware and slap on some slick tooltips that actually give you the intel you need without a click.

We'll pipe the calendar's date state through the URL, making it shareable and bookmarkable. This involves hooking into our central `useAppViewManager` to manage a new `date` URL param. The `CalendarView` will become a controlled component, driven entirely by this URL state. No more internal state shenanigans.

Then, we'll craft a custom tooltip component that looks sharp and surfaces key data on hover. Think status, priority, assignee, the works. It'll be a self-contained, data-rich heads-up display for each event. Less clicking, more knowing. Let's ship it.

```yaml
plan:
  uuid: '3c8d1e2a-7b0f-4e9a-8a1c-9d4f5e6a7b2c'
  status: 'todo'
  title: 'Upgrade Calendar View with URL State and Rich Tooltips'
  introduction: |
    Alright, listen up. We're gonna juice up the calendar view. Right now, it's a black box - you can't link to a specific month, and hovering on an event tells you zilch. That's weak. The plan is to make it route-aware and slap on some slick tooltips that actually give you the intel you need without a click.

    We'll pipe the calendar's date state through the URL, making it shareable and bookmarkable. This involves hooking into our central `useAppViewManager` to manage a new `date` URL param. The `CalendarView` will become a controlled component, driven entirely by this URL state. No more internal state shenanigans.

    Then, we'll craft a custom tooltip component that looks sharp and surfaces key data on hover. Think status, priority, assignee, the works. It'll be a self-contained, data-rich heads-up display for each event. Less clicking, more knowing. Let's ship it.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Implement URL-Driven Calendar Date'
      reason: |
        The calendar currently manages its own state for the displayed month, which is bad for usability. Users can't bookmark, share, or link to a specific month. By moving the date state into a URL parameter, we make the view's state transparent and persistent, which is a core tenet of good web app design.
      steps:
        - uuid: 'b1c2d3e4-f5g6-7890-1234-567890abcdef'
          status: 'todo'
          name: '1. Enhance URL State Manager'
          reason: |
            We need to teach our central state manager, `useAppViewManager`, how to handle calendar dates. It will be responsible for reading the date from the URL on load and providing a function to update it, keeping all URL logic in one place.
          files:
            - src/hooks/useAppViewManager.hook.ts
          operations:
            - 'In the "DERIVED STATE FROM URL" section, add logic to parse a `date` search param (e.g., `2024-08`).'
            - 'Use `new Date()` as a fallback if the param is missing or invalid.'
            - 'Create a new mutator function `setCalendarDate(date: Date)` that updates the URL param to a `YYYY-MM` format.'
            - 'The mutator should clear the param if the new date is the current month to keep default URLs clean.'
            - 'Export the new `calendarDate` state and `setCalendarDate` mutator from the hook.'
        - uuid: 'c2d3e4f5-g6h7-8901-2345-67890abcdef'
          status: 'todo'
          name: '2. Thread State through DynamicView'
          reason: |
            The `DynamicView` component and its context are the main data pipeline. We need to plumb the new date state and its updater through this pipeline to get them to the `CalendarView`.
          files:
            - src/features/dynamic-view/DynamicView.tsx
            - src/features/dynamic-view/DynamicViewContext.tsx
          operations:
            - 'In `DynamicView.tsx`, add new optional props: `calendarDate?: Date` and `onCalendarDateChange?: (date: Date) => void`.'
            - 'Pass these new props down to the `DynamicViewProvider`.'
            - 'In `DynamicViewContext.tsx`, add `calendarDate` and `onCalendarDateChange` to the `DynamicViewContextProps` interface.'
        - uuid: 'd3e4f5g6-h7i8-9012-3456-7890abcdef'
          status: 'todo'
          name: '3. Connect State in DataDemo Page'
          reason: |
            The `DataDemoPage` is the top-level component that uses `DynamicView`. We'll connect our new state from `useAppViewManager` to the `DynamicView` component here.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'In `DataDemoPage`, call `useAppViewManager` to get `calendarDate` and `setCalendarDate`.'
            - 'Pass `calendarDate={calendarDate}` and `onCalendarDateChange={setCalendarDate}` to the `<DynamicView />` component.'
        - uuid: 'e4f5g6h7-i8j9-0123-4567-890abcdef'
          status: 'todo'
          name: '4. Refactor CalendarView as Controlled Component'
          reason: |
            This is the final step to kill the internal state. `CalendarView` will now be a "dumb" component that just renders the date it's given and reports back when the user tries to change it.
          files:
            - src/features/dynamic-view/components/views/CalendarView.tsx
          operations:
            - 'Remove the internal `currentDate` state managed by `useState`.'
            - 'Consume `calendarDate` and `onCalendarDateChange` from the `useDynamicView()` context.'
            - 'Use `calendarDate ?? new Date()` as the source of truth for rendering.'
            - 'Update `handlePrevMonth`, `handleNextMonth`, and `handleToday` to call `onCalendarDateChange(newDate)` instead of the old `setCurrentDate`.'
            - 'Ensure the animation `direction` state is set correctly before calling the callback to preserve transitions.'
      context_files:
        compact:
          - src/hooks/useAppViewManager.hook.ts
          - src/features/dynamic-view/components/views/CalendarView.tsx
          - src/pages/DataDemo/index.tsx
        medium:
          - src/hooks/useAppViewManager.hook.ts
          - src/features/dynamic-view/components/views/CalendarView.tsx
          - src/pages/DataDemo/index.tsx
          - src/features/dynamic-view/DynamicView.tsx
          - src/features/dynamic-view/DynamicViewContext.tsx
        extended:
          - src/hooks/useAppViewManager.hook.ts
          - src/features/dynamic-view/components/views/CalendarView.tsx
          - src/pages/DataDemo/index.tsx
          - src/features/dynamic-view/DynamicView.tsx
          - src/features/dynamic-view/DynamicViewContext.tsx
          - src/features/dynamic-view/types.ts
    - uuid: 'f6g7h8i9-j0k1-2345-6789-0abcdef12345'
      status: 'todo'
      name: 'Part 2: Implement Rich Event Tooltips'
      reason: |
        A calendar without useful event previews is just a grid of colored boxes. Users need to quickly see what an item is about without clicking into it. A rich tooltip provides this "glanceable" information, dramatically improving workflow and reducing interaction cost.
      steps:
        - uuid: '01a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6'
          status: 'todo'
          name: '1. Create EventTooltipContent Component'
          reason: |
            To keep `CalendarView` clean and to create a reusable, well-styled tooltip, we'll encapsulate the tooltip's content into its own component.
          files:
            - src/features/dynamic-view/components/shared/EventTooltipContent.tsx
          operations:
            - 'Create a new file `src/features/dynamic-view/components/shared/EventTooltipContent.tsx`.'
            - 'The component will accept an `item: GenericItem` and `config` as props.'
            - 'Design a layout using a `Card`-like container with a dark, blurred background aesthetic.'
            - 'Render key fields from the item, such as title, status, priority, and assignee, using `Badge`, `Avatar`, and `lucide-react` icons.'
            - 'Use `FieldRenderer` where it makes sense but prioritize a custom, compact layout for the tooltip.'
        - uuid: 'p7q8r9s0-t1u2-v3w4-x5y6-z7a8b9c0d1e2'
          status: 'todo'
          name: '2. Integrate Tooltip into CalendarView'
          reason: |
            With the content component ready, we need to wire it up to the actual calendar events so it appears on hover.
          files:
            - src/features/dynamic-view/components/views/CalendarView.tsx
            - src/components/ui/tooltip.tsx
          operations:
            - 'In `CalendarView.tsx`, import `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger` from `@/components/ui/tooltip`.'
            - 'Wrap the main calendar grid container with `<TooltipProvider>`.'
            - 'In the render loop for calendar items (`dayItems.map`), wrap each draggable item `div` with `<Tooltip>`.'
            - 'Use the item `div` itself as the `<TooltipTrigger asChild>...`.'
            - 'Add `<TooltipContent>` and place the new `<EventTooltipContent item={item} config={config} />` inside it.'
            - 'Style `<TooltipContent>` with `side="top"`, `align="center"`, and classes to make its own background transparent, letting the custom component handle all visuals.'
      context_files:
        compact:
          - src/features/dynamic-view/components/views/CalendarView.tsx
          - src/components/ui/tooltip.tsx
          - src/features/dynamic-view/components/shared/EventTooltipContent.tsx
        medium:
          - src/features/dynamic-view/components/views/CalendarView.tsx
          - src/components/ui/tooltip.tsx
          - src/features/dynamic-view/components/shared/EventTooltipContent.tsx
          - src/features/dynamic-view/types.ts
          - src/features/dynamic-view/components/shared/FieldRenderer.tsx
        extended:
          - src/features/dynamic-view/components/views/CalendarView.tsx
          - src/components/ui/tooltip.tsx
          - src/features/dynamic-view/components/shared/EventTooltipContent.tsx
          - src/features/dynamic-view/types.ts
          - src/features/dynamic-view/components/shared/FieldRenderer.tsx
          - src/pages/DataDemo/data/DataDemoItem.ts
          - src/pages/DataDemo/DataDemo.config.tsx
          - src/lib/utils.ts
  conclusion: |
    When this lands, the calendar view will be a first-class citizen in the app. Users can finally share a link to a specific month, which is table stakes for any real-world use. The new tooltips will slash the time-to-insight, letting users get a snapshot of a task without breaking their flow. It's a massive UX win that makes the whole dynamic view feature feel more polished and professional. We're trading user friction for user delight.
  context_files:
    compact:
      - src/features/dynamic-view/components/views/CalendarView.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/features/dynamic-view/DynamicView.tsx
      - src/pages/DataDemo/index.tsx
      - src/components/ui/tooltip.tsx
      - src/features/dynamic-view/components/shared/EventTooltipContent.tsx
    medium:
      - src/features/dynamic-view/components/views/CalendarView.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/features/dynamic-view/DynamicView.tsx
      - src/pages/DataDemo/index.tsx
      - src/components/ui/tooltip.tsx
      - src/features/dynamic-view/components/shared/EventTooltipContent.tsx
      - src/features/dynamic-view/DynamicViewContext.tsx
      - src/features/dynamic-view/types.ts
    extended:
      - src/features/dynamic-view/components/views/CalendarView.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/features/dynamic-view/DynamicView.tsx
      - src/pages/DataDemo/index.tsx
      - src/components/ui/tooltip.tsx
      - src/features/dynamic-view/components/shared/EventTooltipContent.tsx
      - src/features/dynamic-view/DynamicViewContext.tsx
      - src/features/dynamic-view/types.ts
      - src/pages/DataDemo/DataDemo.config.tsx
      - src/features/dynamic-view/components/shared/FieldRenderer.tsx
      - src/lib/utils.ts
```
