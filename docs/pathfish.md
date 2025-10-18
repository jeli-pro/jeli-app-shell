Alright, let's architect this refactor. The current stats grid on the DataDemo page is a bit too rigid for its own good. It wraps, which is fine, but we can do better. We're going to ditch the wrapping grid for a slick, horizontally scrollable container. This gives us infinite horizontal space for stats, makes the UI feel more modern and touch-friendly, and it's a cleaner look on smaller viewports.

The plan is simple: we'll add more stat cards to prove the concept, then rip out the old grid classes and replace them with a flexbox setup. We'll tweak the card component itself to play nice in this new container, ensuring it doesn't get squished. Finally, we'll add a touch of CSS elegance with a custom, minimalist scrollbar that doesn't scream "1998". It's a quick, high-impact change that levels up the UX.

Let's get this planned out for the code-gen bot.

```yaml
plan:
  uuid: 'c8b4a2d1-e9f7-4a0b-8d1c-5f3e7a09b9f2'
  status: 'todo'
  title: 'Refactor DataDemo Stats to be Horizontally Scrollable'
  introduction: |
    This plan outlines the refactoring of the statistics card section on the DataDemo page. The current implementation uses a responsive grid that wraps cards onto new lines on smaller screens. This approach can lead to inconsistent layout heights and feels somewhat dated.

    The goal is to transform this section into a single, horizontally scrollable row. This change will not only modernize the user interface, providing a "slideable" feel common in dashboards, but also make the section more scalable, allowing for an arbitrary number of stats cards without breaking the layout. The refactor involves updating the data source to include more cards, modifying the container's styling from grid to flex, adjusting the card component to maintain a consistent size, and adding custom CSS for a subtle, on-brand scrollbar.
  parts:
    - uuid: 'a1b3c2d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'
      status: 'todo'
      name: 'Part 1: Expand the Stats Card Data'
      reason: |
        To properly demonstrate and test the effectiveness of a horizontally scrollable container, we need more content than the original four cards. Adding more stats makes the need for scrolling immediately apparent and validates the new design's scalability.
      steps:
        - uuid: 'b2c4d5e6-f7g8-9a0b-1c2d-3e4f5a6b7c8d'
          status: 'todo'
          name: '1. Add more StatItem objects'
          reason: |
            We'll add four new stat cards to the existing array. This will provide enough items to cause an overflow on most screen sizes, making the horizontal scroll functional and visible.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - "In the `stats` constant declared with `useMemo`, add four new objects to the array. These new stats should be plausible metrics for the demo, such as 'Completion Rate', 'Overdue Items', 'New This Week', and 'Archived'."
            - "Ensure the new stat objects conform to the `StatItem` type, providing `title`, `value`, `icon`, `change`, and `trend` properties."
      context_files:
        compact:
          - src/pages/DataDemo/index.tsx
        medium:
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/types.ts
        extended:
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/types.ts
    - uuid: 'd3e5f6g7-h8i9-0j1k-2l3m-4n5o6p7q8r9s'
      status: 'todo'
      name: 'Part 2: Implement Horizontally Scrollable Layout'
      reason: |
        This is the core of the refactor. We need to change the container's CSS to facilitate horizontal scrolling and adjust the child components to behave correctly within this new layout paradigm.
      steps:
        - uuid: 'e4f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0'
          status: 'todo'
          name: '1. Update stats container styling'
          reason: |
            The current `grid` layout must be replaced with a `flex` layout that allows for horizontal overflow. This is the fundamental change that enables the desired scrolling behavior.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - "Locate the `div` that directly wraps the mapped `StatCard` components within the 'Stats Section'."
            - "Replace the existing Tailwind CSS classes `grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4` with `flex gap-4 overflow-x-auto pb-4 horizontal-scrollbar`."
            - "The `overflow-x-auto` enables scrolling, `pb-4` adds space for the new scrollbar, and `horizontal-scrollbar` is a custom class we will define next."
        - uuid: 'f5g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1'
          status: 'todo'
          name: '2. Adjust StatCard component styling'
          reason: |
            By default, items in a flex container can shrink. We need to prevent this to maintain a consistent card width and ensure the container overflows as intended.
          files:
            - src/components/shared/StatCard.tsx
          operations:
            - "In the `StatCard` component, locate the `<Card>` element."
            - "Append `flex-shrink-0 w-72` to its `className` prop using the `cn` utility. This prevents the card from shrinking and sets a consistent base width of `18rem` (288px)."
        - uuid: 'g6h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2'
          status: 'todo'
          name: '3. Add custom horizontal scrollbar styles'
          reason: |
            Default browser scrollbars can be obtrusive. A custom, styled scrollbar provides a more polished and integrated look that matches the application's aesthetic.
          files:
            - src/index.css
          operations:
            - "In `src/index.css`, inside the `@layer components` block, add new CSS rules for the `.horizontal-scrollbar` class."
            - "Define styles for `::-webkit-scrollbar` to set a small height (e.g., `height: 6px;`)."
            - "Style `::-webkit-scrollbar-track` to be transparent (`@apply bg-transparent;`)."
            - "Style `::-webkit-scrollbar-thumb` to have a subtle background color and be rounded (`@apply bg-border rounded-full;`)."
            - "Add a hover state for `::-webkit-scrollbar-thumb:hover` to improve interactivity (`@apply bg-muted-foreground/50;`)."
      context_files:
        compact:
          - src/pages/DataDemo/index.tsx
          - src/components/shared/StatCard.tsx
          - src/index.css
        medium:
          - src/pages/DataDemo/index.tsx
          - src/components/shared/StatCard.tsx
          - src/index.css
          - src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts
        extended:
          - src/pages/DataDemo/index.tsx
          - src/components/shared/StatCard.tsx
          - src/index.css
          - src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts
          - tailwind.config.js
  conclusion: |
    Upon completion, the DataDemo page's statistics section will be transformed into a modern, horizontally scrollable container. This enhancement improves the user experience, especially on smaller screens, by preventing layout shifts caused by wrapping content. The new design is also more scalable, cleanly accommodating a larger number of stat cards without compromising the page's structure. The addition of a custom-styled scrollbar ensures the new functionality feels polished and visually consistent with the rest of the application.
  context_files:
    compact:
      - src/pages/DataDemo/index.tsx
      - src/components/shared/StatCard.tsx
      - src/index.css
    medium:
      - src/pages/DataDemo/index.tsx
      - src/components/shared/StatCard.tsx
      - src/index.css
      - src/pages/DataDemo/types.ts
    extended:
      - src/pages/DataDemo/index.tsx
      - src/components/shared/StatCard.tsx
      - src/index.css
      - src/pages/DataDemo/types.ts
      - src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts
      - tailwind.config.js
```
