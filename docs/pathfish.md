Here's the master plan for the refactor.

This is the way. We're going to gut the `TopBar` component, transforming it from a monolithic, logic-filled beast into a lean, dumb, and purely presentational component. Right now, it's coupled to every page it serves, which is a recipe for disaster. We'll introduce explicit props to serve as injection points, effectively creating slots for page-specific controls.

The logic we're ripping out isn't disappearing; it's being moved to a more appropriate location—the application's composition root in `App.tsx`. This centralizes the decision-making, making it trivial to see which page gets which controls. It’s a classic inversion of control that cleans up dependencies and makes the entire component hierarchy more predictable and maintainable. This move sets us up for future wins, making the system more modular and testable.

Let's ship it.

```yaml
plan:
  uuid: '1e8a9c3f-7b0d-4a9e-8c6f-92a4f5b7d1e0'
  status: 'todo'
  title: 'Refactor TopBar: Nuke Page-Specific Logic, Embrace Composition'
  introduction: |
    Right now, `TopBar.tsx` is a god component. It knows way too much about which page is active and hardcodes UI for each one. This is spaghetti code waiting to happen and makes the component impossible to reuse.

    We're going to pwn this complexity by refactoring `TopBar` into a pure, dumb layout component. It'll know nothing about pages. Instead, it'll expose slots (props) for `breadcrumbs` and `pageControls`. The `App.tsx` composition root will be responsible for plugging in the right controls for the right page.

    This decouples the shell from the content, cleans up the codebase, and makes our UI architecture suck less. It's a classic separation of concerns win.
  parts:
    - uuid: 'a2f4b5c6-8d1e-4f7a-9b3c-0a1b2c3d4e5f'
      status: 'todo'
      name: 'Part 1: Gut `TopBar` and Make it a Dumb Component'
      reason: |
        The `TopBar` shouldn't be making decisions. Its only job is to lay out what it's given. We're ripping out the business logic to enforce this boundary and turn it into a reusable layout primitive.
      steps:
        - uuid: 'b3c5d6e7-9f2a-4b8c-8a1b-3d4e5f6g7h8i'
          status: 'todo'
          name: '1. Tweak `TopBar.tsx` API for explicit content injection'
          reason: |
            Changing the props from a generic `children` to specific `breadcrumbs` and `pageControls` makes the component's contract crystal clear: "give me breadcrumbs for the left, and controls for the right". This enforces better composition patterns.
          files:
            - src/components/layout/TopBar.tsx
          operations:
            - "Update the `TopBarProps` interface: axe `children?: React.ReactNode` and add `breadcrumbs?: React.ReactNode` and `pageControls?: React.ReactNode`."
            - "In the component's function signature, update the props destructuring from `children` to `{ breadcrumbs, pageControls }`."
            - "In the JSX, find the `{children}` render prop in the left section and replace it with `{breadcrumbs}`."
            - "Nuke the entire conditional rendering block for `activePage`, which includes checks for `data-demo` and `dashboard`."
            - "In its place (in the right-aligned section, before global controls like `ViewModeSwitcher`), render the `{pageControls}` prop."
      context_files:
        compact:
          - src/components/layout/TopBar.tsx
          - src/App.tsx
        medium:
          - src/components/layout/TopBar.tsx
          - src/App.tsx
          - src/hooks/useAppViewManager.hook.ts
        extended:
          - src/components/layout/TopBar.tsx
          - src/App.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/components/layout/AppShell.tsx
    - uuid: 'c4d5e6f7-0a1b-4c8d-9b3c-1a2b3c4d5e6f'
      status: 'todo'
      name: 'Part 2: Centralize Control Logic in `App.tsx`'
      reason: |
        The logic we removed has to live somewhere. For now, we'll centralize it in the composition root (`App.tsx`). This is a huge improvement because now there's a single, predictable place to look for "what controls does this page have?".
      steps:
        - uuid: 'd5e6f7g8-1b2c-4d8e-9a1b-4e5f6g7h8i9j'
          status: 'todo'
          name: '1. Build `TopBarPageControls` in `App.tsx`'
          reason: |
            To create a new component whose single responsibility is to map the active page to its specific controls. This isolates the branching logic we extracted from `TopBar`.
          files:
            - src/App.tsx
          operations:
            - "Add new imports for UI components that will now be used here: `Input` from `@/components/ui/input`, and `Button` from `@/components/ui/button`."
            - "Add new imports for icons from `lucide-react` that were previously in `TopBar`: `Filter`, `Plus`, and `Rocket`."
            - "Below the `TopBarContent` component definition, create a new functional component: `const TopBarPageControls = () => { ... }`."
            - "Inside `TopBarPageControls`, call the `useAppViewManager` hook to get the `activePage`: `const { activePage } = useAppViewManager();`."
            - "Move the conditional rendering logic from the old `TopBar.tsx` into this new component's return statement. Use an `if/else if` or `switch` statement based on `activePage`."
            - "For `activePage === 'data-demo'`, return the JSX fragment containing the `Input`, `Filter` button, `New` button, and the separator div."
            - "For `activePage === 'dashboard'`, return the JSX fragment containing the `Upgrade` button."
            - "Return `null` or an empty fragment as the default case."
        - uuid: 'e6f7g8h9-2c3d-4e8f-9b1c-5f6g7h8i9j0k'
          status: 'todo'
          name: '2. Wire up `AuthenticatedLayout`'
          reason: |
            To connect the newly created `TopBarPageControls` and the existing `TopBarContent` to the refactored `TopBar` component via its new, more explicit props.
          files:
            - src/App.tsx
          operations:
            - "Locate the `AuthenticatedLayout` functional component."
            - "Find where the `<TopBar>` component is instantiated within the `topBar` prop passed to `<AppShell>`."
            - "Rename the existing `children={<TopBarContent />}` prop to `breadcrumbs={<TopBarContent />}`."
            - "Add the new `pageControls` prop and pass an instance of the component created in the previous step: `pageControls={<TopBarPageControls />}`."
      context_files:
        compact:
          - src/App.tsx
          - src/components/layout/TopBar.tsx
        medium:
          - src/App.tsx
          - src/components/layout/TopBar.tsx
          - src/hooks/useAppViewManager.hook.ts
        extended:
          - src/App.tsx
          - src/components/layout/TopBar.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/components/layout/AppShell.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/Dashboard/index.tsx
  conclusion: |
    We're done. `TopBar` is now a clean, reusable layout component. The page-specific control logic is no longer tangled inside a generic component but is neatly centralized in `App.tsx`, improving separation of concerns.

    This makes the system easier to reason about and maintain. The next logical step would be to introduce a context so pages can provide their controls directly, but this refactor is a solid and necessary first move toward a more robust architecture.
  context_files:
    compact:
      - src/components/layout/TopBar.tsx
      - src/App.tsx
    medium:
      - src/components/layout/TopBar.tsx
      - src/App.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/components/layout/AppShell.tsx
    extended:
      - src/components/layout/TopBar.tsx
      - src/App.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/components/layout/AppShell.tsx
      - src/pages/DataDemo/index.tsx
      - src/pages/Dashboard/index.tsx
      - src/components/ui/input.tsx
      - src/components/ui/button.tsx
```
Here's the master plan for refactoring the Data Demo page. We're gonna juice the UX by adding a clear CTA to get users to play with adding data. No more dead ends in the demo.

