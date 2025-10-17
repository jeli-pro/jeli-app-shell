Alright, let's architect this refactor. The goal is to drop a seriously slick Kanban board view into the `DataDemo` page. We're talking drag-and-drop, clean aesthetics, the works. No messing around with heavy DnD libs; we'll leverage what the browser gives us.

The current setup is a good launchpad—it's already componentized and state-driven. We'll just extend it. This involves defining the new view type, adding the UI switch, building the board component itself, and then wiring it all into the main page logic. We'll manage the DnD state locally at first to nail the UX, with a clear path to persist changes via the existing Zustand store. This is about shipping a feature that not only works but feels great to use.

The plan is to slice this into four logical parts: foundational updates, component creation, implementing interactivity, and final integration. This approach minimizes complexity at each stage and ensures a clean, maintainable result. Let's get this thing built.

```yaml
plan:
  uuid: 'f4a8b1c2-3d9e-4a6f-8b7d-5e9c1a3b0f2e'
  status: 'todo'
  title: 'Implement Kanban Board View for Data Demo Page'
  introduction: |
    This plan outlines the addition of a new 'Kanban' view mode to the Data Demo feature. The goal is to create a visually appealing, interactive board with columns based on data groups (like 'status') and draggable cards representing data items. This will enhance data visualization and user interaction beyond the existing list, card, and table views.

    The approach involves four main phases. First, we'll establish the foundation by updating type definitions and UI controls to recognize the new Kanban view. Second, we will build the core `DataKanbanView` component, focusing on rendering the columns and cards with a modern aesthetic inspired by the user's example. Third, we will implement the drag-and-drop (DnD) functionality using the native HTML5 API for a lightweight and responsive experience. Finally, we'll integrate the new component into the main `DataDemoPage`, ensuring it works seamlessly with the existing view management and data grouping logic.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Foundational Updates for Kanban View'
      reason: |
        Before building the UI, we need to make the application aware of the new 'kanban' view mode. This involves updating core type definitions, the view mode selector component, and the URL state manager to handle the new option. This ensures the rest of the implementation can be built on a solid, recognized foundation.
      steps:
        - uuid: 'c7d8e9f0-1a2b-3c4d-5e6f-7a8b9c0d1e2f'
          status: 'todo'
          name: '1. Update ViewMode Type Definition'
          reason: |
            To formally introduce the Kanban view, the `ViewMode` type in `types.ts` must be extended. This is a critical first step for type safety and enabling logic for the new view throughout the feature.
          files:
            - 'src/pages/DataDemo/types.ts'
          operations:
            - "In `src/pages/DataDemo/types.ts`, find the `ViewMode` type alias."
            - "Add `'kanban'` as one of the possible literal types. The new type should be `export type ViewMode = 'list' | 'cards' | 'grid' | 'table' | 'kanban'`. "
        - uuid: 'b3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8'
          status: 'todo'
          name: '2. Add Kanban Icon to View Mode Selector'
          reason: |
            The user needs a way to switch to the new Kanban view. This step adds a dedicated button to the `DataViewModeSelector` component, making the new view discoverable and accessible.
          files:
            - 'src/pages/DataDemo/components/DataViewModeSelector.tsx'
          operations:
            - "Import a new icon for the Kanban view from `lucide-react`. The `KanbanSquare` or `LayoutDashboard` icon would be a good fit. Let's use `LayoutDashboard`."
            - "In the `modes` array within the `DataViewModeSelector` component, add a new object for the Kanban view: `{ id: 'kanban', label: 'Kanban', icon: LayoutDashboard }`."
            - "This will automatically render the new button and handle the `onClick` event via the existing `handleModeClick` function."
        - uuid: 'e8f9a0b1-c2d3-e4f5-a6b7-c8d9e0f1a2b3'
          status: 'todo'
          name: '3. Ensure App View Manager Handles Kanban Mode'
          reason: |
            The `useAppViewManager` hook is the source of truth for view state derived from the URL. While it should work generically with the new 'kanban' value, it's good practice to confirm no hardcoded logic would prevent it from functioning correctly.
          files:
            - 'src/hooks/useAppViewManager.hook.ts'
          operations:
            - "Review the `useAppViewManager` hook to ensure the `viewMode` logic is generic."
            - "The existing line `const viewMode = (searchParams.get('view') as ViewMode) ?? 'list'` should handle `'kanban'` correctly thanks to the type change in the previous step. No code change is likely needed, this is a verification step."
      context_files:
        compact:
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/components/DataViewModeSelector.tsx'
        medium:
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/components/DataViewModeSelector.tsx'
          - 'src/hooks/useAppViewManager.hook.ts'
        extended:
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/components/DataViewModeSelector.tsx'
          - 'src/hooks/useAppViewManager.hook.ts'
          - 'src/pages/DataDemo/index.tsx'

    - uuid: 'b6e5f4d3-c2b1-a098-7654-321fedcba987'
      status: 'todo'
      name: 'Part 2: Create the DataKanbanView Component'
      reason: |
        This part involves creating the main component for the Kanban board. It will be responsible for rendering the columns and the cards within them, based on the grouped data it receives. The focus is on structuring the component and achieving the desired visual style.
      steps:
        - uuid: 'd9e8f7a6-b5c4-d3e2-f1a0-b9c8d7e6f5a4'
          status: 'todo'
          name: '1. Create New File: DataKanbanView.tsx'
          reason: |
            A dedicated component is needed to encapsulate the logic and rendering of the Kanban board. This promotes separation of concerns and keeps the main `DataDemoPage` component clean.
          files:
            - 'src/pages/DataDemo/components/DataKanbanView.tsx'
          operations:
            - "Create a new file at `src/pages/DataDemo/components/DataKanbanView.tsx`."
            - "Define a new functional component `DataKanbanView` that accepts props similar to other views: `data: Record<string, DataItem[]>` and `onItemSelect: (item: DataItem) => void`."
            - "Import necessary components like `Card`, `Badge`, `Avatar`, and types like `DataItem`."
            - "Import icons from `lucide-react`: `GripVertical`, `Plus`, `Calendar`, `Paperclip`, etc."
        - uuid: 'c3b2a190-8765-4321-fedc-ba9876543210'
          status: 'todo'
          name: '2. Implement Kanban Column and Card Structure'
          reason: |
            To build the board, we need to render columns from the grouped data and then map the items within each group to individual task cards. This step lays out the static UI structure.
          files:
            - 'src/pages/DataDemo/components/DataKanbanView.tsx'
          operations:
            - "In `DataKanbanView`, map over `Object.entries(data)` to create a container for each column."
            - "Style the column container to match the example: `bg-white/20 dark:bg-neutral-900/20`, `backdrop-blur-xl`, `rounded-3xl`, `p-5`, `border`."
            - "Inside each column, render a header with the column title (the key from the data object) and the count of items."
            - "Map over the `tasks` (the `DataItem[]` array for each column) and render a placeholder for each `KanbanCard`."
            - "Create a sub-component `KanbanCard` within the file that takes an `item: DataItem` as a prop."
            - "Populate `KanbanCard` with key details from the `DataItem`, using shared components from `DataItemParts.tsx` where possible for assignee info, but also creating custom layouts for title, description, tags, and metrics (comments, attachments) as shown in the example."
            - "Use `cn` and TailwindCSS to style the cards with `cursor-move`, background colors with transparency, and hover effects."
      context_files:
        compact:
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/components/shared/DataItemParts.tsx'
          - 'src/components/ui/card.tsx'
        medium:
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/components/shared/DataItemParts.tsx'
          - 'src/components/ui/card.tsx'
          - 'src/components/ui/badge.tsx'
          - 'src/components/ui/avatar.tsx'
        extended:
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/components/shared/DataItemParts.tsx'
          - 'src/components/ui/card.tsx'
          - 'src/components/ui/badge.tsx'
          - 'src/components/ui/avatar.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx' # For reference on card layout

    - uuid: 'e4d3c2b1-a098-7654-321f-edcba9876543'
      status: 'todo'
      name: 'Part 3: Implement Drag-and-Drop Interactivity'
      reason: |
        A static Kanban board is not very useful. This part adds the core drag-and-drop functionality, allowing users to move tasks between columns. We will use the native HTML5 DnD API to keep it lightweight.
      steps:
        - uuid: 'f1a0b9c8-d7e6-f5a4-b3c2-a19087654321'
          status: 'todo'
          name: '1. Manage Board State for DnD'
          reason: |
            To enable DnD, the component needs to manage its own state for the columns and tasks, which can be updated when a drop occurs.
          files:
            - 'src/pages/DataDemo/components/DataKanbanView.tsx'
          operations:
            - "In `DataKanbanView`, use `useState` and `useEffect` to manage a local copy of the board data. Initialize it from the `data` prop: `const [columns, setColumns] = useState(data);`"
            - "Add a `useEffect` to sync the state when the incoming `data` prop changes: `useEffect(() => { setColumns(data); }, [data]);`"
        - uuid: 'a9b8c7d6-e5f4-a3b2-c190-87654321fedc'
          status: 'todo'
          name: '2. Implement DnD Event Handlers'
          reason: |
            The drag-and-drop lifecycle is managed by a set of event handlers on both the draggable items (cards) and the drop targets (columns).
          files:
            - 'src/pages/DataDemo/components/DataKanbanView.tsx'
          operations:
            - "On the `KanbanCard` component, add the `draggable={true}` attribute."
            - "Add an `onDragStart` handler to the `KanbanCard`. It should use `e.dataTransfer.setData()` to store the task's ID and its original column ID."
            - "On the column container `div`, add an `onDragOver` handler that calls `e.preventDefault()` to allow the element to be a drop target."
            - "On the column container `div`, add an `onDrop` handler. It should read the data from `e.dataTransfer.getData()`, find the task and source column, and then update the local `columns` state by removing the task from the source and adding it to the target column."
            - "Add a placeholder comment in the `onDrop` handler: `// TODO: Call a store action to persist this change, e.g., updateItemStatus(taskId, newStatus)`."
      context_files:
        compact:
          - 'src/pages/DataDemo/components/DataKanbanView.tsx'
          - 'src/pages/DataDemo/types.ts'
        medium:
          - 'src/pages/DataDemo/components/DataKanbanView.tsx'
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'
        extended:
          - 'src/pages/DataDemo/components/DataKanbanView.tsx'
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'

    - uuid: 'cba98765-4321-fedc-ba98-76543210fedc'
      status: 'todo'
      name: 'Part 4: Integrate Kanban View into DataDemo Page'
      reason: |
        With the component built and functional, the final step is to integrate it into the main page, so it renders when selected and receives the correct data. This also includes handling UX details, like ensuring data is grouped correctly for the board to display.
      steps:
        - uuid: '98765432-10fe-dcba-9876-543210fedcba'
          status: 'todo'
          name: '1. Conditionally Render DataKanbanView'
          reason: |
            The `DataDemoPage` needs to know when to render the new Kanban component based on the current `viewMode`.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - "Import `DataKanbanView` at the top of `src/pages/DataDemo/index.tsx`."
            - "In the `renderContent` function or conditional rendering block, add a new case: `if (viewMode === 'kanban') { return <DataKanbanView data={groupedData} onItemSelect={handleItemSelect} />; }`."
        - uuid: 'fedcba98-7654-3210-fedc-ba9876543210'
          status: 'todo'
          name: '2. Ensure Data is Grouped for Kanban View'
          reason: |
            The Kanban view is only useful when data is grouped (e.g., by status). We should enforce this grouping when the user switches to Kanban view for a better user experience.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - "In `DataDemoPage`, add a `useEffect` hook that listens for changes to `viewMode`."
            - "Inside the effect, check if `viewMode === 'kanban'` and `groupBy === 'none'`. If true, call `setGroupBy('status')` to automatically switch to a useful grouping for the board."
            - "This ensures users see a correctly formatted board by default when they select the Kanban view."
      context_files:
        compact:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/components/DataKanbanView.tsx'
        medium:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/components/DataKanbanView.tsx'
          - 'src/hooks/useAppViewManager.hook.ts'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'
        extended:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/components/DataKanbanView.tsx'
          - 'src/hooks/useAppViewManager.hook.ts'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'
          - 'src/pages/DataDemo/types.ts'

  conclusion: |
    Upon completion of this plan, the Data Demo feature will be significantly enhanced with a new, fully interactive Kanban board view. This not only provides a powerful new way for users to visualize and manage their data but also showcases the extensibility of the existing application architecture. The new `DataKanbanView` component will be a well-encapsulated, reusable piece of UI, and the foundational changes will ensure it is a first-class citizen alongside the other view modes.
  context_files:
    compact:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/types.ts'
      - 'src/pages/DataDemo/components/DataViewModeSelector.tsx'
      - 'src/pages/DataDemo/components/DataKanbanView.tsx'
    medium:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/types.ts'
      - 'src/pages/DataDemo/components/DataViewModeSelector.tsx'
      - 'src/pages/DataDemo/components/DataKanbanView.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'
      - 'src/pages/DataDemo/store/dataDemo.store.tsx'
    extended:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/types.ts'
      - 'src/pages/DataDemo/components/DataViewModeSelector.tsx'
      - 'src/pages/DataDemo/components/DataKanbanView.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'
      - 'src/pages/DataDemo/store/dataDemo.store.tsx'
      - 'src/pages/DataDemo/components/shared/DataItemParts.tsx'
      - 'src/components/ui/card.tsx'
```
