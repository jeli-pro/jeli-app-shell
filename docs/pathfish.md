Alright, let's get this done. The current messaging page filter is a toy. We're going to ship a real feature that gives users power over their workflow.

The plan is simple: We're upgrading the state management to handle advanced, preset filters like 'Open', 'Unassigned', and 'Done'. Then, we'll overhaul the UI, replacing the weak-sauce tabs with a new set that leverages these presets. Finally, we'll make these views first-class citizens by wiring them up as sub-nav links in the sidebar, all driven by URL params so they're shareable and bookmarkable.

This isn't just a refactor; it's a feature upgrade that'll make the app 10x more usable. Let's build it.

```yaml
plan:
  uuid: 'f2a7b8e1-c9d3-4a1e-8b65-9f4d3c0a7e1b'
  status: 'todo'
  title: 'Refactor Messaging Page for Advanced Filtering and Sidebar Nav'
  introduction: |
    Alright, listen up. The current messaging page filter is weak sauce - just 'all' and 'unread'. Users are crying out for real power. We're going to inject some serious functionality here.

    The plan is to juice up the state management to handle advanced, preset filters like 'Open', 'Unassigned', 'Done', etc. Then, we'll rip out the old tabs and slap in a new UI that uses these presets.

    But that's not all. We're going to make these filters first-class citizens by turning them into sub-navigation links in the sidebar. Clicking 'Unassigned' in the sidebar will jump you right to that view. This is a huge UX win. We'll wire this all up through URL params, making the views shareable and bookmarkable. No half-measures. Let's build something people actually want to use.
  parts:
    - uuid: 'a1b3c4d5-e6f7-8a90-b1c2-d3e4f5a6b7c8'
      status: 'todo'
      name: 'Part 1: Beef Up State Management for Advanced Filtering'
      reason: |
        The current `messaging.store` is too basic. It can't handle the concept of predefined filter "views". We need to bake this logic directly into the store to keep our components clean and have a single source of truth for filtering tasks.
      steps:
        - uuid: 'e8f9a0b1-c2d3-4e5f-6a7b-8c9d0e1f2a3b'
          status: 'todo'
          name: '1. Define new filter presets and state'
          reason: |
            To create a contract for what filter views are available and to store the currently active view. This establishes the foundation for the new filtering logic.
          files:
            - src/pages/Messaging/types.ts
            - src/pages/Messaging/store/messaging.store.ts
          operations:
            - 'In `src/pages/Messaging/types.ts`, export a new type `export type TaskView = "all_open" | "unassigned" | "done";` to define the available filter presets.'
            - 'In `src/pages/Messaging/store/messaging.store.ts`, import the new `TaskView` type.'
            - 'In the `MessagingState` interface, add a new property: `activeTaskView: TaskView;`.'
            - 'In the store''s initial state, set `activeTaskView: "all_open"`, making it the default view.'
            - 'In the `MessagingActions` interface, add a new action signature: `setActiveTaskView: (view: TaskView) => void;`.'
            - 'Implement the `setActiveTaskView` action in the store. It should simply call `set({ activeTaskView: view })`.'
        - uuid: 'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e'
          status: 'todo'
          name: '2. Upgrade `getFilteredTasks` selector'
          reason: |
            This is the core of the refactor. The selector needs to apply the logic for the new `activeTaskView` on top of existing filters like search and tags.
          files:
            - src/pages/Messaging/store/messaging.store.ts
          operations:
            - 'Modify the `getFilteredTasks` selector to read `activeTaskView` from the state.'
            - 'Inside the function, before the existing filtering logic, introduce a new filtering step based on `activeTaskView`.'
            - 'Use a `switch` statement or `if/else` chain to handle the different views:'
            - "For `'all_open'`, filter tasks where status is `'open'` or `'in-progress'`."
            - "For `'unassigned'`, filter tasks where `assigneeId` is `null` AND status is `'open'` or `'in-progress'`."
            - "For `'done'`, filter tasks where status is `'done'`."
            - 'Ensure the result of this new view-based filtering is then passed to the subsequent search and tag filtering logic, allowing all filters to be combined.'
      context_files:
        compact:
          - src/pages/Messaging/store/messaging.store.ts
          - src/pages/Messaging/types.ts
        medium:
          - src/pages/Messaging/store/messaging.store.ts
          - src/pages/Messaging/types.ts
          - src/pages/Messaging/components/TaskList.tsx
        extended:
          - src/pages/Messaging/store/messaging.store.ts
          - src/pages/Messaging/types.ts
          - src/pages/Messaging/components/TaskList.tsx
          - src/hooks/useAppViewManager.hook.ts
    - uuid: 'c9d8e7f6-a5b4-c3d2-e1f0-9a8b7c6d5e4f'
      status: 'todo'
      name: 'Part 2: Overhaul TaskList UI & URL-based State'
      reason: |
        The UI needs to reflect the new filtering power. We'll replace the simple tabs with ones that control our new "views". We'll also make the URL the source of truth for the active view, making the app state more robust and shareable.
      steps:
        - uuid: 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a'
          status: 'todo'
          name: '1. Introduce `messagingView` URL parameter'
          reason: |
            To control the messaging view state via the URL, enabling deep linking and browser history support. This decouples the view state from component state.
          files:
            - src/hooks/useAppViewManager.hook.ts
            - src/pages/Messaging/types.ts
          operations:
            - 'In `useAppViewManager.hook.ts`, import `TaskView` from `''@/pages/Messaging/types''`.'
            - 'In the hook, create a new derived state variable: `const messagingView = searchParams.get("messagingView") as TaskView | null;`.'
            - 'Create a new setter function to update the URL: `const setMessagingView = (view: TaskView) => handleParamsChange({ messagingView: view });`.'
            - 'Return `messagingView` and `setMessagingView` from the hook''s returned object.'
        - uuid: 'a6b7c8d9-e0f1-2a3b-4c5d-6e7f8a9b0c1d'
          status: 'todo'
          name: '2. Connect `TaskList` to URL state and store'
          reason: |
            To make the `TaskList` component react to URL changes and update the central store accordingly, ensuring a synchronized state across the application.
          files:
            - src/pages/Messaging/components/TaskList.tsx
          operations:
            - 'In `TaskList.tsx`, get `messagingView` and `setMessagingView` from the `useAppViewManager()` hook.'
            - 'Get the `setActiveTaskView` action from the `useMessagingStore()` hook.'
            - 'Add a `useEffect` hook to sync the URL state with the Zustand store: `useEffect(() => { setActiveTaskView(messagingView || "all_open"); }, [messagingView, setActiveTaskView]);`.'
        - uuid: 'f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c'
          status: 'todo'
          name: '3. Replace UI tabs with new view controls'
          reason: |
            The old `[all | unread]` tabs are now obsolete. They must be replaced with new tabs that control the `messagingView` via the URL.
          files:
            - src/pages/Messaging/components/TaskList.tsx
          operations:
            - 'Locate the `AnimatedTabs` component within `TaskList.tsx`.'
            - 'Replace the existing `tabs` prop array with a new constant: `const TABS = [{ id: "all_open", label: "Open" }, { id: "unassigned", label: "Unassigned" }, { id: "done", label: "Done" }];`.'
            - 'Update the `activeTab` prop to be driven by the URL: `activeTab={messagingView || "all_open"}`.'
            - 'Update the `onTabChange` prop to call the URL setter: `onTabChange={(tabId) => setMessagingView(tabId as TaskView)}`.'
      context_files:
        compact:
          - src/pages/Messaging/components/TaskList.tsx
          - src/hooks/useAppViewManager.hook.ts
        medium:
          - src/pages/Messaging/components/TaskList.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/pages/Messaging/store/messaging.store.ts
          - src/pages/Messaging/types.ts
        extended:
          - src/pages/Messaging/components/TaskList.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/pages/Messaging/store/messaging.store.ts
          - src/pages/Messaging/types.ts
          - src/components/layout/EnhancedSidebar.tsx
    - uuid: '8d7e6f5a-4b3c-2d1e-0f9a-8b7c6d5e4f3a'
      status: 'todo'
      name: 'Part 3: Integrate Filter Views into Sidebar'
      reason: |
        To provide quick, one-click access to the most important message views directly from the main application navigation, improving discoverability and workflow efficiency.
      steps:
        - uuid: '7c6d5e4f-3a2b-1c0d-9e8f-7a6b5c4d3e2f'
          status: 'todo'
          name: '1. Enhance navigation logic for URL parameters'
          reason: |
            The existing `navigateToPage` function only changes the URL path. We need to upgrade it to handle setting URL search parameters simultaneously, which is essential for activating our new views from the sidebar.
          files:
            - src/hooks/useAppViewManager.hook.ts
          operations:
            - 'Locate the `navigateToPage` function inside `useAppViewManager.hook.ts`.'
            - 'Modify its signature to accept an optional `params` object: `const navigateToPage = (page: ActivePage, params?: Record<string, string | null>) => { ... };`.'
            - 'Inside the function, create a new `URLSearchParams` instance from the current `searchParams`.'
            - 'Iterate over the passed `params` object. If a value is `null` or `undefined`, `delete` the key from the search params. Otherwise, `set` the key/value.'
            - 'Finally, call `navigate` with both the new pathname and the stringified search params: `navigate({ pathname: `/${page}`, search: newSearchParams.toString() });`.'
        - uuid: '6b5c4d3e-2f1a-0b9c-8d7e-6f5a4b3c2d1e'
          status: 'todo'
          name: '2. Refactor "Messaging" sidebar item into a collapsible section'
          reason: |
            To create a container for the main "Messaging" link and its new sub-navigation links. This improves the information architecture and makes the sidebar more organized.
          files:
            - src/components/layout/EnhancedSidebar.tsx
          operations:
            - 'In `EnhancedSidebar.tsx`, get `messagingView` and the modified `navigateToPage` from the `useAppViewManager()` hook.'
            - 'Locate the `EnhancedSidebarMenuItem` for "Messaging" (where `page="messaging"`).'
            - 'Remove this single menu item.'
            - 'In its place, add a `<SidebarSection title="Inbox" isCollapsible={true}>`.'
            - 'Inside this new section, add three `EnhancedSidebarMenuItem` components, one for each view:'
            - "1. **All Open:** `label=\"All Open\"`, `page=\"messaging\"`, `onClick={() => navigateToPage('messaging', { messagingView: 'all_open' })}`, `isActive={activePage === 'messaging' && (messagingView === 'all_open' || !messagingView)}`."
            - "2. **Unassigned:** `label=\"Unassigned\"`, `page=\"messaging\"`, `onClick={() => navigateToPage('messaging', { messagingView: 'unassigned' })}`, `isActive={activePage === 'messaging' && messagingView === 'unassigned'}`."
            - "3. **Done:** `label=\"Done\"`, `page=\"messaging\"`, `onClick={() => navigateToPage('messaging', { messagingView: 'done' })}`, `isActive={activePage === 'messaging' && messagingView === 'done'}`."
            - "Modify the `EnhancedSidebarMenuItem` component to accept and prioritize an `onClick` prop over its default navigation behavior. Update its `handleClick` to be `const handleClick = onClick ?? (() => navigateToPage(page));`."
      context_files:
        compact:
          - src/components/layout/EnhancedSidebar.tsx
          - src/hooks/useAppViewManager.hook.ts
        medium:
          - src/components/layout/EnhancedSidebar.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/pages/Messaging/components/TaskList.tsx
        extended:
          - src/components/layout/EnhancedSidebar.tsx
          - src/hooks/useAppViewManager.hook.ts
          - src/pages/Messaging/components/TaskList.tsx
          - src/store/appShell.store.ts
          - src/components/layout/Sidebar.tsx
  conclusion: |
    Once this is shipped, the messaging feature will be transformed from a simple inbox into a powerful, organized workspace. Users can triage tasks efficiently with direct navigation from the sidebar, and the URL-driven state makes the entire experience more stable and predictable. This is a massive leap forward in usability. LGTM.
  context_files:
    compact:
      - src/pages/Messaging/store/messaging.store.ts
      - src/pages/Messaging/components/TaskList.tsx
      - src/components/layout/EnhancedSidebar.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/pages/Messaging/types.ts
    medium:
      - src/pages/Messaging/store/messaging.store.ts
      - src/pages/Messaging/components/TaskList.tsx
      - src/components/layout/EnhancedSidebar.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/pages/Messaging/types.ts
      - src/components/layout/Sidebar.tsx
    extended:
      - src/pages/Messaging/store/messaging.store.ts
      - src/pages/Messaging/components/TaskList.tsx
      - src/components/layout/EnhancedSidebar.tsx
      - src/hooks/useAppViewManager.hook.ts
      - src/pages/Messaging/types.ts
      - src/components/layout/Sidebar.tsx
      - src/store/appShell.store.ts
      - src/pages/Messaging/index.tsx
```
