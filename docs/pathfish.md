Alright, heard you loud and clear. My first take was too simplistic—stuffing everything into `MainContent` is a cop-out. You want the real deal: a native, three-pane messaging layout that fully leverages the AppShell's split-view power. No hacks, no workarounds. A proper integration.

You're right. The messaging page shouldn't be a special snowflake; it should be a first-class citizen of the split-view world. This means `ConversationList` and `MessageThread` live in the main content area, with their own resizer, while `ContactProfile` takes its rightful place in the `RightPane`. This architecture is cleaner, more powerful, and fixes the janky behavior with overlays.

Let's scrap the old plan. Here's the new blueprint to build this thing right.

```yaml
plan:
  uuid: 'f2c9a1b3-5e8d-4a7b-9c6d-8e4f0a9b1c7d'
  status: 'todo'
  title: 'Architect Messaging for Native Three-Pane Split-View'
  introduction: |
    The initial plan to isolate the messaging page within the main content area was a flawed simplification. Based on feedback, we're pivoting to a more robust architecture that deeply integrates a three-pane messaging layout with the AppShell's native split-view capabilities. This is the "right way" to do it.

    The new strategy involves creating a nested, two-pane layout (Conversation List & Message Thread) that lives entirely within the `MainContent` area, while the `ContactProfile` will be rendered in the `RightPane`. This structure will be activated when the user navigates to a conversation, establishing a true split-view state. Most critically, we'll overhaul the view management logic to ensure that this messaging split-view coexists peacefully with other shell functions, like opening settings or notifications in an overlay pane. This will fix all known view-switching bugs and deliver a seamless, powerful, and maintainable messaging experience.
  parts:
    - uuid: '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d'
      status: 'todo'
      name: 'Part 1: Re-architect Messaging Components for a Main/Right Pane Split'
      reason: |
        To achieve a native split-view, we must first logically and physically separate the messaging components into two groups: what goes in the main content area and what goes in the right pane. This structural change is the foundation for the entire refactor.
      steps:
        - uuid: '1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e'
          status: 'todo'
          name: '1. Create a Nested Two-Pane Layout for Main Content'
          reason: |
            The `ConversationList` and `MessageThread` need to coexist within the `MainContent` area. We'll replace the old `MessagingContent` component with a new layout component dedicated to this two-pane view.
          files:
            - 'src/pages/Messaging/components/MessagingContent.tsx'
            - 'src/pages/Messaging/index.tsx'
          operations:
            - "Rename `src/pages/Messaging/components/MessagingContent.tsx` to a more descriptive name like `MessagingMainContent.tsx`."
            - "Gut the existing layout logic in the renamed file. Rebuild it to render `ConversationList` and `MessageThread` side-by-side within a flexbox container."
            - "Update `src/pages/Messaging/index.tsx` (`MessagingPage`) to render this new `MessagingMainContent` component, passing down the `conversationId` from `useParams`."
        - uuid: '2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f'
          status: 'todo'
          name: '2. Relocate Contact Profile to the Right Pane'
          reason: |
            The `ContactProfile` component is the third pane and belongs in the AppShell's `RightPane` when the messaging split-view is active.
          files:
            - 'src/hooks/useRightPaneContent.hook.tsx'
          operations:
            - "In `useRightPaneContent.hook.tsx`, re-introduce or confirm the logic for `sidePaneContent === 'messaging'`."
            - "This case should render the `<MessagingContent />` component. We will rename this component to `MessagingRightPane` or similar if needed for clarity to avoid confusion with the main content, but for now, let's assume it renders the `ContactProfile`."
            - "The component rendered here should be the `ContactProfile`, which now receives the `conversationId`."
    - uuid: '3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8g'
      status: 'todo'
      name: 'Part 2: Fortify AppShell View Management'
      reason: |
        The core of the problem is that the messaging split-view state is too "sticky," preventing other side panes from opening as overlays. We need to fix the state derivation logic in `useAppViewManager` to be more explicit and predictable.
      steps:
        - uuid: '4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8g9h'
          status: 'todo'
          name: '1. Prioritize Overlay Panes in State Derivation'
          reason: |
            An explicit request for an overlay pane (e.g., `?sidePane=settings`) must always win, regardless of the current URL path. This is the key to fixing the overlay bugs.
          files:
            - 'src/hooks/useAppViewManager.hook.ts'
          operations:
            - "In `useAppViewManager`, locate the `useMemo` hook that derives `bodyState` and `sidePaneContent`."
            - "Refactor the logic to ensure the check for a `sidePane` URL parameter is the very first thing. If `sidePane` exists, the hook must *immediately* return `bodyState: BODY_STATES.SIDE_PANE`."
            - "The existing logic that checks for `conversationId` to create a `SPLIT_VIEW` should only run *after* the `sidePane` check has failed. This ensures overlays can appear on top of the messaging page."
        - uuid: '5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8g9h1i'
          status: 'todo'
          name: '2. Solidify Messaging Split-View Activation'
          reason: |
            With overlays fixed, we need to ensure that navigating to a conversation correctly and reliably activates our desired `SPLIT_VIEW` state.
          files:
            - 'src/hooks/useAppViewManager.hook.ts'
          operations:
            - "Confirm that when no `sidePane` param is present, the logic correctly detects `conversationId` from the URL path."
            - "When `conversationId` is present, the hook should return `{ bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'messaging' }`. This activates our split-view, rendering `ContactProfile` in the `RightPane`."
    - uuid: '6a7b8c9d-0e1f-2a3b-4c5d-6e7f8g9h1i2j'
      status: 'todo'
      name: 'Part 3: Implement Nested Resizable Panes'
      reason: |
        With the AppShell correctly managing the main split, we now need to implement the internal resizer for the two panes living inside `MainContent`.
      steps:
        - uuid: '7b8c9d0e-1f2a-3b4c-5d6e-7f8g9h1i2j3k'
          status: 'todo'
          name: '1. Build the Resizable Two-Pane UI'
          reason: |
            A new, localized resizer is needed to manage the split between the conversation list and the message thread.
          files:
            - 'src/pages/Messaging/MessagingMainContent.tsx'
            - 'src/hooks/useResizablePanes.hook.ts'
          operations:
            - "In `MessagingMainContent.tsx`, add a `useState` hook to manage the widths of the two panes, e.g., `const [widths, setWidths] = useState([33, 67])` to approximate the desired 20%/40% overall ratio."
            - "Apply these widths to the `ConversationList` and `MessageThread` wrapper divs using `flex-basis`."
            - "Insert a resizer `div` between the two panes."
            - "Create a new resizing hook, or adapt `useResizableMessagingProfile`, to handle `onMouseDown` events for the new resizer. The `onMouseMove` handler should calculate the new percentage-based widths and update the state."
        - uuid: '8c9d0e1f-2a3b-4c5d-6e7f-8g9h1i2j3k4l'
          status: 'todo'
          name: '2. Clean Up Obsolete State and Logic'
          reason: |
            The old resizing logic and state for the `ContactProfile` is now redundant and must be removed to prevent conflicts. The AppShell's main resizer handles this now.
          files:
            - 'src/pages/Messaging/MessagingMainContent.tsx'
            - 'src/store/appShell.store.ts'
            - 'src/hooks/useResizablePanes.hook.ts'
          operations:
            - "Remove all state and props related to `messagingProfileWidth`, `isResizingMessagingProfile`, and `isMessagingProfileCollapsed` from the old `MessagingContent` (now `MessagingMainContent`)."
            - "Remove the corresponding state properties and actions (`setMessagingProfileWidth`, `toggleMessagingProfileCollapsed`, etc.) from `appShell.store.ts`."
            - "Remove the `useResizableMessagingProfile` hook from `useResizablePanes.hook.ts` as its functionality is now split between the AppShell's main resizer and our new nested resizer."
            - "Remove any UI elements related to collapsing the profile pane from `MessageThread.tsx`, as this is now implicitly handled by closing the `RightPane`."
  conclusion: |
    By executing this plan, we'll transform the messaging page from a buggy, special-cased component into a flagship example of the AppShell's power. It will feature a clean, performant, and fully resizable three-pane layout that is perfectly integrated with the shell's native split-view and overlay systems. This not only crushes the existing bugs but also establishes a solid, scalable architecture for future feature development.
  context_files:
    compact:
      - 'src/pages/Messaging/index.tsx'
      - 'src/pages/Messaging/components/MessagingContent.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'
      - 'src/hooks/useRightPaneContent.hook.tsx'
    medium:
      - 'src/pages/Messaging/index.tsx'
      - 'src/pages/Messaging/components/MessagingContent.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'
      - 'src/hooks/useRightPaneContent.hook.tsx'
      - 'src/hooks/useResizablePanes.hook.ts'
      - 'src/store/appShell.store.ts'
      - 'src/App.tsx'
    extended:
      - 'src/pages/Messaging/index.tsx'
      - 'src/pages/Messaging/components/MessagingContent.tsx'
      - 'src/pages/Messaging/components/ConversationList.tsx'
      - 'src/pages/Messaging/components/MessageThread.tsx'
      - 'src/pages/Messaging/components/ContactProfile.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'
      - 'src/hooks/useRightPaneContent.hook.tsx'
      - 'src/hooks/useResizablePanes.hook.ts'
      - 'src/store/appShell.store.ts'
      - 'src/components/layout/AppShell.tsx'
      - 'src/components/layout/MainContent.tsx'
      - 'src/components/layout/RightPane.tsx'
      - 'src/App.tsx'

```
