Listen up, folks. The current list view in the Data Demo is a relic. It's chunky, wastes space, and feels like something from 2015. We're talking big, card-like items that scream "bootstrap boilerplate". Users want information density and a clean, fast interface. They want Notion. We're going to give them that vibe.

The plan is to completely gut the existing `DataListView` and rebuild it from the ground up as a sleek, row-based list. We're ditching the heavy card styling, the distracting hover gradients, and the clunky animations. In its place, we'll ship a minimalist layout that's all about typography, subtle interactions, and putting the data front-and-center. Each item will be a clean, clickable row with horizontally arranged properties. This refactor will not only pwn the aesthetics but also significantly improve the UX, making the entire page feel more cohesive and professional. Let's ship it.

```yaml
plan:
  uuid: 'e5b9f1d8-4a7b-4c2f-8a9d-0f1c2b3e4a5b'
  status: 'todo'
  title: 'Refactor Data Demo List View to Emulate Notion''s UI/UX'
  introduction: |
    The current list view in the Data Demo page uses a card-based metaphor which is inefficient for displaying lists of items. It lacks the information density and modern feel of applications like Notion or Linear. This master plan outlines the process of refactoring `DataListView.tsx` to transform it into a clean, row-based interface.

    We will remove the card-like structure, replacing it with a minimalist design that emphasizes typography and horizontal data layout. The goal is to create a more "amazing UI and cohesive UX" by stripping away unnecessary visual clutter, refining hover and selection states, and improving the overall scannability of the list. The staggered animation will be replaced with a more subtle effect suitable for a list view.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Structural and Logical Overhaul of DataListView'
      reason: |
        Before we can make it look good, we need to gut the underlying structure. The current component is built around a card concept, complete with thumbnails, progress bars, and metrics that don't belong in a high-density list view. We're also swapping out the heavy, staggered animation for something more appropriate.
      steps:
        - uuid: 'c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5r'
          status: 'todo'
          name: '1. De-Cardify the List Item Structure'
          reason: |
            The fundamental unit needs to change from a 'card' to a 'row'. This involves removing the main card wrapper, the thumbnail, progress bar, and metrics, which are not suitable for a Notion-style list view.
          files:
            - src/pages/DataDemo/components/DataListView.tsx
          operations:
            - 'Locate the main `div` that wraps each list item.'
            - 'Remove the card-like classes like `bg-card`, `border`, `rounded-lg`, `shadow-sm`, etc.'
            - 'Replace the wrapper with a `button` element to make the entire row interactive, or a `div` with `role="button"`.'
            - 'Remove the `Thumbnail` section entirely.'
            - 'Remove the `ItemProgressBar` component from the render path.'
            - 'Remove the `ItemMetrics` component from the render path.'
            - 'Remove the `div` responsible for the "Hover gradient overlay".'
        - uuid: 'd2e3f4g5-h6i7-j8k9-l0m1-n2o3p4q5r6s'
          status: 'todo'
          name: '2. Rearrange Components into a Horizontal Flex Layout'
          reason: |
            Notion's list is defined by its horizontal arrangement of properties. We need to restructure the JSX to use flexbox, creating a clean row with elements spaced out logically.
          files:
            - src/pages/DataDemo/components/DataListView.tsx
          operations:
            - 'Wrap the contents of the item `button`/`div` in a parent `div` with `flex items-center gap-4`.'
            - 'Arrange the components in the following order: `ItemStatusBadge`, `ItemPriorityBadge`, the main `title`, then `ItemTags`.'
            - 'Add a spacer element `<div className="flex-grow" />` after the tags.'
            - 'Place `AssigneeInfo` and `ItemDateInfo` after the spacer.'
            - 'Keep the `ArrowRight` icon at the end, but we will style its visibility later.'
        - uuid: 'e3f4g5h6-i7j8-k9l0-m1n2-o3p4q5r6s7t'
          status: 'todo'
          name: '3. Replace Staggered Animation'
          reason: |
            The `useStaggeredAnimation` hook is designed for grid/card layouts and feels too heavy for a simple list. We'll remove it to improve performance and better match the minimalist aesthetic. A simpler, list-wide animation can be considered later if needed.
          files:
            - src/pages/DataDemo/components/DataListView.tsx
          operations:
            - 'Remove the import for `useStaggeredAnimation`.'
            - 'Delete the `useStaggeredAnimation(...)` hook invocation.'
            - 'The main list container `ref` that was passed to the hook can now be used for other purposes or removed if not needed.'
        - uuid: 'f4g5h6i7-j8k9-l0m1-n2o3-p4q5r6s7t8u'
          status: 'todo'
          name: '4. Update Interaction Logic and Selection State'
          reason: |
            The click handler and selection state need to be applied to the new row structure.
          files:
            - src/pages/DataDemo/components/DataListView.tsx
          operations:
            - 'Move the `onClick={() => onItemSelect(item)}` handler to the main row `button` element.'
            - 'Use `cn` utility to conditionally apply styling for the selected item. For example: `cn({"bg-muted": isSelected})`.'
            - 'Wrap the entire row `button` in a `group` class to control hover effects on child elements (like the arrow icon).'
      context_files:
        compact:
          - src/pages/DataDemo/components/DataListView.tsx
        medium:
          - src/pages/DataDemo/components/DataListView.tsx
          - src/hooks/useStaggeredAnimation.motion.hook.ts
        extended:
          - src/pages/DataDemo/components/DataListView.tsx
          - src/hooks/useStaggeredAnimation.motion.hook.ts
          - src/pages/DataDemo/components/shared/DataItemParts.tsx
    - uuid: 'b2c3d4e5-f6g7-8901-2345-67890abcdef1'
      status: 'todo'
      name: 'Part 2: Applying Notion-esque Styling and Polish'
      reason: |
        With the structure in place, this part focuses on the aesthetics. We'll use TailwindCSS to achieve the minimalist design, focusing on typography, subtle borders, and clean hover states that define the Notion experience.
      steps:
        - uuid: 'g5h6i7j8-k9l0-m1n2-o3p4-q5r6s7t8u9v'
          status: 'todo'
          name: '1. Implement Row and Typography Styles'
          reason: |
            This step translates the Notion design into CSS classes, defining the core look and feel of each row.
          files:
            - src/pages/DataDemo/components/DataListView.tsx
          operations:
            - 'Apply styles to the main row `button`: `w-full text-left px-2 py-1.5 transition-colors duration-150 rounded-md hover:bg-muted/50`.'
            - 'Add a subtle bottom border to the list container items, not the last one: `[&>button]:border-b [&>button]:border-border/60 [&>button:last-child]:border-b-0`.'
            - 'Style the item `title`: `font-medium text-foreground/90 truncate`.'
            - 'Ensure other text elements like date and assignee name use `text-sm text-muted-foreground`.'
        - uuid: 'h6i7j8k9-l0m1-n2o3-p4q5-r6s7t8u9v0w'
          status: 'todo'
          name: '2. Refine Hover and Action Indicator Styles'
          reason: |
            A key part of cohesive UX is how interactive elements reveal themselves. The arrow icon should only appear on hover, guiding the user without cluttering the UI.
          files:
            - src/pages/DataDemo/components/DataListView.tsx
          operations:
            - 'For the `ArrowRight` icon, apply `opacity-0 group-hover:opacity-100 transition-opacity`.'
            - 'Ensure the icon has `text-muted-foreground` to keep it subtle.'
        - uuid: 'i7j8k9l0-m1n2-o3p4-q5r6-s7t8u9v0w1x'
          status: 'todo'
          name: '3. Adjust Shared Component Styles'
          reason: |
            The shared components might need slight tweaks to fit into the more compact, horizontal layout.
          files:
            - src/pages/DataDemo/components/shared/DataItemParts.tsx
            - src/pages/DataDemo/components/DataListView.tsx
          operations:
            - 'In `DataListView.tsx`, when calling `AssigneeInfo`, pass a smaller avatar class: `avatarClassName="w-5 h-5"`.'
            - 'In `DataItemParts.tsx`, ensure `AssigneeInfo` can accept and apply the `avatarClassName` prop correctly to its `Avatar` component.'
            - 'Verify that badges and other elements in `DataItemParts.tsx` don''t have excessive margins that would disrupt the horizontal alignment.'
      context_files:
        compact:
          - src/pages/DataDemo/components/DataListView.tsx
        medium:
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/shared/DataItemParts.tsx
        extended:
          - src/pages/DataDemo/components/DataListView.tsx
          - src/pages/DataDemo/components/shared/DataItemParts.tsx
          - src/lib/utils.ts
  conclusion: |
    Upon completion, the Data Demo's list view will be completely transformed. We will have replaced the dated, card-based layout with a sleek, minimalist, and highly-functional row-based list that mirrors the best-in-class UI of modern productivity apps.

    This refactor will not only be a significant visual upgrade but will also enhance usability by increasing information density and improving scannability. The UX will feel more cohesive and intuitive, providing a solid foundation for any future list-based interfaces in the application.
  context_files:
    compact:
      - src/pages/DataDemo/components/DataListView.tsx
    medium:
      - src/pages/DataDemo/components/DataListView.tsx
      - src/pages/DataDemo/components/shared/DataItemParts.tsx
    extended:
      - src/pages/DataDemo/components/DataListView.tsx
      - src/pages/DataDemo/components/shared/DataItemParts.tsx
      - src/hooks/useStaggeredAnimation.motion.hook.ts
      - src/pages/DataDemo/index.tsx
```
