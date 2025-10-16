Here's the master plan, crafted in the spirit of a seasoned architect looking to clean up some tangled state logic.

***

Alright, team. We've got some jank in the `useAppViewManager` hook. It's the classic god-object problem, trying to manage the whole universe through URL params and ending up stepping on its own toes. Every time we change one little thing, like the data view mode, it nukes the whole query string and rebuilds it, wiping out our app layout state (`split`, `sidePane`, etc.). This is causing two gnarly bugs: changing the data view breaks the layout, and changing the layout makes the data list vanish into the ether. Classic state management spaghetti.

The fix is simple and surgical. We're going to teach `useAppViewManager` to play nice. Instead of a scorched-earth approach to URL params, we'll refactor its core logic to perform precise, targeted updates. It will read the existing params, change only what it's told to, and leave everything else alone. This single change will decouple the page-level state from the global app-shell state, killing both bugs with one stone. It's a clean, low-risk refactor that will make the whole system more robust and predictable. Let's get it done.

```yaml
plan:
  uuid: 'c8a1b4fe-3d9a-4f2e-8a7e-f6e2b9c7b1d3'
  status: 'todo'
  title: 'Refactor useAppViewManager to Isolate URL State'
  introduction: |
    We've identified a critical issue in `useAppViewManager.hook.ts` where the URL parameter manipulation is too aggressive. The current implementation rebuilds the entire search query string on any state change, which inadvertently resets unrelated parameters. This causes state conflicts between the global app layout (e.g., split view) and page-specific views (e.g., the DataDemo page's list/card/table mode).

    This refactoring plan will address the root cause by modifying the hook to perform surgical updates on URL search parameters. Instead of replacing the entire query string, it will now read the current parameters and only add, update, or remove the specific ones related to the action being performed. This will decouple the states, resolving two major bugs:
    1. Changing the data view mode will no longer reset the app's split-view or side-pane layout.
    2. The data list on the DataDemo page will no longer disappear when the global app layout is changed, as the page's view state will remain stable.
  parts:
    - uuid: '4e9b8dcf-1a0e-4c7b-9f3a-c5d0a6b3e8e1'
      status: 'todo'
      name: 'Part 1: Implement Surgical URL Parameter Updates'
      reason: |
        The core of the problem lies in the `handleParamsChange` function within the `useAppViewManager` hook. It currently overwrites all URL parameters, leading to unintended state resets. By refactoring this single function, we can ensure that different parts of the application state managed via the URL are independent and do not conflict with each other. This is a foundational fix for application stability.
      steps:
        - uuid: 'f5d1e2e9-7c3a-4b9d-8c4b-b1e9c2b3e5a4'
          status: 'todo'
          name: '1. Refactor `handleParamsChange` in `useAppViewManager.hook.ts`'
          reason: |
            This step will modify the internal logic for updating URL search parameters. The goal is to preserve existing, unrelated params when a view state changes. This will fix both reported bugs by preventing state "clobbering".
          files:
            - src/hooks/useAppViewManager.hook.ts
          operations:
            - 'Locate the internal `handleParamsChange` function.'
            - 'Modify the function to accept an object of `paramsToUpdate`.'
            - 'Instead of creating a `new URLSearchParams()`, create one from the current `location.search` to preserve existing parameters: `const newParams = new URLSearchParams(location.search);`.'
            - 'Iterate through the keys of the `paramsToUpdate` object.'
            - 'Inside the loop, if a value is `null` or `undefined`, use `newParams.delete(key)` to remove it from the query string.'
            - 'Otherwise, use `newParams.set(key, String(value))` to update or add the parameter.'
            - 'Finally, use this `newParams` object in the `navigate` call to update the URL.'
  conclusion: |
    By implementing this targeted refactoring of the `useAppViewManager` hook, we will have successfully decoupled the global application layout state from page-specific view states. This change enhances the predictability and stability of the UI, eliminating frustrating bugs where user actions in one part of the app have unintended consequences elsewhere. The codebase becomes more robust, and the user experience is significantly improved.
  context_files:
    compact:
      - src/hooks/useAppViewManager.hook.ts
      - src/pages/DataDemo/index.tsx
    medium:
      - src/hooks/useAppViewManager.hook.ts
      - src/pages/DataDemo/index.tsx
      - src/components/layout/ViewModeSwitcher.tsx
      - src/pages/DataDemo/components/DataViewModeSelector.tsx
    extended:
      - src/hooks/useAppViewManager.hook.ts
      - src/pages/DataDemo/index.tsx
      - src/components/layout/ViewModeSwitcher.tsx
      - src/pages/DataDemo/components/DataViewModeSelector.tsx
      - src/store/appShell.store.ts
      - src/App.tsx
```
Here's the plan, architect. We're gonna give that login page some much-needed love. It's a simple change, but it's all about making things look intentional.

```yaml
plan:
  uuid: 'e4a5b0c1-3d2f-4e6a-8b7c-9d0a1b2c3d4e'
  status: 'todo'
  title: 'Refactor Login Page for Distinct Column Backgrounds'
  introduction: |
    Yo. The login page is looking a bit vanilla. Both columns are rocking the same background, making it feel kinda flat. We're about to change that.

    The plan is to give the left and right panels distinct backgrounds. This is 101 for good visual hierarchy and it'll make the page actually look designed. We'll stick to the existing theme colors so it doesn't look out of place. The left panel, with all the cool animations, gets a `bg-muted` vibe. The right panel with the actual login form? It'll stay on `bg-background` to keep focus where it needs to be.

    It's a quick and dirty change, but the UX boost will be legit.
  parts:
    - uuid: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
      status: 'todo'
      name: 'Part 1: Apply Distinct Backgrounds to Login Page Columns'
      reason: |
        To visually separate the decorative/branding section (left) from the interactive form section (right) on the login page. This enhances the user's focus on the login form and improves the overall aesthetic of the page. It's a low-effort, high-impact tweak.
      steps:
        - uuid: 'f6e5d4c3-b2a1-4f9e-8d7c-6b5a4c3d2e1f'
          status: 'todo'
          name: '1. Tweak Left Column Background'
          reason: |
            We're applying a `bg-muted` class to the left column of the login page. This is where all the eye-candy lives, so giving it a slightly different background will make the form on the right pop. Simple, effective.
          files:
            - src/components/auth/LoginPage.tsx
          operations:
            - "Locate the `div` for the 'Left Side' of the login page. It's the one with all the cool effects components."
            - "Add the `bg-muted` Tailwind class to its `className` attribute. This will pull the muted background color from our theme, ensuring it works in both light and dark modes."
      context_files:
        compact:
          - src/components/auth/LoginPage.tsx
        medium:
          - src/components/auth/LoginPage.tsx
          - src/index.css
        extended:
          - src/components/auth/LoginPage.tsx
          - src/index.css
          - tailwind.config.js
  conclusion: |
    And that's a wrap. We've added a simple background color change that creates a clear visual distinction on the login page. The form now stands out more, and the whole page feels more structured and less monolithic.

    This small change improves the user experience by guiding their focus and makes the initial entry point to the app look more polished. Proof that sometimes the simplest hacks have the biggest impact.
  context_files:
    compact:
      - src/components/auth/LoginPage.tsx
    medium:
      - src/components/auth/LoginPage.tsx
      - src/index.css
    extended:
      - src/components/auth/LoginPage.tsx
      - src/index.css
      - tailwind.config.js
```
