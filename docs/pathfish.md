Yo, what's up HN. We've got a classic state-bleed problem. Resizing a pane in one part of the app is screwing up the layout in another. Specifically, our slick new Messaging page gets its split-view pane width wrecked by whatever the user did last on the DataDemo page. Not a great look.

The root cause is our global `appShell.store`, which persists pane widths to `localStorage`. Great for remembering a user's preference on one page, terrible for pages that need their own pristine layout.

The plan is simple but effective. We're gonna upgrade an existing hook, `usePageViewConfig`, to be reactive. Right now, it's a one-and-done deal on mount. We'll make it listen for changes so it can dynamically enforce a page's desired layout. Then, we'll drop this suped-up hook into the Messaging page. It'll watch the URL for a conversation ID. When one appears, BAM, it slaps the split pane back to a clean default width. When the user leaves, it cleans up after itself. No more layout surprises. It's a surgical strike that fixes the UX without a massive rewrite.

Let's get this done.

```yaml
plan:
  uuid: 'e1c9a0b1-3f4a-4e87-9b1b-a2e4f0c8d19f'
  status: 'todo'
  title: 'Refactor: Enforce Default Split Pane Width on Messaging Page'
  introduction: |
    Alright, listen up. We've got a classic state-bleed problem. The global `appShell.store` persists pane widths, which is cool until it's not. Resizing a split pane on the DataDemo page messes with the layout on the Messaging page, which is supposed to have its own specific layout. This creates a janky, unpredictable UX.

    This plan is a two-step surgical strike. First, we're going to level-up the `usePageViewConfig` hook. Right now it's a fire-and-forget hook that only runs on mount. We'll make it reactive to prop changes, so it can enforce layout rules dynamically as the user navigates within a page.

    Second, we'll deploy this enhanced hook on the Messaging page. It'll monitor the URL. As soon as a conversation ID pops up and the page enters split-view, the hook will force the right pane to a clean, default width, overriding any global shenanigans. On navigating away, it resets everything, leaving no trace. This fixes the immediate bug and gives us a more powerful tool for layout management across the app.
  parts:
    - uuid: '7d3b1f9c-5a2e-4b0d-9a8c-f0e6c1a8b3d4'
      status: 'todo'
      name: 'Part 1: Make `usePageViewConfig` Hook Reactive'
      reason: |
        The existing `usePageViewConfig` hook only runs on component mount because of a static, empty dependency array. This isn't good enough for pages that change their layout based on URL params without a full re-mount. To fix the Messaging page, we need this hook to react whenever the desired pane configuration changes.
      steps:
        - uuid: 'a5b2c3d4-8e1f-4a09-9f7b-6c8d7e9f0a1b'
          status: 'todo'
          name: '1. Update useEffect dependencies to be reactive'
          reason: |
            By changing the `useEffect`'s dependency array from `[]` to include the `config` values, the hook will re-evaluate and apply pane widths whenever those values change, not just on the initial mount. This is the key to making it work dynamically on the Messaging page.
          files:
            - 'src/hooks/usePageViewConfig.hook.ts'
          operations:
            - "In `useEffect`, replace the empty dependency array `[]` with `[config, resetPaneWidths, setSidePaneWidth, setSplitPaneWidth]`."
            - "Destructure `config` inside the `useEffect` callback: `const { sidePaneWidth, splitPaneWidth } = config;`."
            - "Update the `if` conditions to use the destructured variables: `if (sidePaneWidth)` and `if (splitPaneWidth)`."
            - "Update the `useEffect` dependency array again to use the destructured properties for stability against object re-renders: `[sidePaneWidth, splitPaneWidth, resetPaneWidths, setSidePaneWidth, setSplitPaneWidth]`."
            - "Remove the `// eslint-disable-next-line react-hooks/exhaustive-deps` comment as the dependencies are now correctly listed."
    - uuid: 'b8e4f2a1-6d7c-4e09-8b45-1c2d3e4f5a6b'
      status: 'todo'
      name: 'Part 2: Implement Pane Width Logic in Messaging Page'
      reason: |
        With a reactive `usePageViewConfig` hook, we can now apply it to the Messaging page. This will enforce a default `splitPaneWidth` whenever a user views a conversation, solving the core problem of width settings bleeding over from other pages.
      steps:
        - uuid: 'c9f5d6a7-1b3e-4c8d-9a7f-8b9c0d1e2f3a'
          status: 'todo'
          name: '1. Integrate `usePageViewConfig` in MessagingPage'
          reason: |
            This step connects the page's state (whether a conversation is active) to the AppShell's layout control. By calling the hook with a width only when needed, we ensure the layout is correct for the context.
          files:
            - 'src/pages/Messaging/index.tsx'
          operations:
            - "Import `usePageViewConfig` from `'@/hooks/usePageViewConfig.hook.ts'`."
            - "Import `useAppShellStore` from `'@/store/appShell.store'`."
            - "Inside the `MessagingPage` component, get the `defaultSplitPaneWidth` from the store: `const defaultSplitPaneWidth = useAppShellStore((s) => s.defaultSplitPaneWidth);`."
            - "Conditionally determine the desired width based on the presence of `conversationId`: `const desiredSplitPaneWidth = conversationId ? defaultSplitPaneWidth : undefined;`."
            - "Call the hook with the dynamic configuration: `usePageViewConfig({ splitPaneWidth: desiredSplitPaneWidth });`."
  conclusion: |
    Once this is deployed, the Messaging page will finally have a predictable layout. No more weirdly sized panes because you were just on another page. The user experience will be more stable and professional.

    As a side-benefit, we've toughened up the `usePageViewConfig` hook, making it a more versatile tool for future layout challenges. It's a win for the user and a win for future-devs. Solid day's work.
  context_files:
    compact:
      - 'src/hooks/usePageViewConfig.hook.ts'
      - 'src/pages/Messaging/index.tsx'
    medium:
      - 'src/hooks/usePageViewConfig.hook.ts'
      - 'src/pages/Messaging/index.tsx'
      - 'src/store/appShell.store.ts'
      - 'src/App.tsx'
    extended:
      - 'src/hooks/usePageViewConfig.hook.ts'
      - 'src/pages/Messaging/index.tsx'
      - 'src/store/appShell.store.ts'
      - 'src/App.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'
      - 'src/components/layout/AppShell.tsx'
```
