Alright, listen up. The current `DataCalendarView` is built like a brick shithouse - a static 7-column grid. That's fine for a wide open viewport, but our app shell is a dynamic beast. When panes slide in, that calendar gets squished into oblivion, making it useless.

The plan is to tear down that rigid structure and rebuild it with a responsive core. We'll make it aware of its own container size and let it intelligently reflow its columns from 7 down to a more mobile-friendly number. This means when a user opens a side pane, the calendar will gracefully adapt instead of becoming a cramped mess. We'll achieve this by first shipping a generic `useResizeObserver` hook, then putting it to work inside the calendar component to dynamically adjust the grid and headers for a slick, fluid user experience.

This refactor will make the calendar truly "app shell aware," ensuring it looks and works great no matter how the user configures their layout. It's a key step in making our UI components as flexible as the shell itself.

```yaml
plan:
  uuid: 'e8a1b2c3-d4e5-f6a7-b8c9-d0e1f2a3b4c5'
  status: 'todo'
  title: 'Make DataCalendarView Grid Responsive to Container Width'
  introduction: |
    Alright, listen up. The current `DataCalendarView` is built like a brick shithouse - a static 7-column grid. That's fine for a wide open viewport, but our app shell is a dynamic beast. When panes slide in, that calendar gets squished into oblivion, making it useless.

    The plan is to tear down that rigid structure and rebuild it with a responsive core. We'll make it aware of its own container size and let it intelligently reflow its columns from 7 down to a more mobile-friendly number. This means when a user opens a side pane, the calendar will gracefully adapt instead of becoming a cramped mess. We'll achieve this by first shipping a generic `useResizeObserver` hook, then putting it to work inside the calendar component to dynamically adjust the grid and headers for a slick, fluid user experience.

    This refactor will make the calendar truly "app shell aware," ensuring it looks and works great no matter how the user configures their layout. It's a key step in making our UI components as flexible as the shell itself.
  parts:
    - uuid: 'f7b6a5e4-d3c2-b1a0-9f8e-7d6c5b4a3f2e'
      status: 'todo'
      name: 'Part 1: Introduce a Generic `useResizeObserver` Hook'
      reason: |
        Before we can make anything responsive, we need a way to measure it. Hardcoding media queries is for chumps. We need a component to be aware of its *own* dimensions, not the entire viewport's. We're building a reusable `useResizeObserver` hook to do just that. It's a standard tool for the modern web dev arsenal, letting us write components that react to their local environment. Shipping this as a separate utility means we can reuse it anywhere else we need this kind of fine-grained responsiveness.
      steps:
        - uuid: 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6'
          status: 'todo'
          name: '1. Create `useResizeObserver.hook.ts`'
          reason: |
            First, we need the file. This hook is a new piece of infrastructure, so it gets its own file in the `hooks` directory. Clean, organized, and easy to find for the next person who needs it.
          files:
            - 'src/hooks/useResizeObserver.hook.ts'
          operations:
            - 'Create a new file at `src/hooks/useResizeObserver.hook.ts`.'
            - 'Implement a `useResizeObserver` hook that takes a React ref as an argument.'
            - 'The hook should use a `ResizeObserver` to watch the ref''s element.'
            - 'It should store the element''s `width` and `height` in a state variable.'
            - 'The hook will return the `dimensions` object `{ width, height }`.'
            - 'Ensure proper cleanup by calling `disconnect()` on the observer when the component unmounts.'
      context_files:
        compact:
          - 'src/hooks/useResizeObserver.hook.ts'
        medium:
          - 'src/hooks/useResizeObserver.hook.ts'
        extended:
          - 'src/hooks/useResizeObserver.hook.ts'
    - uuid: 'c5b4a3f2-e1d0-9c8b-7a6f-5e4d3c2b1a0f'
      status: 'todo'
      name: 'Part 2: Refactor `DataCalendarView` to be Responsive'
      reason: |
        With our new resize observer hook in hand, it's time for the main event: refactoring `DataCalendarView`. This is where we inject the responsive logic. We'll transform the static 7-day grid into a dynamic layout that calculates the optimal number of columns based on available space. We'll also cleverly adjust the UI to ensure it remains clear and usable, even with fewer columns, by conditionally showing weekday names within each day's cell. This avoids a confusing, misaligned header and keeps the calendar intuitive at any size.
      steps:
        - uuid: 'd4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7'
          status: 'todo'
          name: '1. Integrate `useResizeObserver` into `DataCalendarView`'
          reason: |
            We need to measure the container, so we're wrapping the calendar in a new `div` and attaching a ref to it. This ref will be the eyes for our `useResizeObserver` hook, telling us exactly how much space we have to play with at all times.
          files:
            - 'src/pages/DataDemo/components/DataCalendarView.tsx'
          operations:
            - "Import the new `useResizeObserver` hook."
            - "Create a new wrapper `div` that encloses the `CalendarHeader` and the main calendar grid."
            - "Create a `useRef` for this new wrapper `div`, let's call it `calendarContainerRef`."
            - "Call `useResizeObserver(calendarContainerRef)` to get the container's `width`."
        - uuid: 'e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8'
          status: 'todo'
          name: '2. Calculate Dynamic Column Count'
          reason: |
            This is the brain of the operation. We take the width from the observer and do some quick math to figure out the ideal column count. We'll establish a minimum width for each day cell to prevent them from becoming unreadably narrow, and clamp the result between a sensible min (e.g., 3 columns) and the max of 7. This logic is the key to the whole responsive transformation.
          files:
            - 'src/pages/DataDemo/components/DataCalendarView.tsx'
          operations:
            - 'Inside the `DataCalendarView` component, define a constant `MIN_DAY_WIDTH`, e.g., `160`.'
            - "Calculate the number of columns: `const numColumns = useMemo(() => { if (width === 0) return 7; const cols = Math.floor(width / MIN_DAY_WIDTH); return Math.max(3, Math.min(7, cols)); }, [width]);`."
            - "Using `useMemo` prevents recalculation on every render."
        - uuid: 'f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9'
          status: 'todo'
          name: '3. Adapt Grid Layout and Weekday Header'
          reason: |
            With our column count calculated, we need to apply it. We're ditching the static `grid-cols-7` Tailwind class in favor of dynamic inline styles on the grid containers. We'll also hide the main weekday header on smaller views where it would be misaligned and confusing. This step makes the layout physically adapt.
          files:
            - 'src/pages/DataDemo/components/DataCalendarView.tsx'
          operations:
            - 'Find the `weekdays.map` section. Wrap it in a conditional render: `{numColumns === 7 && ...}`.'
            - 'The parent `div` of the `days.map` loop (the one with `col-span-7 grid grid-cols-7`) needs to be modified.'
            - 'Remove the Tailwind grid classes (`col-span-7`, `grid`, `grid-cols-7`).'
            - 'Add an inline style to this `div`: `style={{ display: "grid", gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))` }}`.'
        - uuid: 'a7b8c9d0-e1f2-a3b4-c5d6-e7f8a9b0'
          status: 'todo'
          name: '4. Enhance Day Cells for Small Views'
          reason: |
            Hiding the main header on small views creates a context problem: which day of the week is which? To solve this, we'll enhance the individual day cells. When the main header is hidden, each cell will display a small weekday abbreviation (e.g., 'Mon', 'Tue') above the date number. This keeps the calendar perfectly readable and intuitive, regardless of how many columns are visible.
          files:
            - 'src/pages/DataDemo/components/DataCalendarView.tsx'
          operations:
            - 'Inside the `days.map` loop, locate the `span` that renders the day number: `{format(day, "d")}`.'
            - 'Wrap this `span` and add a new element to show the weekday name conditionally.'
            - "Replace the existing `span` with a `div` structure like this: `<div className='flex items-center gap-1 text-sm'><span className={cn('font-semibold', isToday(day) && 'text-primary-foreground')}>{numColumns < 7 ? format(day, 'eee') : ''}</span><span className={cn('font-semibold', !isToday(day) && 'text-muted-foreground', numColumns < 7 && 'text-foreground')}>{format(day, 'd')}</span></div>`."
            - 'Adjust the parent `div` of the day cell. Change `p-3` to `p-2`, add `flex-col`, and adjust alignment to `items-start` to accommodate the new text.'
            - 'Modify the `isToday` logic. Instead of wrapping the number, apply styles to the parent div or change text color to ensure visibility.'
            - 'The final structure for the day label should be something like: `<div className={cn("flex items-center justify-center font-semibold text-sm", isToday(day) && "w-7 h-7 rounded-full bg-primary text-primary-foreground")}>{numColumns < 7 && <span className="text-xs mr-1.5 opacity-70">{format(day, "eee")}</span>}{format(day, "d")}</div>`.'
      context_files:
        compact:
          - 'src/pages/DataDemo/components/DataCalendarView.tsx'
          - 'src/hooks/useResizeObserver.hook.ts'
        medium:
          - 'src/pages/DataDemo/components/DataCalendarView.tsx'
          - 'src/hooks/useResizeObserver.hook.ts'
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/types.ts'
        extended:
          - 'src/pages/DataDemo/components/DataCalendarView.tsx'
          - 'src/hooks/useResizeObserver.hook.ts'
          - 'src/pages/DataDemo/index.tsx'
          - 'src/pages/DataDemo/types.ts'
          - 'src/hooks/useAppViewManager.hook.ts'
          - 'src/lib/utils.ts'
  conclusion: |
    Once this refactor is deployed, the Data Calendar will be transformed from a static, fragile component into a robust, fluid part of our dynamic app shell. It will intelligently adapt to any container size, whether squeezed by a side pane or viewed on a smaller device. This not only fixes the immediate UI bug but also establishes a pattern for creating more resilient, container-aware components across the app. Users get a seamless experience, and we get a more flexible, future-proof codebase. Win-win.
  context_files:
    compact:
      - 'src/pages/DataDemo/components/DataCalendarView.tsx'
    medium:
      - 'src/pages/DataDemo/components/DataCalendarView.tsx'
      - 'src/pages/DataDemo/index.tsx'
    extended:
      - 'src/pages/DataDemo/components/DataCalendarView.tsx'
      - 'src/pages/DataDemo/index.tsx'
      - 'src/hooks/useAppViewManager.hook.ts'

```
