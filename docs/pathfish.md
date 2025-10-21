Alright, let's architect this refactor. The goal is to pimp the calendar view. Right now, moving tasks between months is a drag (pun intended). Users have to drop, click next month, then drag again. Lame. We're going to fix it so you can just drag an item to the edge of the calendar, and it'll automagically flip to the next or previous month. We'll even add a little delay so it doesn't feel janky.

This is all about improving flow. Less clicking, more doing. The core logic will live inside the `handleDragOver` event in `CalendarView.tsx`. We'll sniff the cursor position, and if it's hanging out by the edge, we kick off a timer to switch the month. Simple, but effective.

No new files needed, just a surgical strike on `CalendarView.tsx`. Let's get it.

```yaml
plan:
  uuid: 'f4a9b1c0-3e5d-4f2a-8b1e-9c7d8f6a3b2c'
  status: 'todo'
  title: 'Implement Drag-to-Change-Month in Calendar View'
  introduction: |
    This plan details the refactoring of the `CalendarView` component to introduce a "drag-to-change-month" feature. Currently, moving an event across month boundaries is tedious, requiring the user to drop the item, navigate, and then drag again. This refactor will streamline the user experience significantly.

    The core idea is to detect when a user drags a calendar item to the far left or right edge of the calendar grid. When the item hovers in this "hot zone" for a brief period, the calendar will automatically navigate to the previous or next month, allowing the user to continue their drag-and-drop operation seamlessly into the new month. This will make rescheduling long-range tasks much more intuitive and efficient. The implementation will be contained within `CalendarView.tsx`, leveraging existing drag-and-drop handlers and state management for month navigation.
  parts:
    - uuid: '9e8c7b6a-5d4f-4e3c-8a2b-1c9d8e7f6a5b'
      status: 'todo'
      name: 'Part 1: Enhance CalendarView with Edge-Drag Functionality'
      reason: |
        This part focuses on modifying the `CalendarView.tsx` component to enable users to navigate to adjacent months simply by dragging an event to the horizontal edges of the calendar grid. This is the core of the feature and contains all necessary logic.
      steps:
        - uuid: '1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e'
          status: 'todo'
          name: '1. Add Refs for Edge Drag State'
          reason: |
            We need to track the state of the edge-hover interaction without causing component re-renders on every mouse movement. `useRef` is perfect for managing the timer ID and tracking the currently active edge hot zone.
          files:
            - 'src/features/dynamic-view/components/views/CalendarView.tsx'
          operations:
            - 'Introduce two new `useRef` hooks within the `CalendarView` component.'
            - 'One ref, `edgeHoverTimerRef`, will hold the `NodeJS.Timeout` ID for the delayed month change, initialized to `null`.'
            - 'The second ref, `currentEdgeRef`, will store the active edge (`''left''` or `''right''`) or `null`, to prevent restarting the timer on every `dragOver` event within the same hot zone.'
        - uuid: 'a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d'
          status: 'todo'
          name: '2. Enhance `handleDragOver` for Edge Detection'
          reason: |
            The `handleDragOver` function is the main event handler that fires continuously as an item is dragged over the calendar. This is the ideal place to check the cursor's position and determine if it has entered an edge hot zone.
          files:
            - 'src/features/dynamic-view/components/views/CalendarView.tsx'
          operations:
            - 'In `handleDragOver`, get the bounding rectangle of the main calendar grid container (`gridRef.current.getBoundingClientRect()`).'
            - 'Define a constant for the edge hot zone width, e.g., `const edgeZoneWidth = 60;`.'
            - 'Check if the mouse event''s `clientX` is within the left or right hot zone.'
            - 'If the cursor is in a hot zone, initiate the month change logic. Otherwise, clear any pending month change and proceed with the existing drop target logic.'
        - uuid: 'f1e2d3c4-b5a6-9878-6f5e-4d3c2b1a0f9e'
          status: 'todo'
          name: '3. Implement Month Change Timer Logic'
          reason: |
            To prevent accidental and jarring month changes, the navigation should only trigger after the user has hovered near the edge for a short duration. This requires timer-based logic.
          files:
            - 'src/features/dynamic-view/components/views/CalendarView.tsx'
          operations:
            - 'Inside the edge detection block in `handleDragOver`, check if a timer is already running for the detected edge (`currentEdgeRef`). If not, proceed.'
            - 'First, clear any existing timer from the other edge using `clearTimeout(edgeHoverTimerRef.current)`.'
            - 'Set `dropTargetDate(null)` to hide any active drop indicators on calendar days.'
            - 'Use `setTimeout` to schedule a call to `handlePrevMonth()` or `handleNextMonth()` after a delay (e.g., `700ms`).'
            - "Store the timer ID in `edgeHoverTimerRef.current` and the direction in `currentEdgeRef.current`."
            - 'When the cursor moves out of a hot zone, clear the timer and reset the refs.'
        - uuid: 'b4a5c6d7-e8f9-a0b1-c2d3-e4f5a6b7c8d9'
          status: 'todo'
          name: '4. Ensure Timer Cleanup in Drag Handlers'
          reason: |
            It's crucial to clean up any pending timers when the drag operation concludes (either by dropping the item or canceling the drag) to prevent unexpected navigation.
          files:
            - 'src/features/dynamic-view/components/views/CalendarView.tsx'
          operations:
            - 'At the beginning of the `handleDrop` function, add a call to `clearTimeout(edgeHoverTimerRef.current)` and reset `currentEdgeRef`.'
            - 'Similarly, update the `handleDragEnd` function to also clear the timer and reset the refs, ensuring all states are cleaned up when the drag action finishes for any reason.'
      context_files:
        compact:
          - 'src/features/dynamic-view/components/views/CalendarView.tsx'
        medium:
          - 'src/features/dynamic-view/components/views/CalendarView.tsx'
        extended:
          - 'src/features/dynamic-view/components/views/CalendarView.tsx'
  conclusion: |
    By implementing this plan, the `CalendarView` will become significantly more powerful for users needing to reschedule tasks across different months. The drag-to-navigate feature removes friction and makes the UI feel more responsive and intuitive.

    This targeted refactor enhances a key user interaction with minimal code changes, contained within a single component. The resulting improvement in usability will be a noticeable win for the application's overall user experience.
  context_files:
    compact:
      - 'src/features/dynamic-view/components/views/CalendarView.tsx'
    medium:
      - 'src/features/dynamic-view/components/views/CalendarView.tsx'
    extended:
      - 'src/features/dynamic-view/components/views/CalendarView.tsx'

```
