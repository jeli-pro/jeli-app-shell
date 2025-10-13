Alright, so the last push was a good start, but it looks like we introduced a classic state-transition bug with the animations. Happens to the best of us. When you're juggling multiple layout states (`SIDE_PANE` vs `SPLIT_VIEW`), the exit animation for one mode can screw up the entry animation for another. The result? A visible backdrop with an invisible pane, aka the "dark screen of death". Classic.

The core of the issue is in `useAppShellAnimations.hook.ts`. The logic was trying to be too clever and ended up in a state where a pane hidden by shrinking its `width` (for split-view) wouldn't properly slide in with `transform: translateX` (for the overlay side-pane) because it was still a zero-width element.

We need to make the animation logic dumber and more explicit. The fix is to ensure the exit animation is always the reverse of the mode we're leaving. If we're leaving `SIDE_PANE`, we slide it out. If we're leaving `SPLIT_VIEW`, we shrink it. This keeps the pane in a predictable state for the next time it needs to animate in.

Here is the plan to patch this up. It's a surgical strike, one file, one block of code.

```yaml
plan:
  uuid: 'e5f8a0b1-3c1a-4b7d-9a3d-4c8e7f1a2b3c'
  status: 'todo'
  title: 'Fix Pane Animation State Conflicts'
  introduction: |
    This plan addresses a follow-up issue where rapidly opening and closing the side pane (for both data item details and notifications) can result in a blank overlay, hiding the application content. This bug stems from conflicting animation properties (`width` vs. `transform`) in the `useAppShellAnimations.hook.ts` hook.

    The current logic doesn't consistently reset the pane's state when transitioning between different layout modes (e.g., from `SPLIT_VIEW` to `NORMAL` to `SIDE_PANE`). This can leave the pane with a `width` of `0` when it's expected to slide in via a `transform`, making it invisible.

    This refactor will replace the existing animation logic with a more robust, state-aware approach. The new logic will explicitly use the *previous* body state to determine the correct *exit* animation, ensuring the pane is always in a predictable state for any subsequent *entry* animation. This will eliminate the state conflict and provide smooth, reliable transitions for the right-hand pane across all application states.
  parts:
    - uuid: 'f1a2b3c4-d5e6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Refine Right Pane Animation Logic'
      reason: |
        The animation logic in `useAppShellAnimations.hook.ts` needs to be more explicit about how it hides and shows the `RightPane`. The current implementation can lead to inconsistent inline styles (`width` vs. `transform`), causing the pane to be invisible when it should be displayed. The fix is to base the exit animation on the *previous* state, ensuring visual continuity and a predictable starting point for the next animation.
      steps:
        - uuid: 'a1b2c3d4-e5f6-a7b8-9012-34567890cdef'
          status: 'todo'
          name: '1. Update useBodyStateAnimations Hook'
          reason: |
            To resolve the animation conflict, we will replace the entire logic block for the Right Pane animation within the `useEffect` of the `useBodyStateAnimations` hook. The new logic correctly handles transitions between `SIDE_PANE`, `SPLIT_VIEW`, and `NORMAL` states by using the appropriate animation property (`transform` for overlay, `width` for docked) and ensuring a clean handoff between states.
          files:
            - 'src/hooks/useAppShellAnimations.hook.ts'
          operations:
            - "In the `useBodyStateAnimations` hook, locate the `useEffect`."
            - "Inside the `useEffect`, find the comment `// Right pane animation`."
            - "Replace the entire logic block for the right pane animation (the `if/else if/else` block) with the new, more robust logic that correctly distinguishes between `SIDE_PANE`, `SPLIT_VIEW`, and hidden states based on `prevBodyState`."
            - "The new logic should first kill any existing tweens on `rightPaneRef.current` to prevent animation overlaps."
            - "It will then handle three primary cases: showing as an overlay (`isSidePane`), showing as a docked pane (`isSplitView`), or hiding the pane. The hiding logic will check `prevBodyState` to determine whether to slide out (from `SIDE_PANE`) or shrink (from `SPLIT_VIEW`)."
            - "The separate logic for the backdrop (`app-backdrop`) should remain unchanged."
      context_files:
        compact:
          - 'src/hooks/useAppShellAnimations.hook.ts'
        medium:
          - 'src/hooks/useAppShellAnimations.hook.ts'
          - 'src/context/AppShellContext.tsx'
        extended:
          - 'src/hooks/useAppShellAnimations.hook.ts'
          - 'src/context/AppShellContext.tsx'
          - 'src/App.tsx'
          - 'src/components/layout/RightPane.tsx'
  conclusion: |
    With this fix, the application's layout transitions will be rock solid. The "dark overlay" bug will be eliminated, and users will be able to fluidly switch between normal, side pane, and split views without any visual glitches. This small but critical adjustment reinforces the stability of the core app shell, making the entire user experience more polished and reliable.
  context_files:
    compact:
      - 'src/hooks/useAppShellAnimations.hook.ts'
    medium:
      - 'src/hooks/useAppShellAnimations.hook.ts'
      - 'src/context/AppShellContext.tsx'
      - 'src/App.tsx'
    extended:
      - 'src/hooks/useAppShellAnimations.hook.ts'
      - 'src/context/AppShellContext.tsx'
      - 'src/App.tsx'
      - 'src/components/layout/RightPane.tsx'
      - 'src/components/layout/AppShell.tsx'

```