This plan will be broken down into two main parts. First, we'll forge a new, reusable CTA component that's smart enough to adapt to any view mode. Then, we'll inject this component into each of the existing data views—list, cards, grid, and table.

The goal is to make the demo feel more interactive and guide the user towards a key action, making the whole experience less static and more engaging. Let's get this shipped.

```yaml
plan:
  uuid: '3a1b9c4f-8d2e-4a6b-9f7c-5d1e8a2b0c3d'
  status: 'todo'
  title: "feat: Add 'Add Item' CTA to Data Demo Views"
  introduction: |
    Alright, we're going to inject some life into the Data Demo page. Right now, it's a static display of mock data. The goal is to pwn the user experience by adding a clear and attractive "call to action" (CTA) item within each view mode (list, cards, grid, table). This will lure users into adding their own data, making the demo feel more like a real, interactive application.

    The approach is simple and clean. We'll first craft a single, reusable CTA component that can shape-shift its appearance based on the view mode it's in. This keeps our code DRY and consistent. Then, we'll strategically place this component at the end of the item list in each of the four view layouts. This refactor will improve user engagement without polluting the existing component structure.
  parts:
    - uuid: 'c9f8e7d6-a5b4-4c3a-8b1d-0e9f2a7b1c4e'
      status: 'todo'
      name: 'Part 1: Forge the Polymorphic CTA Component'
      reason: |
        To avoid writing the same boilerplate four times, we'll create one shared component for the CTA. This component needs to be flexible enough to render correctly as a list item, a card, or a table row. This is the cornerstone of the whole feature; a single source of truth for the CTA's look and feel.
      steps:
        - uuid: 'd1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5a'
          status: 'todo'
          name: "1. Create 'AddDataItemCta.tsx' Component"
          reason: |
            This new file will house our shared CTA component. It will be responsible for rendering the different visual variants needed for each view in the Data Demo page.
          files:
            - 'src/pages/DataDemo/components/shared/AddDataItemCta.tsx'
          operations:
            - "Create a new file `AddDataItemCta.tsx` in `src/pages/DataDemo/components/shared/`."
            - "Define a React component `AddDataItemCta` that accepts props: `viewMode: 'list' | 'cards' | 'grid' | 'table'` and an optional `colSpan?: number`."
            - "Implement the component's JSX. It should render a `<tr>` element when `viewMode` is `'table'`. For all other view modes, it should render a `div`."
            - "The content inside should be a CTA, e.g., an icon (`PlayCircle` or `Plus`), a title like 'Showcase your own data', and a short description."
            - "Style the component with a dashed border to distinguish it from actual data items. Use `cn` for conditional classes based on `viewMode` to adjust layout (e.g., flex-row for list/table, flex-col for cards/grid)."
            - "For the `'table'` variant, the inner `<td>` element must use the `colSpan` prop to span the entire width of the table."
    - uuid: 'b8a7c6d5-e4f3-4a2b-9c1d-0f9e8a7b6c5d'
      status: 'todo'
      name: 'Part 2: Inject the CTA into Data Views'
      reason: |
        With the CTA component ready, we need to plug it into the existing view components. This ensures the CTA is visible to the user regardless of which data visualization they choose.
      steps:
        - uuid: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
          status: 'todo'
          name: '1. Integrate CTA into List View'
          reason: |
            Add the CTA to the `DataListView` component so it appears as the last item in the list.
          files:
            - 'src/pages/DataDemo/components/DataListView.tsx'
          operations:
            - "Import the new `AddDataItemCta` component."
            - "In the return statement, after the `dataToRender.map(...)` block, render `<AddDataItemCta viewMode='list' />`."
        - uuid: 'f1e2d3c4-b5a6-4f7e-8d9c-0b1a2f3e4d5c'
          status: 'todo'
          name: '2. Integrate CTA into Card & Grid Views'
          reason: |
            Add the CTA to the `DataCardView` component, which handles both 'cards' and 'grid' layouts.
          files:
            - 'src/pages/DataDemo/components/DataCardView.tsx'
          operations:
            - "Import the new `AddDataItemCta` component."
            - "After the `dataToRender.map(...)` block, render `<AddDataItemCta viewMode={isGrid ? 'grid' : 'cards'} />` to ensure it adapts to the current layout."
        - uuid: 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b'
          status: 'todo'
          name: '3. Integrate CTA into Table View'
          reason: |
            Add the CTA to the `DataTableView` as a full-width row at the end of the table body.
          files:
            - 'src/pages/DataDemo/components/DataTableView.tsx'
          operations:
            - "Import the new `AddDataItemCta` component."
            - "In the `<tbody>` element, after the data mapping logic, render `<AddDataItemCta viewMode='table' colSpan={8} />`. The `colSpan` of 8 corresponds to the number of columns in the table."
  conclusion: |
    Once complete, this refactor will significantly enhance the Data Demo page's interactivity. Users will have a clear, consistent prompt to engage further with the application, turning a passive demo into an active sandbox.

    The implementation is modular and clean, introducing a reusable component and making minimal, targeted changes to existing view files. This is a solid UX win with low technical debt. Ship it.
  context_files:
    compact:
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
      - 'src/pages/DataDemo/components/shared/AddDataItemCta.tsx'
    medium:
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
      - 'src/pages/DataDemo/components/shared/AddDataItemCta.tsx'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/types.ts'
    extended:
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
      - 'src/pages/DataDemo/components/shared/AddDataItemCta.tsx'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/types.ts'
      - 'src/components/ui/card.tsx'
      - 'src/components/ui/button.tsx'
      - 'src/lib/utils.ts'
```
