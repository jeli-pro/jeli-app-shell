Alright, let's get this sorted. The last refactor was a necessary evil – we ripped out the guts to build a solid foundation. Now it's time for the second pass: the fit-and-finish. We're going to patch the generic components to bring back the pixel-perfect UI of the original `DataDemo`.

The goal is to enhance our new abstraction, not discard it. We'll add more granular options to the `ViewConfig` and teach our generic components how to render the more complex, nuanced layouts they've forgotten. When we're done, the `dynamic-view` engine will be just as powerful, but the `DataDemo` will look like it never changed.

Here's the plan.

```yaml
plan:
  uuid: 'a8d3f5c1-7b1e-4f09-9a6d-5e8c2a9f4b31'
  status: 'todo'
  title: 'Refactor: Restore UI Fidelity to Dynamic View Components'
  introduction: |
    The previous architectural refactor successfully decoupled our UI components into a generic, config-driven `dynamic-view` engine. However, this came at the cost of UI fidelity, losing the specific layouts and responsive behaviors of the original `DataDemo` implementation. This plan details the second phase of that refactor: re-introducing the lost UI/UX features into the generic components themselves, making them configurable through an enhanced `ViewConfig`.

    Our core principle is to avoid re-introducing hardcoded logic into the view components. Instead, we will augment the configuration schema and the components' rendering logic to support more complex layouts declaratively. This will allow us to achieve a pixel-perfect match with the original `DataDemo` UI while retaining the flexibility and reusability of the new architecture. The `DataDemo` page will serve as the canonical implementation, proving that our generic engine can produce highly polished, specific UIs.
  parts:
    - uuid: 'b9e4f6d2-8c2f-4a08-8b7e-6f9d3b0a5c42'
      status: 'todo'
      name: 'Part 1: Enhance Core Abstractions for UI Fidelity'
      reason: |
        The current `ViewConfig` is too simplistic to describe the nuanced layouts of the original components. We need to expand our core types to give us the vocabulary to define things like composite table cells and more granular card layouts. This is the foundation for all subsequent UI fixes.
      steps:
        - uuid: 'c0f5g7e3-9d3a-4b19-9c8f-7a0e4c1b6d53'
          status: 'todo'
          name: '1. Update ViewConfig Types for Advanced Layouts'
          reason: |
            To support complex layouts like the composite "Project" column in the original table view, we need a way for the config to provide custom rendering logic. We also need to refine the card view config to better match the original component's structure.
          files:
            - 'src/features/dynamic-view/types.ts'
          operations:
            - "In `BaseFieldDefinition`, add an optional `render?: (item: GenericItem) => ReactNode;` property. This allows the `FieldRenderer` to delegate rendering to a custom function, enabling composite fields or complex logic directly from the config."
            - "In `CardViewConfig`, replace the generic `contentFields` array with more specific layout fields to match the old design: `statusField: string;`, `categoryField: string;`, `tagsField: string;`, `progressField: string;`, `assigneeField: string;`, and `metricsField: string;`."
            - "In `KanbanViewConfig`, update `cardFields` to be more descriptive: add `priorityField`, `tagsField`, `dateField`, `metricsField`, and `assigneeField` to allow for richer Kanban cards that match the original."
            - "Rename `thumbnailEmoji` to `thumbnail` in `src/pages/DataDemo/DataDemo.config.ts`'s `fields` array and update its `type` to `'thumbnail'` for clarity. The `FieldRenderer` will handle this new type."
      context_files:
        compact:
          - 'src/features/dynamic-view/types.ts'
          - 'src/pages/DataDemo/components/DataTableView.tsx' # OLD
        medium:
          - 'src/features/dynamic-view/types.ts'
          - 'src/pages/DataDemo/components/DataCardView.tsx' # OLD
          - 'src/pages/DataDemo/components/DataKanbanView.tsx' # OLD
        extended:
          - 'src/features/dynamic-view/types.ts'
          - 'src/pages/DataDemo/components/DataCardView.tsx' # OLD
          - 'src/pages/DataDemo/components/DataKanbanView.tsx' # OLD
          - 'src/pages/DataDemo/components/DataTableView.tsx' # OLD

    - uuid: 'd1a6h8f4-a4e1-4c2a-ad9a-8b1f5d2c7e64'
      status: 'todo'
      name: 'Part 2: Restore Specific View Layouts and Features'
      reason: |
        With the enhanced abstractions in place, we will now update each generic view component to correctly interpret the new configuration options and replicate the original, hardcoded layouts and behaviors.
      steps:
        - uuid: 'e2b7i9g5-b5f2-4d3b-be0b-9c2a6e3d8f75'
          status: 'todo'
          name: '1. Refactor CardView to Restore Original Layout'
          reason: |
            The generic `CardView` has a much simpler layout than the original. We need to implement the more complex structure using the newly defined specific fields in `CardViewConfig`.
          files:
            - 'src/features/dynamic-view/components/views/CardView.tsx'
          operations:
            - "Update `CardView.tsx` to use the new specific fields from `config.cardView` (`statusField`, `tagsField`, `progressField`, etc.)."
            - "Re-create the original JSX structure within the card's content area, placing `<FieldRenderer>` components for each specific field in its correct location."
            - "For example, render status and category badges together, then tags, then progress bar, then assignee, then metrics and date at the bottom, exactly matching `DataCardView.tsx` from the snapshot."
            - "The priority indicator in `headerFields` should be styled as a small colored dot in the top-right corner, replicating the original UI."
        - uuid: 'f3c8j0h6-c6a3-4e4c-cf1c-0d3b7f4e9a86'
          status: 'todo'
          name: '2. Refactor KanbanView Card for Richer Content'
          reason: |
            Similar to `CardView`, the generic Kanban card is too sparse. It needs to render the additional fields (priority, tags, date, metrics, assignee) that the original did.
          files:
            - 'src/features/dynamic-view/components/views/KanbanView.tsx'
          operations:
            - "Update the `KanbanCard` sub-component inside `KanbanView.tsx`."
            - "Use the new fields from `config.kanbanView.cardFields` to render more content."
            - "Re-implement the layout from the old `DataKanbanView.tsx` snapshot, including priority/tag badges and the footer section with date, metrics (comments/attachments), and assignee avatar."
            - "The logic for deriving comment/attachment counts from metrics will be handled by a custom `render` function in the config later, so for now, just render the metrics field directly."
        - uuid: 'g4d9k1i7-d7b4-4f5d-df2d-1e4c8a5f0b97'
          status: 'todo'
          name: '3. Re-introduce Responsiveness to ListView'
          reason: |
            The original `ListView` responsively hid metadata columns on smaller screens. This was lost in the refactor. We'll restore this using a CSS-first approach.
          files:
            - 'src/features/dynamic-view/components/views/ListView.tsx'
            - 'src/features/dynamic-view/types.ts'
          operations:
            - "In `types.ts`, add an optional `className` property to the `ListViewConfig`'s `metaFields` array items, e.g., `metaFields: { fieldId: string; className?: string }[]`."
            - "Update `ListView.tsx` to iterate over the new `metaFields` structure."
            - "When rendering each meta field, apply the `className` from the config. This will allow the configuration to provide responsive Tailwind classes (e.g., `'hidden md:flex'`)."
            - "Update the `DataDemo.config.ts` `listView` section to provide these responsive classes for the different meta fields to replicate the original breakpoints."
        - uuid: 'h5e0l2j8-e8c5-4a6e-eg3e-2f5d9b6a1ca8'
          status: 'todo'
          name: '4. Enhance FieldRenderer and TableView for Composite Cells'
          reason: |
            The `FieldRenderer` and `TableView` need to support the new `render` function in the config. This will allow us to recreate the composite "Project" column which combined a thumbnail, title, and category.
          files:
            - 'src/features/dynamic-view/components/shared/FieldRenderer.tsx'
            - 'src/features/dynamic-view/components/views/TableView.tsx'
          operations:
            - "In `FieldRenderer.tsx`, check if `fieldDef.render` exists. If it does, call `fieldDef.render(item)` and return the result. This should take precedence over the `switch` statement."
            - "No changes are needed in `TableView.tsx` itself. Because it already uses `FieldRenderer` for every cell, it will automatically support custom rendering as long as `FieldRenderer` is updated."
        - uuid: 'i6f1m3k9-f9d6-4b7f-fh4f-3a6e0c7b2db9'
          status: 'todo'
          name: '5. Restore Calendar Event Layout'
          reason: |
            The layout of details within a calendar event (priority on left, assignee on right) was lost. We need to restore this specific arrangement.
          files:
            - 'src/features/dynamic-view/components/views/CalendarView.tsx'
          operations:
            - "In `CalendarView.tsx`, modify the `CalendarEvent` sub-component."
            - "Instead of just mapping over `displayFields`, create a structured footer with a `div` for the left side and one for the right."
            - "Check if `displayFields` includes `'priority'` and render it on the left. Check for `'assignee'` and render it on the right. This restores the layout while still using the config to determine visibility."

    - uuid: 'j7g2n4l0-0a07-4c8a-gi5a-4b7f1d8c3ec0'
      status: 'todo'
      name: 'Part 3: Update Configuration and Finalize Implementation'
      reason: |
        Now we tie everything together. We'll update the `DataDemo.config.ts` to use all our new enhanced features, making the UI match the original. Then we'll clean up all the obsolete code.
      steps:
        - uuid: 'k8h3o5m1-1b18-4d9b-hj6b-5c8a2e9d4fd1'
          status: 'todo'
          name: '1. Overhaul DataDemo.config.ts'
          reason: |
            This is the key step that translates the old hardcoded component logic into our new declarative configuration, effectively restoring the original UI.
          files:
            - 'src/pages/DataDemo/DataDemo.config.ts'
            - 'src/pages/DataDemo/components/DataTableView.tsx' # OLD
          operations:
            - "Update the `cardView` config to use the new specific fields (`statusField`, `tagsField`, etc.), populating them with the correct field IDs from the original `DataCardView.tsx`."
            - "Update the `kanbanView.cardFields` config similarly, referencing the old `DataKanbanView.tsx` card layout."
            - "In the `tableView.columns` config, find the `'title'` column definition. Add a custom `render` function to it. This function will return JSX that includes the item's thumbnail, title, and category, replicating the composite cell from the old `DataTableView.tsx`."
            - "Update the `listView.metaFields` to be an array of objects, including the `className` property with responsive Tailwind utilities to match the old `DataListView`'s behavior."
            - "Add a new field definition for `'thumbnail'` and ensure the `FieldRenderer` handles it, replacing the old direct `item.thumbnail` access."
        - uuid: 'l9i4p6n2-2c29-4e0c-ik7c-6d9b3f0e5ae2'
          status: 'todo'
          name: '2. Refactor DataDetailPanel and Delete Obsolete Components'
          reason: |
            The detail panel still uses old `DataItemParts`. We need to convert it fully to `FieldRenderer` and then remove all the now-unnecessary old components.
          files:
            - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
            - 'src/pages/DataDemo/components/shared/DataItemParts.tsx'
            - 'src/pages/DataDemo/components/DataDetailActions.tsx'
          operations:
            - "In `DataDetailPanel.tsx`, replace all remaining uses of `DataItemParts` components (`ItemProgressBar`, `AssigneeInfo`, etc.) and direct property access (`item.title`) with the generic `<FieldRenderer />` component."
            - "Maintain the panel's overall JSX structure (sections for assignee, metrics, tags, etc.) but ensure every data point is rendered via `FieldRenderer`."
            - "Delete the now-obsolete `src/pages/DataDemo/components/shared/DataItemParts.tsx` file."
            - "Delete `src/pages/DataDemo/components/DataDetailActions.tsx` and move its simple JSX directly into the footer of `DataDetailPanel.tsx` to reduce fragmentation."
            - "Move all remaining reusable components (`AddDataItemCta`, `EmptyState`, `AnimatedLoadingSkeleton`) from `DataDemo/components` to `src/features/dynamic-view/components/shared/`."
            - "Finally, delete the entire `src/pages/DataDemo/components` directory and `src/pages/DataDemo/types.ts`."
  conclusion: |
    By completing this plan, we will have successfully evolved our `dynamic-view` engine to be both powerful in its generic abstraction and capable of producing highly specific, polished UIs that match our original designs. The architectural benefits of the initial refactor are retained, while the user-facing regressions are fully resolved.

    The `DataDemo` page will once again be a showcase of a high-quality user experience, but now it will be built on a robust, reusable, and declarative foundation. This sets a new standard for building data-centric features in this codebase, enabling faster development without sacrificing UI/UX quality.
  context_files:
    compact:
      - 'src/features/dynamic-view/types.ts'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx' # OLD
      - 'src/pages/DataDemo/components/DataListView.tsx' # OLD
    medium:
      - 'src/features/dynamic-view/types.ts'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/features/dynamic-view/components/views/CardView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx' # OLD
      - 'src/pages/DataDemo/components/DataListView.tsx' # OLD
      - 'src/pages/DataDemo/components/DataTableView.tsx' # OLD
    extended:
      - 'src/features/dynamic-view/types.ts'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/DataDemo.config.ts'
      - 'src/features/dynamic-view/components/views/CardView.tsx'
      - 'src/features/dynamic-view/components/views/ListView.tsx'
      - 'src/features/dynamic-view/components/views/TableView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx' # OLD
      - 'src/pages/DataDemo/components/DataListView.tsx' # OLD
      - 'src/pages/DataDemo/components/DataTableView.tsx' # OLD
      - 'src/pages/DataDemo/components/DataKanbanView.tsx' # OLD
      - 'src/pages/DataDemo/components/DataCalendarView.tsx' # OLD
```
