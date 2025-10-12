Here's the master plan to refactor the UI animations and fix visibility glitches.

```yaml
plan:
  uuid: '9b1d8f3a-6e4b-4f9e-8c7a-1b2d3c4f5e6a'
  status: 'todo'
  title: 'Refactor Data Demo Animations to Eliminate Initial Render Glitches'
  introduction: |
    Alright, here's the deal. The data demo page has some jank on initial load. We're seeing a flash of content before the `gsap` animations kick in. This is a classic FOUC-style problem caused by using `gsap.from()` inside a `useEffect`. The browser paints the final state, then JS runs, GSAP sets the 'from' state (e.g., `opacity: 0`), and then animates back. Flicker city.

    The fix is two-fold. First, we'll swap out `useEffect` for `useLayoutEffect` and replace `gsap.from()` with `gsap.fromTo()`. This is the canonical way to handle this. `useLayoutEffect` runs synchronously before the paint, so we can set up our 'from' state without the user ever seeing the un-animated version. `fromTo` gives us bulletproof control.

    Second, there's a redundant animation in the main `DataDemoPage` component that's wrapping the view components. It's animating the container while the components inside animate their own items. This is unnecessary and probably hurts perf when filtering. We're gonna axe it. This will clean up the code and make the animations snappier and more reliable.
  parts:
    - uuid: 'c4e5f6a7-8b9c-4d1e-af2g-3h4i5j6k7l8m'
      status: 'todo'
      name: 'Part 1: Harden Component Entry Animations'
      reason: |
        The core issue is that `useEffect` runs after the initial paint, causing a visual flicker when `gsap.from()` sets the initial animation state. By switching to `useLayoutEffect` and `gsap.fromTo()`, we take full control of the element's state before the browser renders it, guaranteeing a smooth, flicker-free entrance animation.
      steps:
        - uuid: 'd1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5g'
          status: 'todo'
          name: '1. Refactor DataCardView Animation'
          reason: |
            To fix the initial flicker for the card view by ensuring GSAP controls the component's styles before the first paint.
          files:
            - src/pages/DataDemo/components/DataCardView.tsx
          operations:
            - 'Import `useLayoutEffect` instead of `useEffect` from React.'
            - 'Replace the `useEffect` hook with `useLayoutEffect`.'
            - 'Convert the `gsap.from()` call to a `gsap.fromTo()` call.'
            - 'Define the "from" properties (`opacity: 0`, `y: 40`, `scale: 0.95`) in the first argument of `fromTo`.'
            - 'Define the "to" properties (`opacity: 1`, `y: 0`, `scale: 1`) and animation parameters in the second argument.'
        - uuid: 'h6i7j8k9-l0m1-4n2o-3p4q-5r6s7t8u9v0w'
          status: 'todo'
          name: '2. Refactor DataListView Animation'
          reason: |
            To apply the same flicker-fix to the list view, creating a consistent and smooth loading experience across view modes.
          files:
            - src/pages/DataDemo/components/DataListView.tsx
          operations:
            - 'Import `useLayoutEffect` instead of `useEffect`.'
            - 'Replace the `useEffect` hook with `useLayoutEffect`.'
            - 'Convert `gsap.from()` to `gsap.fromTo()`.'
            - 'Set "from" state: `{ opacity: 0, y: 30 }`.'
            - 'Set "to" state and parameters, including `opacity: 1` and `y: 0`.'
        - uuid: 'x1y2z3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5g'
          status: 'todo'
          name: '3. Refactor DataTableView Animation'
          reason: |
            To fix the initial render flicker for the table view, ensuring all data representations are robust.
          files:
            - src/pages/DataDemo/components/DataTableView.tsx
          operations:
            - 'Import `useLayoutEffect` from React, replacing `useEffect` if it becomes unused by other logic.'
            - 'Replace the animation `useEffect` with `useLayoutEffect`.'
            - 'Convert the `gsap.from()` targeting `tbody tr` to a `gsap.fromTo()` call.'
            - 'Set "from" state: `{ opacity: 0, y: 20 }`.'
            - 'Set "to" state and parameters, including `opacity: 1` and `y: 0`.'
        - uuid: 'a9b8c7d6-e5f4-4g3h-2i1j-0k9l8m7n6o5p'
          status: 'todo'
          name: '4. Refactor DataDetailPanel Animation'
          reason: |
            To ensure the detail panel also animates in smoothly without any flicker when it appears.
          files:
            - src/pages/DataDemo/components/DataDetailPanel.tsx
          operations:
            - 'Import `useLayoutEffect` instead of `useEffect`.'
            - 'Replace the `useEffect` hook with `useLayoutEffect`.'
            - 'Convert the `gsap.from()` call to `gsap.fromTo()`.'
            - 'Set "from" state: `{ opacity: 0, y: 30 }`.'
            - 'Set "to" state and parameters, including `opacity: 1` and `y: 0`.'
      context_files:
        compact:
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
        medium:
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/pages/DataDemo/index.tsx
        extended:
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/types.ts
    - uuid: 'q4r5s6t7-u8v9-4w0x-1y2z-3a4b5c6d7e8f'
      status: 'todo'
      name: 'Part 2: Simplify and Centralize Animation Logic'
      reason: |
        The parent component `DataDemoPage` currently applies its own animation to the view container, which is redundant since each child view component now handles its own entry animation. Removing this parent animation simplifies the code, prevents potential animation conflicts, and improves performance, especially during filtering operations.
      steps:
        - uuid: 'g1h2i3j4-k5l6-4m7n-8o9p-0q1r2s3t4u5v'
          status: 'todo'
          name: '1. Remove Redundant Animation from DataDemoPage'
          reason: |
            To eliminate the unnecessary container-level animation, making the child components the single source of truth for their entry animations.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'Remove the `useEffect` hook that targets `contentRef.current.children`.'
            - 'Remove `useEffect` from the React import statement if it is no longer used.'
      context_files:
        compact:
          - src/pages/DataDemo/index.tsx
        medium:
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
        extended:
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/components/DataCardView.tsx
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/DataTableView.tsx
          - src/components/shared/PageLayout.tsx
  conclusion: |
    By executing this plan, we'll squash the initial rendering bugs in the Data Demo. The animations will be rock-solid and flicker-free, providing a much smoother user experience. We'll also have cleaner, more efficient code by removing redundant animation logic. It's a win for both UX and maintainability.
  context_files:
    compact:
      - src/pages/DataDemo/components/DataCardView.tsx
      - src/pages/DataDemo/components/DataListView.tsx
      - src/pages/DataDemo/components/DataTableView.tsx
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/pages/DataDemo/index.tsx
    medium:
      - src/pages/DataDemo/components/DataCardView.tsx
      - src/pages/DataDemo/components/DataListView.tsx
      - src/pages/DataDemo/components/DataTableView.tsx
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/types.ts
    extended:
      - src/pages/DataDemo/components/DataCardView.tsx
      - src/pages/DataDemo/components/DataListView.tsx
      - src/pages/DataDemo/components/DataTableView.tsx
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/types.ts
      - src/components/shared/PageLayout.tsx
```
