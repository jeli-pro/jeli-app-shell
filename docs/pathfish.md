ok, let's architect this refactor. dropping items on the calendar is a must-have, classic kanban-for-your-week stuff. right now, it's all sizzle and no steak – you can drag, but you can't drop. we're gonna fix that.

the plan is to light up the day cells as drop targets. when an event is dragged over a day, we'll give some visual feedback. when it's dropped, we'll grab the item's id, the new date, and fire off an update. we need to be smart about it and preserve the original time of day, just changing the date part. this keeps things predictable for the user.

we'll contain all this logic within the `CalendarView.tsx` component. it's a surgical strike. we'll add some state for tracking the drag operation, implement the necessary event handlers (`onDragOver`, `onDrop`, `onDragLeave`), and wire everything into the existing day-rendering loop. no need to touch the data store logic or other view components. clean in, clean out.

```yaml
plan:
  uuid: 'e8a1d4b6-7c0f-4e5b-9a2d-0f1c3a4b5d6e'
  status: 'todo'
  title: 'Enable Drag-and-Drop Item Updates in Calendar View'
  introduction: |
    The current calendar view lets you start dragging items, but you can't drop them anywhere to reschedule. It's a dead-end interaction. This refactor will fully implement drag-and-drop functionality, turning each day cell into a valid drop target.

    The goal is to allow users to intuitively reschedule items by dragging them from one day to another. When an item is dropped, its date property (e.g., `dueDate`) will be updated to reflect the new day, while preserving the original time. This is a significant UX improvement that makes the calendar view truly interactive and functional. We will achieve this by adding state management for the drag operation and wiring up the necessary event handlers directly within the `CalendarView` component.
  parts:
    - uuid: 'f3d9a0c2-1b8e-4f7a-8b1c-9e6a7d5b4c3d'
      status: 'todo'
      name: 'Part 1: Implement Drag and Drop Logic in CalendarView'
      reason: |
        The core of the feature is missing. We need to add state and event handlers to `CalendarView.tsx` to manage the drag-and-drop lifecycle. This includes tracking the dragged item, identifying drop targets, and handling the final drop action to update the data.
      steps:
        - uuid: 'c9b4e1d1-0a7f-4b6c-8c5e-2f1d3b4a5b6f'
          status: 'todo'
          name: '1. Add State and D&D Handlers'
          reason: |
            To enable drag and drop, we need to introduce state for tracking the currently dragged item (`draggedItemId`) and the potential drop target (`dropTargetDate`). We also need the core handler functions (`handleDragOver`, `handleDrop`, etc.) that will contain the logic for the D&D interaction.
          files:
            - src/features/dynamic-view/components/views/CalendarView.tsx
          operations:
            - 'Introduce two new state variables using `useState`: `draggedItemId` (string | null) and `dropTargetDate` (Date | null).'
            - 'Update the `handleDragStart` function to accept an `itemId` and set both the `dataTransfer` value and the `draggedItemId` state.'
            - 'Create a new `handleDragEnd` function to reset `draggedItemId` and `dropTargetDate` to null, ensuring a clean state after any drag operation.'
            - 'Create a `handleDragOver` function. It should call `event.preventDefault()` to allow dropping and update the `dropTargetDate` state with the current day being hovered over.'
            - 'Create a `handleDragLeave` function to reset `dropTargetDate` when the cursor leaves a day cell.'
            - 'Create the main `handleDrop` function. This function will read the `itemId` from `dataTransfer`, find the original item, construct a new date using the drop day but preserving the original time, and then call `onItemUpdate` with the new date. It should call `handleDragEnd` to clean up.'
        - uuid: 'a0b8d7c4-5e9f-4d3a-9b1e-8f2c3d4e5a6b'
          status: 'todo'
          name: '2. Wire up Handlers and Visual Feedback in JSX'
          reason: |
            With the logic in place, we need to connect it to the rendered elements. The day cells must become aware of drag events, and the user needs visual feedback to understand they can drop an item on a specific day.
          files:
            - src/features/dynamic-view/components/views/CalendarView.tsx
          operations:
            - 'In the `days.map` loop, attach the new handlers (`onDragOver`, `onDragLeave`, `onDrop`) to the main `div` for each day cell.'
            - 'Attach the `handleDragEnd` handler to the main calendar grid container (`div` with `className="px-2"`) to catch drops that happen outside a valid target.'
            - 'Update the `className` of the day cell `div` using `cn()`. Add conditional classes that apply a visual style (e.g., `border-primary/50 bg-primary/10`) when the `day` is the current `dropTargetDate`.'
            - 'In the `CalendarEvent` component invocation, update the `onDragStart` prop to pass the `item.id` to the `handleDragStart` handler: `onDragStart={(e) => handleDragStart(e, item.id)}`.'
            - 'Update the `CalendarEvent` props interface to reflect the change in `onDragStart` signature: `onDragStart: (e: React.DragEvent<HTMLDivElement>, itemId: string) => void`.'
      context_files:
        compact:
          - src/features/dynamic-view/components/views/CalendarView.tsx
        medium:
          - src/features/dynamic-view/components/views/CalendarView.tsx
          - src/features/dynamic-view/DynamicViewContext.tsx
        extended:
          - src/features/dynamic-view/components/views/CalendarView.tsx
          - src/features/dynamic-view/DynamicViewContext.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/store/dataDemo.store.tsx
  conclusion: |
    Once complete, this refactor will deliver a fully interactive calendar. Users will be able to reschedule items simply by dragging them to a new date, providing a fluid and intuitive experience. The update is immediate and reflects in the underlying data store, making the calendar a powerful tool for managing date-based items. The changes are cleanly encapsulated within the `CalendarView` component, ensuring maintainability and no side effects on other parts of the application.
  context_files:
    compact:
      - src/features/dynamic-view/components/views/CalendarView.tsx
    medium:
      - src/features/dynamic-view/components/views/CalendarView.tsx
      - src/features/dynamic-view/DynamicViewContext.tsx
    extended:
      - src/features/dynamic-view/components/views/CalendarView.tsx
      - src/features/dynamic-view/DynamicViewContext.tsx
      - src/pages/DataDemo/index.tsx
```
