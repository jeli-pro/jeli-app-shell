Fellas, we're diving into the `DataDemo` page to juice up the calendar controls. Right now, it's just a pretty face. We're going to wire it up, make it slick, and ensure it plays nice with the rest of the app's state management.

The plan is simple: First, we'll fortify our `useAppViewManager` hook to be the single source of truth for all calendar settings, pulling state from the URL like a champ. Then, we'll overhaul the `DataCalendarViewControls` component, connecting its switches and knobs to the hook and polishing its UI until it shines. Finally, we'll make the `DataCalendarView` itself dance to the new tune, dynamically updating what it shows based on the user's choices.

This refactor will turn a static piece of UI into a fully interactive feature, giving users granular control over their calendar view. It's about making the thing *actually work* and look good while doing it. No more mockups, just pure, unadulterated functionality. Let's get it.

```yaml
plan:
  uuid: '3a8d1e2f-b4c1-4f9e-a0d3-5b8c76a9f1b0'
  status: 'todo'
  title: 'Refactor Data Demo Calendar Controls for Full Functionality and UI Consistency'
  introduction: |
    This master plan details the refactoring of the calendar view controls within the `DataDemo` feature. Currently, the UI for these controls is present but not fully functional. The goal is to wire up the controls to a centralized state manager, make them actively control the calendar's display, and refine their styling to align with the application's global design system.

    The approach involves three main phases. First, we will ensure the `useAppViewManager` hook is robust enough to manage all calendar-related state (date property, display options, item limits) via URL search parameters. Second, we will refactor the `DataCalendarViewControls` component to use this hook, making the UI fully interactive and improving its layout and styling for a better user experience. Finally, we will modify the `DataCalendarView` component to consume the state from the hook, dynamically altering its presentation based on user-configured settings.

    This refactor will transform the static controls into a powerful, state-driven feature, enhancing user experience by providing meaningful customization of the calendar interface.
  parts:
    - uuid: 'd9b0e5a1-c3f7-4a6b-8b2c-1f4a90e3d2a1'
      status: 'todo'
      name: 'Part 1: Solidify Calendar State Management in `useAppViewManager`'
      reason: |
        The `useAppViewManager` hook is the central authority for view-related state stored in the URL. We must first ensure it correctly parses, manages, and updates all calendar-specific parameters to provide a reliable foundation for the UI components.
      steps:
        - uuid: 'e1f8c0a3-d4e1-4b7f-8c3c-2a0e1f9b8d0a'
          status: 'todo'
          name: '1. Verify and Enhance Calendar State Logic'
          reason: |
            To ensure robustness, we need to confirm that the hook correctly reads calendar view parameters from the URL, provides sensible defaults for missing or invalid values, and exposes them to the application.
          files:
            - src/hooks/useAppViewManager.hook.ts
          operations:
            - 'In `useAppViewManager`, locate the logic that derives `calendarDateProp`, `calendarDisplayProps`, and `calendarItemLimit` from `searchParams`.'
            - 'Confirm the default values are sensible: `calendarDateProp` defaults to `dueDate`, `calendarDisplayProps` to `['priority', 'assignee']`, and `calendarItemLimit` to a number like `3`.'
            - 'Ensure the parsing logic for `calendarDisplayProps` correctly handles a comma-separated string from the `calDisplay` URL param, converting it to an array.'
            - 'Verify that the corresponding setter functions (`setCalendarDateProp`, `setCalendarDisplayProps`, `setCalendarItemLimit`) correctly update the URL search parameters.'

    - uuid: 'b6f2d1e8-a5c3-4d0f-9e1b-7c6d9a3b0f5e'
      status: 'todo'
      name: 'Part 2: Implement and Style Calendar View Controls'
      reason: |
        The `DataCalendarViewControls` component needs to be transformed from a static UI into a fully interactive panel. This involves connecting its inputs to the state management hook and refining its visual presentation for clarity and consistency with the application's design language.
      steps:
        - uuid: 'c5d3a0b1-e2f9-4c8a-9a0b-1f8d9c7a4b0c'
          status: 'todo'
          name: '1. Connect Controls to State Manager'
          reason: |
            To make the controls functional, they must read their current state from `useAppViewManager` and use its mutator functions to update that state.
          files:
            - src/pages/DataDemo/components/DataCalendarViewControls.tsx
          operations:
            - 'Import and call `useAppViewManager` to get `calendarDateProp`, `calendarDisplayProps`, `calendarItemLimit`, and their respective setters.'
            - 'Wire up the `RadioGroup` for "Date Property": set its `value` to `calendarDateProp` and its `onValueChange` to `setCalendarDateProp`.'
            - 'Wire up the `Checkbox`es for "Display Properties": for each checkbox, set `checked` based on whether its corresponding property exists in the `calendarDisplayProps` array.'
            - 'Update the `handleDisplayPropChange` function to correctly add/remove properties from the `calendarDisplayProps` array and call `setCalendarDisplayProps` with the new array.'
            - 'Wire up the `Switch` for "Item Limit": set its `checked` state based on `calendarItemLimit === 'all'`. The `onCheckedChange` handler should call `setCalendarItemLimit`, toggling between `'all'` and a default number (e.g., `3`).'

        - uuid: 'a9e0f3b2-d1c8-4e7b-8f1d-2c5e6a4b3d9c'
          status: 'todo'
          name: '2. Refine UI Layout and Styling'
          reason: |
            A clean, well-organized UI improves usability. We will restructure the popover content to be more scannable and visually consistent with other control panels in the app.
          files:
            - src/pages/DataDemo/components/DataCalendarViewControls.tsx
          operations:
            - 'Restructure the popover content using a main container with padding (e.g., `p-4`) and a standard width (e.g., `w-80`).'
            - 'Organize controls into logical sections titled "Date Property", "Display Options", and "View Options" using `<h4>` tags or similar.'
            - 'Add descriptive text under section titles using `text-sm text-muted-foreground` for better user guidance.'
            - 'Insert `<Separator className="my-4" />` between sections for clear visual separation.'
            - 'Improve the layout of each control. For each `RadioGroupItem` and `Checkbox`, wrap it and its `Label` in a `div` with `flex items-center gap-2` for proper alignment.'
            - 'Ensure all `Label` components use the `htmlFor` attribute, pointing to the `id` of their corresponding input for accessibility.'

    - uuid: 'f8e1d7a3-c2b9-4d6f-8a0e-9c1d2b0a3c4d'
      status: 'todo'
      name: 'Part 3: Apply Settings to the Calendar View'
      reason: |
        The calendar grid must dynamically update to reflect the user's selections in the control panel. This step involves reading the shared state and altering the rendering logic accordingly.
      steps:
        - uuid: '1b2a3d4c-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
          status: 'todo'
          name: '1. Make Calendar Grid Dynamically Respond to Settings'
          reason: |
            To complete the feature, the `DataCalendarView` needs to consume the state from `useAppViewManager` and use it to control which data is shown and how it's presented.
          files:
            - src/pages/DataDemo/components/DataCalendarView.tsx
          operations:
            - 'In `DataCalendarView`, get `calendarDateProp`, `calendarDisplayProps`, and `calendarItemLimit` from the `useAppViewManager` hook.'
            - 'Modify the logic that groups items by day to use the date field specified by `calendarDateProp` (e.g., `item[calendarDateProp]`) instead of a hardcoded value.'
            - 'Inside the render logic for each calendar item, use `calendarDisplayProps` to conditionally render components like priority badges, assignee info, and tags.'
            - 'Before rendering the items for a given day, check `calendarItemLimit`. If it is a number, use `.slice(0, calendarItemLimit)` on the items array.'
            - 'If the number of items for a day exceeds `calendarItemLimit`, render a "+X more" indicator to inform the user that some items are hidden.'
  conclusion: |
    Upon completion of this plan, the `DataDemo` calendar view will be a fully functional and polished feature. The controls will be intuitively styled and will reliably manage the calendar's display state via URL parameters, making user preferences bookmarkable and shareable.

    This refactor not only delivers a requested user-facing feature but also reinforces a clean architecture by centralizing view state in the `useAppViewManager` hook. This improves code maintainability and sets a clear pattern for implementing similar state-driven UI features in the future.
  context_files:
    compact:
      - src/pages/DataDemo/components/DataCalendarViewControls.tsx
      - src/pages/DataDemo/components/DataCalendarView.tsx
      - src/hooks/useAppViewManager.hook.ts
    medium:
      - src/pages/DataDemo/components/DataCalendarViewControls.tsx
      - src/pages/DataDemo/components/DataCalendarView.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/pages/DataDemo/types.ts
    extended:
      - src/pages/DataDemo/components/DataCalendarViewControls.tsx
      - src/pages/DataDemo/components/DataCalendarView.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/pages/DataDemo/types.ts
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/components/shared/DataItemParts.tsx
```
