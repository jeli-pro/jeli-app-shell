Here's the master plan for implementing the drag-and-drop sidebar feature.

```yaml
plan:
  uuid: '9b1a8c3d-f2e4-4d8a-9e6b-0c7f1a2b3d4e'
  status: 'todo'
  title: 'Implement Drag-and-Drop Sidebar for Split View'
  introduction: |
    Alright, let's wire this thing up. The goal is to let users drag items from the sidebar and drop them into the main content area to dynamically create a split view. This is a classic power-user feature that makes the shell feel more like a native desktop app.

    We'll build this in a clean, modular way. First, we'll lay the foundation with a new Drag-and-Drop (D&D) context to handle the global state of dragging. Then, we'll make the sidebar items draggable. After that, we'll define drop zones over our main content areas. Finally, we'll write the logic that triggers the app state change on a successful drop, rearranging the panes as needed.

    The result will be an intuitive way to multitask, allowing users to, for example, drag the 'Notifications' page next to their 'Dashboard' for a side-by-side view. It's all about boosting productivity and making the UI feel alive.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Create the D&D Foundation'
      reason: |
        We need a centralized system to manage the state of the drag-and-drop operation. A dedicated React context is the cleanest way to track what's being dragged, whether a drag is in progress, and to render a "ghost" preview that follows the cursor, without polluting other components with D&D logic.
      steps:
        - uuid: 'c7d8e9f0-1a2b-3c4d-5e6f-7a8b9c0d1e2f'
          status: 'todo'
          name: '1. Create DndContext'
          reason: |
            To establish the core state management for all D&D operations.
          files:
            - 'src/context/DndContext.tsx'
          operations:
            - "Create a new file `src/context/DndContext.tsx`."
            - "Define a context to hold D&D state: `isDragging` (boolean), `draggedItem` (object with page data), and `draggedNode` (ReactNode for preview)."
            - "Create a `DndProvider` that wraps its children and provides the context value."
            - "The provider will manage the state and contain functions like `startDrag` and `endDrag`."
            - "Implement a `DragPreview` component within the context file. It should render a portal-based element at the cursor's position, visible only when `isDragging` is true."
            - "The `DndProvider` should add `onDragEnd` and `onDragOver` listeners to the window to globally handle drag termination and track the cursor."
        - uuid: 'f3e2d1c0-b9a8-7c6d-5e4f-3a2b1c0d9e8f'
          status: 'todo'
          name: '2. Integrate DndProvider into the App'
          reason: |
            To make the D&D context available to the entire application shell.
          files:
            - 'src/App.tsx'
          operations:
            - "Import `DndProvider` from the newly created context file."
            - "In `App()` function, wrap the `<AppShellProvider>` component with `<DndProvider>` to ensure the D&D context is available everywhere inside the shell."
      context_files:
        compact:
          - 'src/App.tsx'
        medium:
          - 'src/App.tsx'
          - 'src/context/AppShellContext.tsx'
        extended:
          - 'src/App.tsx'
          - 'src/context/AppShellContext.tsx'
          - 'src/components/layout/AppShell.tsx'
    - uuid: 'b2c3d4e5-f6a7-8b90-c1d2-e3f4a5b6c7d8'
      status: 'todo'
      name: 'Part 2: Make Sidebar Items Draggable'
      reason: |
        With the foundation in place, we need to designate the source of our drag operations. The `AppMenuItem` component in the sidebar is the natural candidate. It needs to be modified to initiate a drag when a user clicks and drags it.
      steps:
        - uuid: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'
          status: 'todo'
          name: '1. Update AppMenuItem'
          reason: |
            To enable drag initiation on sidebar items that correspond to a page.
          files:
            - 'src/components/layout/EnhancedSidebar.tsx'
          operations:
            - "Import the `useDnd` hook from `DndContext.tsx`."
            - "In the `AppMenuItem` component, get the `startDrag` function from `useDnd()`."
            - "Add a `draggable=true` attribute to the `<SidebarMenuButton>` element, but only if the menu item has a `page` prop."
            - "Add an `onDragStart` event handler to the `<SidebarMenuButton>`."
            - "Inside `onDragStart`, call `startDrag`, passing an object with the item's `page`, `label`, and the `Icon` component itself for rendering the preview. Also pass a reference to the dragged element to render a preview node."
      context_files:
        compact:
          - 'src/components/layout/EnhancedSidebar.tsx'
        medium:
          - 'src/components/layout/EnhancedSidebar.tsx'
          - 'src/context/DndContext.tsx'
        extended:
          - 'src/components/layout/EnhancedSidebar.tsx'
          - 'src/context/DndContext.tsx'
          - 'src/store/appStore.ts'
    - uuid: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f'
      status: 'todo'
      name: 'Part 3: Centralize Page-to-Pane Mapping'
      reason: |
        The logic to map a page (like 'settings') to a pane content key (like 'settings') exists but is locally scoped in `ViewModeSwitcher`. To use this logic for our drop handler, we need to extract it into a shared, easily importable location. This avoids code duplication and creates a single source of truth.
      steps:
        - uuid: '4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e'
          status: 'todo'
          name: '1. Create Mappings File and Refactor'
          reason: |
            To centralize the mapping between `ActivePage` types and `sidePaneContent` types.
          files:
            - 'src/lib/mappings.ts'
            - 'src/components/layout/ViewModeSwitcher.tsx'
          operations:
            - "Create a new file `src/lib/mappings.ts`."
            - "Move the `pageToPaneMap` constant from `ViewModeSwitcher.tsx` into `src/lib/mappings.ts` and export it."
            - "Update `ViewModeSwitcher.tsx` to import `pageToPaneMap` from the new `mappings.ts` file."
      context_files:
        compact:
          - 'src/components/layout/ViewModeSwitcher.tsx'
        medium:
          - 'src/components/layout/ViewModeSwitcher.tsx'
        extended:
          - 'src/components/layout/ViewModeSwitcher.tsx'
          - 'src/store/appStore.ts'
    - uuid: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a'
      status: 'todo'
      name: 'Part 4: Implement Drop Zones and Finalize Logic'
      reason: |
        This is where the magic happens. We need to define areas where the user can drop items and then implement the logic to handle the drop. This involves creating a reusable `DropZone` component and integrating it into the `AppShell` to modify the application's layout state.
      steps:
        - uuid: '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f'
          status: 'todo'
          name: '1. Create DropZone Component'
          reason: |
            To create a reusable component for handling drop events and providing visual feedback.
          files:
            - 'src/components/shared/DropZone.tsx'
          operations:
            - "Create a new file `src/components/shared/DropZone.tsx`."
            - "The component will accept `side` ('left' | 'right') and `onDropItem` props."
            - "It will render a div that covers one half of the main area."
            - "Implement `onDragEnter`, `onDragLeave`, and `onDragOver` handlers to toggle a visual highlight class (e.g., a dashed border and semi-transparent background)."
            - "Implement the `onDrop` handler, which will call `e.preventDefault()`, remove the highlight, and invoke the `onDropItem` callback, passing the `draggedItem` from the `DndContext` and its own `side`."
        - uuid: '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a'
          status: 'todo'
          name: '2. Integrate DropZones into AppShell'
          reason: |
            To position the drop zones in the UI and connect them to the application state logic.
          files:
            - 'src/components/layout/AppShell.tsx'
            - 'src/index.ts'
          operations:
            - "In `AppShell.tsx`, import `useDnd`, `useAppStore`, `DropZone`, and `pageToPaneMap`."
            - "Inside the main area `div`, conditionally render two `<DropZone>` components (one for 'left', one for 'right') only when `isDragging` from the `DndContext` is true."
            - "Create a `handleDrop` function within `AppShell.tsx`."
            - "The `handleDrop` function will take the `draggedItem` and `side` as arguments."
            - "Inside `handleDrop`, implement the logic: "
            - "  - If `side` is 'right', use `pageToPaneMap` to find the pane content key for the dropped page, then dispatch actions to set the `sidePaneContent` and change `bodyState` to `SPLIT_VIEW`."
            - "  - If `side` is 'left', get the current `activePage` and find its corresponding `paneContent` key. Dispatch an action to move *it* to the `sidePaneContent`. Then, call `setActivePage` with the dropped page's ID. Finally, set `bodyState` to `SPLIT_VIEW`."
            - "Pass the `handleDrop` function to the `onDropItem` prop of the `<DropZone>` components."
            - "Export the new `DropZone` component from `src/index.ts` under shared components."
      context_files:
        compact:
          - 'src/components/layout/AppShell.tsx'
          - 'src/context/DndContext.tsx'
          - 'src/lib/mappings.ts'
        medium:
          - 'src/components/layout/AppShell.tsx'
          - 'src/context/AppShellContext.tsx'
          - 'src/store/appStore.ts'
          - 'src/context/DndContext.tsx'
          - 'src/lib/mappings.ts'
        extended:
          - 'src/components/layout/AppShell.tsx'
          - 'src/context/AppShellContext.tsx'
          - 'src/store/appStore.ts'
          - 'src/context/DndContext.tsx'
          - 'src/lib/mappings.ts'
          - 'src/components/layout/MainContent.tsx'
          - 'src/components/layout/RightPane.tsx'
  conclusion: |
    Once these parts are complete, the app shell will have a powerful and intuitive drag-and-drop interface for managing split views. This enhances the user experience by providing desktop-grade window management capabilities directly in the browser. The implementation is modular, with a clear separation between the D&D mechanics, the draggable items, and the drop targets, making it maintainable and extensible for future features.
  context_files:
    compact:
      - 'src/components/layout/AppShell.tsx'
      - 'src/components/layout/EnhancedSidebar.tsx'
      - 'src/context/AppShellContext.tsx'
      - 'src/App.tsx'
    medium:
      - 'src/components/layout/AppShell.tsx'
      - 'src/components/layout/EnhancedSidebar.tsx'
      - 'src/context/AppShellContext.tsx'
      - 'src/store/appStore.ts'
      - 'src/App.tsx'
      - 'src/components/layout/ViewModeSwitcher.tsx'
    extended:
      - 'src/components/layout/AppShell.tsx'
      - 'src/components/layout/EnhancedSidebar.tsx'
      - 'src/context/AppShellContext.tsx'
      - 'src/store/appStore.ts'
      - 'src/App.tsx'
      - 'src/components/layout/ViewModeSwitcher.tsx'
      - 'src/lib/utils.ts'
      - 'src/components/layout/MainContent.tsx'
      - 'src/components/layout/RightPane.tsx'
```
