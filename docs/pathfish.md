Yo, check it. We're dropping a new feature into the messaging system. Right now, it's a free-for-all. We're adding an agent-lock mechanism to prevent collisions and clarify who's handling what. This is a classic coordination problem, and we're solving it with a clean UI.

The plan is to show when a conversation (task) is being worked on. We'll differentiate between a human agent and an AI agent. If it's a human, the user has to request a takeover – we're not animals. If it's an AI, the user can just boot it and take control directly. This prevents stepping on toes while keeping the workflow fast.

We'll tackle this surgically. First, we'll update the data model and the Zustand store to understand this new "locked" state. Then, we'll sprinkle in UI indicators in the task list and build out the main takeover controls in the task detail header. Finally, we'll wire everything up and add toast notifications for slick user feedback. It's a clean, multi-part refactor that will seriously level up the UX. No massive rewrites, just targeted enhancements.

```yaml
plan:
  uuid: 'e8a1b2c4-f3d5-4e67-8b9a-c0d1f2e3a4b5'
  status: 'todo'
  title: 'Refactor: Implement Agent Lock & Takeover UX in Messaging'
  introduction: |
    Alright, listen up. We're about to ship a slick new feature for the messaging module. Right now, it's the wild west—anyone can jump into any conversation. We're adding an agent lock. If someone's on it, you'll know. If it's a human, you ask nicely to take over. If it's our AI bot, you just kick it out. Simple.

    This refactor is surgical. We'll start by teaching our data model about this new "locked" state. Then we'll slap some UI on the task list so you can see locks at a glance. The main event is in the task detail view: a big, clear banner showing who's in charge, with the right button to request or force a takeover. Finally, we'll wire it all up with Zustand and some flashy toasts so the user knows what's happening.

    No big bang rewrite. Just a clean, four-part slice that adds real value. Let's get it done.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Data Model & Store Enhancements'
      reason: |
        Gotta start with the foundation. We need to update our data structures and state management to even recognize the concept of a "locked" task. Without this, the UI has nothing to work with. This part gets our store and types in shape for the new reality.
      steps:
        - uuid: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1'
          status: 'todo'
          name: '1. Extend Task Data Model'
          reason: |
            The `Task` interface is our source of truth for a conversation. We need to add an optional `lockedBy` field to track who, if anyone, is currently handling it. This field needs to know if the agent is human or AI, which dictates the takeover UX.
          files:
            - src/pages/Messaging/types.ts
          operations:
            - 'In `src/pages/Messaging/types.ts`, find the `Task` interface.'
            - 'Add a new optional property `lockedBy` of type `{ agentId: string; agentType: "human" | "ai"; agentName: string; agentAvatar: string; } | null`.'
        - uuid: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12'
          status: 'todo'
          name: '2. Seed Mock Data with Locked Tasks'
          reason: |
            To build and test the UI, we need data that reflects the new locked states. We'll update the mock data to include examples of tasks locked by both a human and an AI agent.
          files:
            - src/pages/Messaging/data/mockData.ts
          operations:
            - 'Open `src/pages/Messaging/data/mockData.ts`.'
            - 'In the `mockTasks` array, find a couple of tasks to modify.'
            - 'For one task, add the `lockedBy` property with `agentType: "human"`. You can use an existing assignee for the agent details.'
            - 'For another task, add `lockedBy` with `agentType: "ai"`. Create a mock AI agent profile for this (e.g., name: "Jeli AI Assistant").'
        - uuid: 'd4e5f6a7-b8c9-0123-4567-890abcdef123'
          status: 'todo'
          name: '3. Add Takeover Actions to Messaging Store'
          reason: |
            The UI needs functions to call. We'll add two new actions to our Zustand store: one for requesting a takeover from a human and another for forcing a takeover from an AI. For now, these will be placeholders for the logic we'll implement later.
          files:
            - src/pages/Messaging/store/messaging.store.ts
          operations:
            - 'In `src/pages/Messaging/store/messaging.store.ts`, locate the `MessagingActions` interface.'
            - 'Add a new action: `requestTakeover: (taskId: string) => void;`.'
            - 'Add another new action: `forceTakeover: (taskId: string) => void;`.'
            - 'In the store implementation, add placeholder implementations for these two new actions that do nothing for now.'
      context_files:
        compact:
          - src/pages/Messaging/types.ts
          - src/pages/Messaging/data/mockData.ts
          - src/pages/Messaging/store/messaging.store.ts
        medium:
          - src/pages/Messaging/types.ts
          - src/pages/Messaging/data/mockData.ts
          - src/pages/Messaging/store/messaging.store.ts
        extended:
          - src/pages/Messaging/types.ts
          - src/pages/Messaging/data/mockData.ts
          - src/pages/Messaging/store/messaging.store.ts
          - src/pages/Messaging/components/TaskList.tsx
          - src/pages/Messaging/components/TaskHeader.tsx
    - uuid: 'e5f6a7b8-c9d0-1234-5678-90abcdef1234'
      status: 'todo'
      name: 'Part 2: UI for Locked State in Task List'
      reason: |
        Users need to see the state of a conversation before clicking in. A simple lock icon on the task list items provides crucial at-a-glance information, improving workflow and preventing unnecessary clicks.
      steps:
        - uuid: 'f6a7b8c9-d0e1-2345-6789-0abcdef12345'
          status: 'todo'
          name: '1. Render Lock Indicator in Task List'
          reason: |
            We'll modify the `TaskList` component to check for the `lockedBy` property on each task and render a visual indicator, like a lock icon, if it's present. This gives immediate feedback in the list view.
          files:
            - src/pages/Messaging/components/TaskList.tsx
          operations:
            - 'In `src/pages/Messaging/components/TaskList.tsx`, import the `Lock` icon from `lucide-react`.'
            - 'Inside the `getFilteredTasks().map(...)` loop that renders each task `Link`.'
            - 'Check if `task.lockedBy` exists.'
            - 'If it does, render the `<Lock />` icon next to the contact name or in another prominent spot within the list item.'
            - 'Optionally, add a `group` class to the `Link` and a `group-hover:opacity-70` style to visually fade locked tasks slightly.'
      context_files:
        compact:
          - src/pages/Messaging/components/TaskList.tsx
        medium:
          - src/pages/Messaging/components/TaskList.tsx
          - src/pages/Messaging/types.ts
        extended:
          - src/pages/Messaging/components/TaskList.tsx
          - src/pages/Messaging/types.ts
          - src/pages/Messaging/store/messaging.store.ts
    - uuid: 'a7b8c9d0-e1f2-3456-7890-bcdef1234567'
      status: 'todo'
      name: 'Part 3: UI for Takeover in Task Detail View'
      reason: |
        This is the core UX. When a user opens a locked conversation, we need to clearly communicate the situation and provide the correct action. This part builds the banner and buttons in the `TaskHeader` and disables input to prevent invalid actions.
      steps:
        - uuid: 'b8c9d0e1-f2a3-4567-8901-cdef12345678'
          status: 'todo'
          name: '1. Display Lock Banner and Conditional Buttons in Header'
          reason: |
            The `TaskHeader` is the perfect place to display who has locked the conversation. We'll add a banner with the agent's info and show the right button—"Request Takeover" for humans, "Take Over" for AI.
          files:
            - src/pages/Messaging/components/TaskHeader.tsx
          operations:
            - 'In `src/pages/Messaging/components/TaskHeader.tsx`, import `Lock`, `UserCheck`, and `Bot` icons from `lucide-react`.'
            - 'At the top of the component, check if `task.lockedBy` exists.'
            - 'If it does, render a new banner-like `div`. This should contain the agent''s avatar (`task.lockedBy.agentAvatar`), name (`task.lockedBy.agentName`), and a message like "is currently handling this conversation."'
            - 'Inside this banner, add a `Button`. The button''s text and `onClick` handler will be conditional.'
            - 'If `task.lockedBy.agentType === "human"`, the button text is "Request Takeover".'
            - 'If `task.lockedBy.agentType === "ai"`, the button text is "Take Over".'
            - 'Hide the normal header controls (Assignee, Status, etc.) when the task is locked.'
        - uuid: 'c9d0e1f2-a3b4-5678-9012-def123456789'
          status: 'todo'
          name: '2. Disable Message Input for Locked Tasks'
          reason: |
            A user shouldn't be able to send messages in a conversation they don't control. We'll disable the input form in `TaskDetail` if the task is locked to enforce this rule.
          files:
            - src/pages/Messaging/components/TaskDetail.tsx
          operations:
            - 'In `src/pages/Messaging/components/TaskDetail.tsx`, get the full task details, including `lockedBy`.'
            - 'Locate the `div` containing the message input form (with `Textarea`, `Button`, etc.).'
            - 'Add the `disabled` attribute to the `Textarea`, `Input`, and action `Button`s if `task.lockedBy` is not null.'
            - 'You can also use CSS to visually indicate the disabled state, e.g., `opacity-50 cursor-not-allowed` on the form wrapper.'
      context_files:
        compact:
          - src/pages/Messaging/components/TaskHeader.tsx
          - src/pages/Messaging/components/TaskDetail.tsx
        medium:
          - src/pages/Messaging/components/TaskHeader.tsx
          - src/pages/Messaging/components/TaskDetail.tsx
          - src/pages/Messaging/types.ts
        extended:
          - src/pages/Messaging/components/TaskHeader.tsx
          - src/pages/Messaging/components/TaskDetail.tsx
          - src/pages/Messaging/types.ts
          - src/pages/Messaging/store/messaging.store.ts
    - uuid: 'd0e1f2a3-b4c5-6789-0123-ef1234567890'
      status: 'todo'
      name: 'Part 4: Implement Takeover Logic & User Feedback'
      reason: |
        The final step is to make it all work. We need to implement the logic in the store actions and connect the UI buttons. Providing instant feedback with toast notifications is key to making the experience feel responsive and complete.
      steps:
        - uuid: 'e1f2a3b4-c5d6-7890-1234-f12345678901'
          status: 'todo'
          name: '1. Implement Store Actions with Toast Feedback'
          reason: |
            Now we flesh out the store actions. The `forceTakeover` will modify the state directly. `requestTakeover` will simulate an API call. Both will use `sonner` to show toasts, confirming to the user that their action was registered.
          files:
            - src/pages/Messaging/store/messaging.store.ts
          operations:
            - 'In `src/pages/Messaging/store/messaging.store.ts`, import `toast` from `sonner`.'
            - 'Implement `forceTakeover(taskId)`. It should use `set` to find the task in the `tasks` array and update its `lockedBy` property to `null`. After updating, call `toast.success("You have taken over the conversation.")`.'
            - 'Implement `requestTakeover(taskId)`. It won''t change state. Instead, find the task to get the agent''s name, then call `toast.info(`Takeover request sent to ${task.lockedBy.agentName}.`)`.'
        - uuid: 'f2a3b4c5-d6e7-8901-2345-123456789012'
          status: 'todo'
          name: '2. Connect UI Buttons to Store Actions'
          reason: |
            Let's wire it up. The buttons we created in the `TaskHeader` need to be connected to the new Zustand store actions to trigger the logic and feedback.
          files:
            - src/pages/Messaging/components/TaskHeader.tsx
          operations:
            - 'In `src/pages/Messaging/components/TaskHeader.tsx`, import `useMessagingStore`.'
            - 'Destructure the `requestTakeover` and `forceTakeover` actions from the store.'
            - 'In the conditional button rendering, add the `onClick` handler.'
            - 'For the "Request Takeover" button, call `onClick={() => requestTakeover(task.id)}`.'
            - 'For the "Take Over" button, call `onClick={() => forceTakeover(task.id)}`.'
      context_files:
        compact:
          - src/pages/Messaging/store/messaging.store.ts
          - src/pages/Messaging/components/TaskHeader.tsx
        medium:
          - src/pages/Messaging/store/messaging.store.ts
          - src/pages/Messaging/components/TaskHeader.tsx
          - src/components/ui/toast.tsx
        extended:
          - src/pages/Messaging/store/messaging.store.ts
          - src/pages/Messaging/components/TaskHeader.tsx
          - src/components/ui/toast.tsx
          - src/App.tsx
  conclusion: |
    Once this is done, the messaging feature will have a proper concurrency control mechanism. Users will get clear, immediate feedback on conversation status, preventing them from talking over each other or interfering with AI processes. This surgical refactor adds significant UX value with minimal disruption, making the whole system feel more robust and professional. Ship it.
  context_files:
    compact:
      - src/pages/Messaging/types.ts
      - src/pages/Messaging/data/mockData.ts
      - src/pages/Messaging/store/messaging.store.ts
      - src/pages/Messaging/components/TaskList.tsx
      - src/pages/Messaging/components/TaskHeader.tsx
      - src/pages/Messaging/components/TaskDetail.tsx
    medium:
      - src/pages/Messaging/types.ts
      - src/pages/Messaging/data/mockData.ts
      - src/pages/Messaging/store/messaging.store.ts
      - src/pages/Messaging/components/TaskList.tsx
      - src/pages/Messaging/components/TaskHeader.tsx
      - src/pages/Messaging/components/TaskDetail.tsx
      - src/components/ui/toast.tsx
    extended:
      - src/pages/Messaging/types.ts
      - src/pages/Messaging/data/mockData.ts
      - src/pages/Messaging/store/messaging.store.ts
      - src/pages/Messaging/components/TaskList.tsx
      - src/pages/Messaging/components/TaskHeader.tsx
      - src/pages/Messaging/components/TaskDetail.tsx
      - src/components/ui/toast.tsx
      - src/App.tsx
      - src/pages/Messaging/index.tsx
```
