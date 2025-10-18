Alright, let's architect this refactor. We're going to simplify the data detail overlay. Right now, it's got its own back button, but the shell already provides a close button. Two ways to do the same thing is one too many. We're ripping out the redundant one.

The plan is simple: dive into the `DataDetailPanel`, find the `ArrowLeft` button, and delete it. The parent `RightPane` component already handles closing, so we're just removing dead weight and cleaning up the header. Less chrome, more content.

Here's the blueprint.

```yaml
plan:
  uuid: 'f2d1e8c9-3a4b-4c5d-8b6a-7e9f0d1a2b3c'
  status: 'todo'
  title: "Refactor Data Detail Pane: Axe Redundant 'Back' Button"
  introduction: |
    Yo, we're cleaning up the UI. The data detail panel, when it slides out as an overlay, has this 'Back' arrow button. But the main `RightPane` component *already* slaps an 'X' button on there for overlays. It's redundant and adds noise.

    This plan nukes the `ArrowLeft` button inside `DataDetailPanel` to streamline the header and rely on the single, consistent close mechanism provided by the app shell. Less code, cleaner look. Ship it.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Nuke the Back Button'
      reason: |
        The `DataDetailPanel` currently renders its own back/close button. This is redundant since the parent `RightPane` component provides a global 'X' to close the overlay. By removing the button from the detail panel, we create a cleaner, more consistent UI and delegate close functionality to the shell, where it belongs. One source of truth for closing panes.
      steps:
        - uuid: 'b9e8d7c6-5a4b-3c2d-1f0e-9876543210ab'
          status: 'todo'
          name: '1. Remove ArrowLeft Button Component'
          reason: |
            This is the core of the change. We're ripping out the `Button` component responsible for showing the back arrow. This declutters the header of the detail panel, leaving only the title and actions.
          files:
            - src/pages/DataDemo/components/DataDetailPanel.tsx
          operations:
            - "In `DataDetailPanel.tsx`, locate the header `div` with the `flex items-center` classes at the top of the returned JSX."
            - "Target the `<Button variant=\"ghost\" size=\"icon\" onClick={onClose} ...>` component within that header."
            - "Delete the entire `Button` component, which contains the `<ArrowLeft ... />` icon and the associated screen-reader `span`."
      context_files:
        compact:
          - src/pages/DataDemo/components/DataDetailPanel.tsx
        medium:
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/components/layout/RightPane.tsx
          - src/hooks/useRightPaneContent.hook.tsx
        extended:
          - src/pages/DataDemo/components/DataDetailPanel.tsx
          - src/components/layout/RightPane.tsx
          - src/hooks/useRightPaneContent.hook.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/store/appShell.store.ts
  conclusion: |
    Boom, done. The detail panel header is now cleaner, just showing the title and primary actions. The user experience for closing the panel is now unified through the app shell's 'X' button, which is the standard for overlays in this system.

    This tightens up the design and removes a small piece of duplicated functionality. Solid win.
  context_files:
    compact:
      - src/pages/DataDemo/components/DataDetailPanel.tsx
    medium:
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/components/layout/RightPane.tsx
      - src/hooks/useRightPaneContent.hook.tsx
    extended:
      - src/pages/DataDemo/components/DataDetailPanel.tsx
      - src/components/layout/RightPane.tsx
      - src/hooks/useRightPaneContent.hook.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/store/appShell.store.ts
      - src/components/layout/AppShell.tsx
```
