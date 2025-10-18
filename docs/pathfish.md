looks good. here's the plan to centralize the data demo controls. we're not reinventing the wheel, just greasing it. the foundation is solid with `useAppViewManager`, but we'll make the connections explicit and clean up the blueprints. this is about making the architecture clean, obvious, and future-proof. no more guessing where the controls live or how state flows.

we'll move a key type definition to its rightful home, making the data contracts clear. then, we'll sprinkle in some documentation to illuminate the path for the next dev who touches this code. small changes, big impact on clarity and maintainability. let's ship it.

```yaml
plan:
  uuid: 'e8a1c4b2-5f6d-4e9a-8c1b-3d0f7a6b9c21'
  status: 'todo'
  title: 'Centralize Data Demo Controls for a Cohesive UX'
  introduction: |
    This refactoring plan aims to solidify and clarify the centralized control mechanism for the Data Demo page. Currently, the state for search, filtering, and sorting is managed centrally in the `useAppViewManager` hook and reflected in the URL, which is a solid foundation. However, the code structure can be improved to make this pattern more explicit and robust.

    The primary goal is to establish the `DataToolbar` component as the single, unambiguous UI for these controls, functional across all view modes (list, table, kanban, etc.). We will achieve this by centralizing shared type definitions, ensuring a clean data flow, and documenting the architecture to guide future development. This will enhance maintainability and provide a more cohesive and predictable user experience.
  parts:
    - uuid: 'a9b3f8e1-7d4c-4a1f-9b0e-6f2c8d7e4b3c'
      status: 'todo'
      name: 'Part 1: Centralize Shared Type Definitions'
      reason: |
        The `FilterConfig` type is crucial for defining the shape of our filter state. It's currently defined within the `DataToolbar` component, but it's used by the state management hook (`useAppViewManager`) and the data store (`dataDemo.store`). To establish a clear contract and improve code organization, this type must be moved to a shared location within the feature.
      steps:
        - uuid: 'c1d2e3f4-5a6b-4c7d-8e9f-0a1b2c3d4e5f'
          status: 'todo'
          name: '1. Relocate FilterConfig Type Definition'
          reason: |
            To make `FilterConfig` a shared, reusable type, it needs to be moved from a specific component file to the feature's central `types.ts` file.
          files:
            - src/pages/DataDemo/components/DataToolbar.tsx
            - src/pages/DataDemo/types.ts
          operations:
            - 'In `src/pages/DataDemo/components/DataToolbar.tsx`, cut the `export interface FilterConfig { ... }` definition.'
            - 'In `src/pages/DataDemo/types.ts`, paste the `FilterConfig` interface definition and ensure it is exported. It should be placed after the `Status` and `Priority` type definitions it depends on.'
        - uuid: 'b3e4f5a6-7c8d-4e9f-a0b1-c2d3e4f5a6b7'
          status: 'todo'
          name: '2. Update Component, Hook, and Store Imports'
          reason: |
            With `FilterConfig` relocated, all files that use it must be updated to import it from its new canonical location in `types.ts`.
          files:
            - src/pages/DataDemo/components/DataToolbar.tsx
            - src/hooks/useAppViewManager.hook.ts
            - src/pages/DataDemo/store/dataDemo.store.tsx
          operations:
            - 'In `src/pages/DataDemo/components/DataToolbar.tsx`, update the import statement from `import type { SortableField, Status, Priority } from ''../types''` to `import type { SortableField, Status, Priority, FilterConfig } from ''../types''`.'
            - 'In `src/hooks/useAppViewManager.hook.ts`, change the import from `import type { FilterConfig } from ''@/pages/DataDemo/components/DataToolbar''` to `import type { ..., FilterConfig } from ''@/pages/DataDemo/types''`.'
            - 'In `src/pages/DataDemo/store/dataDemo.store.tsx`, change the import `import type { FilterConfig } from ''../components/DataToolbar''` to `import type { FilterConfig } from ''../types''`.'
      context_files:
        compact:
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/types.ts
        medium:
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/types.ts
          - src/hooks/useAppViewManager.hook.ts
          - src/pages/DataDemo/store/dataDemo.store.tsx
        extended:
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/types.ts
          - src/hooks/useAppViewManager.hook.ts
          - src/pages/DataDemo/store/dataDemo.store.tsx
          - src/pages/DataDemo/index.tsx
    - uuid: 'd8c7b6a5-4f3e-4d2c-1b0a-9e8d7c6b5a4f'
      status: 'todo'
      name: 'Part 2: Document the Centralized Control Architecture'
      reason: |
        The existing architecture is sound but implicit. Adding comments will make the control flow obvious to any developer working on this feature, preventing architectural drift and ensuring the centralized model is maintained.
      steps:
        - uuid: 'f6a5b4c3-2d1e-4f0c-8b9a-7e6d5c4b3a2f'
          status: 'todo'
          name: '1. Clarify DataToolbar''s Role'
          reason: |
            A module-level comment will immediately inform developers of the component's purpose and its relationship with the central state management hook.
          files:
            - src/pages/DataDemo/components/DataToolbar.tsx
          operations:
            - 'Add a module-level comment at the top of `DataToolbar.tsx` explaining its role as the primary UI for search, filtering, and sorting, and how it interacts with `useAppViewManager`.'
        - uuid: 'a5b4c3d2-1e0f-4c9b-8a8b-6d5c4b3a2f1e'
          status: 'todo'
          name: '2. Document State Management Flow in DataDemoPage'
          reason: |
            Explicitly documenting the data flow in the main page component makes the entire feature easier to understand and debug.
          files:
            - src/pages/DataDemo/index.tsx
          operations:
            - 'In `src/pages/DataDemo/index.tsx`, add a comment block inside the `DataDemoPage` component function, before the hooks, explaining the control flow: URL state -> `useAppViewManager` -> `DataToolbar` & data fetching.'
      context_files:
        compact:
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/index.tsx
        medium:
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/index.tsx
          - src/hooks/useAppViewManager.hook.ts
        extended:
          - src/pages/DataDemo/components/DataToolbar.tsx
          - src/pages/DataDemo/index.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/pages/DataDemo/store/dataDemo.store.tsx
  conclusion: |
    By relocating the shared `FilterConfig` type and strategically documenting the existing control flow, we make the centralized architecture for the Data Demo page robust, explicit, and easy to maintain. This refactor doesn't require rewriting logic but rather clarifies and hardens the current design. The result is a cleaner codebase where the `DataToolbar` serves as a truly reusable and central control hub, improving both developer and user experience.
  context_files:
    compact:
      - src/pages/DataDemo/components/DataToolbar.tsx
      - src/pages/DataDemo/types.ts
      - src/pages/DataDemo/index.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/pages/DataDemo/store/dataDemo.store.tsx
    medium:
      - src/pages/DataDemo/components/DataToolbar.tsx
      - src/pages/DataDemo/types.ts
      - src/pages/DataDemo/index.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/pages/DataDemo/store/dataDemo.store.tsx
    extended:
      - src/pages/DataDemo/components/DataToolbar.tsx
      - src/pages/DataDemo/types.ts
      - src/pages/DataDemo/index.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/pages/DataDemo/store/dataDemo.store.tsx
```
