Alright, let's architect this fix. The current setup is slick, but losing the theme on refresh is a classic rookie mistake. We're going to fix it the right way, making it persistent and flicker-free. This isn't just about slapping `localStorage` on it; it's about doing it elegantly so the user experience is seamless.

We'll use Zustand's built-in `persist` middleware to handle the state storage. That's the easy part. The real pro move is adding a tiny, blocking script to the `index.html` head. This script will run before React even thinks about mounting, read the theme from `localStorage`, and apply the `dark` class instantly. No more flash of light theme on a dark-mode user's screen. That's how you show you care about the details.

The plan is simple:
1.  **Beef up the `appShell.store`:** We'll wrap our Zustand store with the `persist` middleware. We'll be surgical, using `partialize` to only store the settings that matter—theme, layout preferences, etc. We don't want to persist transient UI state like `isResizing`.
2.  **Pre-emptive Strike on `index.html`:** We'll inject a small script into the `<head>` to set the theme class before the page paints. This kills the flicker dead.

Let's get this done.

```yaml
plan:
  uuid: 'f8d1e2c3-a4b5-46c7-8d9e-01a2b3c4d5e6'
  status: 'todo'
  title: 'Persist Dark/Light Mode on Refresh'
  introduction: |
    The current application does not persist the user's selected dark or light mode preference across page reloads, leading to a frustrating user experience where the theme resets on every refresh. Additionally, even with simple persistence, there's a risk of a "flash of incorrect theme" (FOIT) where the default theme is shown briefly before the persisted preference is applied by JavaScript.

    This plan addresses both issues. We will leverage Zustand's `persist` middleware to automatically save the user's theme choice (and other relevant settings) to `localStorage`. To eliminate the theme flicker, we will add a small, synchronous inline script to the `<head>` of the `index.html` file. This script will execute before the main application bundle, read the persisted theme from `localStorage`, and apply the correct CSS class to the `<html>` element, ensuring a seamless and instant theme application on page load.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Implement Persistence in App Shell Store'
      reason: |
        To ensure user preferences are saved and reloaded, we need to modify the central `appShell.store` to use `localStorage`. We will use Zustand's `persist` middleware, which simplifies this process. We will also be selective about what we persist to avoid saving temporary UI state.
      steps:
        - uuid: 'b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6'
          status: 'todo'
          name: '1. Integrate `persist` Middleware into `appShell.store`'
          reason: |
            This step modifies the Zustand store to save a subset of its state to `localStorage`. We will use the `partialize` option to specifically select user preferences like dark mode, sidebar state, and pane widths, preventing transient state like `isResizing` or `draggedPage` from being persisted.
          files:
            - src/store/appShell.store.ts
          operations:
            - 'Import `persist` from `zustand/middleware`.'
            - 'Wrap the existing `create` callback with `persist((set, get) => ({...}), { ...options })`.'
            - 'Provide a configuration object to `persist`.'
            - "Set the `name` option to `'app-shell-storage'` to define the key in `localStorage`."
            - "Implement the `partialize` option to return an object containing only the state we want to persist: `isDarkMode`, `sidebarState`, `sidebarWidth`, `sidePaneWidth`, `splitPaneWidth`, `autoExpandSidebar`, `reducedMotion`, `compactMode`, `primaryColor`."
    - uuid: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12'
      status: 'todo'
      name: 'Part 2: Prevent Initial Theme Flicker'
      reason: |
        Even with persistence, the application's JavaScript needs time to load and apply the theme, causing a "flicker" of the default (light) theme. By adding a script directly to `index.html`, we can apply the theme before the page is rendered by the browser, providing a much smoother user experience.
      steps:
        - uuid: 'd4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9'
          status: 'todo'
          name: '1. Add Pre-emptive Theme Script to `index.html`'
          reason: |
            This inline script will run synchronously before the main React application. It checks `localStorage` for the persisted theme setting and applies the `.dark` class to the `<html>` element if necessary. It also includes a fallback to respect the user's operating system preference via `prefers-color-scheme`.
          files:
            - index.html
          operations:
            - 'In `index.html`, add a `<script>` tag inside the `<head>` element, before any other scripts or stylesheets.'
            - 'Inside the script, write self-executing JavaScript (`(() => { ... })();`).'
            - "The script should attempt to read from `localStorage` using the key `'app-shell-storage'`."
            - 'It should parse the stored JSON and check for the `state.isDarkMode` property.'
            - "If `isDarkMode` is `true`, add the class `'dark'` to `document.documentElement`."
            - "If `isDarkMode` is `false`, remove the class `'dark'` from `document.documentElement`."
            - "If no value is found in `localStorage`, use `window.matchMedia('(prefers-color-scheme: dark)').matches` as a fallback to set the initial theme based on the user's system settings."
  conclusion: |
    By completing these two parts, we will have a robust and professional theme persistence implementation. The user's dark/light mode preference will be remembered across sessions, and the flicker-free loading experience will make the application feel more native and polished. This approach correctly separates concerns: Zustand handles state management, while a minimal, high-priority script handles the initial render to prevent visual artifacts.
  context_files:
    compact:
      - src/store/appShell.store.ts
      - index.html
    medium:
      - src/store/appShell.store.ts
      - index.html
      - src/App.tsx
    extended:
      - src/store/appShell.store.ts
      - index.html
      - src/App.tsx
      - src/features/settings/SettingsContent.tsx
      - src/components/layout/TopBar.tsx
```
