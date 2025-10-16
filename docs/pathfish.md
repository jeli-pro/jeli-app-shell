Yo, check it. We're about to level up the `RightPane`. Right now, it's got these clunky buttons for view modes. We're swapping that out for our slick `ViewModeSwitcher`. This gives users the full power of view management right from the side pane overlay—fullscreen, split view, back to normal—all in one spot. It's about making the UX tight and consistent.

The plan is simple: First, we'll juice up the `ViewModeSwitcher` to handle dynamic routes, 'cause that's how the `RightPane` rolls with detailed views. Then, we'll slot it into the `RightPane`'s header, replacing the old controls. It'll only show up in overlay mode, keeping things clean. This is a surgical strike, minimal blast radius, maximum impact. Let's get it.

```yaml
plan:
  uuid: 'c4e9f5a0-8a1a-4d7b-9f2c-5678b3a0e1b2'
  status: 'todo'
  title: 'Refactor RightPane to use ViewModeSwitcher in Header'
  introduction: |
    This refactoring plan aims to enhance the user experience by replacing the basic view control buttons in the `RightPane` header with the more comprehensive `ViewModeSwitcher` component. This change will only apply when the `RightPane` is in its overlay mode (`SIDE_PANE` state).

    The first part of the plan involves making the `ViewModeSwitcher` more flexible by allowing it to handle dynamic URL paths, which is essential for detail views often shown in the `RightPane`. The second part focuses on integrating this enhanced switcher into the `RightPane`'s header, providing users with a consistent and powerful set of view management tools (Normal, Split, Fullscreen) directly from the side pane. This will streamline the UI and improve the overall coherence of the application shell.
  parts:
    - uuid: 'e0d1f4b2-3c1a-4f9e-8b6d-7f8e1a0b3c2d'
      status: 'todo'
      name: 'Part 1: Enhance ViewModeSwitcher Flexibility'
      reason: |
        The `ViewModeSwitcher` currently expects a static `ActivePage` type for its `targetPage` prop. To work correctly within the `RightPane`, which often displays content for dynamic routes (e.g., `/data-demo/item-123`), the component must be updated to handle arbitrary string paths. This change will allow it to correctly determine the base page and associated pane content for its actions.
      steps:
        - uuid: 'a9b8c7d6-5e4f-4a3b-8c1d-9e0f1a2b3c4d'
          status: 'todo'
          name: '1. Update ViewModeSwitcher Props and Logic'
          reason: |
            To accept dynamic routes, we need to change the `targetPage` prop type to `string` and add logic to parse the base path from it.
          files:
            - src/components/layout/ViewModeSwitcher.tsx
          operations:
            - 'Change the prop type for `targetPage` from `ActivePage` to `string` in the component definition: `targetPage?: string`.'
            - 'In the `handlePaneClick` function, update the logic to derive a `basePage` from the `activePage` variable (which holds the `targetPage` prop). Use `activePage.split('/')[0]` to extract the root path of the page.'
            - 'Use this `basePage` to look up the corresponding `paneContent` from `pageToPaneMap`.'
            - 'Remove the `ActivePage` type import as it''s no longer needed for the prop type.'
      context_files:
        compact:
          - src/components/layout/ViewModeSwitcher.tsx
        medium:
          - src/components/layout/ViewModeSwitcher.tsx
          - src/hooks/useAppViewManager.hook.ts
        extended:
          - src/components/layout/ViewModeSwitcher.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/store/appShell.store.ts
    - uuid: 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c'
      status: 'todo'
      name: 'Part 2: Integrate ViewModeSwitcher into RightPane'
      reason: |
        The primary goal is to provide a consistent and full-featured view management experience from the side pane overlay. Replacing the existing simple buttons with the `ViewModeSwitcher` achieves this by consolidating all view-related actions into a single, familiar component.
      steps:
        - uuid: 'b3c4d5e6-7f8a-4b9c-8d1e-2f3a4b5c6d7e'
          status: 'todo'
          name: '1. Replace Header Controls in RightPane'
          reason: |
            This step implements the core UI change, swapping out the old buttons for the new, more powerful switcher.
          files:
            - src/components/layout/RightPane.tsx
          operations:
            - 'Import the `ViewModeSwitcher` component at the top of `src/components/layout/RightPane.tsx`.'
            - 'In the `useMemo` hook for the `header` constant, locate the `div` that contains the view control buttons (the one with `SplitSquareHorizontal` and `ChevronsLeftRight` icons).'
            - 'Remove the entire contents of that `div`, including the two `button` elements.'
            - 'Inside the now-empty `div`, add the `<ViewModeSwitcher />` component.'
            - 'Conditionally render the switcher to ensure it only appears when `bodyState === BODY_STATES.SIDE_PANE` and the content has a navigable page (`"page" in meta && meta.page`).'
            - 'Pass the necessary props to the switcher: `pane="right"` and `targetPage={meta.page}`.'
            - 'Remove unused icon imports like `SplitSquareHorizontal`, `Layers`, and `ChevronsLeftRight` if they are no longer referenced anywhere else in the file.'
      context_files:
        compact:
          - src/components/layout/RightPane.tsx
        medium:
          - src/components/layout/RightPane.tsx
          - src/components/layout/ViewModeSwitcher.tsx
        extended:
          - src/components/layout/RightPane.tsx
          - src/components/layout/ViewModeSwitcher.tsx
          - src/hooks/useRightPaneContent.hook.tsx
          - src/hooks/useAppViewManager.hook.ts
  conclusion: |
    Upon completion, the `RightPane` will feature the `ViewModeSwitcher` in its header during overlay mode, providing a significant UX improvement. Users will have a consistent and intuitive way to manage the view state of side pane content, including switching to normal view, split view, or fullscreen. This refactor successfully modularizes the view control logic and enhances the application shell's flexibility.
  context_files:
    compact:
      - src/components/layout/ViewModeSwitcher.tsx
      - src/components/layout/RightPane.tsx
    medium:
      - src/components/layout/ViewModeSwitcher.tsx
      - src/components/layout/RightPane.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/hooks/useRightPaneContent.hook.tsx
    extended:
      - src/components/layout/ViewModeSwitcher.tsx
      - src/components/layout/RightPane.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/hooks/useRightPaneContent.hook.tsx
      - src/store/appShell.store.ts
      - src/components/layout/TopBar.tsx
      - src/components/layout/AppShell.tsx
```
