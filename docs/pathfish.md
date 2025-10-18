Here's the master plan for refactoring the data list view to be responsive.

***

Alright, listen up. The `DataListView` is static and breaks on smaller viewports. It's a bad look. We're going to fix it by making it "viewport aware." The game plan is to hook into the component's width and dynamically decide which metadata attributes to show. We'll be using a `useResizeObserver` hook we already have, so it's clean, performant, and pure React.

The idea is simple: big screen, you get all the eye candy—tags, full assignee names, dates, the works. Squeeze the browser window, and we start shedding the less critical info, collapsing assignee names to just avatars, and hiding tags and dates. This keeps the core info scannable without ugly wrapping or horizontal scrolling. It's a classic progressive disclosure pattern, but driven by container queries, not just media queries. This makes the component truly portable and self-contained.

This refactor will make the UI feel slick and professional on any device, from a wide desktop monitor to a tablet. No more jank, just a fluid user experience that adapts on the fly. Let's get this done.

```yaml
plan:
  uuid: 'f2a7b8e1-5d9c-4f8a-9a3b-1c0d4e5f6g7h'
  status: 'todo'
  title: 'Pwn the viewport: making DataListView super responsive'
  introduction: |
    Right now, our DataListView is a bit of a fixed-width dinosaur. It looks great on a big screen, but squish the viewport and it's a mess. We're gonna inject some `useResizeObserver` goodness to make it adapt like a chameleon. The plan is to dynamically show/hide metadata fields based on the available real estate. No more horizontal scrollbars, just clean, responsive UI.

    This refactor will make the component "self-aware" of its own dimensions, allowing it to gracefully degrade its complexity as space becomes limited. We'll start by showing everything and then progressively hide less critical information like tags and timestamps, while making other elements like assignee info more compact. The end result is a component that feels native and fluid across any screen size it's rendered in.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'
      status: 'todo'
      name: 'Part 1: Implement Responsive Metadata Display in DataListView'
      reason: |
        To make the list view usable and aesthetically pleasing on a wide range of screen sizes, we need to adapt the amount of information displayed. This part will introduce the logic required to observe the component's width and render its contents accordingly.
      steps:
        - uuid: 'c7d8e9f0-1a2b-3c4d-5e6f-7g8h9i0j1k2l'
          status: 'todo'
          name: '1. Measure Container Width'
          reason: |
            To make rendering decisions, we first need to know how much space we have. We'll use the existing `useResizeObserver` hook to get the real-time width of the list container.
          files:
            - 'src/pages/DataDemo/components/DataListView.tsx'
          operations:
            - "Import `useResizeObserver` from `'@/hooks/useResizeObserver.hook'`."
            - "Import `ArrowUpRight` from `'lucide-react'` and `Button` from `'@/components/ui/button'`, as they are used in the list item but might be missing from the provided context."
            - "Inside the `DataListView` component, get the `listContainerRef` which is already used by `useStaggeredAnimation`."
            - "Call `useResizeObserver` with `listContainerRef` to get a `width` variable. `const { width } = useResizeObserver(listContainerRef);`."

        - uuid: 'b3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8'
          status: 'todo'
          name: '2. Add Responsive Rendering Logic'
          reason: |
            With the container width available, we can now implement the core logic to conditionally render metadata components, ensuring the UI remains clean and uncluttered on smaller viewports.
          files:
            - 'src/pages/DataDemo/components/DataListView.tsx'
          operations:
            - "Inside the `DataListView` component, define boolean constants based on the `width`."
            - "Create a constant `showTags = width > 1100;`."
            - "Create a constant `showDate = width > 800;`."
            - "Create a constant `compactAssignee = width < 700;`."
            - "Locate the `div` for the 'Right side: Metadata' inside the `data.map` loop."
            - "Update the container's class to use a responsive gap: `className=\"flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6\"`."
            - "Wrap `<ItemTags>` in a conditional render: `{showTags && <ItemTags ... />}`."
            - "Always render `<AssigneeInfo>`, but pass the `compact` prop: `<AssigneeInfo ... compact={compactAssignee} />`."
            - "Keep `<ItemStatusBadge>` and `<ItemPriorityBadge>` always visible."
            - "Wrap `<ItemDateInfo>` in a conditional render: `{showDate && <ItemDateInfo ... />}`."
            - "Ensure the `ArrowUpRight` button remains visible at all sizes."
  conclusion: |
    Once this plan is executed, the `DataListView` will be fully responsive. It will no longer be a liability on smaller screens but a prime example of adaptive design within our application. This change significantly improves the user experience for the Data Demo page and provides a solid pattern for other components going forward.
  context_files:
    compact:
      - 'src/pages/DataDemo/components/DataListView.tsx'
    medium:
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/hooks/useResizeObserver.hook.ts'
      - 'src/pages/DataDemo/components/shared/DataItemParts.tsx'
    extended:
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/hooks/useResizeObserver.hook.ts'
      - 'src/pages/DataDemo/components/shared/DataItemParts.tsx'
      - 'src/pages/DataDemo/index.tsx'
```
