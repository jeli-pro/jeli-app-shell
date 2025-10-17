Here's the master plan for refactoring the messaging task list.

```yaml
plan:
  uuid: 'e4a2c1b8-3f4d-4e5a-8b6c-9d7e0f1a2b3c'
  status: 'todo'
  title: 'Refactor Messaging Task List Tabs for Enhanced UX'
  introduction: |
    Alright, we're shipping a small but slick UX upgrade to the messaging task list. The current tabs are a bit chunky and lack some key info. We're going to add a 'Me' view so users can cut through the noise, shrink the tabs for a cleaner look, and add dynamic counters that pop up on hover. It's a classic case of making the UI work smarter, not harder.

    The plan is to first tool up our Zustand store with the necessary logic, then beef up our generic `AnimatedTabs` component to handle the new hover-count feature. Once the foundations are solid, we'll rewire the `TaskList` component to use all the new goodies. This approach minimizes the blast radius and keeps the changes clean and logical.
  parts:
    - uuid: 'a1b2c3d4-5678-90ab-cdef-1234567890ab'
      status: 'todo'
      name: 'Part 1: Enhance Messaging Store & Types'
      reason: |
        Before touching the UI, we need to prep the data layer. This means updating our type definitions to recognize the new 'Me' view and creating efficient selectors in the Zustand store to provide the necessary data (filtered tasks for 'Me' and counts for all tabs) to the frontend. Getting the data model right first prevents hacks in the component layer later.
      steps:
        - uuid: 'b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6'
          status: 'todo'
          name: '1. Update TaskView Type'
          reason: |
            The `TaskView` type defines the valid tab identifiers. We need to add `'me'` to this union type so it's a recognized state throughout the messaging feature.
          files:
            - 'src/pages/Messaging/types.ts'
          operations:
            - "Add `'me'` to the `TaskView` type definition."
        - uuid: 'c2d3e4f5-a6b7-c8d9-e0f1-a2b3c4d5e6f7'
          status: 'todo'
          name: '2. Update Store Filtering Logic'
          reason: |
            The `getFilteredTasks` selector needs to know how to handle the new `'me'` view. We'll add logic to filter tasks assigned to the current user.
          files:
            - 'src/pages/Messaging/store/messaging.store.ts'
          operations:
            - "Define a mock `currentUserId = 'user-1'` at the top of the file for consistency with other parts of the app."
            - "In the `getFilteredTasks` function, add a filter condition for when `activeTaskView` is `'me'`, checking `task.assigneeId === currentUserId`."
        - uuid: 'd3e4f5a6-b7c8-d9e0-f1a2-b3c4d5e6f7a8'
          status: 'todo'
          name: '3. Create New Selector for Task Counts'
          reason: |
            To display counts in the tabs, we need an efficient way to calculate them. A new, memoized selector is the right tool for the job. It will compute the counts for all views in one pass, preventing redundant calculations in the component.
          files:
            - 'src/pages/Messaging/store/messaging.store.ts'
          operations:
            - "Create and export a new selector hook named `useMessagingTaskCounts`."
            - "Inside this selector, calculate the number of tasks for `all_open`, `unassigned`, `me`, and `done` views. Use the `currentUserId` for the 'me' count."
            - "The selector should return an object, e.g., `{ all_open: 10, unassigned: 2, me: 5, done: 50 }`."
      context_files:
        compact:
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/pages/Messaging/types.ts'
        medium:
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/Messaging/data/mockData.ts'
          - 'src/pages/Messaging/components/TaskList.tsx'
        extended:
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/Messaging/data/mockData.ts'
          - 'src/pages/Messaging/components/TaskList.tsx'
          - 'src/pages/Messaging/components/TaskDetail.tsx'
    - uuid: 'b2c3d4e5-6789-0abc-def1-2345678901bc'
      status: 'todo'
      name: 'Part 2: Upgrade AnimatedTabs Component'
      reason: |
        The generic `AnimatedTabs` component needs to be enhanced to support the new hover-to-see-count feature. We're making it smarter so it can handle this UI pattern anywhere it's used, not just in the `TaskList`. This is about building reusable, powerful primitives.
      steps:
        - uuid: 'e4f5a6b7-c8d9-e0f1-a2b3-c4d5e6f7a8b9'
          status: 'todo'
          name: '1. Enhance Tab Interface'
          reason: |
            The component's `Tab` interface needs to be updated to accept a count, making the data structure aware of the new requirement.
          files:
            - 'src/components/ui/animated-tabs.tsx'
          operations:
            - "Add an optional `count?: number` property to the `Tab` interface."
        - uuid: 'f5a6b7c8-d9e0-f1a2-b3c4-d5e6f7a8b9c0'
          status: 'todo'
          name: '2. Implement Hover State and Conditional Count Display'
          reason: |
            This is the core of the new feature. We'll add state to track hovering and update the render logic to show the count only when a tab is active or hovered, creating the desired "peek" effect.
          files:
            - 'src/components/ui/animated-tabs.tsx'
          operations:
            - "Introduce a state variable for the hovered tab ID: `const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);`."
            - "In the tab mapping logic, add `onMouseEnter` and `onMouseLeave` event handlers to the tab button element to update `hoveredTabId`."
            - "Modify the tab label's JSX to conditionally render a `span` containing `tab.count` if `tab.count` exists and `tab.id === activeTab || tab.id === hoveredTabId`."
      context_files:
        compact:
          - 'src/components/ui/animated-tabs.tsx'
        medium:
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/pages/Messaging/components/TaskList.tsx'
        extended:
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/pages/Messaging/components/TaskList.tsx'
          - 'src/pages/Messaging/components/MessagingContent.tsx'
    - uuid: 'c3d4e5f6-7890-bcde-f123-4567890123cd'
      status: 'todo'
      name: 'Part 3: Refactor TaskList Component'
      reason: |
        With the store and generic tab component upgraded, we can now wire everything together in the `TaskList`. This final part integrates all the new functionality to deliver the complete UX improvement.
      steps:
        - uuid: 'a6b7c8d9-e0f1-a2b3-c4d5-e6f7a8b9c0d1'
          status: 'todo'
          name: '1. Add "Me" Tab and Set Size'
          reason: |
            We'll update the `tabs` configuration array to include the new 'Me' view and simultaneously apply the `sm` size prop for a more compact layout.
          files:
            - 'src/pages/Messaging/components/TaskList.tsx'
          operations:
            - "In the `tabs` constant, add a new tab object: `{ id: 'me', label: 'Me' }` between 'Unassigned' and 'Done'."
            - "Locate the `<AnimatedTabs />` component instance and add the `size=\"sm\"` prop."
        - uuid: 'b7c8d9e0-f1a2-b3c4-d5e6-f7a8b9c0d1e2'
          status: 'todo'
          name: '2. Integrate Task Counts from Store'
          reason: |
            This step connects the component to the new store selector and passes the counts to the `AnimatedTabs` component, enabling the hover-to-see-count feature.
          files:
            - 'src/pages/Messaging/components/TaskList.tsx'
          operations:
            - "Call the new `useMessagingTaskCounts` hook to retrieve the task counts."
            - "Modify the `tabs` array definition. Use `.map()` to add the corresponding `count` from the hook's return value to each tab object."
            - "Ensure this new array, now containing counts, is passed to the `AnimatedTabs` component's `tabs` prop."
      context_files:
        compact:
          - 'src/pages/Messaging/components/TaskList.tsx'
        medium:
          - 'src/pages/Messaging/components/TaskList.tsx'
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/pages/Messaging/types.ts'
        extended:
          - 'src/pages/Messaging/components/TaskList.tsx'
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/pages/Messaging/types.ts'
          - 'src/hooks/useAppViewManager.hook.ts'
          - 'src/pages/Messaging/index.tsx'
  conclusion: |
    Once complete, this refactor will deliver a noticeable improvement to the messaging page's usability. Users get a much-needed personal queue, the UI feels less crowded, and the interactive tab counts provide information without cluttering the screen. We've achieved this by making targeted, logical changes: improving the data layer first, enhancing a generic component, and then cleanly integrating everything. Solid work.
  context_files:
    compact:
      - 'src/pages/Messaging/components/TaskList.tsx'
      - 'src/pages/Messaging/store/messaging.store.ts'
      - 'src/components/ui/animated-tabs.tsx'
      - 'src/pages/Messaging/types.ts'
    medium:
      - 'src/pages/Messaging/components/TaskList.tsx'
      - 'src/pages/Messaging/store/messaging.store.ts'
      - 'src/components/ui/animated-tabs.tsx'
      - 'src/pages/Messaging/types.ts'
      - 'src/hooks/useAppViewManager.hook.ts'
      - 'src/pages/Messaging/data/mockData.ts'
    extended:
      - 'src/pages/Messaging/components/TaskList.tsx'
      - 'src/pages/Messaging/store/messaging.store.ts'
      - 'src/components/ui/animated-tabs.tsx'
      - 'src/pages/Messaging/types.ts'
      - 'src/hooks/useAppViewManager.hook.ts'
      - 'src/pages/Messaging/data/mockData.ts'
      - 'src/pages/Messaging/components/MessagingContent.tsx'
      - 'src/pages/Messaging/index.tsx'
      - 'src/pages/Messaging/components/TaskDetail.tsx'
```
