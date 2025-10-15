Here is the master plan for the refactor.

```yaml
plan:
  uuid: 'f4a1b2c3-d4e5-f6a7-b8c9-d0e1f2a3b4c5'
  status: 'todo'
  title: 'Refactor Pane Width Management for Page-Specific Layouts'
  introduction: |
    Alright, let's kill the hardcoded pane widths. The current setup where `splitPaneWidth` and `sidePaneWidth` are global constants in the store is too rigid. Some pages, like Messaging, need different proportions to feel right. Pages should own their layout, not be dictated to by a global config.

    This refactor introduces a system for page-specific view configurations. We'll juice up the Zustand store to distinguish between default pane widths and the currently active widths. This allows individual pages to temporarily override the defaults when they are mounted.

    The star of the show is a new `usePageViewConfig` hook. It's a clean, declarative API for any page component to say "Hey, when I'm on screen, use *these* widths." When the component unmounts, the hook cleans up after itself, resetting the widths back to the default. This keeps things tidy and prevents layout settings from one page from bleeding into another.

    We'll apply this new system to the Messaging page first, fixing the cramped split-view layout that was reported. This approach makes the AppShell more of a flexible framework and less of a dictator, paving the way for more complex and context-aware layouts in the future.
  parts:
    - uuid: 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6'
      status: 'todo'
      name: 'Part 1: Enhance State Management for Dynamic Pane Widths'
      reason: |
        The current store treats pane widths as global, session-wide variables. We need to evolve this to support a concept of "default" widths that can be temporarily overridden by pages. This part lays the foundation by updating the store to track both default and current widths.
      steps:
        - uuid: 'b2c3d4e5-f6a7-b8c9-d0e1-f2a3b4c5d6e7'
          status: 'todo'
          name: '1. Update appShell.store.ts State'
          reason: |
            To differentiate between the application's default widths and the widths currently in use (which might be set by a specific page or by user resizing), we need to add state for the defaults and a flag to see if they've been initialized.
          files:
            - src/store/appShell.store.ts
          operations:
            - 'In `AppShellState`, add `defaultSplitPaneWidth: number`, `defaultSidePaneWidth: number`, and `defaultWidthsSet: boolean`.'
            - 'In `defaultState`, initialize `defaultSplitPaneWidth` and `defaultSidePaneWidth` with placeholder values (e.g., `400`) and `defaultWidthsSet` to `false`.'
        - uuid: 'c3d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e7f8'
          status: 'todo'
          name: '2. Add New Actions to appShell.store.ts'
          reason: |
            We need actions to manage the new default/current width lifecycle: one to capture the initial defaults, and one to reset the current widths back to those defaults when a page with custom widths unmounts.
          files:
            - src/store/appShell.store.ts
          operations:
            - 'Create a new action `setDefaultPaneWidths: () => void`.'
            - 'Inside `setDefaultPaneWidths`, add a guard to return if `defaultWidthsSet` is true.'
            - 'If not set, it should capture the current `splitPaneWidth` and `sidePaneWidth` from the state and save them into `defaultSplitPaneWidth` and `defaultSidePaneWidth`, then set `defaultWidthsSet` to `true`.'
            - 'Create a new action `resetPaneWidths: () => void` that sets the current `splitPaneWidth` and `sidePaneWidth` from `defaultSplitPaneWidth` and `defaultSidePaneWidth`.'
            - "Update the existing `resetToDefaults` action to also call the new `resetPaneWidths` action to ensure a full reset."
        - uuid: 'd4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9'
          status: 'todo'
          name: '3. Initialize Default Widths in Provider'
          reason: |
            To capture the initial, dynamically calculated pane widths as our defaults for the session, we need to call the `setDefaultPaneWidths` action once when the application loads. The `AppShellProvider` is the perfect place for this one-time setup.
          files:
            - src/providers/AppShellProvider.tsx
          operations:
            - 'In `AppShellProvider`, get the `setDefaultPaneWidths` action from the `useAppShellStore`.'
            - 'Use a `useEffect` hook with an empty dependency array `[]` to call `setDefaultPaneWidths()` when the provider mounts.'
      context_files:
        compact:
          - src/store/appShell.store.ts
          - src/providers/AppShellProvider.tsx
        medium:
          - src/store/appShell.store.ts
          - src/providers/AppShellProvider.tsx
          - src/hooks/useResizablePanes.hook.ts
        extended:
          - src/store/appShell.store.ts
          - src/providers/AppShellProvider.tsx
          - src/hooks/useResizablePanes.hook.ts
          - src/components/layout/AppShell.tsx
    - uuid: 'e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0'
      status: 'todo'
      name: 'Part 2: Implement Page-Level View Configuration'
      reason: |
        With the store ready, we can now build the mechanism for pages to declare their layout preferences. This involves creating a new hook for a clean API and then applying it to the Messaging page to solve the immediate layout issue.
      steps:
        - uuid: 'f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1'
          status: 'todo'
          name: '1. Create usePageViewConfig Hook'
          reason: |
            A dedicated hook provides a clean, reusable, and declarative API for pages to manage their specific view width configurations without cluttering the page components with lifecycle logic.
          files:
            - src/hooks/usePageViewConfig.hook.ts
          operations:
            - 'Create a new file `src/hooks/usePageViewConfig.hook.ts`.'
            - "Define a hook `usePageViewConfig` that accepts a config object: `{ sidePaneWidth?: number; splitPaneWidth?: number }`."
            - 'Inside the hook, use a `useEffect` with an empty dependency array `[]`.'
            - "In the effect, get `setSplitPaneWidth`, `setSidePaneWidth`, and `resetPaneWidths` actions from `useAppShellStore`."
            - 'If `config.splitPaneWidth` is defined, call `setSplitPaneWidth` with the value.'
            - 'If `config.sidePaneWidth` is defined, call `setSidePaneWidth` with the value.'
            - 'Return a cleanup function from the effect that calls `resetPaneWidths()`.'
        - uuid: 'a7b8c9d0-e1f2-a3b4-c5d6-e7f8a9b0c1d2'
          status: 'todo'
          name: '2. Apply Configuration to Messaging Page'
          reason: |
            Now we apply the new hook to the Messaging page to fix the cramped split-view layout. This serves as the primary use case and validation for the new system. We'll give the right pane more room, making the conversation list in the main pane narrower.
          files:
            - src/pages/Messaging/index.tsx
          operations:
            - "Import the new `usePageViewConfig` hook."
            - "Inside the `MessagingPage` component, call `usePageViewConfig`."
            - 'Pass a configuration object that sets `splitPaneWidth`. A good starting value would be a calculation that makes the right pane significantly larger, for example: `splitPaneWidth: window.innerWidth * 0.6`.'
      context_files:
        compact:
          - src/pages/Messaging/index.tsx
          - src/store/appShell.store.ts
        medium:
          - src/pages/Messaging/index.tsx
          - src/store/appShell.store.ts
          - src/hooks/useResizablePanes.hook.ts
        extended:
          - src/pages/Messaging/index.tsx
          - src/store/appShell.store.ts
          - src/hooks/useResizablePanes.hook.ts
          - src/components/layout/AppShell.tsx
          - src/hooks/useAppViewManager.hook.ts
  conclusion: |
    This refactor successfully decouples page layout from the global shell configuration, making the AppShell more of a framework and less of a dictator. Pages can now opt-in to custom layouts with a single hook, without needing to fork the main shell logic or cluttering their own component.

    It's a huge win for component independence and makes implementing future features like user-saveable layout presets much more straightforward. The immediate fix to the Messaging page layout demonstrates the power and simplicity of the new approach.
  context_files:
    compact:
      - src/store/appShell.store.ts
      - src/providers/AppShellProvider.tsx
      - src/pages/Messaging/index.tsx
    medium:
      - src/store/appShell.store.ts
      - src/providers/AppShellProvider.tsx
      - src/pages/Messaging/index.tsx
      - src/hooks/useResizablePanes.hook.ts
      - src/components/layout/AppShell.tsx
    extended:
      - src/store/appShell.store.ts
      - src/providers/AppShellProvider.tsx
      - src/pages/Messaging/index.tsx
      - src/hooks/useResizablePanes.hook.ts
      - src/components/layout/AppShell.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/hooks/useRightPaneContent.hook.tsx
```
