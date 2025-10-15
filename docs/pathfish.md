You're right. My apologies. The context is everything. The goal isn't to refactor the main `/messaging` page itself, but to enhance the experience when the messaging feature is loaded into the `RightPane` during a split view. This is a critical distinction.

The previous plan was flawed because it focused on `MessagingPage.tsx`. The real work needs to happen in the component that *gets rendered inside* the `RightPane`. We need a new container component to manage the thread and the profile *within that context*.

Here is the corrected master plan. It's more surgical and respects the existing architecture.

```yaml
plan:
  uuid: '2c5f1a9e-8d7b-4c6a-9e8d-3b4c1a9e8d7b'
  status: 'todo'
  title: 'Implement Collapsible Profile in Messaging Split View Pane'
  introduction: |
    Got it. The refactor is specifically for the messaging experience *within the split view's right pane*. The previous approach was off-target. We won't touch the top-level layout of `MessagingPage.tsx` initially, but instead create a new wrapper component that will house both the `MessageThread` and the `ContactProfile`.

    This new component, let's call it `MessagingContent`, will become the orchestrator for the right pane. It will manage the collapsible state of the `ContactProfile`, allowing the `MessageThread` to expand and fill the space. This is a much cleaner way to achieve the goal without disrupting the main app shell's logic or the primary two-pane layout of the messaging route.

    The plan is now focused: 1) Add the necessary global state. 2) Create the resizing hook. 3) Build the new `MessagingContent` component and integrate it where it belongs—inside the `RightPane` via our `useRightPaneContent` hook. 4) Add the final UI toggle in the `MessageThread` header. This is the right way to do it.
  parts:
    - uuid: 'b9c8d7e6-f5a4-4b3c-ad9e-2f1a0b9c8d7e'
      status: 'todo'
      name: 'Part 1: Extend App Shell State for the Profile Pane'
      reason: |
        To make the profile pane collapsible and resizable, its state (width, visibility, resizing status) must live in our global Zustand store. This allows different components to react to and control the pane's properties without messy prop drilling.
      steps:
        - uuid: 'c0d9e8f7-a6b5-4c4d-be0f-3a2b1c0d9e8f'
          status: 'todo'
          name: '1. Update AppShell Store with Profile Pane State'
          reason: |
            We need to add state for the new profile pane (`isMessagingProfileCollapsed`, `messagingProfileWidth`, `isResizingMessagingProfile`) and corresponding actions to manipulate it. This is the foundation for the entire feature.
          files:
            - 'src/store/appShell.store.ts'
          operations:
            - "In the `AppShellState` interface, add three new properties: `isMessagingProfileCollapsed: boolean`, `messagingProfileWidth: number`, and `isResizingMessagingProfile: boolean`."
            - "In the `AppShellActions` interface, add the corresponding setters: `toggleMessagingProfileCollapsed: () => void`, `setMessagingProfileWidth: (payload: number) => void`, and `setIsResizingMessagingProfile: (payload: boolean) => void`."
            - "In the `defaultState` object, initialize these new properties: `isMessagingProfileCollapsed: false`, `messagingProfileWidth: 384`, and `isResizingMessagingProfile: false`."
            - "Implement the new actions in the store creation logic. `toggleMessagingProfileCollapsed` flips the boolean. `setMessagingProfileWidth` updates the width with sane min/max bounds (e.g., min 320, max window width - 400). `setIsResizingMessagingProfile` sets the resizing flag."
      context_files:
        compact:
          - 'src/store/appShell.store.ts'
        medium:
          - 'src/store/appShell.store.ts'
        extended:
          - 'src/store/appShell.store.ts'

    - uuid: 'd1e0f9a8-b7c6-4d5e-af1a-4b3c2d1e0f9a'
      status: 'todo'
      name: 'Part 2: Implement Profile Pane Resizing Hook'
      reason: |
        To allow users to resize the `ContactProfile` pane, we'll create a dedicated React hook. This encapsulates the complex logic of handling mouse events for resizing, keeping our layout components clean.
      steps:
        - uuid: 'e2f1a0b9-c8d7-4e6f-be2b-5c4d3e2f1a0b'
          status: 'todo'
          name: '1. Create useResizableMessagingProfile Hook'
          reason: |
            This new hook, `useResizableMessagingProfile`, will mirror the functionality of existing resizer hooks. It will listen for mouse movements when resizing is active and update the profile pane's width in the global store.
          files:
            - 'src/hooks/useResizablePanes.hook.ts'
          operations:
            - "Export a new function `useResizableMessagingProfile(containerRef: React.RefObject<HTMLDivElement>)`."
            - "Inside the hook, get `isResizingMessagingProfile` from `useAppShellStore`."
            - "Get the `setMessagingProfileWidth` and `setIsResizingMessagingProfile` actions from the store."
            - "Use a `useEffect` hook that attaches `mousemove` and `mouseup` event listeners to the `window` only when `isResizingMessagingProfile` is true."
            - "The `mousemove` handler will calculate the new width based on the cursor's X position relative to the right edge of the *container* (`containerRect.right - e.clientX`) and call `setMessagingProfileWidth`."
            - "The `mouseup` handler will set `isResizingMessagingProfile` to `false` and clean up the event listeners."
      context_files:
        compact:
          - 'src/hooks/useResizablePanes.hook.ts'
        medium:
          - 'src/hooks/useResizablePanes.hook.ts'
          - 'src/store/appShell.store.ts'
        extended:
          - 'src/hooks/useResizablePanes.hook.ts'
          - 'src/store/appShell.store.ts'

    - uuid: '0abf88c1-6e3a-4f9e-8d7b-1a2b3c4d5e6f'
      status: 'todo'
      name: 'Part 3: Create and Integrate Messaging Content Container'
      reason: |
        This is the core of the refactor. We will create a new component, `MessagingContent`, to manage the layout of the message thread and the contact profile. We will then update our hooks and pages to use this new component, ensuring the logic is correctly placed for both split-view and full-page scenarios.
      steps:
        - uuid: '1cde2f3a-7b4d-4a0f-9e8d-2b3c4d5e6f7a'
          status: 'todo'
          name: '1. Create the MessagingContent Component'
          reason: |
            This new component will act as a dedicated layout manager for the messaging thread and profile, containing all the logic for resizing and collapsing.
          files:
            - 'src/pages/Messaging/components/MessagingContent.tsx' # This is a new file to be created.
          operations:
            - "Create a new file: `src/pages/Messaging/components/MessagingContent.tsx`."
            - "The component, `MessagingContent`, should accept `conversationId?: string` as a prop."
            - "Import `MessageThread`, `ContactProfile`, `useAppShellStore`, and the new `useResizableMessagingProfile` hook."
            - "Inside the component, get all relevant state from the store: `isMessagingProfileCollapsed`, `messagingProfileWidth`, `isResizingMessagingProfile`, and the `setIsResizingMessagingProfile` action."
            - "The component will return a main container `div` with `className='h-full w-full flex'`. This `div` should have a `ref`."
            - "Call `useResizableMessagingProfile` with the container's `ref`."
            - "Inside the main container, render three elements: a `div` for `MessageThread` (with `className='flex-1 min-w-0'`), a resizer `div`, and a `div` for `ContactProfile`."
            - "The `ContactProfile` wrapper `div` should have its width controlled by state: `style={{ width: isMessagingProfileCollapsed ? 0 : messagingProfileWidth }}` and have transition classes."
            - "The resizer `div` should only be visible when the profile is not collapsed and its `onMouseDown` should trigger `setIsResizingMessagingProfile(true)`."
      context_files:
        compact:
          - 'src/store/appShell.store.ts'
          - 'src/hooks/useResizablePanes.hook.ts'
          - 'src/pages/Messaging/components/MessageThread.tsx'
          - 'src/pages/Messaging/components/ContactProfile.tsx'
        medium:
          - 'src/store/appShell.store.ts'
          - 'src/hooks/useResizablePanes.hook.ts'
          - 'src/pages/Messaging/components/MessageThread.tsx'
          - 'src/pages/Messaging/components/ContactProfile.tsx'
        extended:
          - 'src/store/appShell.store.ts'
          - 'src/hooks/useResizablePanes.hook.ts'
          - 'src/pages/Messaging/components/MessageThread.tsx'
          - 'src/pages/Messaging/components/ContactProfile.tsx'
          - 'src/pages/Messaging/index.tsx'

        - uuid: '2def3a4b-8c5e-4b1g-0f9e-3c4d5e6f7a8b'
          status: 'todo'
          name: '2. Update Right Pane Hook to use MessagingContent'
          reason: |
            To make the split view work, the `useRightPaneContent` hook must be updated to render our new `MessagingContent` container instead of just the `MessageThread`.
          files:
            - 'src/hooks/useRightPaneContent.hook.tsx'
          operations:
            - "Import the new `MessagingContent` component."
            - "In the `contentMap`, when the key is `'messaging'`, change the `content` property to render `<MessagingContent conversationId={conversationId} />`."
            - "Update the `useMemo` block that calculates `meta` and `content`. When `sidePaneContent === 'messaging'`, it should return `{ meta: contentMap.messaging, content: <MessagingContent conversationId={conversationId} /> }`."
            - "Remove the direct import of `MessageThread` as it's no longer used in this hook."
      context_files:
        compact:
          - 'src/hooks/useRightPaneContent.hook.tsx'
        medium:
          - 'src/hooks/useRightPaneContent.hook.tsx'
          - 'src/pages/Messaging/components/MessagingContent.tsx' # new file
        extended:
          - 'src/hooks/useRightPaneContent.hook.tsx'
          - 'src/pages/Messaging/components/MessagingContent.tsx'
          - 'src/store/appShell.store.ts'

        - uuid: '3ef4a5b-9d6f-4c2h-1g0f-4d5e6f7a8b9c'
          status: 'todo'
          name: '3. Refactor MessagingPage to use MessagingContent'
          reason: |
            To ensure a consistent UI, the full `/messaging` page should also use the new `MessagingContent` component, simplifying its own layout logic.
          files:
            - 'src/pages/Messaging/index.tsx'
          operations:
            - "Import the new `MessagingContent` component."
            - "Remove the direct import of `ContactProfile`."
            - "In the return statement, replace the direct rendering of `ContactProfile` with `<MessagingContent conversationId={conversationId} />`."
            - "The main flex container in `MessagingPage` should now contain only two children: the `div` for `ConversationList` and the new `MessagingContent` component."
            - "Remove the resizing logic and state related to the profile pane from this page, as it's now handled inside `MessagingContent`."
      context_files:
        compact:
          - 'src/pages/Messaging/index.tsx'
        medium:
          - 'src/pages/Messaging/index.tsx'
          - 'src/pages/Messaging/components/MessagingContent.tsx'
        extended:
          - 'src/pages/Messaging/index.tsx'
          - 'src/pages/Messaging/components/MessagingContent.tsx'
          - 'src/pages/Messaging/components/ConversationList.tsx'

    - uuid: 'b5c4d3e2-f1a0-4b9i-dh5e-8f7a6b5c4d3e'
      status: 'todo'
      name: 'Part 4: Add Profile Pane Toggle Control'
      reason: |
        A feature isn't complete until the user can actually use it. We'll make the `MessageThread` header clickable to toggle the `ContactProfile` pane, providing a clean, button-less user experience.
      steps:
        - uuid: 'c6d5e4f3-a2b1-4c0j-ei6f-9a8b7c6d5e4f'
          status: 'todo'
          name: '1. Make MessageThread Header Clickable'
          reason: |
            Using the entire header as a click target is an elegant solution. We'll add an `onClick` handler and a visual state indicator (an icon) directly into the header flow, avoiding the need for a separate button.
          files:
            - 'src/pages/Messaging/components/MessageThread.tsx'
          operations:
            - "Import `PanelRightClose` and `PanelRightOpen` from `lucide-react`."
            - "Import `useAppShellStore` from `'@/store/appShell.store'`."
            - "In the `MessageThread` component, get `isMessagingProfileCollapsed` state and `toggleMessagingProfileCollapsed` action from the `useAppShellStore`."
            - "Locate the main header `div` (the one with the class `flex items-center gap-3...`)."
            - "Add an `onClick` handler to this `div` that calls `toggleMessagingProfileCollapsed`."
            - "Using the `cn` utility, add `cursor-pointer` and `group` classes to this same `div`."
            - "At the end of the header `div`'s children, right after the `<ChannelIcon />`, add the state indicator icon."
            - "Conditionally render the icon: `{isMessagingProfileCollapsed ? <PanelRightOpen ... /> : <PanelRightClose ... />}`."
            - "Style the icon with `className='w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors ml-auto'` to make it respond to the header hover state and align to the right."
      context_files:
        compact:
          - 'src/pages/Messaging/components/MessageThread.tsx'
        medium:
          - 'src/pages/Messaging/components/MessageThread.tsx'
          - 'src/store/appShell.store.ts'
        extended:
          - 'src/pages/Messaging/components/MessageThread.tsx'
          - 'src/store/appShell.store.ts'
          - 'src/pages/Messaging/components/MessagingContent.tsx'

  conclusion: |
    This corrected plan is laser-focused on the user's requirement. By creating a dedicated `MessagingContent` component, we encapsulate the complex layout logic and apply it correctly within the `RightPane` for split view. This ensures the main app shell remains untouched while delivering a powerful, flexible, and intuitive enhancement to the messaging feature exactly where it's needed.
  context_files:
    compact:
      - 'src/store/appShell.store.ts'
      - 'src/hooks/useResizablePanes.hook.ts'
      - 'src/hooks/useRightPaneContent.hook.tsx'
      - 'src/pages/Messaging/index.tsx'
      - 'src/pages/Messaging/components/MessageThread.tsx'
    medium:
      - 'src/store/appShell.store.ts'
      - 'src/hooks/useResizablePanes.hook.ts'
      - 'src/hooks/useRightPaneContent.hook.tsx'
      - 'src/pages/Messaging/index.tsx'
      - 'src/pages/Messaging/components/MessageThread.tsx'
      - 'src/pages/Messaging/components/ContactProfile.tsx'
    extended:
      - 'src/store/appShell.store.ts'
      - 'src/hooks/useResizablePanes.hook.ts'
      - 'src/hooks/useRightPaneContent.hook.tsx'
      - 'src/pages/Messaging/index.tsx'
      - 'src/pages/Messaging/components/MessageThread.tsx'
      - 'src/pages/Messaging/components/ContactProfile.tsx'
      - 'src/components/layout/AppShell.tsx'
      - 'src/App.tsx'
```
