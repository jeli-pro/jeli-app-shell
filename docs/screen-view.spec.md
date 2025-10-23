### TL;DR

To accommodate complex, multi-pane layouts and granular user constraints, the `viewRegistry` will be elevated to a complete behavioral specification. It will define not only what a view is, but how it can be displayed, how it responds to different user interactions, and how it composes with other views. The view manager becomes a "dumb" executor of these declarative rules.

### Core Proposal: The "Hyper-Explicit" `viewRegistry`

We will add three key pieces of metadata to our view definitions:

1.  **`allowedBodyStates`**: An array of `bodyState`s a view is permitted to be in. The view manager will enforce this, defaulting to the first allowed state if an invalid transition is attempted.
2.  **`triggerBehaviors`**: An object mapping an interaction *source* (e.g., `iconClick`, `navClick`) to a specific *action* (`openPane`, `navigate`). This provides context-aware control.
3.  **`compositeView`**: For "app-within-an-app" layouts like Messaging, this defines what content should be in the `main` and `right` panes when this route is active. This is the key to the three-pane layout.

---

## Ideal Screen Views & Behavior (Based on Your Requirements)

### `dashboard`, `settings`, `notifications`

*   **Requirement:** Can be a full page, overlay, split view, or fullscreen. However, `settings` (from top bar icon) and `notifications` (from sidebar link) should default to opening as an overlay.
*   **Proposed Ideal Behavior:** These views are defined as maximally flexible, but with specific `triggerBehaviors` to override the default action based on the interaction source.
*   **`viewRegistry.tsx` Entries:**
    ```typescript
    dashboard: {
      id: 'dashboard',
      component: ..., title: 'Dashboard', icon: Home, isNavigable: true,
      renderTarget: ['main', 'pane'],
      allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
      defaultBehavior: 'navigate',
    },

    settings: {
      id: 'settings',
      component: ..., title: 'Settings', icon: Settings, isNavigable: true,
      renderTarget: ['main', 'pane'],
      allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
      defaultBehavior: 'navigate', // Default for command palette, etc.
      triggerBehaviors: {
        iconClick: 'openPane', // <-- Rule for TopBar icon
      },
    },

    notifications: {
      id: 'notifications',
      component: ..., title: 'Notifications', icon: Bell, isNavigable: true,
      renderTarget: ['main', 'pane'],
      allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
      defaultBehavior: 'navigate',
      triggerBehaviors: {
        navClick: 'openPane', // <-- Rule for Sidebar link
      },
    },
    ```
*   **Rationale:** The `triggerBehaviors` object gives us the context-aware logic needed. When the `TopBar` settings icon is clicked, it calls `viewManager.trigger('settings', 'iconClick')`. The manager sees the override and runs `openPane('settings')`. A click from the command palette, lacking a specific trigger, uses `defaultBehavior: 'navigate'`.

### `messaging`

*   **Requirement:** A three-pane layout perceived as one screen. `[Pane 1: List | Pane 2: Thread] | [Pane 3: Context]`. It can only be a `split_view` or `fullscreen`. Individual panes can be fullscreened. The context pane (`Pane 3`) can be opened as a standalone overlay, but the entire view cannot be a single page.
*   **Proposed Ideal Behavior:** This is a "Composite View". We define a virtual `messaging` route that orchestrates the layout. The `AppShell`'s main content area will render `MessagingPage` (which contains Panes 1 & 2), and the `AppShell`'s right pane will render `MessagingContent` (Pane 3).
*   **`viewRegistry.tsx` Entries:**
    ```typescript
    // 1. The "Virtual" Route for the layout. This is what the user navigates to.
    messaging: {
      id: 'messaging',
      isNavigable: true, title: 'Messaging', icon: Inbox,
      renderTarget: [], // It doesn't render a component itself
      allowedBodyStates: ['split_view', 'fullscreen'], // <-- Enforces layout constraint
      defaultBehavior: 'openSplit',
      compositeView: { // <-- Defines the layout for the view manager
        main: 'messagingPage',
        right: 'messagingContextPanel',
      },
      onNavigate: { sidebar: SIDEBAR_STATES.COLLAPSED },
    },

    // 2. The component for the main content area (Panes 1 & 2)
    messagingPage: {
      id: 'messagingPage',
      component: MessagingPage, // The component with its own internal 2-pane resizer
      title: 'Inbox', isNavigable: false,
      renderTarget: ['main'],
      allowedBodyStates: ['split_view', 'fullscreen'],
      hasOwnScrolling: true,
    },

    // 3. The component for the right pane (Pane 3)
    messagingContextPanel: {
      id: 'messagingContextPanel',
      component: MessagingContent, // Refactored component for context
      title: 'Task Details', isNavigable: false,
      renderTarget: ['pane'],
      // Note: This pane can exist as a simple overlay if opened from another context
      allowedBodyStates: ['side_pane', 'split_view', 'fullscreen'],
    },
    ```
*   **Rationale:** This is the key insight. When `navigateTo('/messaging')` is called, the view manager sees `compositeView`. It automatically enforces `bodyState: 'split_view'`, sets the main view to `messagingPage`, and the right pane view to `messagingContextPanel`. The fullscreen buttons within `messagingPage` would call `toggleFullscreen('main')`, while a button in `messagingContextPanel` would call `toggleFullscreen('right')`, providing the required granular control.

### `dataItemDetail`

*   **Requirement:** Should be a page (have a URL), but its default presentation is an overlay. The user can then promote it to a full page, split view, or fullscreen.
*   **Proposed Ideal Behavior:** A contextually-triggered view that defaults to a pane but has permissions to exist in any layout.
*   **`viewRegistry.tsx` Entry:**
    ```typescript
    dataItemDetail: {
      id: 'dataItemDetail',
      component: DataDetailContent,
      title: 'Item Details', icon: FileText,
      isNavigable: false, // Not in main navigation
      renderTarget: ['main', 'pane'],
      allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
      defaultBehavior: 'openPane', // <-- Default action when triggered by onItemSelect
    },
    ```
*   **Rationale:** When a user clicks an item in `data-demo`, `onItemSelect` calls the view manager. The manager sees `defaultBehavior: 'openPane'` for `dataItemDetail` and constructs the URL (`?itemId=...`) to open it as an overlay. However, because `allowedBodyStates` includes `'normal'`, a user can manually navigate to `/data-demo/123` and the view manager will render it as a full page in the main content area, satisfying all requirements.
