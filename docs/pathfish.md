Alright, let's architect this refactor. We're gonna juice up the messaging experience. Two main goals: tighten up the timestamps like a good one-liner, and drop in a search feature so users aren't scrolling for days. This is about making the UI faster, both in performance and perception.

First, those verbose "about 5 minutes ago" timestamps gotta go. We'll replace them with a slick, short format like "5m ago". This is a classic HN-style tweak for information density. We'll cook up a new util function to handle this, then swap it in where needed. Quick, clean, and makes the whole message list feel more professional.

Next, we're tackling the endless scroll problem in message threads. A simple, powerful search bar is the answer. This will be a client-side implementation for speed. We'll add an input to the thread view, filter messages in real-time as the user types, and highlight the matches. It's a massive UX win that makes the feature feel complete.

Let's get this done.

```yaml
plan:
  uuid: 'f2d8a1c3-4b5e-4f6a-8b7c-9d0e1a2f3b4c'
  status: 'todo'
  title: 'Refactor Messaging UX: Concise Timestamps and Thread Search'
  introduction: |
    This master plan outlines a two-pronged enhancement for the messaging feature. The goal is to improve user experience by increasing information density and adding critical search functionality.

    First, we will replace the default, verbose time-ago formatting (`formatDistanceToNow`) with a more compact and scannable version (e.g., "5m ago" instead of "about 5 minutes ago"). This will be achieved by creating a new utility function that wraps the existing library and applies custom formatting rules. This change will be applied to both the message list and the activity feed within a conversation.

    Second, we will introduce a search functionality within individual message threads. This allows users to quickly find specific information in long conversations. A search input will be added to the task detail view, which will filter the displayed messages in real-time and highlight matching text. This is a crucial usability improvement for a core feature.
  parts:
    - uuid: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
      status: 'todo'
      name: 'Part 1: Implement Concise Time Formatting'
      reason: |
        The current timestamp format is too long for a high-density UI, reducing scannability. A shorter, more concise format improves readability and allows users to process information faster.
      steps:
        - uuid: 'b1c2d3e4-f5g6-7890-1234-567890abcdef'
          status: 'todo'
          name: '1. Create Utility for Short Timestamps'
          reason: |
            To ensure consistency and reusability, we'll centralize the time formatting logic in a new utility function.
          files:
            - 'src/lib/utils.ts'
          operations:
            - "Import `formatDistanceToNow` from `date-fns`."
            - "Create and export a new function `formatDistanceToNowShort(date: string | Date): string`."
            - "Inside the function, call `formatDistanceToNow` with the provided date and `{ addSuffix: true }`."
            - "Chain string replacement methods to shorten the output. For example, `.replace('about ', '')`, `.replace(' minutes', 'm')`, `.replace(' minute', 'm')`, etc."
            - "Handle the edge case for 'less than a minute ago' by returning 'now'."
        - uuid: 'c2d3e4f5-g6h7-8901-2345-67890abcdef'
          status: 'todo'
          name: '2. Update Task List View'
          reason: |
            To apply the new concise timestamp format to the list of conversations.
          files:
            - 'src/pages/Messaging/components/TaskList.tsx'
          operations:
            - "Remove the existing import for `formatDistanceToNow` from `date-fns`."
            - "Import the new `formatDistanceToNowShort` function from `@/lib/utils`."
            - "Find the usage of `formatDistanceToNow(new Date(task.lastActivity.timestamp))` and replace it with `formatDistanceToNowShort(new Date(task.lastActivity.timestamp))`."
        - uuid: 'd3e4f5g6-h7i8-9012-3456-7890abcdef'
          status: 'todo'
          name: '3. Update Activity Feed View'
          reason: |
            To apply the new concise timestamp format to individual messages within a conversation thread.
          files:
            - 'src/pages/Messaging/components/ActivityFeed.tsx'
          operations:
            - "Remove the existing import for `formatDistanceToNow` from `date-fns`."
            - "Import the new `formatDistanceToNowShort` function from `@/lib/utils`."
            - "Find the usage of `formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })` and replace it with `formatDistanceToNowShort(new Date(message.timestamp))`."
      context_files:
        compact:
          - 'src/lib/utils.ts'
          - 'src/pages/Messaging/components/TaskList.tsx'
          - 'src/pages/Messaging/components/ActivityFeed.tsx'
        medium:
          - 'src/lib/utils.ts'
          - 'src/pages/Messaging/components/TaskList.tsx'
          - 'src/pages/Messaging/components/ActivityFeed.tsx'
        extended:
          - 'src/lib/utils.ts'
          - 'src/pages/Messaging/components/TaskList.tsx'
          - 'src/pages/Messaging/components/ActivityFeed.tsx'
    - uuid: 'e6f7g8h9-i0j1-k2l3-m4n5-o6p7q8r9s0t'
      status: 'todo'
      name: 'Part 2: Implement In-Thread Search'
      reason: |
        Navigating long conversation histories is inefficient without a search function. This feature is a standard expectation and a significant usability improvement.
      steps:
        - uuid: 'f7g8h9i0-j1k2-l3m4-n5o6-p7q8r9s0t1u'
          status: 'todo'
          name: '1. Add Search UI and State to Task Detail'
          reason: |
            To provide the user with a visible control to initiate a search and to manage the search query within the component's state.
          files:
            - 'src/pages/Messaging/components/TaskDetail.tsx'
          operations:
            - "Import `useState`, `useMemo` from `react`, `Search` icon from `lucide-react`, and `Input` from `@/components/ui/input`."
            - "In the `TaskDetail` component, add a new state for the search query: `const [searchTerm, setSearchTerm] = useState('');`."
            - "Locate the `<TabsList>` component. Wrap it and a new search input inside a flex container: `<div className=\"flex items-center justify-between px-4 border-b\">`."
            - "Add a container for the search input with a relative position."
            - "Add the `Search` icon, absolutely positioned inside the input container."
            - "Add the `Input` component, binding its `value` and `onChange` to the `searchTerm` state. Add padding to prevent text from overlapping the icon."
            - "Adjust the `<TabsList>` styling to fit the new layout (e.g., `className=\"bg-transparent border-none p-0\"`)."
        - uuid: 'g8h9i0j1-k2l3-m4n5-o6p7-q8r9s0t1u2v'
          status: 'todo'
          name: '2. Filter Messages and Pass Search Term'
          reason: |
            To dynamically update the displayed message list based on the user's search query.
          files:
            - 'src/pages/Messaging/components/TaskDetail.tsx'
          operations:
            - "Create a memoized variable `filteredMessages` using `useMemo` that depends on `conversation.messages` and `searchTerm`."
            - "The filter logic should be case-insensitive: `messages.filter(msg => !searchTerm || msg.text.toLowerCase().includes(searchTerm.toLowerCase()))`."
            - "Find the `<ActivityFeed />` component invocation."
            - "Update its props to pass `messages={filteredMessages}` and add a new prop `searchTerm={searchTerm}`."
        - uuid: 'h9i0j1k2-l3m4-n5o6-p7q8-r9s0t1u2v3w'
          status: 'todo'
          name: '3. Implement Search Term Highlighting'
          reason: |
            To visually indicate to the user why a particular message is included in the search results, improving clarity.
          files:
            - 'src/pages/Messaging/components/ActivityFeed.tsx'
          operations:
            - "Update the `ActivityFeedProps` interface to accept an optional `searchTerm?: string`."
            - "Create a new internal component, `Highlight`, that accepts `text` and `highlight` string props."
            - "In the `Highlight` component, if `highlight` is empty, return the plain `text`."
            - "Otherwise, use a case-insensitive RegExp to split the `text` by the `highlight` term."
            - "Map over the resulting array, wrapping the matching parts in a `<mark>` tag with appropriate theme-aware styling (e.g., `className=\"bg-primary/20 rounded\"`)."
            - "In the `ActivityFeed`'s main render logic, replace where `message.text` is rendered with `<Highlight text={message.text} highlight={searchTerm} />`."
      context_files:
        compact:
          - 'src/pages/Messaging/components/TaskDetail.tsx'
          - 'src/pages/Messaging/components/ActivityFeed.tsx'
        medium:
          - 'src/pages/Messaging/components/TaskDetail.tsx'
          - 'src/pages/Messaging/components/ActivityFeed.tsx'
          - 'src/components/ui/input.tsx'
          - 'src/components/ui/tabs.tsx'
        extended:
          - 'src/pages/Messaging/components/TaskDetail.tsx'
          - 'src/pages/Messaging/components/ActivityFeed.tsx'
          - 'src/components/ui/input.tsx'
          - 'src/components/ui/tabs.tsx'
          - 'src/pages/Messaging/types.ts'
  conclusion: |
    Upon completion, the messaging feature will be significantly more polished and user-friendly. The concise timestamps will enhance readability across the board, making the UI feel quicker and more professional.

    The addition of in-thread search is a major functional upgrade, transforming the component from a simple message display into a powerful communication tool. This will directly improve user efficiency and satisfaction by reducing the time spent searching for information.
  context_files:
    compact:
      - 'src/lib/utils.ts'
      - 'src/pages/Messaging/components/TaskList.tsx'
      - 'src/pages/Messaging/components/ActivityFeed.tsx'
      - 'src/pages/Messaging/components/TaskDetail.tsx'
    medium:
      - 'src/lib/utils.ts'
      - 'src/pages/Messaging/components/TaskList.tsx'
      - 'src/pages/Messaging/components/ActivityFeed.tsx'
      - 'src/pages/Messaging/components/TaskDetail.tsx'
      - 'src/components/ui/input.tsx'
      - 'src/components/ui/tabs.tsx'
    extended:
      - 'src/lib/utils.ts'
      - 'src/pages/Messaging/components/TaskList.tsx'
      - 'src/pages/Messaging/components/ActivityFeed.tsx'
      - 'src/pages/Messaging/components/TaskDetail.tsx'
      - 'src/components/ui/input.tsx'
      - 'src/components/ui/tabs.tsx'
      - 'src/pages/Messaging/types.ts'
```
