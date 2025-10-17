Alright, let's get this done. We're about to give the activity feed a serious glow-up. That old, tired list is getting swapped for a slick, modern timeline component. This is a classic "replace-the-guts" refactor, making the UI not just look better but feel more professional.

The plan is simple: First, we lay the groundwork. This means bringing in a new Radix UI primitive for scroll areas, which our new timeline component needs. Then, we drop in the shiny new `Timeline` component itself, a self-contained piece of art. Finally, we'll rip out the old list from the `ActivityPanel` and wire up the new timeline, mapping the existing data to our new, superior presentation. This will be a huge win for readability and overall UX. No more boring lists of text.

The result will be a much more intuitive and visually engaging activity feed that clearly shows the sequence of events. Let's build something devs will actually want to look at.

```yaml
plan:
  uuid: '9a3d1c4e-6f8b-4b2a-8d7c-5e9f1a3b2c1d'
  status: 'todo'
  title: 'Refactor Messaging Activity Panel with a new Timeline Component'
  introduction: |
    This plan outlines the refactoring of the `ActivityPanel` within the messaging feature. The current implementation uses a basic list to display user activity, which is functional but lacks visual appeal and clarity.

    The goal is to replace this list with a new, reusable, and aesthetically pleasing `Timeline` component. This will significantly enhance the user experience by presenting activity events in a more structured and intuitive chronological format. The refactor involves adding the new component and its dependencies, and then integrating it into the `ActivityPanel` by transforming the existing data structure to fit the new component's API.
  parts:
    - uuid: 'f8b1e4a2-9c7d-4e5f-8a1b-3c6d9e0f2a4b'
      status: 'todo'
      name: 'Part 1: Prep the Scaffolding: Dependencies & New UI Primitives'
      reason: |
        Before we can build the new UI, we need the right tools and foundation. This means adding a new dependency for scrollable areas and creating the new reusable `Timeline` component and its `ScrollArea` dependency. These primitives will be essential for the UI upgrade.
      steps:
        - uuid: '1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e'
          status: 'todo'
          name: '1. Update package.json with new dependency'
          reason: |
            The new `ScrollArea` component, which is a dependency for the `Timeline` component's horizontal layout, requires the `@radix-ui/react-scroll-area` package. We need to add this to our `peerDependencies` to ensure the project has all necessary modules.
          files:
            - package.json
          operations:
            - "Add `'@radix-ui/react-scroll-area': '^1.0.5'` to the `peerDependencies` object in `package.json`. Keep the list alphabetized for cleanliness."
        - uuid: 'c7d8e9f0-1a2b-3c4d-5e6f-7a8b9c0d1e2f'
          status: 'todo'
          name: '2. Create new ScrollArea UI component'
          reason: |
            The `Timeline` component relies on a `ScrollArea` for its horizontal orientation. We'll create a standard `scroll-area.tsx` component in the `ui` directory, based on shadcn/ui conventions.
          files:
            - src/components/ui/scroll-area.tsx
          operations:
            - "Create a new file `src/components/ui/scroll-area.tsx`."
            - "Add the standard implementation for a `ScrollArea` and `ScrollBar` component using `@radix-ui/react-scroll-area`. This will be a self-contained, reusable component."
            - |
              ```typescript
              "use client"

              import * as React from "react"
              import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

              import { cn } from "@/lib/utils"

              const ScrollArea = React.forwardRef<
                React.ElementRef<typeof ScrollAreaPrimitive.Root>,
                React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
              >(({ className, children, ...props }, ref) => (
                <ScrollAreaPrimitive.Root
                  ref={ref}
                  className={cn("relative overflow-hidden", className)}
                  {...props}
                >
                  <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
                    {children}
                  </ScrollAreaPrimitive.Viewport>
                  <ScrollBar />
                  <ScrollAreaPrimitive.Corner />
                </ScrollAreaPrimitive.Root>
              ))
              ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

              const ScrollBar = React.forwardRef<
                React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
                React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
              >(({ className, orientation = "vertical", ...props }, ref) => (
                <ScrollAreaPrimitive.ScrollAreaScrollbar
                  ref={ref}
                  orientation={orientation}
                  className={cn(
                    "flex touch-none select-none transition-colors",
                    orientation === "vertical" &&
                      "h-full w-2.5 border-l border-l-transparent p-[1px]",
                    orientation === "horizontal" &&
                      "h-2.5 flex-col border-t border-t-transparent p-[1px]",
                    className
                  )}
                  {...props}
                >
                  <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
                </ScrollAreaPrimitive.ScrollAreaScrollbar>
              ))
              ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

              export { ScrollArea, ScrollBar }
              ```
        - uuid: '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d'
          status: 'todo'
          name: '3. Create new Timeline UI component'
          reason: |
            This is the core of the UI upgrade. We'll create the `timeline.tsx` file and populate it with the provided powerful, flexible implementation. This component will be the new foundation for displaying activity feeds.
          files:
            - src/components/ui/timeline.tsx
          operations:
            - "Create a new file at `src/components/ui/timeline.tsx`."
            - "Add the full source code for the `Timeline` component as provided in the problem description. This includes all variants, types, helper functions, and example components."
      context_files:
        compact:
          - package.json
          - src/components/ui/timeline.tsx
          - src/components/ui/scroll-area.tsx
        medium:
          - package.json
          - src/components/ui/timeline.tsx
          - src/components/ui/scroll-area.tsx
          - src/lib/utils.ts
        extended:
          - package.json
          - src/components/ui/timeline.tsx
          - src/components/ui/scroll-area.tsx
          - src/lib/utils.ts
          - tailwind.config.js
    - uuid: 'b9c8d7e6-f5a4-b3c2-d1e0-f9a8b7c6d5e4'
      status: 'todo'
      name: 'Part 2: Implement the UI Upgrade in ActivityPanel'
      reason: |
        With the new `Timeline` component ready, it's time to replace the old, plain list in the `ActivityPanel`. This will modernize the UI, making the activity feed more readable and visually appealing by connecting it to real application data.
      steps:
        - uuid: '4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c'
          status: 'todo'
          name: '1. Refactor ActivityPanel.tsx to use Timeline'
          reason: |
            This step guts the old component and replaces it with the new one. We'll add logic to transform the `activity` data into the format required by the `Timeline` component and render it, completely changing the look and feel of the panel.
          files:
            - src/pages/Messaging/components/ActivityPanel.tsx
          operations:
            - "Import the new `Timeline` component and its `TimelineItem` type from `'@/components/ui/timeline'`."
            - "Import the `useMemo` hook from React and `capitalize` from `'@/lib/utils'`."
            - "Remove the old `ActivityItem` component and its associated `iconMap`."
            - "Inside the `ActivityPanel` component, create a new `iconMap` with smaller icons (`className='w-3 h-3'`) suitable for the timeline component."
            - "Use the `useMemo` hook to transform the `contact.activity` prop into a `timelineItems` array that matches the `TimelineItem[]` type."
            - "The transformation logic should sort events by timestamp and map each `ActivityEvent` to a `TimelineItem`, setting the `id`, `title` (using `capitalize`), `description`, `timestamp`, `icon`, and a default `status`."
            - "Replace the old `.map` rendering logic with the `<Timeline />` component, passing the `timelineItems` to its `items` prop."
            - "Configure the `<Timeline />` component with `variant='compact'` and `timestampPosition='inline'` for a clean, dense look suitable for a side panel."
            - "Update the empty state message to be consistent."
      context_files:
        compact:
          - src/pages/Messaging/components/ActivityPanel.tsx
          - src/components/ui/timeline.tsx
        medium:
          - src/pages/Messaging/components/ActivityPanel.tsx
          - src/components/ui/timeline.tsx
          - src/pages/Messaging/types.ts
          - src/lib/utils.ts
        extended:
          - src/pages/Messaging/components/ActivityPanel.tsx
          - src/components/ui/timeline.tsx
          - src/pages/Messaging/types.ts
          - src/lib/utils.ts
          - src/pages/Messaging/components/MessagingContent.tsx
  conclusion: |
    Upon completion of this refactoring, the `ActivityPanel` will be significantly improved, offering a modern and intuitive user experience. We will have successfully introduced a new, reusable `Timeline` component into the UI library, which can be leveraged in other parts of the application. The messaging feature will be more polished, and the codebase will be cleaner with the old list implementation removed.
  context_files:
    compact:
      - package.json
      - src/components/ui/timeline.tsx
      - src/components/ui/scroll-area.tsx
      - src/pages/Messaging/components/ActivityPanel.tsx
    medium:
      - package.json
      - src/components/ui/timeline.tsx
      - src/components/ui/scroll-area.tsx
      - src/pages/Messaging/components/ActivityPanel.tsx
      - src/pages/Messaging/types.ts
      - src/lib/utils.ts
    extended:
      - package.json
      - src/components/ui/timeline.tsx
      - src/components/ui/scroll-area.tsx
      - src/pages/Messaging/components/ActivityPanel.tsx
      - src/pages/Messaging/types.ts
      - src/lib/utils.ts
      - src/pages/Messaging/components/MessagingContent.tsx
      - tailwind.config.js
```
