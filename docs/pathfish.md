Here's the master plan, architect style.

We're going to make the top bar in split view mode slicker than a greased-up watermelon. Right now, it's just sitting there, hogging precious vertical space. The new deal: it gets out of the way by default and only peeks back when you hover the top edge of the window. It's about giving users back their pixels.

The approach is surgical. First, we'll patch our central nervous system, the Zustand store, with a new state to track the hover status. Then, we'll rewire the animation logic in `useAppShellAnimations.hook.ts` to listen to this new signal. If we're in split view and not hovering, we'll tell GSAP to boot that top bar off-screen. Finally, the main `AppShell` component will get the simple mouse listeners to flip the state. This avoids polluting components with messy logic and keeps the animations smooth.

This is a clean, state-driven approach that respects the existing architecture. No hacks, just extending the system to be smarter. Let's lay out the schematics.

```yaml
plan:
  uuid: 'c8a2b1f3-5d7e-4b9a-8c1f-9d3e5a7b6a2c'
  status: 'todo'
  title: 'Auto-hide Top Bar on Split View with Hover Reveal'
  introduction: |
    Alright, listen up. The top bar in split view is a screen real estate hog. We're gonna make it slick. It'll get out of the way by default and only slide back in when you mouse over the top edge. Pure class.

    We'll pipe a new `isTopBarHovered` boolean into our Zustand store. The main `AppShell` component will be responsible for flipping this switch on mouse enter/leave events in the top bar area. Then, our existing GSAP animation hook, `useBodyStateAnimations`, will be modified to react to this new state. If the app is in split view and the user isn't hovering at the top, that top bar gets a `translateY(-100%)`.

    This keeps our logic tight and centralized. The scroll-based animation for the normal view remains untouched. It's a surgical strike, extending the system to be smarter without adding complexity where it doesn't belong. Let's get it done.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Augment App Shell State'
      reason: |
        We need a central, single source of truth to track whether the user's cursor is in the "reveal zone" for the top bar. The Zustand store is the right place for this to avoid prop-drilling and keep our components clean.
      steps:
        - uuid: '11aa22bb-33cc-44dd-55ee-66ff77gg88hh'
          status: 'todo'
          name: '1. Update appShell.store.ts'
          reason: |
            To add the new state and its corresponding action to the global `AppShell` store.
          files:
            - src/store/appShell.store.ts
          operations:
            - 'In the `AppShellState` interface, add a new property: `isTopBarHovered: boolean;`.'
            - 'In the `AppShellActions` interface, add a new action signature: `setTopBarHovered: (isHovered: boolean) => void;`.'
            - 'In the `defaultState` object, initialize the new state: `isTopBarHovered: false,`.'
            - 'Within the `create` function body, add the implementation for the new action: `setTopBarHovered: (isHovered) => set({ isTopBarHovered: isHovered }),`.'
      context_files:
        compact:
          - src/store/appShell.store.ts
        medium:
          - src/store/appShell.store.ts
          - src/hooks/useAppShellAnimations.hook.ts
        extended:
          - src/store/appShell.store.ts
          - src/hooks/useAppShellAnimations.hook.ts
          - src/components/layout/AppShell.tsx
    - uuid: 'b2c3d4e5-f6a7-8901-2345-678901bcdefa'
      status: 'todo'
      name: 'Part 2: Update Animation Logic for Split View'
      reason: |
        The core animation logic that controls the top bar's vertical position needs to be updated. It must now consider the new hover state, but *only* when the application is in split view mode.
      steps:
        - uuid: '22bb33cc-44dd-55ee-66ff-77gg88hh99ii'
          status: 'todo'
          name: '1. Modify useBodyStateAnimations hook'
          reason: |
            This hook is the central controller for major layout animations. We need to patch its logic to hide/show the top bar based on the new `isTopBarHovered` state when in split view.
          files:
            - src/hooks/useAppShellAnimations.hook.ts
          operations:
            - 'Inside the `useBodyStateAnimations` hook, import and subscribe to the new state from the store: `const isTopBarHovered = useAppShellStore(s => s.isTopBarHovered);`.'
            - 'Add `isTopBarHovered` to the dependency array of the main `useEffect` inside the hook.'
            - "Update the `topBarY` variable logic. The new logic should prioritize the `isTopBarHovered` state when `bodyState` is `SPLIT_VIEW`."
            - 'Replace the existing `topBarY` logic block with this enhanced version:
              ```typescript
              let topBarY = '0%';
              if (bodyState === BODY_STATES.FULLSCREEN) {
                topBarY = '-100%';
              } else if (bodyState === BODY_STATES.SPLIT_VIEW && !isTopBarHovered) {
                topBarY = '-100%';
              } else if (bodyState === BODY_STATES.NORMAL && !isTopBarVisible) {
                topBarY = '-100%';
              }
              ```'
      context_files:
        compact:
          - src/hooks/useAppShellAnimations.hook.ts
        medium:
          - src/hooks/useAppShellAnimations.hook.ts
          - src/store/appShell.store.ts
        extended:
          - src/hooks/useAppShellAnimations.hook.ts
          - src/store/appShell.store.ts
          - src/components/layout/AppShell.tsx
    - uuid: 'c3d4e5f6-a7b8-9012-3456-789012cdefab'
      status: 'todo'
      name: 'Part 3: Implement UI Hover Trigger'
      reason: |
        The state needs to be updated from the UI. The most logical place for the hover trigger is the `AppShell` component itself, which renders the top bar container. We will attach mouse listeners there.
      steps:
        - uuid: '33cc44dd-55ee-66ff-77gg-88hh99ii00jj'
          status: 'todo'
          name: '1. Add hover listeners to AppShell.tsx'
          reason: |
            To connect the user's mouse actions to the state management, we'll add `onMouseEnter` and `onMouseLeave` handlers to the top bar's container element.
          files:
            - src/components/layout/AppShell.tsx
          operations:
            - "In the `AppShell` component, get the `setTopBarHovered` action from the store: `const { ..., setTopBarHovered } = useAppShellStore.getState();`."
            - "Find the `div` with the `ref={topBarContainerRef}`."
            - "Modify its `onMouseEnter` handler to also call `setTopBarHovered(true)` when in split view. The existing call to `setHoveredPane(null)` should remain."
            - "Add a new `onMouseLeave` handler to the same `div` to call `setTopBarHovered(false)` when in split view."
            - 'The handlers should look like this:
              ```tsx
              onMouseEnter={() => {
                if (isSplitView) {
                  setTopBarHovered(true);
                  setHoveredPane(null);
                }
              }}
              onMouseLeave={() => {
                if (isSplitView) {
                  setTopBarHovered(false);
                }
              }}
              ```'
      context_files:
        compact:
          - src/components/layout/AppShell.tsx
        medium:
          - src/components/layout/AppShell.tsx
          - src/store/appShell.store.ts
        extended:
          - src/components/layout/AppShell.tsx
          - src/store/appShell.store.ts
          - src/hooks/useAppShellAnimations.hook.ts
  conclusion: |
    Once these changes are deployed, the top bar will behave intelligently in split view mode, maximizing screen real estate for the user while remaining easily accessible. This enhances the user experience by reducing visual clutter without sacrificing functionality. The implementation is clean, state-driven, and maintains a clear separation of concerns.
  context_files:
    compact:
      - src/store/appShell.store.ts
      - src/hooks/useAppShellAnimations.hook.ts
      - src/components/layout/AppShell.tsx
    medium:
      - src/store/appShell.store.ts
      - src/hooks/useAppShellAnimations.hook.ts
      - src/components/layout/AppShell.tsx
    extended:
      - src/store/appShell.store.ts
      - src/hooks/useAppShellAnimations.hook.ts
      - src/components/layout/AppShell.tsx
      - src/components/layout/TopBar.tsx
      - src/lib/utils.ts
```
