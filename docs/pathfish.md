Here's the master plan for refactoring the Data Demo page.

```yaml
plan:
  uuid: 'c8d4a9e1-5b7f-4f9a-8e2c-1a3b9f0d6c5e'
  status: 'todo'
  title: 'Implement Global Sorting & Filtering for Data Demo Page'
  introduction: |
    The current DataDemo page is a static beast. We're gonna juice it up with dynamic client-side sorting and filtering that works across all view modes (list, cards, grid, table).

    Right now, the table view has its own siloed sorting logic, which is a no-go for a unified experience. The plan is to rip that out, hoist all data-massaging logic into the main `DataDemoPage` component, and create a single source of truth for data processing. We'll build a new `DataToolbar` component to house all the user controls, keeping the main component clean.

    This refactor will make the page feel alive and actually useful, transforming it from a simple showcase into an interactive data exploration tool.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Centralize Data Processing Logic'
      reason: |
        To make sorting and filtering global across all views, all data manipulation logic must be hoisted into the parent `DataDemoPage` component. This creates a single source of truth and makes the view components "dumber" and more reusable. We'll start by lifting the existing sort logic from `DataTableView` and expanding on it.
      steps:
        - uuid: 'e1f2a3b4-c5d6-7890-e1f2-a3b4c5d67890'
          status: 'todo'
          name: '1. Update Data Types'
          reason: |
            We need to define the shapes for our new sorting and filtering state to ensure type safety throughout the implementation.
          files:
            - src/pages/DataDemo/types.ts
          operations:
            - 'Add new type `SortConfig` with properties `key: SortableField` and `direction: "asc" | "desc"`.
            - 'Add a new type `SortableField` which is a union of strings for the fields we can sort by, like `"title"`, `"status"`, `"priority"`, `"updatedAt"`, `"assignee.name"`, etc.'
            - 'Add a new type `FilterConfig` with properties like `searchTerm: string`, `status: string[]`, `priority: string[]`.
        - uuid: 'b4c5d6e7-f8a9-0b1c-d2e3-f4a5b6c7d8e9'
          status: 'todo'
          name: '2. Hoist State and Logic to DataDemoPage'
          reason: |
            This is the core of the refactor. We'll move all data processing to the main page component to act as the single source of truth.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'Import the new `SortConfig` and `FilterConfig` types.'
            - 'Introduce new states: `const [filters, setFilters] = useState<FilterConfig>(...)` and `const [sortConfig, setSortConfig] = useState<SortConfig | null>(...)`.
            - 'Create a `useMemo` hook named `processedData`. This hook will take `mockDataItems`, `filters`, and `sortConfig` as dependencies.'
            - 'Inside `processedData`, first apply filtering based on `filters.searchTerm`, `filters.status`, and `filters.priority`.'
            - 'Then, sort the filtered array based on `sortConfig.key` and `sortConfig.direction`. Handle nested keys like `"assignee.name"`.
            - 'Create a `useEffect` that listens for changes in `filters` or `sortConfig`. When they change, it should reset `setItems([])` and `setPage(1)` to trigger a fresh load of the newly processed data.'
            - 'Update the infinite scroll `useEffect` to slice from `processedData` instead of `mockDataItems`.'
        - uuid: 'f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a90b1c'
          status: 'todo'
          name: '3. Refactor DataTableView'
          reason: |
            Make `DataTableView` a "dumb" component that receives its data and state from its parent, removing its internal sorting logic.
          files:
            - src/pages/DataDemo/components/DataTableView.tsx
          operations:
            - 'Remove the internal `sortField` and `sortDirection` state.'
            - 'Add new props: `sortConfig: SortConfig | null` and `onSort: (field: SortableField) => void`.
            - 'Update the `handleSort` function to be a simple callback `(field) => onSort(field)`.
            - 'Modify the `SortIcon` component to determine its state from the `sortConfig` prop instead of internal state.'
            - 'The component should now render `data` directly without calling an internal `getSortedData` function.'
    - uuid: '09876543-21fe-dcba-0987-654321fedcba'
      status: 'todo'
      name: 'Part 2: Build the Data Toolbar'
      reason: |
        A dedicated `DataToolbar` component is needed to house the filter and sort controls. This keeps the UI for data manipulation separate from the main page logic, promoting separation of concerns and a cleaner `DataDemoPage` component.
      steps:
        - uuid: 'cba98765-4321-fedc-ba98-76543210fedc'
          status: 'todo'
          name: '1. Create DataToolbar Component'
          reason: |
            Scaffold the new component and define its API.
          files:
            - src/pages/DataDemo/components/DataToolbar.tsx
          operations:
            - 'Create a new file `src/pages/DataDemo/components/DataToolbar.tsx`.
            - 'The component should accept props: `filters`, `onFiltersChange`, `sortConfig`, `onSortChange`, and `viewMode`, `onViewModeChange`.
            - 'Move the existing `DataViewModeSelector` inside this new toolbar component.'
        - uuid: '1234abcd-efgh-5678-ijkl-mnopqrstuv'
          status: 'todo'
          name: '2. Implement Filter and Sort Controls'
          reason: |
            Build out the UI elements for searching, filtering, and sorting within the toolbar.
          files:
            - src/pages/DataDemo/components/DataToolbar.tsx
          operations:
            - 'Add an `Input` component with a `Search` icon for the `searchTerm` filter.'
            - 'Use a `Popover` containing a `Command` component to create a multi-select dropdown for filtering by `status`. It should display a `Badge` with the count of active filters.'
            - 'Implement a similar multi-select `Popover` for filtering by `priority`.
            - 'Add a `DropdownMenu` to control sorting. It should have options like "Last Updated", "Title A-Z", "Priority", etc. and reflect the current `sortConfig`.'
            - 'Arrange all controls in a responsive flex layout.'
    - uuid: 'fedcba09-8765-4321-fedc-ba0987654321'
      status: 'todo'
      name: 'Part 3: Integrate and Finalize'
      reason: |
        Wire up the new `DataToolbar` and the centralized data processing logic to create the final, interactive experience.
      steps:
        - uuid: '543210fe-dcba-9876-5432-10fedcba9876'
          status: 'todo'
          name: '1. Integrate DataToolbar into DataDemoPage'
          reason: |
            Connect the new toolbar to the main page's state and logic.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'Remove the `DataViewModeSelector` from `index.tsx`.
            - 'Import and render the new `DataToolbar` component in its place.'
            - 'Pass the `filters`, `sortConfig`, and `viewMode` state down to the `DataToolbar` as props.'
            - 'Pass callback handlers (`setFilters`, `setSortConfig`, `setViewMode`) to `DataToolbar` to update the state.'
        - uuid: 'abcdef12-3456-7890-abcd-ef1234567890'
          status: 'todo'
          name: '2. Update View Components Props'
          reason: |
            Ensure all view components receive the correctly processed data and props.
          files:
            - src/pages/DataDemo/index.tsx
            - src/pages/DataDemo/components/DataTableView.tsx
            - src/pages/DataDemo/components/DataCardView.tsx
            - src/pages/DataDemo/components/DataListView.tsx
          operations:
            - 'In `DataDemoPage`, make sure the `renderView` function passes the paginated `items` state to all view components.'
            - 'Pass the new `onSort` handler and `sortConfig` state down to `DataTableView`.
            - 'Check that `EmptyState` is correctly displayed by all views when the `processedData` array is empty after filtering.'
  conclusion: |
    Upon completion, we'll have a much more powerful and maintainable data page. The logic will be centralized in `DataDemoPage`, the UI for controls will be decoupled into its own `DataToolbar` component, and the user gets a vastly improved, interactive experience that feels like a proper application. This structured approach makes future enhancements, like adding more filters or sort options, trivial.
  context_files:
    compact:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/components/DataTableView.tsx
      - src/pages/DataDemo/types.ts
    medium:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/components/DataTableView.tsx
      - src/pages/DataDemo/components/DataCardView.tsx
      - src/pages/DataDemo/components/DataListView.tsx
      - src/pages/DataDemo/components/DataViewModeSelector.tsx
      - src/pages/DataDemo/types.ts
      - src/components/ui/input.tsx
      - src/components/ui/popover.tsx
      - src/components/ui/command.tsx
    extended:
      - src/pages/DataDemo/index.tsx
      - src/pages/DataDemo/components/DataTableView.tsx
      - src/pages/DataDemo/components/DataCardView.tsx
      - src/pages/DataDemo/components/DataListView.tsx
      - src/pages/DataDemo/components/DataViewModeSelector.tsx
      - src/pages/DataDemo/components/EmptyState.tsx
      - src/pages/DataDemo/types.ts
      - src/pages/DataDemo/data/mockData.ts
      - src/components/ui/input.tsx
      - src/components/ui/popover.tsx
      - src/components/ui/command.tsx
      - src/components/ui/dropdown-menu.tsx
      - src/components/ui/badge.tsx
      - src/components/ui/button.tsx
```
