Alright, let's architect this refactor. We're adding a `split_view` mode. The current setup is slick but binary: content is either full-page or in a side-pane overlay. We're adding a third state where the main content and side pane live side-by-side, like civilized folk. No more hiding.

This is more than just a fresh coat of paint; we're tweaking the core layout engine. We'll touch the state machine, the animation hooks, and the main shell component. The goal is to make this feel native, not bolted on. Minimal disruption, maximum impact.

Here's the playbook.

---

```yaml
plan:
  uuid: '3a1f9e8b-5c7d-4b0a-9d2f-6c8e0a7b4f3c'
  status: 'todo'
  title: 'Introduce Split View Mode for Side-by-Side Content'
  introduction: |
    This refactor introduces a new 'split view' layout mode to the application shell. Currently, the shell supports a `NORMAL` view and a `SIDE_PANE` view where the right pane overlays the main content. This plan will add a `SPLIT_VIEW` mode, allowing the main content and the right pane to be displayed side-by-side, sharing the available horizontal space.

    The approach involves three main stages. First, we'll update the core state management within `AppShellContext` to recognize and handle the new `split_view` state. This includes adding the state enum and a dedicated action to toggle between overlay and split modes.

    Second, we will modify the layout and animation logic. The core animation hook, `useBodyStateAnimations`, will be updated to orchestrate the transition. Instead of having the right pane slide over the content, it will push the main content area aside by animating its margin, creating a seamless split. This requires adding a new `ref` to the main layout area in `AppShell.tsx` for precise animation control.

    Finally, we'll implement the UI controls for users to activate this new mode. A new toggle button will be added to the header of the `RightPane`, allowing users to switch between the overlay (`SIDE_PANE`) and `SPLIT_VIEW` modes dynamically. This ensures the control is contextually available when the pane is active.
  parts:
    - uuid: 'd9e0c1a4-8b7f-4c6d-8a1e-3f5b2c9d7a6b'
      status: 'todo'
      name: 'Part 1: Update State Management and Types'
      reason: |
        The foundation of the new feature is in the state management. We need to define the `SPLIT_VIEW` state so the entire application shell can recognize it. This involves updating our constants and then teaching the `AppShellContext` how to manage transitions into and out of this new state via a dedicated action.
      steps:
        - uuid: 'e1f8d3c2-7b5a-4e9f-8d1c-0a9b3c4d5e6f'
          status: 'todo'
          name: '1. Add SPLIT_VIEW to Body States'
          reason: |
            To introduce the new layout mode, we must first add `split_view` to the list of possible body states. This makes it a recognized state within the app's type system and state machine.
          files:
            - src/lib/utils.ts
          operations:
            - 'In `BODY_STATES`, add a new state: `SPLIT_VIEW: ''split_view''`.'
            - 'The `BodyState` type will automatically be updated by this change.'
        - uuid: 'a2b4c6d8-9e0f-4a1b-8c7d-5e3f4g1h2i3j'
          status: 'todo'
          name: '2. Implement toggleSplitView Action in Context'
          reason: |
            We need a dedicated action to switch between the `SIDE_PANE` (overlay) and the new `SPLIT_VIEW`. This keeps the state transition logic centralized and reusable. The action will be a simple toggle that only works when the right pane is already open in either mode.
          files:
            - src/context/AppShellContext.tsx
          operations:
            - 'In `AppShellContextValue`, add a new function signature: `toggleSplitView: () => void`.'
            - 'Implement the `toggleSplitView` function using `useCallback`. It should check if `state.bodyState` is `SIDE_PANE` and dispatch an action to set it to `SPLIT_VIEW`, and vice-versa. It should do nothing for other states like `NORMAL` or `FULLSCREEN`.'
            - 'Add the `toggleSplitView` function to the memoized `value` object returned by the `AppShellProvider`.'
      context_files:
        compact:
          - src/lib/utils.ts
          - src/context/AppShellContext.tsx
        medium:
          - src/lib/utils.ts
          - src/context/AppShellContext.tsx
        extended:
          - src/lib/utils.ts
          - src/context/AppShellContext.tsx
          - src/hooks/useAppShellAnimations.hook.ts

    - uuid: 'c3d5e7f9-1a2b-4c5d-8e9f-0a1b2c3d4e5f'
      status: 'todo'
      name: 'Part 2: Adapt Layout and Animation Engine'
      reason: |
        With the state management ready, we need to teach the layout how to render the `SPLIT_VIEW`. This involves modifying the main `AppShell` component to provide a handle for the main content area and updating the animation hook to control the layout of both the main content and the right pane during state transitions.
      steps:
        - uuid: 'b4e6f8a0-2b3c-4d5e-8f9a-1b2c3d4e5f6g'
          status: 'todo'
          name: '1. Add a Ref to the Main Content Area'
          reason: |
            To create the split view, we need to animate the container of the main content, not just the content itself. Adding a dedicated ref allows the animation hook to target this container directly.
          files:
            - src/components/layout/AppShell.tsx
          operations:
            - 'Create a new ref named `mainAreaRef` using `useRef<HTMLDivElement>(null)`.'
            - 'Assign `ref={mainAreaRef}` to the `div` that wraps the `topBarContainerRef` and `mainContentWithProps`. This is the div with `className="relative flex-1..."`.'
            - 'Pass `mainAreaRef` to the `useBodyStateAnimations` hook.'
        - uuid: 'f7g9h1i2-3c4d-5e6f-9a0b-1c2d3e4f5g6h'
          status: 'todo'
          name: '2. Update Animation Logic for Split View'
          reason: |
            The core of the visual change happens here. We update the animation hook to handle the `SPLIT_VIEW` state. It will now animate the `marginRight` of the main content area to make space for the right pane and ensure the overlay backdrop is hidden in this mode.
          files:
            - src/hooks/useAppShellAnimations.hook.ts
          operations:
            - 'Update the `useBodyStateAnimations` function signature to accept the new `mainAreaRef`.'
            - 'Inside the `useEffect`, define a new constant: `const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;`.'
            - 'Modify the GSAP animation for `rightPaneRef.current`. The `x` property should be `isSidePane || isSplitView ? 0 : rightPaneWidth + 5` to ensure it is visible in both modes.'
            - 'Add a new GSAP animation targeting `mainAreaRef.current` to animate its `marginRight` property. The value should be `isSplitView ? rightPaneWidth : 0`.'
            - 'Update the backdrop logic. The backdrop should only be created when `isSidePane` is true. Ensure it is removed for `isSplitView` and other states.'
      context_files:
        compact:
          - src/components/layout/AppShell.tsx
          - src/hooks/useAppShellAnimations.hook.ts
        medium:
          - src/components/layout/AppShell.tsx
          - src/hooks/useAppShellAnimations.hook.ts
          - src/context/AppShellContext.tsx
        extended:
          - src/components/layout/AppShell.tsx
          - src/hooks/useAppShellAnimations.hook.ts
          - src/context/AppShellContext.tsx
          - src/components/layout/RightPane.tsx
          - src/App.tsx

    - uuid: 'a5b6c7d8-e9f0-1a2b-3c4d-5e6f7g8h9i0j'
      status: 'todo'
      name: 'Part 3: Implement UI Controls'
      reason: |
        A new feature is useless without a way to access it. We will add a toggle button to the `RightPane`'s header, making it easy and intuitive for users to switch between the overlay and split view modes. We'll also refine the behavior of existing controls to be aware of the new state.
      steps:
        - uuid: 'h1i2j3k4-l5m6-n7o8-p9q0-r1s2t3u4v5w6'
          status: 'todo'
          name: '1. Add Split View Toggle Button'
          reason: |
            This step adds the user-facing control. The button will be placed in the right pane's header, providing a clear, contextual way to switch layout modes. Its icon will change to reflect the current state.
          files:
            - src/App.tsx
          operations:
            - 'Import the `SplitSquareHorizontal` and `Layers` icons from `lucide-react`.'
            - 'In the `ComposedApp` component, get `bodyState` and `toggleSplitView` from `useAppShell()`.'
            - 'Modify the `rightPaneHeader` JSX. Add a `div` to wrap the control buttons.'
            - 'Inside this wrapper, add a conditional `<button>` that renders when `bodyState` is `SIDE_PANE` or `SPLIT_VIEW`.'
            - 'The button''s `onClick` should call `toggleSplitView`.'
            - 'The button''s title and icon should change based on `bodyState`. Show `SplitSquareHorizontal` for `SIDE_PANE` and `Layers` for `SPLIT_VIEW`.'
        - uuid: 'x7y8z9a0-b1c2-d3e4-f5g6-h7i8j9k0l1m2'
          status: 'todo'
          name: '2. Adjust Right Pane Close Behavior'
          reason: |
            The external close handle on the `RightPane` implies a sliding-out motion, which doesn't make sense in `SPLIT_VIEW`. We will hide this handle in split view to avoid user confusion and rely on header controls for mode changes or closing.
          files:
            - src/components/layout/RightPane.tsx
          operations:
            - 'Import the `useAppShell` hook.'
            - 'Get `bodyState` from `useAppShell()`.'
            - 'Wrap the external close `<button>` (the one with `ChevronRight`) in a conditional render: `{bodyState !== ''split_view'' && (...) }`.'
      context_files:
        compact:
          - src/App.tsx
          - src/components/layout/RightPane.tsx
        medium:
          - src/App.tsx
          - src/components/layout/RightPane.tsx
          - src/context/AppShellContext.tsx
        extended:
          - src/App.tsx
          - src/components/layout/RightPane.tsx
          - src/context/AppShellContext.tsx
          - src/hooks/useAppShellAnimations.hook.ts

  conclusion: |
    Upon completion, the application shell will support a powerful new split view mode, enhancing user productivity and multitasking capabilities. The state management will be robust, animations will remain fluid, and the user controls will be intuitive.

    This refactor not only adds a significant feature but also demonstrates the flexibility of the underlying shell architecture. The changes are well-encapsulated, touching only the necessary parts of the state, animation, and layout systems, paving the way for future layout enhancements.
  context_files:
    compact:
      - src/lib/utils.ts
      - src/context/AppShellContext.tsx
      - src/hooks/useAppShellAnimations.hook.ts
      - src/components/layout/AppShell.tsx
      - src/components/layout/RightPane.tsx
      - src/App.tsx
    medium:
      - src/lib/utils.ts
      - src/context/AppShellContext.tsx
      - src/hooks/useAppShellAnimations.hook.ts
      - src/components/layout/AppShell.tsx
      - src/components/layout/RightPane.tsx
      - src/App.tsx
      - src/components/layout/MainContent.tsx
    extended:
      - src/lib/utils.ts
      - src/context/AppShellContext.tsx
      - src/hooks/useAppShellAnimations.hook.ts
      - src/components/layout/AppShell.tsx
      - src/components/layout/RightPane.tsx
      - src/App.tsx
      - src/components/layout/MainContent.tsx
      - src/components/layout/TopBar.tsx
```
