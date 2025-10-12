Ah, a classic case of scattered state logic. The current setup, with view controls sprinkled around, is asking for trouble. We've got buttons in the `TopBar`, buttons in the `App.tsx` content, and logic spread thin. It's time to forge a single source of truth for view management.

We're going to rip out the disparate view-toggle buttons and create a new, centralized `ViewModeSwitcher` component. This component will live in the `TopBar` and be the one and only place for a user to switch between `Normal`, `Side Pane`, `Split View`, and `Fullscreen` modes. Crucially, it will be context-aware. Clicking "Side Pane" won't just open a generic panel; it will intelligently move the *currently active page* into the side pane, making the UI feel intuitive and powerful.

This refactor will kill a whole class of potential state bugs, simplify the `TopBar` and `App` components, and give the user a clean, consistent control surface for managing their workspace. It's a classic move: centralize, simplify, and build a more robust foundation. Let's get to it.

```yaml
plan:
  uuid: 'c8a2b1f0-3e4d-4f6a-8b9c-9d0e1f2a3b4c'
  status: 'todo'
  title: 'Centralize View Mode Control into a Context-Aware Component'
  introduction: |
    Right now, the controls for changing the view mode (fullscreen, side pane) are scattered. There's a fullscreen button in the TopBar, and another page-specific button in the App's top bar content to move a page to the side pane. This is fragile and leads to duplicated logic.

    This plan outlines the process of ripping out these scattered controls and forging a new, centralized `ViewModeSwitcher` component. This new component will live in the TopBar and serve as the single source of truth for managing the application's view state.

    The key here is making it context-aware. It will use the application's state to know which page is currently active, so when the user clicks "Side Pane," it intelligently moves the correct content. This refactor will significantly clean up the codebase, improve user experience by providing a consistent control pattern, and make future modifications to view logic much easier.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Create the Context-Aware ViewModeSwitcher Component'
      reason: |
        We need a new, dedicated component to encapsulate the logic and UI for switching view modes. This centralizes control and makes it reusable and easier to manage. It will read from the global state to be context-aware and dispatch actions to change the view.
      steps:
        - uuid: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1'
          status: 'todo'
          name: '1. Create ViewModeSwitcher.tsx'
          reason: |
            This step establishes the new component file and its basic structure. We'll use shadcn/ui's `Tabs` component to create a visually appealing segmented control for the view modes.
          files:
            - 'src/components/layout/ViewModeSwitcher.tsx'
          operations:
            - 'Create a new file at `src/components/layout/ViewModeSwitcher.tsx`.'
            - 'Import React, necessary hooks (`useAppShell`, `useAppStore`), `cn`, and icons (`Columns3`, `PanelRightOpen`, `Maximize`, `SplitSquareHorizontal`) from `lucide-react`.'
            - 'Create a functional component `ViewModeSwitcher`.'
            - 'Use `useAppShell` to get `bodyState`, `openSidePane`, `closeSidePane`, `toggleFullscreen`, and `toggleSplitView`.'
            - 'Use `useAppStore` to get the `activePage`.'
            - 'Create a `pageToPaneMap` object to map `ActivePage` types (`dashboard`, `settings`, etc.) to `sidePaneContent` types (`main`, `settings`, etc.).'
            - 'Implement the UI using a wrapper div, which will contain the view mode buttons.'
        - uuid: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12'
          status: 'todo'
          name: '2. Implement Button Logic and Active States'
          reason: |
            The component needs to correctly reflect the current view state and dispatch the right actions when a user interacts with it. This logic is the core of making the component "context-aware".
          files:
            - 'src/components/layout/ViewModeSwitcher.tsx'
          operations:
            - 'Create a set of buttons for "Normal", "Side Pane", "Split View", and "Fullscreen" modes.'
            - 'Bind `onClick` handlers to each button:'
            - ' - "Normal" (`Columns3` icon) should call `closeSidePane()`.'
            - ' - "Side Pane" (`PanelRightOpen` icon) should call `openSidePane(pageToPaneMap[activePage])`.'
            - ' - "Split View" (`SplitSquareHorizontal` icon) should call `toggleSplitView()`.'
            - ' - "Fullscreen" (`Maximize` icon) should call `toggleFullscreen()`.'
            - 'Use the `cn` utility and the `bodyState` from `useAppShell` to conditionally apply an active style (e.g., `bg-accent`) to the button corresponding to the current view mode.'
            - 'For the "Side Pane" button, it should be considered active if `bodyState` is `side_pane`.'
            - 'For the "Split View" button, it should be considered active if `bodyState` is `split_view`.'
            - 'For the "Fullscreen" button, it should be considered active if `bodyState` is `fullscreen`.'
            - 'The "Normal" button should be active if `bodyState` is `normal`.'
            - 'Wrap the buttons in a styled container that looks like a segmented control, perhaps a `div` with `bg-card` and `rounded-full`.'

    - uuid: 'd4e5f6a7-b8c9-0123-4567-890abcdef123'
      status: 'todo'
      name: 'Part 2: Integrate ViewModeSwitcher and Refactor TopBar'
      reason: |
        With the new component built, we need to replace the old, fragmented controls in the `TopBar` to make the `ViewModeSwitcher` the single source of truth for these actions.
      steps:
        - uuid: 'e5f6a7b8-c9d0-1234-5678-90abcdef1234'
          status: 'todo'
          name: '1. Remove Old View Mode Buttons from TopBar'
          reason: |
            To avoid confusion and conflicting logic, the old individual buttons for fullscreen and side pane must be removed.
          files:
            - 'src/components/layout/TopBar.tsx'
          operations:
            - 'Open `src/components/layout/TopBar.tsx`.'
            - "Locate and delete the `button` responsible for toggling the side pane (the one using a custom `div` for its icon)."
            - "Locate and delete the `button` responsible for toggling fullscreen, which conditionally renders `<Maximize>` or `<Minimize>`."
            - "Clean up the `TopBarProps` interface, removing `onToggleFullscreen` as it's no longer needed."
        - uuid: 'f6a7b8c9-d0e1-2345-6789-0abcdef12345'
          status: 'todo'
          name: '2. Add ViewModeSwitcher to TopBar'
          reason: |
            The new component needs to be placed in the `TopBar` to be globally accessible.
          files:
            - 'src/components/layout/TopBar.tsx'
          operations:
            - 'Import the newly created `ViewModeSwitcher` component into `TopBar.tsx`.'
            - 'In the JSX, find the "Body State Controls" section. Replace the deleted buttons with the `<ViewModeSwitcher />` component.'
            - 'Ensure it is positioned logically, for example, next to the other quick actions, separated by a divider.'

    - uuid: '0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d'
      status: 'todo'
      name: 'Part 3: Clean Up Redundant Controls in App.tsx'
      reason: |
        The main application component (`App.tsx`) contains a page-specific control for moving content to the side pane. This is now redundant and should be removed to complete the centralization of view controls.
      steps:
        - uuid: '1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e'
          status: 'todo'
          name: "1. Remove 'Move to Side Pane' Button from AppTopBar"
          reason: |
            This button's functionality is now handled globally by the `ViewModeSwitcher`, so it must be removed to prevent UI duplication.
          files:
            - 'src/App.tsx'
          operations:
            - 'In `src/App.tsx`, locate the `AppTopBar` internal component.'
            - "Find and delete the `button` that uses the `PanelRight` icon and has the title 'Move to Side Pane'."
            - "Delete the corresponding `handleMoveToSidePane` function, as it's no longer used."

    - uuid: '2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f'
      status: 'todo'
      name: 'Part 4: Expose New Component from Library'
      reason: |
        To ensure the new `ViewModeSwitcher` component is accessible to consumers of the `jeli-app-shell` library, it must be exported from the main `index.ts` file.
      steps:
        - uuid: '3d4e5f6a-7b8c-9d0e-1f-2a3b4c5d6e7f8a'
          status: 'todo'
          name: '1. Export ViewModeSwitcher in index.ts'
          reason: |
            Properly exporting the component is essential for maintaining the library's public API.
          files:
            - 'src/index.ts'
          operations:
            - "Open `src/index.ts`."
            - "In the 'Layout Components' section, add an export for `ViewModeSwitcher`."
  conclusion: |
    By executing this plan, we will have successfully refactored the application's view management system. The new `ViewModeSwitcher` component centralizes all view-related logic, making the system more robust, easier to maintain, and predictable.

    The `TopBar` is now cleaner, containing a single, intuitive control for workspace layout. The removal of redundant page-specific controls simplifies the main `App` component. This results in a superior developer experience and a more polished and cohesive user experience.
  context_files:
    compact:
      - 'src/components/layout/TopBar.tsx'
      - 'src/App.tsx'
      - 'src/context/AppShellContext.tsx'
      - 'src/store/appStore.ts'
    medium:
      - 'src/components/layout/TopBar.tsx'
      - 'src/App.tsx'
      - 'src/context/AppShellContext.tsx'
      - 'src/store/appStore.ts'
      - 'src/components/layout/AppShell.tsx'
      - 'src/components/layout/RightPane.tsx'
    extended:
      - 'src/components/layout/TopBar.tsx'
      - 'src/App.tsx'
      - 'src/context/AppShellContext.tsx'
      - 'src/store/appStore.ts'
      - 'src/components/layout/AppShell.tsx'
      - 'src/components/layout/RightPane.tsx'
      - 'src/hooks/useAppShellAnimations.hook.ts'
      - 'src/lib/utils.ts'
```
