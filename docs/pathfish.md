Here's the plan, architect.

This refactor is a classic "make it Just Work™" situation. The `AnimatedTabs` component is clean but brittle; toss too many tabs at it and the layout goes bust, wrapping like a noob's first HTML page. That's not how we roll.

We're going to rebuild it to handle overflow like a champ. The core idea is to introduce a classic scroll container pattern: an outer div that acts as the viewport (`overflow-x: auto`) and an inner div that holds the content (`white-space: nowrap`), letting it grow as wide as it needs. This keeps everything on one line and makes it swipe-able. We'll hide the gross default scrollbar because aesthetics matter.

To top it off, we'll add some UX magic. When a tab is selected, especially one that's off-screen, we'll programmatically scroll it into the center of the view. This makes the component feel responsive and intelligent. It's a small touch, but it separates the pros from the script kiddies. End result: a more robust, polished component that developers can drop in anywhere without worrying about overflow.

Let's get it done.

```yaml
plan:
  uuid: 'e8a1d4b2-c0e9-4f7a-8f6b-0a377d61b34c'
  status: 'todo'
  title: 'Refactor: Make AnimatedTabs Horizontally Scrollable'
  introduction: |
    The current `AnimatedTabs` component is slick but lacks robustness. When populated with more tabs than can fit its container, the layout breaks and tabs wrap to the next line, which is a poor user experience. This forces consumers of the component to wrap it in their own scrolling containers, which is not ideal.

    This refactoring plan will enhance the `AnimatedTabs` component to handle overflow natively. We will restructure its internal layout to create a horizontally scrolling container, ensuring that all tabs remain on a single line. We will also add functionality to automatically scroll the active tab into view, providing a seamless and intuitive navigation experience, especially on smaller viewports or when dealing with a large number of tabs.

    The goal is to make the component more resilient and "just work" out of the box, removing the burden of handling overflow from the developer and improving the overall UI/UX of the application.
  parts:
    - uuid: '9f2c11d3-a4e1-4c5b-98f2-d3a6c8e0b1d5'
      status: 'todo'
      name: 'Part 1: Implement Horizontal Scrolling in AnimatedTabs'
      reason: |
        The core of this refactor is to modify the `AnimatedTabs` component's structure and styling to support horizontal scrolling when its content overflows. This makes the component self-contained and reliable in various layout contexts.
      steps:
        - uuid: 'c6a3b09e-7c2a-41d5-8f1b-5e7e6f9d02c1'
          status: 'todo'
          name: '1. Update JSX Structure for Scrolling'
          reason: |
            A nested structure is required to properly manage scrolling. The outer `div` will act as the scroll viewport, while a new inner `div` will contain the tabs and the active indicator, allowing them to expand beyond the viewport's bounds without wrapping.
          files:
            - src/components/ui/animated-tabs.tsx
          operations:
            - 'Wrap the active indicator `div` and the `tabs.map(...)` block within a new inner `div`.'
            - 'The existing, outermost `div` will now serve as the scroll container.'
        - uuid: 'a1b7e45f-9c8d-4b3a-9e2c-3d1f0a2c8e3d'
          status: 'todo'
          name: '2. Apply CSS Classes for Overflow and Layout'
          reason: |
            With the new structure in place, we need to apply the correct CSS classes to enable the desired scrolling behavior and ensure the layout remains correct. This includes enabling `overflow-x`, preventing wrapping, and hiding the default scrollbar for a cleaner look. The `relative` positioning context for the animated indicator also needs to be on the new inner container.
          files:
            - src/components/ui/animated-tabs.tsx
          operations:
            - 'On the outer `div`, remove the `relative` class.'
            - 'Add the following classes to the outer `div`: `overflow-x-auto`, `overflow-y-hidden`, and `no-scrollbar` to handle scrolling.'
            - 'On the new inner `div`, add the following classes: `relative`, `flex`, `items-center`, `w-max`, and `whitespace-nowrap`. This ensures the tabs stay in a single line and provides the positioning context for the active indicator.'
        - uuid: 'f8d3c5a1-e9c4-4a2b-8d1e-2a9c4b7b3c2e'
          status: 'todo'
          name: '3. Add Auto-Scroll to Active Tab'
          reason: |
            To improve user experience, the active tab should always be visible. When a tab is selected (especially one that is currently off-screen), it should be automatically and smoothly scrolled into the center of the viewport.
          files:
            - src/components/ui/animated-tabs.tsx
          operations:
            - 'Locate the `useEffect` hook that depends on `activeTab` and `tabs`.'
            - 'Inside this effect, after getting the `activeIndex`, retrieve the corresponding tab element from `tabRefs.current[activeIndex]`.'
            - 'If the element exists, call `element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })` to bring it into view.'
      context_files:
        compact:
          - src/components/ui/animated-tabs.tsx
        medium:
          - src/components/ui/animated-tabs.tsx
          - src/index.css
        extended:
          - src/components/ui/animated-tabs.tsx
          - src/index.css
          - src/pages/Messaging/components/TaskList.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/Messaging/components/MessagingContent.tsx
  conclusion: |
    Upon completion, the `AnimatedTabs` component will be significantly more robust and user-friendly. It will gracefully handle any number of tabs by providing a smooth, horizontal scrolling experience, complete with an intelligent auto-scroll feature. This removes a potential layout bug, improves the developer experience by creating a more powerful primitive, and enhances the end-user's interaction with tabbed interfaces across the application.
  context_files:
    compact:
      - src/components/ui/animated-tabs.tsx
    medium:
      - src/components/ui/animated-tabs.tsx
      - src/index.css
    extended:
      - src/components/ui/animated-tabs.tsx
      - src/index.css
      - src/pages/Messaging/components/TaskList.tsx
      - src/pages/DataDemo/index.tsx
      - src/pages/Messaging/components/MessagingContent.tsx
```
