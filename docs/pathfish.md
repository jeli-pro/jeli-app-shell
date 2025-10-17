Here's the plan, hot off the presses. We're about to supercharge the messaging demo. The current state is a ghost town; we're turning it into a bustling metropolis of user interaction. This is a two-pronged attack: first, we're injecting a massive amount of realistic, generated data to make the app feel alive. Forget a dozen conversations, we're talking hundreds, each with deep history.

Second, we're evolving the `JourneyScrollbar` from a simple timeline into a meaningful customer journey map. It'll track the entire lifecycle—from initial contact and ordering to complaints and repeat business. Users will be able to see the entire story of a conversation at a glance. This isn't just about more data; it's about smarter, more insightful data visualization. We'll rip out the hardcoded mock data, replace it with dynamic generators, and give the UI the spit-and-polish it needs to handle the new depth.

The result will be a demo that doesn't just show features but tells a story. It'll be more robust, more impressive, and a hell of a lot more convincing. Let's get to it.

```yaml
plan:
  uuid: '3a1c8b9d-4e2f-4a6c-8b1e-9f0d7c5a3b21'
  status: 'todo'
  title: 'Refactor: Supercharge Messaging Demo with Voluminous Data and Enhanced Journey Mapping'
  introduction: |
    This refactoring plan aims to dramatically enhance the Messaging feature's demo capabilities. The current implementation uses a sparse, static set of mock data, which fails to showcase the application's potential for handling high-volume, complex user interactions.

    The strategy is twofold. First, we will replace the hardcoded mock data with a robust generation system capable of producing a large and varied dataset—increasing the number of tasks by 20x and populating them with hundreds of messages. This will create a more realistic and performance-testing environment.

    Second, we will enrich the data model and UI for the customer journey. The `JourneyScrollbar` will be upgraded to map distinct stages of customer interaction, such as 'Consult', 'Order', 'Delivered', and 'Complain', complete with unique icons. This transforms it from a simple progress bar into a powerful narrative tool, allowing users to instantly grasp the context of a conversation.
  parts:
    - uuid: 'b4d2c1a0-9e8f-4b1a-8c7d-6e3f2a1b0c9e'
      status: 'todo'
      name: 'Part 1: Evolve Data Model for Richer Customer Journeys'
      reason: |
        Before we can generate more data, we need to expand the data model to support a more detailed customer journey. This involves updating the types to include more nuanced stages of a customer interaction, which is foundational for the subsequent data generation and UI enhancements.
      steps:
        - uuid: 'c5e1f0a9-8d7c-4b3a-9e1f-0a9b8c7d6e5f'
          status: 'todo'
          name: '1. Expand JourneyPointType'
          reason: |
            To accurately model a customer's lifecycle, the existing `JourneyPointType` needs to be more comprehensive. We'll add key stages like 'Delivered' and 'Follow-up' to create a more complete narrative.
          files:
            - 'src/pages/Messaging/types.ts'
          operations:
            - "In `src/pages/Messaging/types.ts`, modify the `JourneyPointType`."
            - "Expand the type definition from `'Consult' | 'Order' | 'Complain' | 'Reorder'` to `'Consult' | 'Order' | 'Delivered' | 'Complain' | 'Reorder' | 'Follow-up'`."
      context_files:
        compact:
          - 'src/pages/Messaging/types.ts'
        medium:
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/Messaging/data/mockData.ts'
        extended:
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/Messaging/data/mockData.ts'
          - 'src/pages/Messaging/components/JourneyScrollbar.tsx'

    - uuid: 'a1b0c9d8-7e6f-4a5b-9c8d-1e2f3a4b5c6d'
      status: 'todo'
      name: 'Part 2: Implement High-Volume Mock Data Generation'
      reason: |
        The current static mock data is a major bottleneck for demonstrating the app's capabilities. Replacing it with a programmatic generator will allow us to create a large, diverse, and realistic dataset that properly simulates a production environment. This part focuses on creating the generation logic and integrating the enhanced journey points.
      steps:
        - uuid: 'd9e8f7c6-5b4a-4c3d-8b2a-1c0d9e8f7c6b'
          status: 'todo'
          name: '1. Create Task and Message Generators'
          reason: |
            Manually creating hundreds of tasks and thousands of messages is not feasible. We will build generator functions to automate this process, allowing for easy scalability and variation in the mock data.
          files:
            - 'src/pages/Messaging/data/mockData.ts'
          operations:
            - "In `src/pages/Messaging/data/mockData.ts`, create a new function `generateTasks(count: number): Task[]` to programmatically create a large number of tasks."
            - "Modify the existing `generateMessages` function to accept a larger, variable count and to increase its output significantly."
            - "Remove the hardcoded `mockTasks` array and replace it with a call to the new generator, e.g., `export const mockTasks = generateTasks(100);`."
        - uuid: 'e7f6d5c4-3a2b-4d1c-9a0b-8e7f6d5c4b3a'
          status: 'todo'
          name: '2. Integrate Journey Points into Generated Data'
          reason: |
            The generated messages need to feel like real conversations. This step will inject the new journey points into the message data in a logical, sequential order to create coherent customer stories.
          files:
            - 'src/pages/Messaging/data/mockData.ts'
          operations:
            - "Inside the `generateMessages` function, define a logical sequence for journey points, such as `['Consult', 'Order', 'Delivered', 'Follow-up']`."
            - "Add logic to the message generation loop to strategically assign `journeyPoint` properties to certain messages, ensuring they appear in a plausible order within a single conversation."
            - "Introduce variability so that some conversations might end after 'Order', while others might include 'Complain' or 'Reorder' points."
      context_files:
        compact:
          - 'src/pages/Messaging/data/mockData.ts'
        medium:
          - 'src/pages/Messaging/data/mockData.ts'
          - 'src/pages/Messaging/types.ts'
        extended:
          - 'src/pages/Messaging/data/mockData.ts'
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/Messaging/store/messaging.store.ts'

    - uuid: 'f8c7b6a5-4d3e-4f2g-9h1i-2j3k4l5m6n7o'
      status: 'todo'
      name: 'Part 3: Enhance JourneyScrollbar UI with Icons'
      reason: |
        To make the new journey data immediately useful, the `JourneyScrollbar` UI needs to be updated. Adding distinct icons for each journey stage will provide at-a-glance context, making the feature more intuitive and visually appealing.
      steps:
        - uuid: '9a8b7c6d-5e4f-4g3h-9i2j-1k0l9m8n7p6q'
          status: 'todo'
          name: '1. Map Journey Points to Icons'
          reason: |
            Text-only tooltips are not enough. We will create a visual language for the customer journey by mapping each stage to a unique icon, improving usability and aesthetics.
          files:
            - 'src/pages/Messaging/components/JourneyScrollbar.tsx'
          operations:
            - "In `src/pages/Messaging/components/JourneyScrollbar.tsx`, import a set of icons from `lucide-react` corresponding to the journey stages (e.g., `MessageSquare` for 'Consult', `ShoppingCart` for 'Order', `PackageCheck` for 'Delivered', `Angry` for 'Complain')."
            - "Create a helper function or a constant map within the component, e.g., `getJourneyIcon(point: JourneyPointType)`, that returns the appropriate icon component for each journey point type."
            - "In the JSX for the `TooltipContent`, call this new helper function to render the icon next to the journey point's text label (`dot.message.journeyPoint`)."
            - "Style the tooltip content to have the icon and text aligned, for example, using a flex container with a gap."
      context_files:
        compact:
          - 'src/pages/Messaging/components/JourneyScrollbar.tsx'
        medium:
          - 'src/pages/Messaging/components/JourneyScrollbar.tsx'
          - 'src/pages/Messaging/types.ts'
        extended:
          - 'src/pages/Messaging/components/JourneyScrollbar.tsx'
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/Messaging/components/TaskDetail.tsx'

  conclusion: |
    Upon completion of this plan, the Messaging demo will be transformed from a proof-of-concept into a compelling, high-fidelity simulation of a real-world application. The massive increase in data volume will demonstrate the UI's performance and scalability, while the enhanced `JourneyScrollbar` will provide a powerful tool for narrative-driven data exploration. This refactor will significantly elevate the perceived value and robustness of the entire application shell.
  context_files:
    compact:
      - 'src/pages/Messaging/data/mockData.ts'
      - 'src/pages/Messaging/types.ts'
      - 'src/pages/Messaging/components/JourneyScrollbar.tsx'
    medium:
      - 'src/pages/Messaging/data/mockData.ts'
      - 'src/pages/Messaging/types.ts'
      - 'src/pages/Messaging/components/JourneyScrollbar.tsx'
      - 'src/pages/Messaging/components/TaskDetail.tsx'
      - 'src/pages/Messaging/store/messaging.store.ts'
    extended:
      - 'src/pages/Messaging/data/mockData.ts'
      - 'src/pages/Messaging/types.ts'
      - 'src/pages/Messaging/components/JourneyScrollbar.tsx'
      - 'src/pages/Messaging/components/TaskDetail.tsx'
      - 'src/pages/Messaging/store/messaging.store.ts'
      - 'src/pages/Messaging/index.tsx'
      - 'src/pages/Messaging/components/TaskList.tsx'
```
