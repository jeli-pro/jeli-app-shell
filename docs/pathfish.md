Here is the master plan for the code refactoring.

```yaml
plan:
  uuid: 'c8a2b1f3-7e4d-4a1b-9f0c-6d9e8a7b3c2d'
  status: 'todo'
  title: 'Refactor Sidebar Toggle and TopBar Layout'
  introduction: |
    This plan orchestrates a two-part refactor to improve the UI/UX of the application shell. The primary goals are to enhance component encapsulation and create a more intuitive, conventional layout.

    First, we'll relocate the sidebar toggle control from the global `TopBar` into the `Sidebar` component itself. This is a cleaner architecture, as a component should ideally manage its own state toggles. The new toggle will be stateful, visually indicating whether it will collapse or expand the sidebar, improving user feedback.

    Second, we'll address the layout of the `TopBar`. The breadcrumb navigation, currently pushed away from the edge, will be permanently anchored to the far left. This creates a more standard and predictable header layout, ensuring a consistent starting point for user navigation across all pages. These changes will be implemented carefully to avoid any animation lag or race conditions.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'
      status: 'todo'
      name: 'Part 1: Relocate and Enhance Sidebar Toggle'
      reason: |
        The current sidebar toggle resides in the `TopBar`, which breaks component encapsulation. A component should ideally contain the controls that manipulate it. By moving the toggle inside the sidebar, we create a more self-contained and reusable `Sidebar` component.

        Furthermore, the toggle will be made "stateful," meaning its icon will change to reflect the action it will perform (collapse or expand). This provides clearer visual feedback to the user.
      steps:
        - uuid: 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e'
          status: 'todo'
          name: '1. Remove Toggle Button from TopBar'
          reason: |
            The `Menu` button in the `TopBar` is the current sidebar toggle. This step removes it from its current location to prepare for its relocation into the sidebar component.
          files:
            - src/components/layout/TopBar.tsx
          operations:
            - "Delete the entire `<button>` element responsible for toggling the sidebar, which contains the `<Menu>` icon."
            - "The parent `div` for the 'Left Section' will now be empty, awaiting the breadcrumb content in Part 2."
        - uuid: 'c2d3e4f5-a6b7-8c9d-0e1f-2a3b4c5d6f7a'
          status: 'todo'
          name: '2. Implement Stateful Toggle in Sidebar Header'
          reason: |
            This step creates the new, improved toggle button within the sidebar's header, making it an integral part of the sidebar. The button will change its icon based on the sidebar's current state (collapsed or expanded).
          files:
            - src/components/layout/EnhancedSidebar.tsx
          operations:
            - "Import `PanelLeftClose` from 'lucide-react'."
            - "Within the `EnhancedSidebar` component, inside the `<SidebarHeader>`."
            - "After the `<SidebarTitle>` component, add a new `<button>` for toggling."
            - "Use the `useAppShellStore` to get the `toggleSidebar` action and `sidebarState`."
            - "The button's `onClick` handler should call `toggleSidebar`."
            - "The button should be styled to be pushed to the right of the header, for instance using `ml-auto`."
            - "The button's icon should be `<PanelLeftClose />` as it will only be visible when the sidebar is expanded, and its purpose is to collapse it."
            - "Ensure the button is only rendered when the sidebar is not collapsed. The logic to expand the sidebar from a collapsed state is handled by other interactions (like hover or a different UI element if designed)."
    - uuid: 'd3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6f7a8b'
      status: 'todo'
      name: 'Part 2: Re-align TopBar Breadcrumb'
      reason: |
        The breadcrumb's current alignment is inconsistent and not anchored to the left edge, which is standard practice for primary navigation elements. This part corrects the layout for better visual hierarchy and predictability.
      steps:
        - uuid: 'e4f5a6b7-c8d9-0e1f-2a3b-4c5d6f7a8b9c'
          status: 'todo'
          name: "1. Modify AppShell's TopBar Composition"
          reason: |
            The `TopBar` component's structure needs to be adjusted to correctly place its children (the breadcrumb and page-specific actions) in the leftmost area.
          files:
            - src/components/layout/AppShell.tsx
          operations:
            - "Locate the `topBar` prop being passed to the `AppShell` component."
            - "The `AppTopBar` component is currently passed as a child inside the `TopBar`. This structure is correct, but we need to ensure the parent `TopBar` places it correctly."
        - uuid: 'f5a6b7c8-d9e0-1f2a-3b4c-5d6f7a8b9c0d'
          status: 'todo'
          name: "2. Adjust TopBar's Internal Layout"
          reason: |
            To force the breadcrumb to the left, the `TopBar` component must be told to render its children in the "left section" of its flex layout.
          files:
            - src/components/layout/TopBar.tsx
          operations:
            - "In the `TopBar` component's JSX, move the `{children}` prop inside the 'Left Section' `div`."
            - "This div previously held the `Menu` icon and should now be the designated area for breadcrumbs or other primary page identifiers."
        - uuid: 'a6b7c8d9-e0f1-2a3b-4c5d-6f7a8b9c0e1f'
          status: 'todo'
          name: "3. Refine AppTopBar Component Layout"
          reason: |
            The `AppTopBar` component in `App.tsx` contains flex spacer elements that push the breadcrumb away from the left edge. These need to be removed.
          files:
            - src/App.tsx
          operations:
            - "Find the `AppTopBar` functional component."
            - "Remove the `<div className=\"flex-1\" />` spacer element."
            - "In the root `div` of `AppTopBar`, which has `className=\"flex items-center gap-3 flex-1\"`, remove the `flex-1` class."
  conclusion: |
    Upon completion, this refactor will result in a more robust and intuitive application shell. The sidebar will be a self-contained unit with its own state controls, improving code organization and reusability. The `TopBar` will feature a logically aligned layout, with primary navigation elements anchored to the left, adhering to common UX patterns.

    These changes provide a cleaner foundation for future development and a better, more predictable experience for the end-user, all while ensuring smooth transitions and a responsive feel.
  context_files:
    compact:
      - src/components/layout/TopBar.tsx
      - src/components/layout/EnhancedSidebar.tsx
      - src/App.tsx
    medium:
      - src/components/layout/TopBar.tsx
      - src/components/layout/EnhancedSidebar.tsx
      - src/App.tsx
      - src/components/layout/AppShell.tsx
      - src/components/layout/Sidebar.tsx
    extended:
      - src/components/layout/TopBar.tsx
      - src/components/layout/EnhancedSidebar.tsx
      - src/App.tsx
      - src/components/layout/AppShell.tsx
      - src/components/layout/Sidebar.tsx
      - src/store/appShell.store.ts
```
