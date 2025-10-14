Here's the master plan for refactoring the codebase.

```yaml
plan:
  uuid: '3a1e8c4d-9b5f-4a2e-8a7c-6f1b3d5e7a9f'
  status: 'todo'
  title: 'Refactor Codebase for Maximum DRYness and Better Structure'
  introduction: |
    What's up, hackers. We've got a decent app shell here, but it's got some serious code duplication and a few monolithic components that are getting hard to wrangle. The goal of this operation is to aggressively refactor for DRY principles, abstract repeated logic into reusable hooks and utilities, and break down mega-components into a more modular, maintainable structure.

    We'll start by deconstructing the massive `LoginPage.tsx` into a collection of reusable, animated UI components. Then, we'll hunt down all the repeated GSAP animation logic and forge it into a single, powerful, reusable animation hook. We'll also tackle the `DataDemo` page, which is currently a beast, by extracting its complex data management logic into a dedicated hook.

    This overhaul will make the codebase cleaner, easier to navigate, and way faster to build on. We're doing this without any UI/UX regressions—the user won't see a thing, but our dev experience will be night and day. Let's ship it.
  parts:
    - uuid: 'c1b2a3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Deconstruct Monolithic LoginPage Component'
      reason: |
        The `LoginPage.tsx` is a classic example of a "God component." It defines multiple, complex, and potentially reusable components like `Input`, `BoxReveal`, `Ripple`, and `OrbitingCircles` within its own file. This makes them impossible to reuse elsewhere and bloats the login page component itself.

        By extracting these into their own files under a new `src/components/effects` directory, we'll create a library of powerful, reusable animation and UI components. This will dramatically simplify `LoginPage.tsx`, making it focused solely on authentication logic and layout, while making our component library richer.
      steps:
        - uuid: 'd1e2f3a4-b5c6-7890-1234-567890abcdef'
          status: 'todo'
          name: '1. Create Directory and Extract `BoxReveal`'
          reason: |
            To begin deconstruction, we need a home for our new, specialized components. `BoxReveal` is a self-contained animation component perfect for the first extraction.
          files:
            - 'src/components/auth/LoginPage.tsx'
          operations:
            - 'Create a new directory: `src/components/effects`.'
            - 'Create a new file: `src/components/effects/BoxReveal.tsx`.'
            - 'Cut the entire `BoxReveal` component definition (including imports it needs like `gsap`, `cn`, `memo`, `useRef`, `useEffect`) from `src/components/auth/LoginPage.tsx` and paste it into the new file.'
            - 'Export the `BoxReveal` component from `src/components/effects/BoxReveal.tsx`.'
            - 'Update `src/components/auth/LoginPage.tsx` to import `BoxReveal` from its new location.'
        - uuid: 'e2f3a4b5-c6d7-8901-2345-678901bcdefa'
          status: 'todo'
          name: '2. Extract `Ripple` and `OrbitingCircles` Components'
          reason: |
            `Ripple` and `OrbitingCircles` are complex, decorative components. Extracting them makes them available for other pages and continues to clean up `LoginPage.tsx`. `TechOrbitDisplay` is a specific implementation using `OrbitingCircles`, so it should move with it.
          files:
            - 'src/components/auth/LoginPage.tsx'
          operations:
            - 'Create a new file: `src/components/effects/Ripple.tsx`.'
            - 'Move the `Ripple` component from `LoginPage.tsx` to `Ripple.tsx` and export it.'
            - 'Create a new file: `src/components/effects/OrbitingCircles.tsx`.'
            - 'Move the `OrbitingCircles` and `TechOrbitDisplay` components (and the `iconsArray` constant) from `LoginPage.tsx` to `OrbitingCircles.tsx`.'
            - 'Export both `OrbitingCircles` and `TechOrbitDisplay` from the new file.'
            - 'Update `LoginPage.tsx` to import `Ripple` and `TechOrbitDisplay` from their new locations.'
        - uuid: 'f3a4b5c6-d7e8-9012-3456-789012cdefab'
          status: 'todo'
          name: '3. Extract `AnimatedInput` and Form Primitives'
          reason: |
            The animated `Input` in `LoginPage.tsx` is a unique component, different from the standard one in `ui/`. It deserves its own file. `BottomGradient` and `Label` are also part of this custom form aesthetic.
          files:
            - 'src/components/auth/LoginPage.tsx'
          operations:
            - 'Create a new file: `src/components/effects/AnimatedInput.tsx`.'
            - 'Move the animated `Input` component from `LoginPage.tsx` to `AnimatedInput.tsx`. Export it.'
            - 'Create a new file: `src/components/effects/BottomGradient.tsx`.'
            - 'Move the `BottomGradient` component to `BottomGradient.tsx` and export it.'
            - 'In `LoginPage.tsx`, rename the imported `Input` to `AnimatedInput` to avoid confusion with the UI library.'
            - 'Update `LoginPage.tsx` to import `AnimatedInput` and `BottomGradient` from their new homes.'
            - 'The `Label` component in `LoginPage.tsx` is a duplicate of the one in `src/components/ui/label.tsx`. Remove the local `Label` definition and import it from `src/components/ui/label.tsx` instead.'
        - uuid: 'a4b5c6d7-e8f9-0123-4567-890123defabc'
          status: 'todo'
          name: '4. Update `index.ts` to Export New Components'
          reason: |
            To make these new components part of the library's public API, they must be exported from the main `index.ts` file.
          files:
            - 'src/index.ts'
          operations:
            - 'Create a new section in `src/index.ts` for "Effects Components".'
            - 'Export `BoxReveal` from `./components/effects/BoxReveal`.'
            - 'Export `Ripple` from `./components/effects/Ripple`.'
            - 'Export `OrbitingCircles` and `TechOrbitDisplay` from `./components/effects/OrbitingCircles`.'
            - 'Export `AnimatedInput` from `./components/effects/AnimatedInput`.'
            - 'Export `BottomGradient` from `./components/effects/BottomGradient`.'
      context_files:
        compact:
          - 'src/components/auth/LoginPage.tsx'
          - 'src/index.ts'
        medium:
          - 'src/components/auth/LoginPage.tsx'
          - 'src/components/ui/label.tsx'
          - 'src/index.ts'
        extended:
          - 'src/components/auth/LoginPage.tsx'
          - 'src/components/ui/label.tsx'
          - 'src/index.ts'
          - 'tailwind.config.js'

    - uuid: 'b2c3d4e5-f6a7-8901-2345-678901abcdef'
      status: 'todo'
      name: 'Part 2: Abstract Repetitive GSAP Animations'
      reason: |
        Several components (`DataListView`, `DataCardView`, `DataDetailPanel`, `DemoContent`) implement nearly identical `useLayoutEffect` hooks with GSAP to create a "staggered fade-in" animation for their child elements. This is a textbook violation of DRY.

        We will create a single, reusable hook, `useStaggeredAnimation`, that encapsulates this logic. This will remove duplicated code, centralize the animation logic for easier maintenance, and ensure a consistent entrance animation across the application. We'll also consolidate the two redundant dashboard animation hooks.
      steps:
        - uuid: 'c3d4e5f6-a7b8-9012-3456-789012abcdef'
          status: 'todo'
          name: '1. Create a Reusable Animation Hook'
          reason: |
            To centralize the repeated GSAP logic. This hook will be the single source of truth for staggered entrance animations.
          files: []
          operations:
            - 'Create a new file: `src/hooks/useStaggeredAnimation.hook.ts`.'
            - 'Inside, create a hook named `useStaggeredAnimation` that accepts a ref to a container element and an optional selector for child elements.'
            - 'Move the `useLayoutEffect` logic with the `gsap.fromTo` call (staggering `y` and `opacity`) from `DataCardView.tsx` into this new hook. Make it generic to work with any container.'
            - 'The hook should track the number of animated items to prevent re-animating elements that are already visible.'
        - uuid: 'd4e5f6a7-b8c9-0123-4567-890123bcdefa'
          status: 'todo'
          name: '2. Refactor Data Components to Use the New Hook'
          reason: |
            To eliminate the duplicated animation code in the data view components.
          files:
            - 'src/pages/DataDemo/components/DataListView.tsx'
            - 'src/pages/DataDemo/components/DataCardView.tsx'
            - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
            - 'src/hooks/useStaggeredAnimation.hook.ts'
          operations:
            - 'In `DataListView.tsx`, remove the `useLayoutEffect` and `animatedItemsCount` ref.'
            - 'Call the new `useStaggeredAnimation(listRef)` hook instead.'
            - 'In `DataCardView.tsx`, remove the `useLayoutEffect` and `animatedItemsCount` ref. Call `useStaggeredAnimation(containerRef)`.'
            - 'In `DataDetailPanel.tsx`, remove the `useLayoutEffect` hook. Call `useStaggeredAnimation(contentRef)`.'
        - uuid: 'e5f6a7b8-c9d0-1234-5678-901234cdefab'
          status: 'todo'
          name: '3. Consolidate Dashboard Animation Hooks'
          reason: |
            `useDashboardAnimations.hook.ts` and `useDemoContentAnimations.hook.ts` do almost the same thing (stagger card animations). We can merge them into one and have it also use the new generic hook.
          files:
            - 'src/pages/Dashboard/hooks/useDashboardAnimations.hook.ts'
            - 'src/pages/Dashboard/hooks/useDemoContentAnimations.hook.ts'
            - 'src/pages/Dashboard/DemoContent.tsx'
            - 'src/hooks/useStaggeredAnimation.hook.ts'
          operations:
            - 'Merge the logic from `useDemoContentAnimations.hook.ts` into `useDashboardAnimations.hook.ts`.'
            - 'Refactor the stagger logic inside `useDashboardAnimations.hook.ts` to call the new `useStaggeredAnimation` hook for the cards animation.'
            - 'Delete the now-redundant file: `src/pages/Dashboard/hooks/useDemoContentAnimations.hook.ts`.'
            - 'Update `DemoContent.tsx` to remove its call to `useDemoContentAnimations` as this is now handled by the parent `DashboardContent` component via `useDashboardAnimations`.'
      context_files:
        compact:
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/Dashboard/hooks/useDashboardAnimations.hook.ts'
          - 'src/pages/Dashboard/hooks/useDemoContentAnimations.hook.ts'
        medium:
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
          - 'src/pages/Dashboard/hooks/useDashboardAnimations.hook.ts'
          - 'src/pages/Dashboard/hooks/useDemoContentAnimations.hook.ts'
          - 'src/pages/Dashboard/DemoContent.tsx'
        extended:
          - 'src/pages/DataDemo/components/DataListView.tsx'
          - 'src/pages/DataDemo/components/DataCardView.tsx'
          - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
          - 'src/pages/Dashboard/hooks/useDashboardAnimations.hook.ts'
          - 'src/pages/Dashboard/hooks/useDemoContentAnimations.hook.ts'
          - 'src/pages/Dashboard/DemoContent.tsx'
          - 'src/pages/Dashboard/index.tsx'

    - uuid: 'a3b4c5d6-e7f8-9012-3456-789012abcdef'
      status: 'todo'
      name: 'Part 3: Encapsulate DataDemo Page Logic'
      reason: |
        The `DataDemoPage` component in `src/pages/DataDemo/index.tsx` is overloaded with responsibilities. It handles URL parsing, state management, data filtering, sorting, grouping, and pagination simulation. This makes the component difficult to read and maintain.

        By extracting all this data management logic into a dedicated `useDataManagement` hook, we can turn the `DataDemoPage` into a much cleaner, presentation-focused component. The hook will act as a controller, providing the view with the necessary data and state handlers, adhering to the separation of concerns principle.
      steps:
        - uuid: 'b4c5d6e7-f8a9-0123-4567-890123bcdefa'
          status: 'todo'
          name: '1. Create `useDataManagement` Hook'
          reason: |
            To create a centralized place for all data-related logic for the DataDemo page.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - 'Create a new file: `src/pages/DataDemo/hooks/useDataManagement.hook.ts`.'
            - 'Define the `useDataManagement` hook within this file.'
            - 'Move all data-related state and logic from `DataDemo/index.tsx` into the hook. This includes:'
            - '  - All `useMemo` hooks for deriving state from URL (`viewMode`, `page`, `groupBy`, `filters`, `sortConfig`).'
            - '  - The `handleParamsChange` `useCallback`.'
            - '  - The large `useMemo` for `filteredAndSortedData`.'
            - '  - The `useEffect` hook for loading/simulating data fetching.'
            - '  - The `useCallback` for the infinite scroll `loaderRef`.'
            - '  - The `useState` calls for `items`, `hasMore`, `isLoading`.'
            - 'The hook should return an object containing all the necessary states and handlers for the component (e.g., `items`, `isLoading`, `hasMore`, `viewMode`, `handleParamsChange`, `loaderRef`, `dataToRender`, `totalItemCount`, etc.).'
        - uuid: 'c5d6e7f8-a9b0-1234-5678-901234cdefab'
          status: 'todo'
          name: '2. Refactor `DataDemoPage` to Use the Hook'
          reason: |
            To simplify the page component and make it purely presentational.
          files:
            - 'src/pages/DataDemo/index.tsx'
            - 'src/pages/DataDemo/hooks/useDataManagement.hook.ts'
          operations:
            - 'In `DataDemo/index.tsx`, import and call the `useDataManagement` hook at the top of the component.'
            - 'Destructure all the returned values from the hook.'
            - 'Remove all the logic that was moved to the hook from the page component.'
            - 'The component should now primarily consist of the JSX structure, passing props from the hook down to child components like `DataToolbar`, `DataListView`, etc.'

      context_files:
        compact:
          - 'src/pages/DataDemo/index.tsx'
        medium:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/types.ts'
        extended:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/types.ts'
          - 'src/pages/DataDemo/components/DataToolbar.tsx'

  conclusion: |
    By executing this plan, we will have transformed the codebase into a much more professional and scalable state. The `LoginPage` will be a clean, focused component, backed by a new library of reusable effects components. Our animation system will be consistent and centralized, eliminating code rot and making it easy to apply our signature animations anywhere. Finally, the `DataDemo` page will serve as a blueprint for a clean separation of concerns between data logic and presentation.

    These changes significantly improve developer experience, reduce the cognitive load required to understand any single part of the app, and set a strong precedent for future development. The result is a more robust, maintainable, and enjoyable codebase to work with.
  context_files:
    compact:
      - 'src/components/auth/LoginPage.tsx'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/components/DataListView.tsx'
    medium:
      - 'src/components/auth/LoginPage.tsx'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/Dashboard/hooks/useDashboardAnimations.hook.ts'
      - 'src/pages/Dashboard/hooks/useDemoContentAnimations.hook.ts'
    extended:
      - 'src/components/auth/LoginPage.tsx'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/DataDemo/components/DataListView.tsx'
      - 'src/pages/DataDemo/components/DataCardView.tsx'
      - 'src/pages/DataDemo/components/DataDetailPanel.tsx'
      - 'src/pages/Dashboard/hooks/useDashboardAnimations.hook.ts'
      - 'src/pages/Dashboard/hooks/useDemoContentAnimations.hook.ts'
      - 'src/pages/Dashboard/DemoContent.tsx'
```
