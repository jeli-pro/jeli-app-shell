Here's the master plan for the refactor, crafted in the requested style.

---

Alright, listen up. The `DataDemo` page is slick, but those stat cards are sticky. They hog vertical space like a bad ad banner, especially when you're deep-diving into the data. We're going to fix that.

The plan is to give them the "sliver app bar" treatment. When the user scrolls down, the stats container will gracefully GTFO. When they scroll back up, it'll slide right back in. This keeps the key metrics accessible at the top but prioritizes the content when the user is in the zone.

We'll forge a new, reusable hook to encapsulate the scroll-jacking and `gsap` magic. This keeps the page component clean and makes the pattern portable. Then, we'll wire it up in `DataDemoPage`. Simple, clean, effective. Let's make this thing feel alive.

```yaml
plan:
  uuid: '3a8d4f1c-6b2e-4f9a-8c7d-9e1b2f0a5c4d'
  status: 'todo'
  title: 'Sliver-ize the Data Demo Stats Header'
  introduction: |
    Right now, the stats cards on the Data Demo page are static. They eat up valuable screen real estate, especially on smaller viewports, forcing users to scroll past them every time. This is a classic UX bottleneck.

    We're going to refactor this to implement a sliver-style header for the stats section. The stats will gracefully animate out of view on a scroll-down gesture and reappear instantly on a scroll-up, letting users focus on the core data grid, list, or kanban board.

    To achieve this, we'll first encapsulate the animation logic within a new, dedicated hook (`useAutoAnimateStats.hook.ts`). This promotes reusability and keeps our component logic clean. Then, we'll integrate this hook into the `DataDemoPage` component, attaching it to the relevant DOM elements. The result will be a more dynamic and content-focused user experience.
  parts:
    - uuid: 'c1b9e0a2-f4d3-4e8b-9a1f-6c5d7e8f0a3b'
      status: 'todo'
      name: 'Part 1: Forge the Auto-Animation Hook'
      reason: |
        To avoid cluttering the `DataDemoPage` component with raw scroll event listeners and animation logic, we will create a self-contained, reusable hook. This encapsulates the behavior, making it easier to maintain, test, and apply to other components in the future.
      steps:
        - uuid: 'f8e7d6a5-3c1b-4f0a-9e2d-1a8c7b6f4d3c'
          status: 'todo'
          name: '1. Create `useAutoAnimateStats.hook.ts`'
          reason: |
            This new file will house the custom hook responsible for tracking scroll position and triggering the animations on the stats container.
          files:
            - 'src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts'
          operations:
            - "Create a new file at `src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts`."
            - "Import `useEffect`, `useRef`, and `useCallback` from `react`, and `gsap` from `gsap`."
            - "Define the hook `useAutoAnimateStats` that accepts two arguments: `scrollContainerRef: React.RefObject<HTMLElement>` and `statsContainerRef: React.RefObject<HTMLElement>`."
            - "Inside the hook, use `useRef` to track `lastScrollY` and the animation state to prevent redundant tweens."
            - "Use `useEffect` to add and clean up a `scroll` event listener on `scrollContainerRef.current`."
            - "Implement the scroll handler logic: if scrolling down past a threshold (e.g., 150px), animate the `statsContainerRef` element's `height`, `autoAlpha`, and `margin` to 0 using `gsap`. If scrolling up, animate it back to its original state using `height: 'auto'`."
            - "Ensure the animation is fast and non-intrusive, with a duration of around `0.3s` and a `power2.inOut` ease."
      context_files:
        compact:
          - 'src/hooks/useAutoAnimateTopBar.ts'
        medium:
          - 'src/hooks/useAutoAnimateTopBar.ts'
          - 'src/pages/DataDemo/index.tsx'
        extended:
          - 'src/hooks/useAutoAnimateTopBar.ts'
          - 'src/pages/DataDemo/index.tsx'
          - 'src/components/shared/PageLayout.tsx'

    - uuid: 'a9b2d1c3-e5f6-4a7b-8d9c-0e1f2a3b4c5d'
      status: 'todo'
      name: 'Part 2: Integrate Hook into DataDemo Page'
      reason: |
        With the animation logic encapsulated, we now need to apply it to the `DataDemoPage`. This involves creating a `ref` for the stats container and invoking the newly created hook to link the scroll container with the element to be animated.
      steps:
        - uuid: 'b4d5e6f7-1a2b-3c4d-5e6f-7a8b9c0d1e2f'
          status: 'todo'
          name: '1. Wire up the hook in `DataDemoPage`'
          reason: |
            This step connects the abstract hook logic to the concrete DOM elements within the Data Demo page, bringing the dynamic behavior to life.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - "In `src/pages/DataDemo/index.tsx`, import the new `useAutoAnimateStats` hook."
            - "Create a new `ref` for the stats container: `const statsContainerRef = useRef<HTMLDivElement>(null);`."
            - "Attach this `statsContainerRef` to the `div` that wraps the `StatCard` components. The target is the `div` with class `grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6`."
            - "Call the hook within the `DataDemoPage` component, passing the existing `contentRef` (the scroll container) and the new `statsContainerRef`: `useAutoAnimateStats(contentRef, statsContainerRef);`."
      context_files:
        compact:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts'
        medium:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts'
          - 'src/components/shared/PageLayout.tsx'
        extended:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts'
          - 'src/components/shared/PageLayout.tsx'
          - 'src/components/shared/StatCard.tsx'

  conclusion: |
    Once complete, this refactor will significantly improve the user experience on the Data Demo page. The content becomes the primary focus during interaction, with statistical data smartly tucked away and readily available at the top of the view.

    The creation of the `useAutoAnimateStats` hook provides a robust, reusable pattern for similar dynamic UI behaviors elsewhere in the application, adhering to DRY principles and improving the overall quality and maintainability of the codebase. The final result is a more polished, modern, and professional-feeling interface.
  context_files:
    compact:
      - 'src/pages/DataDemo/index.tsx'
    medium:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/hooks/useAutoAnimateTopBar.ts'
    extended:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/hooks/useAutoAnimateTopBar.ts'
      - 'src/components/shared/PageLayout.tsx'
      - 'src/components/shared/StatCard.tsx'
```
