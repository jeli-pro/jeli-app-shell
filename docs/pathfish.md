Okay, let's architect this refactor. We're going for a full Notion-style makeover on the data detail view. Think editable everything, drag-and-drop sections, and a cleaner, more interactive UI. The goal is to transform a static display into a dynamic workspace.

We'll break this down into two main thrusts: first, wiring up in-place editing for all the data fields, and second, rebuilding the detail panel itself to support a customizable layout and that slick Notion aesthetic. This is a deep refactor touching the data flow from the store all the way to the final render. No half-measures.

Here's the plan.

```yaml
plan:
  uuid: 'f4b1e8a9-c7d6-4a1e-8f2b-9c0d3a5b6e7f'
  status: 'todo'
  title: 'Refactor: Notion-Style Editable & Draggable Detail Page'
  introduction: |
    This master plan outlines the refactoring of the `DynamicView`'s detail page into a Notion-style interactive document. The current detail panel is a read-only view. This effort will transform it into a fully editable and customizable overlay, enhancing the user experience from passive consumption to active data manipulation.

    The strategy involves two core parts. First, we will introduce in-place editing capabilities to the fundamental `FieldRenderer` component, allowing users to click and edit data directly. This requires plumbing the update logic from our UI components back to the central state management. Second, we will overhaul the `DetailPanel` component itself. It will be redesigned to support a Notion-like aesthetic with cover images and icons, and crucially, we'll implement drag-and-drop functionality for its content sections, giving users control over their data layout.

    By the end of this refactor, selecting an item in the `DataDemoPage` will launch an elegant, editable, and re-orderable side pane, dramatically improving the application's interactivity and aligning it with modern productivity app standards.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Implement In-Place Field Editing'
      reason: |
        The foundation of a Notion-like experience is the ability to edit content directly where it's displayed. This part will replace static text fields with interactive components that can be edited in-place, with changes propagating back to the data store.
      steps:
        - uuid: 'b9d8c7e6-f5a4-4b3c-2a1b-0987654321fe'
          status: 'todo'
          name: '1. Wire Up Update Logic from Store to View'
          reason: |
            The `DynamicView` component is decoupled from the data store. We need to explicitly pass the `updateItem` action from `useDataDemoStore` to `DynamicView` so that child components like `FieldRenderer` can trigger data updates.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - 'In `DataDemoPage`, import `useDataDemoStore`.'
            - 'Destructure the `updateItem` action from the store hook: `const { updateItem } = useDataDemoStore()`. '
            - 'Pass this action to the `<DynamicView />` component via the `onItemUpdate` prop: `onItemUpdate={updateItem}`.'
        - uuid: 'c3d4e5f6-7890-1234-5678-90abcdef1234'
          status: 'todo'
          name: '2. Enhance FieldRenderer with Editing Capabilities'
          reason: |
            `FieldRenderer` is the single component responsible for rendering all data types. We will augment it to handle an `isEditable` state, switching between a display view and an appropriate input element.
          files:
            - 'src/features/dynamic-view/components/shared/FieldRenderer.tsx'
          operations:
            - "Add a new prop to `FieldRendererProps`: `isEditable?: boolean`."
            - 'Import `useState` from React and `useDynamicView` to get access to `onItemUpdate`.'
            - "For simple types like `'string'` and `'longtext'`, introduce a local state: `const [isEditing, setIsEditing] = useState(false)`."
            - "If `isEditable` is true, wrap the output in a clickable element that sets `isEditing` to true."
            - 'When `isEditing` is true, render an `<input>` or `<textarea>` instead of a `<span>`.'
            - "Implement `onBlur` and `onKeyDown` handlers for the input. On blur or `Enter` key press, call `onItemUpdate(item.id, { [fieldId]: newValue })` and set `isEditing` to false."
            - "On `Escape` key press, discard changes and set `isEditing` to false."
            - 'Leave complex types like `avatar` or `badge` as read-only for now, focusing on text-based fields.'
        - uuid: 'd4e5f6g7-8901-2345-6789-0abcdef12345'
          status: 'todo'
          name: '3. Enable Editing within the Detail Panel'
          reason: |
            The `DetailPanel` is the container for all the fields. It needs to signal to `FieldRenderer` that its fields should be editable.
          files:
            - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
          operations:
            - 'Add a new prop to `DetailPanelProps`: `isEditable?: boolean`.'
            - 'When mapping over fields to render `FieldRenderer`, pass the `isEditable` prop down: `<FieldRenderer ... isEditable={isEditable} />`.'
            - 'In `useRightPaneContent.hook.tsx`, when rendering `DetailPanel` for a `dataItem`, set `isEditable={true}`.'
      context_files:
        compact:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/features/dynamic-view/components/shared/FieldRenderer.tsx'
          - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
        medium:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/features/dynamic-view/components/shared/FieldRenderer.tsx'
          - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'
          - 'src/hooks/useRightPaneContent.hook.tsx'
        extended:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/features/dynamic-view/components/shared/FieldRenderer.tsx'
          - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'
          - 'src/hooks/useRightPaneContent.hook.tsx'
          - 'src/features/dynamic-view/DynamicViewContext.tsx'
          - 'src/pages/DataDemo/DataDemo.config.tsx'
    - uuid: 'e6f7g8h9-0123-4567-8901-234567abcdef'
      status: 'todo'
      name: 'Part 2: Implement Draggable Sections & Notion UI'
      reason: |
        To complete the Notion-like experience, the detail panel's structure must be fluid. This part focuses on allowing users to reorder content sections via drag-and-drop and redesigning the panel's chrome to be cleaner and more modern.
      steps:
        - uuid: 'f7g8h9i0-1234-5678-9012-345678abcdef'
          status: 'todo'
          name: '1. Redesign DetailPanel Header'
          reason: |
            The current header is generic. A Notion-style header includes placeholders for a cover image and page icon, and treats the title as the primary editable element.
          files:
            - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
          operations:
            - 'At the top of the component, add a placeholder `div` for a cover image with a subtle hover effect and an "Add Cover" button.'
            - 'Just above the title, add a placeholder for a page icon, with a similar "Add Icon" hover button.'
            - "Modify the rendering of the `titleField`. Instead of using a standard `FieldRenderer`, render it as a larger, font-weighty `h1`-like element and wrap it with its own in-place editing logic to make it stand out."
            - 'Rework the `badgeFields` and `progressField` to appear below the title as a list of "properties", rather than being embedded in the header.'
        - uuid: 'g8h9i0j1-2345-6789-0123-456789abcdef'
          status: 'todo'
          name: '2. Implement Drag-and-Drop for Body Sections'
          reason: |
            The core of a customizable workspace is layout flexibility. We will enable drag-and-drop for the content sections within the detail panel's body.
          files:
            - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
          operations:
            - 'Import `useState` and `GripVertical` from `lucide-react`.'
            - 'Create a local state to manage the order of sections, initialized from the view config: `const [sections, setSections] = useState(config.body.sections)`.'
            - 'Map over the `sections` state to render the sections instead of directly mapping over `config.body.sections`.'
            - 'Wrap each section in a `div` with `draggable={true}` and attach `onDragStart`, `onDragOver`, and `onDrop` event handlers.'
            - 'Add a `GripVertical` icon as a drag handle that appears on hover next to each section title.'
            - 'Implement the drag-and-drop handler functions (`handleDragStart`, `handleDragOver`, `handleDrop`) to update the `sections` state array, reordering the elements. Borrow logic from `KanbanView.tsx` for a consistent implementation.'
        - uuid: 'h9i0j1k2-3456-7890-1234-567890abcdef'
          status: 'todo'
          name: '3. Adjust Styling for a Cleaner Aesthetic'
          reason: |
            The final step is to adjust the overall styling to match the spacious, clean, and minimalist design language of applications like Notion.
          files:
            - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
          operations:
            - 'Reduce the overall padding within the panel to give content more room to breathe.'
            - 'Increase the spacing between sections and fields to improve readability.'
            - 'Use a consistent and cleaner typography scale for titles, labels, and content.'
            - 'Ensure all interactive elements (buttons, drag handles) have clear hover and focus states.'
      context_files:
        compact:
          - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
          - 'src/features/dynamic-view/components/views/KanbanView.tsx'
        medium:
          - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
          - 'src/features/dynamic-view/components/views/KanbanView.tsx'
          - 'src/pages/DataDemo/DataDemo.config.tsx'
          - 'src/features/dynamic-view/types.ts'
        extended:
          - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
          - 'src/features/dynamic-view/components/views/KanbanView.tsx'
          - 'src/pages/DataDemo/DataDemo.config.tsx'
          - 'src/features/dynamic-view/types.ts'
          - 'src/hooks/useRightPaneContent.hook.tsx'
          - 'src/index.css'
  conclusion: |
    Upon completion, this refactor will fundamentally elevate the Data Demo feature from a simple data display to a powerful, interactive editing experience. Users will be able to modify data seamlessly within an overlay panel that is both aesthetically pleasing and highly functional, featuring customizable layouts through drag-and-drop.

    This effort not only delivers a significant UX improvement but also establishes a robust pattern for creating editable, dynamic interfaces elsewhere in the application. The enhanced `FieldRenderer` and `DetailPanel` will serve as powerful, reusable primitives for future development.
  context_files:
    compact:
      - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
      - 'src/features/dynamic-view/components/shared/FieldRenderer.tsx'
      - 'src/pages/DataDemo/index.tsx'
    medium:
      - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
      - 'src/features/dynamic-view/components/shared/FieldRenderer.tsx'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/store/dataDemo.store.tsx'
      - 'src/hooks/useRightPaneContent.hook.tsx'
      - 'src/pages/DataDemo/DataDemo.config.tsx'
    extended:
      - 'src/features/dynamic-view/components/shared/DetailPanel.tsx'
      - 'src/features/dynamic-view/components/shared/FieldRenderer.tsx'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/store/dataDemo.store.tsx'
      - 'src/hooks/useRightPaneContent.hook.tsx'
      - 'src/pages/DataDemo/DataDemo.config.tsx'
      - 'src/features/dynamic-view/types.ts'
      - 'src/features/dynamic-view/DynamicView.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'
```
