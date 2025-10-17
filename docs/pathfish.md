Alright, let's architect this refactor. The current Data Demo page is a bit janky when switching between grouped tabs. It's triggering a full-on loading state, which kills the flow. Plus, we've got that slick `AnimatedTabs` component, but we're not using its full potential for a smooth, slidy content transition.

The plan is to decouple the data fetching from the tab switching. We'll fetch the whole grouped dataset once, then just slide between the views of that data. This will make the UI feel instantaneous and fluid, exactly what you'd expect from a modern app shell. We'll rejigger the rendering logic to lay out all the tab content panels in a row and let `AnimatedTabs` work its GSAP magic to slide the correct one into view. No more pointless spinners, just buttery-smooth transitions.

Here's the blueprint.

```yaml
plan:
  uuid: 'f2a1b8c3-4d5e-4f6a-8b9c-7d0e1a2b3c4d'
  status: 'todo'
  title: 'Refactor Data Demo Grouping for Animated Tabs and No-Reload Switching'
  introduction: |
    This master plan outlines the refactoring of the Data Demo page to improve the user experience of grouped data views. The primary goal is to eliminate unnecessary loading states when switching between group tabs (e.g., "Active", "Pending") and to implement a fluid, animated sliding transition for the content, leveraging the existing `AnimatedTabs` component.

    Currently, changing the active group tab likely triggers a full data-refetch cycle, leading to a disruptive user experience. The `AnimatedTabs` component's capability to animate content is also not being fully utilized.

    The approach involves two main parts. First, we will modify the data fetching logic in the `DataDemoPage` component to fetch the entire grouped dataset only when the grouping criteria change, not when simply switching between tabs of already-grouped data. Second, we will restructure the JSX to render all tab content panels within the `AnimatedTabs` component, allowing its internal GSAP animations to create a seamless sliding effect between them. This will result in a faster, more responsive, and visually appealing interface.
  parts:
    - uuid: 'a9b0c1d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d'
      status: 'todo'
      name: 'Part 1: Decouple Data Fetching from Tab Switching'
      reason: |
        To prevent the jarring loading skeleton from appearing every time a user clicks a different group tab, we need to ensure that the `loadData` function is not called on this action. The data loading effect should only depend on parameters that fundamentally change the dataset, such as filters, sort order, page number, or the grouping field itself (`groupBy`), but not the `activeGroupTab`.
      steps:
        - uuid: 'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f'
          status: 'todo'
          name: '1. Adjust Data Loading Effect Dependencies'
          reason: |
            The core of the issue lies in the `useEffect` hook in `DataDemoPage` that triggers `loadData`. By removing `activeGroupTab` from its dependency array, we ensure that changing tabs via `setActiveGroupTab` updates the URL and tab UI but does not cause a data refetch.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - "Locate the `useEffect` hook that calls `loadData` from the `useDataDemoStore`."
            - "Verify its dependency array contains `loadData`, `page`, `groupBy`, `filters`, and `sortConfig`."
            - "Ensure that `activeGroupTab` is *not* present in the dependency array. If it is, remove it. This is the key change to prevent re-fetching on tab switch."

      context_files:
        compact:
          - 'src/pages/DataDemo/index.tsx'
        medium:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/hooks/useAppViewManager.hook.ts'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'
        extended:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/hooks/useAppViewManager.hook.ts'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'
          - 'src/pages/DataDemo/types.ts'

    - uuid: 'b3c4d5e6-7a8b-9c0d-1e2f-3a4b5c6d7e8f'
      status: 'todo'
      name: 'Part 2: Implement Sliding Content Animation with AnimatedTabs'
      reason: |
        To achieve the desired fluid, sliding animation between tab content, we must structure the rendered output to match what the `AnimatedTabs` component expects. Instead of conditionally rendering a single view for the active tab, we will render the content for *all* tabs and let the component handle the animation by translating a content track.
      steps:
        - uuid: 'd5e6f7a8-9b0c-1d2e-3f4a-5b6c7d8e9f0a'
          status: 'todo'
          name: '1. Rework View Rendering Logic'
          reason: |
            The current rendering logic likely shows only the active view. We need to map over all possible groups and render a view for each one inside `AnimatedTabs`, which will act as a sliding carousel.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - "Locate the JSX where `DataListView`, `DataCardView`, or `DataTableView` is rendered."
            - "Move this rendering logic inside the `AnimatedTabs` component's children."
            - "When data is grouped (`groupBy !== 'none'`), map over the `groupTabs` array."
            - "For each `tab` in the map, render a container `div` with `key={tab.id}` and `className='w-full flex-shrink-0'`."
            - "Inside this `div`, conditionally render the correct view component (`DataListView`, `DataCardView`, etc.) based on the current `viewMode`."
            - "Pass the appropriate slice of data to each view, e.g., `data={dataToRender[tab.id] || []}`."
            - "Handle the `else` case for when `groupBy` is `'none'`. In this case, render a single container `div` containing the view for the entire ungrouped `dataToRender` array."
            - "Remove the placeholder `div` with `h-[68px]` if it's no longer necessary after restructuring."
      context_files:
        compact:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/components/ui/animated-tabs.tsx'
        medium:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
        extended:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/pages/DataDemo/store/dataDemo.store.tsx'
          - 'src/hooks/useAppViewManager.hook.ts'
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataTableView.tsx'
          - 'src/pages/DataDemo/types.ts'

  conclusion: |
    Upon completion, the Data Demo page's grouping feature will be significantly improved. Users will experience instant, fluid transitions when switching between data groups, free from disruptive loading states. The UI will feel more polished and responsive, correctly utilizing the `AnimatedTabs` component to provide a high-quality, modern user experience. This refactor enhances perceived performance and aligns the component with the sophisticated interaction patterns established elsewhere in the application shell.
  context_files:
    compact:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/components/ui/animated-tabs.tsx'
    medium:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/components/ui/animated-tabs.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'
      - 'src/pages/DataDemo/store/dataDemo.store.tsx'
    extended:
      - 'src/pages/DataDemo/index.tsx'
      - 'src/components/ui/animated-tabs.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'
      - 'src/pages/DataDemo/store/dataDemo.store.tsx'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/DataDemo/components/DataTableView.tsx'
      - 'src/pages/DataDemo/types.ts'
```
