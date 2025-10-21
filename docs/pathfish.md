Alright, let's get this done. The last push left some leaky abstractions. The `DataDemo` page is still doing the heavy lifting for stats rendering and animations, which is just plain wrong. A generic view component should handle its own presentation, soup to nuts.

We're going to fix this by teaching `DynamicView` how to handle an optional stats section. We'll use a render prop to pass in the stats, but `DynamicView` will own the layout/shared/StatCard.tsx
        extended:
          - src/features/dynamic-view/DynamicView.tsx, the refs, and the slick "sliver app bar" animation. This moves the logic where it belongs and cleans
          - src/pages/DataDemo/index.tsx
          - src/components/shared/StatCard.tsx
          - src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts
 up the consumer page, making it a pure controller. No more half-measures.

Here's the plan to finish    - uuid: 'e5f6a7b8-c9d0-e1f2-a3b the job and make `DynamicView` truly self-contained.

```yaml
plan:
  uuid: '4-c5d6e7f8a9b0'
      status: 'todo'
      c8b7f0a9-3d1e-4f6a-8b9c-5name: 'Part 2: Encapsulate the Sliver Animation'
      reason: |
        The auto-hiding animatione2d1a4b6c7d'
  status: 'todo'
  title: 'General is a core behavior of the `DynamicView` header. This logic must be moved from the `DataDemo`-specific hook into the `DynamicView` component itself to ensure consistent behavior and complete encapsulation.
      steps:
        - uuid: 'f6aize Stats Rendering and Animation within DynamicView'
  introduction: |
    The previous refactor was a solid step, but it7b8c9-d0e1-f2a3-b4c5-d6e left the stats section as an orphaned implementation detail on the `DataDemo` page. This violates the core principle of our7f8a9b0c1'
          status: 'todo'
          name: '1. Move Animation Logic into `DynamicView`'
          reason: |
            Co-locating the animation logic with new architecture: `DynamicView` should be a black box that handles all its own presentation logic. Leaving stats rendering and animation logic the component it animates makes the feature self-contained and removes the burden of implementation from the consumer.
          files in the consumer page is a leaky abstraction that we need to seal.

    This plan completes the encapsulation. We will ref:
            - src/features/dynamic-view/DynamicView.tsx
            - src/pages/Dataactor `DynamicView` to accept an optional, configurable stats section via a render prop. Crucially, `DynamicView` will takeDemo/hooks/useAutoAnimateStats.hook.ts
          operations:
            - "Copy the entire `useAutoAnimateStats` hook's logic from `src/pages/DataDemo/hooks/useAutoAn ownership of rendering this section and applying the "sliver app bar" scroll animation internally.

    The result will be aimateStats.hook.ts`."
            - "Paste this logic directly into `DynamicView.tsx` or cleaner separation of concerns. `DataDemo` will be simplified to a pure controller that just calculates stats and passes the resulting create a new hook file within `src/features/dynamic-view/hooks/`."
            - "Inside JSX to `DynamicView`. `DynamicView` becomes a more powerful, self-contained layout engine, fully responsible for its `DynamicView.tsx`, create the necessary refs (`scrollContainerRef`, `statsContainerRef`) for the hook."
            - "The `statsContainerRef` should be attached to the new container div that wraps the `renderStats` output."
             own UI and behavior.
  parts:
    - uuid: '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d- "The `scrollContainerRef` needs to be attached to the main scrolling element that `DynamicView` controls.'
      status: 'todo'
      name: 'Part 1: Abstract Stats Rendering into `DynamicView` The `PageLayout` component will likely need to forward this ref."
        - uuid: 'a7b8c'
      reason: |
        To make `DynamicView` responsible for the stats layout, we need to provide a "9d0-e1f2-a3b4-c5d6-e7f8a9b0slot" for the stats content. Using a render prop is the cleanest way to allow the consumer (`DataDemo`) toc1d2'
          status: 'todo'
          name: '2. Update `PageLayout` to Forward Scroll Ref'
          reason: |
            `DynamicView` needs a reference to the main scrolling container to correctly provide the content while `DynamicView` controls the container and its behavior.
      steps:
        - uuid: '1b2c3d4e-5f6a-7b8c-9d0e-1 trigger the sliver animation. `PageLayout` owns this element and must forward the ref.
          files:
            - src/components/shared/PageLayout.tsx
            - src/pages/DataDemo/index.tsxf2a3b4c5d6e'
          status: 'todo'
          name: '1. Add `renderStats` prop and layout slot to `DynamicView`'
          reason: |
            This step updates
          operations:
            - "Modify `PageLayout.tsx` to accept a `ref` (using `forwardRef the `DynamicView` component's public API and internal layout to accommodate the new, optional stats section.
          files`). The `scrollRef` prop already exists, we will transition to using `forwardRef` for better composition."
            - "Update `PageLayout` to attach the forwarded ref to its main scrolling `div`."
            - "In `Data:
            - src/features/dynamic-view/DynamicView.tsx
          operations:
            - "Demo.tsx`, create a `scrollRef` and pass it to both `PageLayout` and a new `loaderUpdate the `DynamicViewProps` interface to include a new optional prop: `renderStats?: () => ReactNode;`Ref` prop on `DynamicView` so it can orchestrate the animation."
        - uuid: '01d2e3f4-a5b6-c7d8-e9f0-a1b2c3d4e5f6'
          status: 'todo'
          name: '3. Remove Redundant Code from `DataDemo`'
          reason: |
            With the animation logic fully encapsulated,."
            - "Modify the JSX return of the `DynamicView` component."
            - "Add a container `div` above the `ViewControls` that conditionally renders the output of `renderStats()` only if the prop is provided."
            - "This creates the designated slot for the stats content within the component's layout."
      context_files:
        compact:
          - src/features/dynamic-view/DynamicView.tsx
          - src/pages the old hook and its invocation in the `DataDemo` page are now obsolete and should be removed to prevent confusion and code/DataDemo/index.tsx
        medium:
          - src/features/dynamic-view/DynamicView.tsx
          - src/pages/DataDemo/index.tsx
          - src/features/dynamic-view/ rot.
          files:
            - src/pages/DataDemo/index.tsx
            - src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts
          operations:
            - "Intypes.ts
        extended:
          - src/features/dynamic-view/DynamicView.tsx
          - src `DataDemo.tsx`, remove the call to the `useAutoAnimateStats()` hook."
            - "Delete/pages/DataDemo/index.tsx
          - src/features/dynamic-view/types.ts
 the file `src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts`."
      context          - src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts
    - uuid_files:
        compact:
          - src/features/dynamic-view/DynamicView.tsx
          : 'f0e9d8c7-b6a5-f4e3-d2c1- src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/hooks/use-b0a9f8e7d6c5'
      status: 'todo'
      name: 'AutoAnimateStats.hook.ts
        medium:
          - src/features/dynamic-view/DynamicView.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts
          - src/components/shared/PageLayout.tsxPart 2: Encapsulate the Stats Animation Logic'
      reason: |
        The animation logic is presentation-specific and belongs inside the presentation component. Moving the `useAutoAnimateStats` logic into `DynamicView` makes it a self-contained feature and removes duplicated code.
      steps:
        - uuid: 'a9
        extended:
          - src/features/dynamic-view/DynamicView.tsx
          - src/pages/DataDemo/index.tsx
          - src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts
          - src/components/shared/PageLayout.tsx
          - src/hooks/useAutoAnimateStats.hook.ts # The original one, for reference
  conclusion: |
    Byb8c7d6-e5f4-a3b2-c1d0-e9f executing this plan, we will have successfully sealed the leaky abstraction of the `DynamicView` component. It will now fully8a7b6c5d4'
          status: 'todo'
          name: '1. Move animation hook logic into `DynamicView`'
          reason: |
            To control the animation, `DynamicView` needs to manage the refs and the animation effect itself. It needs to be told which element is scrolling.
          files:
            - src/features/dynamic-view/DynamicView.tsx
            - src/pages/DataDemo/hooks/ own its presentation layer, including the optional stats header and its signature sliver animation, making it a robust, self-contained,useAutoAnimateStats.hook.ts
          operations:
            - "Update `DynamicViewProps` to accept and truly reusable feature.

    The `DataDemo` page will be reduced to its ideal role: a clean controller that provides data and configuration without being burdened by implementation details. This finalizes the architecture, improves maintainability, and ensures the scroll container's ref: `loaderRef?: React.Ref<HTMLDivElement>;`. The existing `loaderRef` is for the infinite scroll trigger."
            - "Inside `DynamicView.tsx`, create a new internal `stats that future extensions to `DynamicView` can be made without requiring changes in every consuming page. The zombie hook will be eliminatedContainerRef = useRef<HTMLDivElement>(null)`."
            - "Copy the entire `useEffect` hook logic for good.
  context_files:
    compact:
      - src/pages/DataDemo/index. from `src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts` into the `DynamicViewtsx
      - src/features/dynamic-view/DynamicView.tsx
      - src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts
    medium:
      - src/pages/` component."
            - "Adapt the copied effect to use the `loaderRef` prop (as the `scrollDataDemo/index.tsx
      - src/features/dynamic-view/DynamicView.tsx
      - src/pages/DataDemo/hooks/useAutoAnimateStats.hook.ts
      - src/componentsContainerRef`) and the internal `statsContainerRef`."
            - "Wrap this effect in a condition so it only runs if/shared/StatCard.tsx
      - src/components/shared/PageLayout.tsx
    extended: both `loaderRef` and `renderStats` are provided."
            - "In the component's JSX, assign the internal
      - src/pages/DataDemo/index.tsx
      - src/features/dynamic-view/ `statsContainerRef` to the stats container `div`."
        - uuid: 'c7d6e5fDynamicView.tsx
      - src/pages/DataDemo/hooks/useAutoAnimateStats.hook.4-a3b2-c1d0-e9f8-a7b6c5dts
      - src/components/shared/StatCard.tsx
      - src/components/shared/PageLayout.tsx
      - src/hooks/useAutoAnimateStats.hook.ts
```
