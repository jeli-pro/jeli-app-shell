This is a classic case of state management getting out of hand on a single page. Moving all this view state into the URL is a massive win for user experience. Bookmarks will just work, sharing a specific filtered/sorted view becomes trivial, and the browser's back button becomes our friend again. We're going to turn that mess of `useState` into a clean, URL-driven component.

The core idea is to make `URLSearchParams` the single source of truth. We'll read from it to build the UI, and any user interaction will update the URL, which in turn triggers a re-render with the new state. It's a clean, declarative flow. We'll centralize all URL updates into a single handler to keep things DRY and manage side-effects like resetting pagination.

Let's get this done.

```yaml
plan:
  uuid: 'f2d9c1e0-a7b3-4f9d-8c4a-6e5b7f1d2a3b'
  status: 'todo'
  title: 'Refactor Data Demo Page State to be URL-Driven'
  introduction: |
    We're overhauling the `DataDemoPage` to move its local component state into the URL's search parameters. Currently, all filtering, sorting, view mode, and pagination are managed by a series of `useState` hooks, making the page's state ephemeral and not shareable.

    This refactor will make `react-router`'s `useSearchParams` the single source of truth for the page's configuration. Every state change will be reflected in the URL, making the view fully linkable, bookmarkable, and navigable through browser history. We'll create a centralized handler to manage URL updates, ensuring consistent behavior like resetting pagination when filters are applied. The goal is a cleaner, more robust, and user-friendly data exploration experience.
  parts:
    - uuid: '9a1b8c7d-4e5f-4a3b-9c8d-1e2f3a4b5c6d'
      status: 'todo'
      name: 'Part 1: Make Data Demo Page State URL-Driven'
      reason: |
        To make the page state (filters, sorting, view mode, etc.) bookmarkable, shareable, and navigable via browser history. This change centralizes state management, making the component more predictable and easier to debug.
      steps:
        - uuid: '1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e'
          status: 'todo'
          name: '1. Parse URL Search Parameters for State'
          reason: |
            The first step is to stop managing state locally and instead derive it directly from the URL. This makes the URL the single source of truth. We'll replace multiple `useState` hooks with `useMemo` hooks that parse the `searchParams` object from `react-router-dom`.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'Import `useSearchParams` from `react-router-dom` in `DataDemoPage`.'
            - 'Remove the `useState` hooks for `viewMode`, `filters`, `sortConfig`, `groupBy`, and `activeGroupTab`.'
            - 'Create `useMemo` hooks to derive these state variables from `searchParams`. For example: `const viewMode = useMemo(() => (searchParams.get("view") as ViewMode) || "list", [searchParams]);`.'
            - 'Ensure parsing is case-insensitive where appropriate by using `.toLowerCase()` on retrieved parameter values.'
            - 'Parse `q` for search, `status` and `priority` for filters (split by comma), `sort` for sorting, `groupBy`, and `tab`.'
            - 'Remove the `useState` for `page` and derive it from the `page` search param, defaulting to `1`. For example: `const page = useMemo(() => parseInt(searchParams.get("page") || "1"), [searchParams]);`.'
        - uuid: '2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f'
          status: 'todo'
          name: '2. Implement a Centralized URL Update Handler'
          reason: |
            Instead of scattering `setSearchParams` calls throughout the component, we'll create a single, robust function to handle all URL modifications. This keeps logic centralized, reduces boilerplate, and allows us to manage complex side-effects like resetting pagination when filters change.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'Create a new function `handleParamsChange` wrapped in `useCallback`.'
            - 'This function should accept an object of new or updated search parameters (e.g., `{ view: "cards" }`).'
            - 'Inside the function, use the functional update form of `setSearchParams(prev => { ... })` to avoid stale state.'
            - 'Implement logic to merge the new params with the existing ones. If a value is `null`, `undefined`, or an empty string/array, delete the parameter from the URL.'
            - 'Add logic to automatically reset the `page` to 1 by deleting the `page` param whenever filters (`q`, `status`, `priority`), sorting (`sort`), or grouping (`groupBy`) are changed.'
            - 'Add logic to reset the active group `tab` by deleting the `tab` param whenever `groupBy` is changed.'
        - uuid: '3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8g'
          status: 'todo'
          name: '3. Connect UI Components to the URL Handler'
          reason: |
            With the state derived from the URL and a handler to update it, we now need to wire up the UI components to this new system. All user interactions that change the view will now call our centralized `handleParamsChange` function.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'Update the `onChange` prop for `DataViewModeSelector` to call `handleParamsChange({ view: newMode })`.'
            - 'Modify the `onFiltersChange` handler for `DataToolbar` to call `handleParamsChange` with the new filter values for `q`, `status`, and `priority`.'
            - 'Modify the `onSortChange` handler for `DataToolbar` to format the sort config into a string (e.g., `updatedAt-desc`) and pass it to `handleParamsChange({ sort: ... })`.'
            - 'Update the `onValueChange` handler for the `groupBy` `DropdownMenu` to call `handleParamsChange({ groupBy: ... })`.'
            - 'Update the `onTabChange` prop for `AnimatedTabs` to call `handleParamsChange({ tab: ... })`.'
        - uuid: '4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8g9h'
          status: 'todo'
          name: '4. Refactor Data Loading and Infinite Scroll'
          reason: |
            The data fetching and pagination logic needs to be adapted to the new URL-driven state model. The component should now react to changes in `searchParams` to fetch or display data, rather than local state.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - "Remove the `useEffect` hook that was responsible for resetting pagination; this logic is now in `handleParamsChange`."
            - "Refactor the main data-loading `useEffect` to be triggered by `searchParams` and the `filteredAndSortedData` memo."
            - "Inside this effect, handle the case where `groupBy` is active by loading all data at once and disabling pagination (`setHasMore(false)`)."
            - "For paginated views (`groupBy` is `'none'`), check the `page` from the URL. If it's `1`, clear the existing `items`. Then, slice the correct page of data from `filteredAndSortedData` and append it to the `items` state."
            - "Update the `loaderRef` `useCallback` for infinite scroll. When triggered, it should read the current `page` from `searchParams`, calculate `currentPage + 1`, and call `handleParamsChange` to update the `page` param in the URL."
      context_files:
        compact:
          - src/pages/DataDemo/index.tsx
        medium:
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/components/DataViewModeSelector.tsx
        extended:
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/components/DataViewModeSelector.tsx
          - src/App.tsx
          - src/pages/DataDemo/types.ts
  conclusion: |
    By completing this refactor, the `DataDemoPage` will be significantly more robust and user-friendly. Its state will be entirely controlled by the URL, making every possible view of the data—filtered, sorted, grouped, and paginated—a distinct, shareable link.

    This change simplifies the component's internal logic by removing multiple `useState` hooks and effects in favor of a declarative approach that derives state from a single source of truth. The result is cleaner code, a better user experience, and a more powerful data exploration tool.
  context_files:
    compact:
      - src/pages/DataDemo/index.tsx
    medium:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/components/DataToolbar.tsx
      - src/pages/DataDemo/components/DataViewModeSelector.tsx
    extended:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/components/DataToolbar.tsx
      - src/pages/DataDemo/components/DataViewModeSelector.tsx
      - src/App.tsx
      - src/pages/DataDemo/types.ts
```
