Here is the master plan for refactoring the `JourneyScrollbar` component.

```yaml
plan:
  uuid: 'c7b3e2a1-8d4f-4a9e-8b1a-9f01e2d4c5b6'
  status: 'todo'
  title: 'Refactor JourneyScrollbar for Smoother Interaction and Enhanced Visuals'
  introduction: |
    Alright, let's pimp this scrollbar. The current `JourneyScrollbar` is a good first pass, but it's got a critical bug where dragging the thumb doesn't actually scroll the content. Plus, the user wants it to be "cooler," referencing some slick `framer-motion` examples. We don't have that lib, but we've got `gsap` in the arsenal, so we'll use that to make it buttery smooth.

    This refactor is a two-pronged attack. First, we'll squash the drag-to-scroll bug and rip out the state-based animations that are probably causing jank. We'll replace them with direct DOM manipulation via refs and `gsap`, which is way more performant for high-frequency updates like scrolling.

    Second, we'll give it a visual overhaul. We'll add a progress fill to the track and make the "journey point" dots come alive, highlighting the one that's currently in view. The result will be a bug-free, high-performance, and visually engaging scrollbar that feels native to the app's polished aesthetic.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Fix Drag Logic and Optimize Performance'
      reason: |
        The scrollbar's core function—dragging the thumb to scroll—is broken. We need to implement a more robust calculation for this. Simultaneously, the current implementation relies on React state for positioning the thumb, causing re-renders on every scroll event. This is inefficient. We'll move all animation logic to GSAP and direct ref manipulation to decouple it from the React render cycle for a massive performance boost.
      steps:
        - uuid: 'f1e2d3c4-b5a6-7890-1234-567890abcdef'
          status: 'todo'
          name: '1. Overhaul Drag-to-Scroll Logic'
          reason: |
            The existing drag calculation using deltas is likely the source of the bug. We will replace it with a more reliable method that maps the absolute mouse position within the scrollbar track directly to a scroll position in the content area. This eliminates complex state tracking during the drag operation.
          files:
            - src/pages/Messaging/components/JourneyScrollbar.tsx
          operations:
            - "In `handleMouseMove`, replace the current delta-based calculation with logic that determines the `scrollTop` based on the mouse's `clientY` relative to the track's bounding box."
            - "The new logic should be similar to `handleTrackClick` but applied continuously during a drag."
            - "Remove the `startYRef` and `startScrollTopRef` refs, as they are no longer needed for this new, simpler calculation."
            - "Ensure the `useCallback` dependencies for `handleMouseMove` and `handleMouseDown` are updated correctly."
        - uuid: 'g2h3i4j5-k6l7-8901-2345-67890abcdef'
          status: 'todo'
          name: '2. Animate Thumb with GSAP for Performance'
          reason: |
            Updating the thumb's position via `useState` is causing performance issues. We will create a ref for the thumb element and use `gsap` to animate its position, making the movement independent of React's render loop and significantly smoother.
          files:
            - src/pages/Messaging/components/JourneyScrollbar.tsx
          operations:
            - "Remove the `thumbStyle` state variable (`useState({ top: 0, height: 0 })`)."
            - "Add a `useRef` for the thumb DOM element, e.g., `const thumbRef = useRef<HTMLDivElement>(null);`."
            - "In the JSX, attach `thumbRef` to the thumb `div` and remove the inline `style` attribute that depends on state."
            - "Modify the `updateThumb` function. Instead of `setThumbStyle`, use `gsap.to(thumbRef.current, ...)` to animate its `height` and `y` (translateY) properties. Set a short duration like `0.1` for responsiveness."
            - "Ensure the `gsap` animation also handles the case where the thumb should be hidden (e.g., set `autoAlpha: 0` or `height: 0`)."
      context_files:
        compact:
          - src/pages/Messaging/components/JourneyScrollbar.tsx
        medium:
          - src/pages/Messaging/components/JourneyScrollbar.tsx
          - src/pages/Messaging/components/TaskDetail.tsx
        extended:
          - src/pages/Messaging/components/JourneyScrollbar.tsx
          - src/pages/Messaging/components/TaskDetail.tsx
          - src/components/effects/BoxReveal.tsx
    - uuid: 'b2c3d4e5-f6a7-8901-2345-67890abcdef'
      status: 'todo'
      name: 'Part 2: Enhance Scrollbar Visuals'
      reason: |
        To meet the user's request for a "cooler" scrollbar, we will add dynamic visual feedback. This includes highlighting the active journey point and showing a progress fill, making the component more interactive and aesthetically pleasing, using `gsap` for smooth animations.
      steps:
        - uuid: 'h3i4j5k6-l7m8-9012-3456-7890abcdef'
          status: 'todo'
          name: '1. Implement Active Journey Point Highlighting'
          reason: |
            Highlighting the currently visible "journey point" on the scrollbar provides valuable context to the user. We'll do this performantly using a ref to track the active item and GSAP to handle the animations, avoiding unnecessary re-renders.
          files:
            - src/pages/Messaging/components/JourneyScrollbar.tsx
          operations:
            - "Add a ref to store the ID of the active journey point, e.g., `activeJourneyPointIdRef = useRef<string | null>(null);`."
            - "Inside the scroll handler (e.g., `updateThumb`), calculate which message element is closest to the center of the viewport."
            - "If the active point has changed, use `gsap` to animate the previously active dot back to its default state (e.g., `scale: 1`)."
            - "Use `gsap` to animate the new active dot to a highlighted state (e.g., `scale: 1.5`). Update `activeJourneyPointIdRef`."
            - "To make this work, add a unique data attribute like `data-dot-id={pos.id}` to each journey point `button` for easy selection with `querySelector`."
            - "Update the `className` for the journey point `button` to include `transition-transform` and `hover:scale-125` for a base effect, which will be gracefully overridden by GSAP."
        - uuid: 'i4j5k6l7-m8n9-0123-4567-890abcdef'
          status: 'todo'
          name: '2. Add Animated Progress Fill to the Track'
          reason: |
            A progress fill provides a clear and satisfying indication of the user's overall position in the conversation. We'll add a new element and animate its height with GSAP for a smooth effect.
          files:
            - src/pages/Messaging/components/JourneyScrollbar.tsx
          operations:
            - "Add a new `div` inside the relative container of the scrollbar track. Style it to be the 'progress fill', positioned at the top of the track (e.g., `absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-primary rounded-full`)."
            - "Set its `transform-origin` to `top`."
            - "Add a ref for this new element, e.g., `progressRef = useRef<HTMLDivElement>(null);`."
            - "In the scroll handler, calculate the scroll progress as a percentage: `const progress = container.scrollTop / (container.scrollHeight - container.clientHeight);`."
            - "Use `gsap.to(progressRef.current, { scaleY: progress, duration: 0.1 })` to animate the fill's height based on the scroll progress."
      context_files:
        compact:
          - src/pages/Messaging/components/JourneyScrollbar.tsx
        medium:
          - src/pages/Messaging/components/JourneyScrollbar.tsx
          - src/pages/Messaging/components/TaskDetail.tsx
        extended:
          - src/pages/Messaging/components/JourneyScrollbar.tsx
          - src/pages/Messaging/components/TaskDetail.tsx
          - src/components/effects/BoxReveal.tsx
  conclusion: |
    Once this refactor is complete, the `JourneyScrollbar` will be transformed from a slightly buggy, basic component into a key feature of the messaging UI. The drag-to-scroll functionality will be reliable and intuitive. Performance will be significantly improved, ensuring a fluid user experience even with long conversations.

    The new visual enhancements—the active point highlighting and progress fill—will not only look great but also provide better context and navigation cues for the user, making the entire conversation view more functional and polished. This hack brings the component up to the high standard set by the rest of the application shell.
  context_files:
    compact:
      - src/pages/Messaging/components/JourneyScrollbar.tsx
    medium:
      - src/pages/Messaging/components/JourneyScrollbar.tsx
      - src/pages/Messaging/components/TaskDetail.tsx
      - src/pages/Messaging/types.ts
    extended:
      - src/pages/Messaging/components/JourneyScrollbar.tsx
      - src/pages/Messaging/components/TaskDetail.tsx
      - src/pages/Messaging/types.ts
      - src/components/effects/BoxReveal.tsx
      - src/lib/utils.ts
```
