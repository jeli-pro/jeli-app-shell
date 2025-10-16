howdy, fellow code wranglers.

the scroll-to-bottom button on the dashboard is borked. it's using `position: fixed`, which pegs it to the viewport, making it look janky when side panes are open. the logic is also hard-wired into a dashboard-specific hook, which is a big no-no. we're gonna fix this the right way.

we'll forge a new, reusable hook and a dedicated button component for this job. the hook will be pure, handling only the scroll logic, and the button will use `position: absolute` to stay neatly within its container. this decouples the logic from any specific page.

once we've got our new toys, we'll refactor the dashboard to use them, squashing the positioning bug in the process. then, to prove our point and spread the wealth, we'll drop this shiny new feature into the data demo page. clean, reusable, and works everywhere. let's get it done.

```yaml
plan:
  uuid: 'f8d3c1a0-7b6e-4f5a-8d1c-9e2f3a4b5c6d'
  status: 'todo'
  title: 'Refactor Scroll-to-Bottom and Extend to Data Demo'
  introduction: |
    Alright, let's ship a fix and a feature. The current scroll-to-bottom button on the dashboard is misaligned because it's using `position: fixed` against the viewport instead of being contained within its scrollable area. The logic for it is also siloed in a dashboard-specific hook, which isn't scalable.

    The plan is two-fold. First, we'll abstract the functionality into a generic hook and a reusable UI component. The new hook, `useScrollToBottom`, will encapsulate the scroll detection logic. The new component, `ScrollToBottomButton`, will handle the presentation and use `position: absolute` for correct placement.

    Second, we'll refactor the Dashboard page to use these new, generalized tools, which will incidentally fix the positioning bug. Finally, we'll add the same functionality to the Data Demo page, demonstrating the reusability of our solution and improving UX on another key page.
  parts:
    - uuid: 'c1e2d3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f'
      status: 'todo'
      name: 'Part 1: Create Generic Scroll-to-Bottom Hook and Component'
      reason: |
        The existing scroll logic is coupled with top bar animation and is not reusable. We need to create a dedicated, single-responsibility hook and a presentational component that can be used across any scrollable page.
      steps:
        - uuid: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'
          status: 'todo'
          name: '1. Create `useScrollToBottom.hook.ts`'
          reason: |
            To extract and generalize the scroll detection logic from `useDashboardScroll.hook.ts`. This new hook will be responsible only for determining if the scroll-to-bottom button should be visible.
          files:
            - 'src/hooks/useScrollToBottom.hook.ts'
          operations:
            - 'Create a new file `src/hooks/useScrollToBottom.hook.ts`.'
            - 'Copy the core logic from `src/pages/Dashboard/hooks/useDashboardScroll.hook.ts`.'
            - 'Remove the dependency and logic related to `useAutoAnimateTopBar`. The new hook should have a single responsibility.'
            - 'The hook should accept a `scrollRef` (React.RefObject<HTMLDivElement>) as an argument.'
            - 'It should return an object with `showScrollToBottom`, `scrollToBottom`, and the `handleScroll` function.'
            - 'The `handleScroll` function will calculate scroll position and update the `showScrollToBottom` state.'
        - uuid: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e'
          status: 'todo'
          name: '2. Create `ScrollToBottomButton.tsx` Component'
          reason: |
            To create a reusable button component that handles its own presentation, including the correct absolute positioning and animations. This avoids duplicating JSX and CSS across pages.
          files:
            - 'src/components/shared/ScrollToBottomButton.tsx'
          operations:
            - 'Create a new file `src/components/shared/ScrollToBottomButton.tsx`.'
            - 'Create a component that accepts `isVisible: boolean` and `onClick: () => void` as props.'
            - 'Move the button JSX from `src/pages/Dashboard/index.tsx` into this component.'
            - 'Change the button''s positioning from `fixed` to `absolute`. The class should be `absolute bottom-8 right-8 ...`.'
            - 'Use a conditional render or a simple animation (like the existing `animate-fade-in`) based on the `isVisible` prop.'
            - 'Import and use the `ArrowDown` icon from `lucide-react`.'
    - uuid: 'd2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a'
      status: 'todo'
      name: 'Part 2: Refactor Dashboard and Clean Up'
      reason: |
        To apply the new reusable components to the Dashboard, fix the original positioning bug, and remove the old, now-redundant hook.
      steps:
        - uuid: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f'
          status: 'todo'
          name: '1. Update `DashboardContent` Component'
          reason: |
            To replace the old hook with the new generic implementation and fix the button's container.
          files:
            - 'src/pages/Dashboard/index.tsx'
          operations:
            - 'In `DashboardContent`, remove the import for `useDashboardScroll.hook.ts`.'
            - 'Import the new `useScrollToBottom` from `@/hooks/useScrollToBottom.hook.ts` and `ScrollToBottomButton` from `@/components/shared/ScrollToBottomButton.tsx`.'
            - 'The `PageLayout` component is already wrapped by `MainContent`, which will serve as our `relative` container. Add `position: relative` to `MainContent` component to ensure the button is positioned correctly.'
            - 'Instantiate the new hook: `const { showScrollToBottom, scrollToBottom, handleScroll: handleScrollToBottom } = useScrollToBottom(scrollRef);`.'
            - 'In the `useDashboardScroll` hook, combine the two scroll handlers. `const { onScroll: handleTopBarScroll } = useAutoAnimateTopBar(isInSidePane);`. Then create a new `handleScroll` function: `const handleScroll = (e: React.UIEvent<HTMLDivElement>) => { handleTopBarScroll(e); handleScrollToBottom(e); };`.'
            - 'Update the `onScroll` prop of `PageLayout` to use this new combined `handleScroll` function.'
            - 'Remove the old button JSX and replace it with `<ScrollToBottomButton isVisible={showScrollToBottom} onClick={scrollToBottom} />`.'
            - 'Place the new `ScrollToBottomButton` component inside the `PageLayout` component, but as a direct child, so it is positioned relative to it.'
        - uuid: 'e4f5a6b7-c8d9-e0f1-a2b3-c4d5e6f7a8b9'
          status: 'todo'
          name: '2. Update `MainContent` to be a positioning context'
          reason: |
            The `ScrollToBottomButton` needs a `relative` positioned ancestor to be positioned `absolute`ly correctly. `MainContent` is the logical choice.
          files:
            - src/components/layout/MainContent.tsx
          operations:
            - 'In `MainContent.tsx`, ensure the main wrapper `div` has the class `relative` in addition to its other classes. Like: `className={cn("relative flex flex-col h-full...", ...)}`'
        - uuid: 'd4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9'
          status: 'todo'
          name: '3. Delete Old Dashboard Hook'
          reason: |
            The hook `useDashboardScroll.hook.ts` is now obsolete and should be removed to avoid confusion and code rot.
          files:
            - 'src/pages/Dashboard/hooks/useDashboardScroll.hook.ts'
          operations:
            - 'Delete the file `src/pages/Dashboard/hooks/useDashboardScroll.hook.ts`.'
      context_files:
        compact:
          - 'src/pages/Dashboard/index.tsx'
          - 'src/pages/Dashboard/hooks/useDashboardScroll.hook.ts'
        medium:
          - 'src/pages/Dashboard/index.tsx'
          - 'src/pages/Dashboard/hooks/useDashboardScroll.hook.ts'
          - 'src/components/layout/PageLayout.tsx'
          - 'src/components/layout/MainContent.tsx'
        extended:
          - 'src/pages/Dashboard/index.tsx'
          - 'src/pages/Dashboard/hooks/useDashboardScroll.hook.ts'
          - 'src/components/layout/PageLayout.tsx'
          - 'src/components/layout/MainContent.tsx'
          - 'src/hooks/useAutoAnimateTopBar.ts'
    - uuid: 'e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b'
      status: 'todo'
      name: 'Part 3: Add Scroll-to-Bottom to Data Demo Page'
      reason: |
        To enhance the user experience on the long, scrollable Data Demo page and to prove the reusability of our new components.
      steps:
        - uuid: 'f4a5b6c7-d8e9-f0a1-b2c3-d4e5f6a7b8c9'
          status: 'todo'
          name: '1. Update `DataDemoContent` Component'
          reason: |
            To integrate the new scroll-to-bottom functionality.
          files:
            - 'src/pages/DataDemo/index.tsx'
          operations:
            - 'In `DataDemoContent`, import `useScrollToBottom` and `ScrollToBottomButton`.'
            - 'Create a new `scrollRef` for the `PageLayout` component: `const scrollRef = useRef<HTMLDivElement>(null);`.'
            - 'Instantiate the hook: `const { showScrollToBottom, scrollToBottom, handleScroll } = useScrollToBottom(scrollRef);`.'
            - 'Pass the ref and the handler to the `PageLayout` component: `scrollRef={scrollRef}` and `onScroll={handleScroll}`.'
            - 'Render the `<ScrollToBottomButton isVisible={showScrollToBottom} onClick={scrollToBottom} />` as a direct child of the `PageLayout` component.'
      context_files:
        compact:
          - 'src/pages/DataDemo/index.tsx'
        medium:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/hooks/useScrollToBottom.hook.ts'
          - 'src/components/shared/ScrollToBottomButton.tsx'
        extended:
          - 'src/pages/DataDemo/index.tsx'
          - 'src/hooks/useScrollToBottom.hook.ts'
          - 'src/components/shared/ScrollToBottomButton.tsx'
          - 'src/components/layout/PageLayout.tsx'
          - 'src/components/layout/MainContent.tsx'
  conclusion: |
    Upon completion, we will have a robust, reusable scroll-to-bottom feature that is correctly positioned within its content area, regardless of the app's layout state. The Dashboard page will be fixed, and the Data Demo page will be enhanced. This refactor improves code quality by adhering to DRY and Single Responsibility principles, making future maintenance easier and providing a consistent UX across the application.
  context_files:
    compact:
      - 'src/pages/Dashboard/index.tsx'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/Dashboard/hooks/useDashboardScroll.hook.ts'
    medium:
      - 'src/pages/Dashboard/index.tsx'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/Dashboard/hooks/useDashboardScroll.hook.ts'
      - 'src/components/layout/PageLayout.tsx'
      - 'src/components/layout/MainContent.tsx'
    extended:
      - 'src/pages/Dashboard/index.tsx'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/pages/Dashboard/hooks/useDashboardScroll.hook.ts'
      - 'src/components/layout/PageLayout.tsx'
      - 'src/components/layout/MainContent.tsx'
      - 'src/hooks/useAutoAnimateTopBar.ts'
      - 'src/components/layout/AppShell.tsx'
```
