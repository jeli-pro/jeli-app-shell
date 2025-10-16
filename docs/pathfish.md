Okay, let's architect this refactor. The current messaging feature is a basic chat app. We're going to rebuild it from the ground up with a new mental model: every conversation is an actionable task. Think less "chat log," more "command center." This is a full-stack rewrite of the feature, from data models to UI components.

We'll ditch the ephemeral nature of chat and introduce structure: status, assignees, due dates, the works. The UI will be overhauled to present this dense, actionable information in a way that's both powerful and intuitive. It's time to stop just talking and start doing.

Here's the master plan.

```yaml
plan:
  uuid: 'd8a3c1f0-5b7e-4d9c-8a1b-6f2e9b1c0a4d'
  status: 'todo'
  title: 'Refactor Messaging from Chat to a Task-Based Inbox'
  introduction: |
    Alright, let's pwn this messaging feature. The current setup is a vanilla chat clone. We're gonna juice it up and pivot to a task-based inbox, think Linear meets Intercom. The mental model is simple: every conversation is a task. It has a lifecycle, an owner, a deadline. It's not just chat, it's actionable.

    We'll gut the existing data models and replace them with task-centric structures. Then we'll rebuild the UI layer by layer: a slick task list instead of a boring conversation list, a full-blown task detail view with an activity feed, and a properties panel to manage the metadata. This isn't just a facelift; it's a full architectural overhaul to make the feature 10x more powerful. No more dropping the ball on user messages.
  parts:
    - uuid: 'c1b2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e'
      status: 'todo'
      name: 'Part 1: Nuke and Pave the Data Layer for Tasks'
      reason: |
        The current data model is for chat. It won't scale for tasks. We need to rebuild the foundation first to support states, deadlines, and ownership. Garbage in, garbage out. Let's get the types right, and everything else will follow.
      steps:
        - uuid: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d'
          status: 'todo'
          name: '1. Overhaul Data Types'
          reason: |
            To represent conversations as tasks, we need to redefine the core `Conversation` and `Message` types. We'll rename `Conversation` to `Task` and enrich it with properties needed for task management.
          files:
            - 'src/pages/Messaging/types.ts'
          operations:
            - 'Rename the `Conversation` interface to `Task`.'
            - 'Add new properties to `Task`: `title: string`, `status: ''open'' | ''in-progress'' | ''done'' | ''snoozed''`, `assigneeId: string | null`, `dueDate: string | null`, `priority: ''none'' | ''low'' | ''medium'' | ''high''`, and `labels: string[]`.'
            - 'The `messages` property on `Task` will now represent an activity feed.'
            - 'Modify the `Message` type to include a `type` property: `type: ''comment'' | ''note'' | ''system''` to differentiate between customer messages, internal notes, and automated logs.'
            - 'Rename `lastMessage` on `Task` to `lastActivity` and its type to `Message` (or a new `Activity` type if we expand it).'
        - uuid: '6f7a8b9c-0d1e-4f2a-b3c4-d5e6f7a8b9c0'
          status: 'todo'
          name: '2. Update Mock Data Generation'
          reason: |
            The existing mock data is for simple chats. We need to update the data generator to produce rich `Task` objects that reflect the new, more complex structure.
          files:
            - 'src/pages/Messaging/data/mockData.ts'
          operations:
            - 'Update `mockConversations` to `mockTasks`.'
            - 'Refactor the generation logic to create `Task` objects with randomized statuses, priorities, due dates, and assignees.'
            - 'Modify the message generation logic to produce a mix of `comment`, `note`, and `system` type messages for the activity feed.'
        - uuid: 'b3c4d5e6-f7a8-4b9c-8d1e-2f3a4b5c6d7e'
          status: 'todo'
          name: '3. Refactor the Messaging Store'
          reason: |
            The Zustand store is wired to the old `Conversation` model. We need to update its state, actions, and selectors to manage `Task` entities.
          files:
            - 'src/pages/Messaging/store/messaging.store.ts'
          operations:
            - 'In `MessagingState`, rename `conversations` to `tasks` and update its type to `Task[]`.'
            - 'Rename actions and selectors from `*Conversation*` to `*Task*`. For example, `getConversationById` becomes `getTaskById`.'
            - 'Add new actions to the store for managing task properties, such as `updateTaskStatus(taskId: string, status: Task[''status''])`, `setTaskAssignee(...)`, and `setTaskDueDate(...)`.'
      context_files:
        compact:
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/Messaging/data/mockData.ts'
          - 'src/pages/Messaging/store/messaging.store.ts'
        medium:
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/Messaging/data/mockData.ts'
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/pages/Messaging/index.tsx'
        extended:
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/Messaging/data/mockData.ts'
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/pages/Messaging/index.tsx'
          - 'src/pages/Messaging/components/ConversationList.tsx'
          - 'src/pages/Messaging/components/MessageThread.tsx'
    - uuid: 'e5f6a7b8-c9d0-4e1f-a2b3-c4d5e6f7a8b9'
      status: 'todo'
      name: 'Part 2: Morph Conversation List into a Legit Task List'
      reason: |
        The left pane is prime real estate. Showing a snippet of the last message is a waste. We need a high-density, scannable list of tasks with their status, priority, and assignee. This will be the new command-central.
      steps:
        - uuid: '2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d'
          status: 'todo'
          name: '1. Create the new TaskList Component'
          reason: |
            We'll replace the old `ConversationList` with a new `TaskList` component designed to display the rich task data.
          files:
            - 'src/pages/Messaging/components/ConversationList.tsx'
            - 'src/pages/Messaging/components/TaskList.tsx' # new file
            - 'src/pages/Messaging/index.tsx'
          operations:
            - 'Create a new file `src/pages/Messaging/components/TaskList.tsx`.'
            - 'In `TaskList.tsx`, fetch tasks from `useMessagingStore`.'
            - 'Render each task as a dense row. Include the task `title`, contact `avatar`, `status` badge, `priority` icon, and `dueDate`.'
            - 'Use `Link` from `react-router-dom` to navigate to `/messaging/{taskId}` when a task row is clicked.'
            - 'Delete the old `ConversationList.tsx` file.'
            - 'Update `src/pages/Messaging/index.tsx` to import and render `TaskList` instead of `ConversationList`.'
        - uuid: '7f8a9b0c-1d2e-4f3a-b4c5-d6e7f8a9b0c1'
          status: 'todo'
          name: '2. Implement Advanced Filtering'
          reason: |
            A simple search bar isn't enough for a task list. We need powerful filtering controls similar to those in the `DataDemo` feature.
          files:
            - 'src/pages/Messaging/components/TaskList.tsx'
            - 'src/pages/Messaging/store/messaging.store.ts'
          operations:
            - 'In `TaskList.tsx`, add a toolbar section above the list.'
            - 'Add dropdowns/popovers for filtering by `status`, `priority`, and `assignee`.'
            - 'Connect these UI controls to the `setFilters` action in the `messaging.store.ts`.'
            - 'Update the selectors in the store to apply these new filters to the `tasks` list that is returned.'
      context_files:
        compact:
          - 'src/pages/Messaging/components/ConversationList.tsx'
          - 'src/pages/Messaging/index.tsx'
          - 'src/pages/Messaging/store/messaging.store.ts'
        medium:
          - 'src/pages/Messaging/components/ConversationList.tsx'
          - 'src/pages/Messaging/index.tsx'
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/DataDemo/components/DataToolbar.tsx' # for reference
        extended:
          - 'src/pages/Messaging/components/ConversationList.tsx'
          - 'src/pages/Messaging/index.tsx'
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/DataDemo/components/DataToolbar.tsx'
          - 'src/components/ui/dropdown-menu.tsx'
          - 'src/components/ui/popover.tsx'
    - uuid: 'd9e0f1a2-b3c4-4d5e-8f6a-7b8c9d0e1f2a'
      status: 'todo'
      name: 'Part 3: Evolve the Message Thread into Task Command Center'
      reason: |
        The center pane is where the work gets done. A simple chat log doesn't cut it. We need a proper header to manage the task's state and an activity feed that shows not just messages, but the entire history of the task.
      steps:
        - uuid: '3a4b5c6d-7e8f-4a9b-0c1d-2e3f4a5b6c7d'
          status: 'todo'
          name: '1. Create TaskHeader Component'
          reason: |
            The task's metadata needs to be front and center, and editable. We'll create a dedicated header component for this.
          files:
            - 'src/pages/Messaging/components/TaskHeader.tsx' # new file
          operations:
            - 'Create a new file `src/pages/Messaging/components/TaskHeader.tsx`.'
            - 'The component will receive a `task` object as a prop.'
            - 'Display the task `title`. Make it editable inline or via a modal.'
            - 'Add dropdowns (`DropdownMenu` or `Popover` with `Command`) to change the `status`, `assignee`, `priority`, and `dueDate`.'
            - 'These controls should call the corresponding update actions in `useMessagingStore`.'
        - uuid: '8f9a0b1c-2d3e-4f4a-b5c6-d7e8f9a0b1c2'
          status: 'todo'
          name: '2. Create ActivityFeed Component'
          reason: |
            The message list needs to become an activity feed that can render different types of events.
          files:
            - 'src/pages/Messaging/components/ActivityFeed.tsx' # new file
          operations:
            - 'Create a new file `src/pages/Messaging/components/ActivityFeed.tsx`.'
            - 'The component will receive an array of `Message` objects.'
            - 'Iterate through the messages and render them based on their `type`.'
            - '`comment` type: Render as a chat bubble, similar to the old design.'
            - '`note` type: Render with a distinct style (e.g., yellow background, "Internal Note" header) to show it's not visible to the contact.'
            - '`system` type: Render as a centered, small-text event line (e.g., "Assignee changed to John Doe").'
        - uuid: 'e2f3a4b5-c6d7-4e8f-9a0b-1c2d3e4f5a6b'
          status: 'todo'
          name: '3. Assemble the new TaskDetail View'
          reason: |
            We'll combine the new header and activity feed into a single `TaskDetail` component, replacing the old `MessageThread`.
          files:
            - 'src/pages/Messaging/components/MessageThread.tsx'
            - 'src/pages/Messaging/components/TaskDetail.tsx' # new file
            - 'src/pages/Messaging/index.tsx'
          operations:
            - 'Create a new file `src/pages/Messaging/components/TaskDetail.tsx`.'
            - 'Get the current `taskId` from `useParams` and fetch the task data using `getTaskById` from the store.'
            - 'Render the `TaskHeader` at the top, passing the task data.'
            - 'Render the `ActivityFeed` below the header, passing the task''s messages.'
            - 'Include an input form at the bottom for adding new comments or internal notes (with a toggle).'
            - 'Delete the old `MessageThread.tsx` file.'
            - 'Update `src/pages/Messaging/index.tsx` to render `TaskDetail` instead of `MessageThread`.'
      context_files:
        compact:
          - 'src/pages/Messaging/components/MessageThread.tsx'
          - 'src/pages/Messaging/index.tsx'
          - 'src/pages/Messaging/types.ts'
        medium:
          - 'src/pages/Messaging/components/MessageThread.tsx'
          - 'src/pages/Messaging/index.tsx'
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/Messaging/store/messaging.store.ts'
        extended:
          - 'src/pages/Messaging/components/MessageThread.tsx'
          - 'src/pages/Messaging/index.tsx'
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/components/ui/dropdown-menu.tsx'
          - 'src/components/ui/popover.tsx'
    - uuid: '4a5b6c7d-8e9f-4a0b-1c2d-3e4f5a6b7c8d'
      status: 'todo'
      name: 'Part 4: Refactor Right Pane for Task & Contact Context'
      reason: |
        Context is king. The right pane needs to show both information about the task and the contact. We'll use tabs to separate these concerns and present a clean, organized view.
      steps:
        - uuid: '9f0a1b2c-3d4e-4f5a-b6c7-d8e9f0a1b2c3'
          status: 'todo'
          name: '1. Create TaskPropertiesPanel Component'
          reason: |
            A dedicated panel is needed to display all the task's metadata in a clear, structured format.
          files:
            - 'src/pages/Messaging/components/TaskPropertiesPanel.tsx' # new file
          operations:
            - 'Create a new file `src/pages/Messaging/components/TaskPropertiesPanel.tsx`.'
            - 'It will accept a `task` object as a prop.'
            - 'Display key-value pairs for all task metadata: `Status`, `Assignee`, `Priority`, `Labels`, `Due Date`, `Created Date`, etc.'
            - 'This panel should be read-only, as editing is handled in the `TaskHeader`.'
        - uuid: '4e5f6a7b-8c9d-4e0f-a1b2-c3d4e5f6a7b8'
          status: 'todo'
          name: '2. Combine Panels with Tabs'
          reason: |
            We'll use tabs to allow the user to switch between viewing task properties and contact details in the right-hand pane.
          files:
            - 'src/pages/Messaging/components/MessagingContent.tsx'
            - 'src/pages/Messaging/components/ContactProfile.tsx'
          operations:
            - 'Modify `MessagingContent.tsx` to be the container for the tabbed view.'
            - 'Use the `AnimatedTabs` component.'
            - 'Create two tabs: "Details" and "Contact".'
            - 'The "Details" tab will render the new `TaskPropertiesPanel.tsx`.'
            - 'The "Contact" tab will render the existing `ContactProfile.tsx`.'
            - 'Pass the relevant `task` and `contact` data to each panel.'
      context_files:
        compact:
          - 'src/pages/Messaging/components/MessagingContent.tsx'
          - 'src/pages/Messaging/components/ContactProfile.tsx'
        medium:
          - 'src/pages/Messaging/components/MessagingContent.tsx'
          - 'src/pages/Messaging/components/ContactProfile.tsx'
          - 'src/components/ui/animated-tabs.tsx'
        extended:
          - 'src/pages/Messaging/components/MessagingContent.tsx'
          - 'src/pages/Messaging/components/ContactProfile.tsx'
          - 'src/components/ui/animated-tabs.tsx'
          - 'src/pages/Messaging/types.ts'
    - uuid: 'b3c4d5e6-f7a8-4b9c-8d1e-0f1a2b3c4d5e'
      status: 'todo'
      name: 'Part 5: Final Integration & Route Cleanup'
      reason: |
        The URL is part of the feature's API. Renaming `/messaging/:conversationId` to `/messaging/:taskId` makes the new model explicit and self-documenting. We'll hunt down and rename all the old `conversation` cruft to complete the migration.
      steps:
        - uuid: '5a6b7c8d-9e0f-4a1b-2c3d-4e5f6a7b8c9d'
          status: 'todo'
          name: '1. Update Routing and URL Parameters'
          reason: |
            To align with the new task-based model, we need to update the application's routes and any code that depends on the URL structure.
          files:
            - 'src/App.tsx'
            - 'src/hooks/useAppViewManager.hook.ts'
            - 'src/pages/Messaging/index.tsx'
          operations:
            - 'In `App.tsx`, change the messaging route from `/messaging/:conversationId` to `/messaging/:taskId`.'
            - 'In `useAppViewManager.hook.ts`, find the logic that handles messaging views. Update it to look for `taskId` in the params instead of `conversationId`.'
            - 'In `TaskList.tsx` and anywhere else a link to a task is generated, ensure it uses the new `/messaging/:taskId` format.'
            - 'In `TaskDetail.tsx`, update `useParams` to extract `taskId`.'
      context_files:
        compact:
          - 'src/App.tsx'
          - 'src/hooks/useAppViewManager.hook.ts'
        medium:
          - 'src/App.tsx'
          - 'src/hooks/useAppViewManager.hook.ts'
          - 'src/pages/Messaging/index.tsx'
        extended:
          - 'src/App.tsx'
          - 'src/hooks/useAppViewManager.hook.ts'
          - 'src/pages/Messaging/index.tsx'
          - 'src/pages/Messaging/components/TaskList.tsx' # newly created
          - 'src/pages/Messaging/components/TaskDetail.tsx' # newly created
  conclusion: |
    When we're done, the messaging feature will be transformed from a passive communication log into an active work management system. Users will be able to track, manage, and resolve conversations like a pro. This shift makes the app stickier and provides a ton more value by treating user interaction as the start of a workflow, not the end of one. It's a massive level-up.
  context_files:
    compact:
      - 'src/pages/Messaging/index.tsx'
      - 'src/pages/Messaging/types.ts'
      - 'src/pages/Messaging/store/messaging.store.ts'
      - 'src/App.tsx'
    medium:
      - 'src/pages/Messaging/index.tsx'
      - 'src/pages/Messaging/types.ts'
      - 'src/pages/Messaging/store/messaging.store.ts'
      - 'src/pages/Messaging/data/mockData.ts'
      - 'src/App.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'
    extended:
      - 'src/pages/Messaging/index.tsx'
      - 'src/pages/Messaging/types.ts'
      - 'src/pages/Messaging/store/messaging.store.ts'
      - 'src/pages/Messaging/data/mockData.ts'
      - 'src/pages/Messaging/components/ConversationList.tsx'
      - 'src/pages/Messaging/components/MessageThread.tsx'
      - 'src/pages/Messaging/components/ContactProfile.tsx'
      - 'src/App.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'
```
