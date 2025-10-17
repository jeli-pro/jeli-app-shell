Here is the master architect plan for the code refactor.

```yaml
plan:
  uuid: 'f4a1b2c3-d5e6-4f7a-8b9c-0d1e2f3a4b5c'
  status: 'todo'
  title: 'Refactor: Enhance Messaging UI with Company & Colleague Context'
  introduction: |
    Alright, listen up. We're about to juice up the messaging page. Right now, it's a flat list of contacts, totally siloed. That's not how the real world works. People work for companies, they have colleagues. We're going to inject that reality right into the UI. This isn't just a facelift; it's about giving our users mission-critical context so they can see the whole chessboard, not just one piece.

    The plan is simple but slick. First, we'll beef up our data models and mock data generator to understand company structures. Think multiple contacts from "Acme Inc." showing up in the system. Then, we'll overhaul the `ContactInfoPanel` to make it a proper intel dashboard: who the person is, where they work, and crucially, who else we know from their company. We'll also sprinkle this company context into the main task list and header, so it's always front and center. Less clicking, more knowing. Let's build something sharp.
  parts:
    - uuid: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
      status: 'todo'
      name: 'Part 1: Bolster Data Layer with Company & Colleague Relationships'
      reason: |
        You can't build a skyscraper on a swamp. Before we touch a single pixel of UI, we need to get the data right. This part is about re-engineering our mock data and state management to properly model real-world company affiliations. If the data doesn't know about colleagues, the UI never will.
      steps:
        - uuid: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e'
          status: 'todo'
          name: '1. Refine Mock Data Generation for Company Grouping'
          reason: |
            Garbage in, garbage out. To build a "colleagues" feature, we need mock data that actually contains colleagues. We'll tweak our data generator to create clusters of contacts who work for the same company, making our dev environment mirror reality.
          files:
            - 'src/pages/Messaging/data/mockData.ts'
          operations:
            - "In `mockData.ts`, create a static array of about 5-7 company names using `faker.company.name()`."
            - "Modify the `generateContacts` function. Instead of generating a new company for every contact, have it randomly pick from the pre-defined company array. This will naturally create groups of contacts under the same company."
        - uuid: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6f7a'
          status: 'todo'
          name: '2. Implement State Logic for Colleague Retrieval'
          reason: |
            The UI needs a clean API to ask, "who else works at this company?". Shoving this logic into a component is messy. We'll add a dedicated selector to our Zustand store to handle this, keeping our data logic centralized and our components dumb and happy.
          files:
            - 'src/pages/Messaging/store/messaging.store.ts'
            - 'src/pages/Messaging/types.ts'
          operations:
            - "In `src/pages/Messaging/types.ts`, inside the `Contact` interface, ensure `company` and `role` are non-optional `string` types. They're already there, we're just confirming their importance."
            - "In `src/pages/Messaging/store/messaging.store.ts`, add a new function to the `MessagingActions` interface: `getContactsByCompany: (companyName: string, currentContactId: string) => Contact[];`"
            - "Implement the `getContactsByCompany` function in the store's `create` block. It should take a `companyName` and `currentContactId`, then filter `state.contacts` to return all contacts with a matching company name, excluding the current contact."
      context_files:
        compact:
          - 'src/pages/Messaging/data/mockData.ts'
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/pages/Messaging/types.ts'
        medium:
          - 'src/pages/Messaging/data/mockData.ts'
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/pages/Messaging/types.ts'
        extended:
          - 'src/pages/Messaging/data/mockData.ts'
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/pages/Messaging/types.ts'
    - uuid: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8b'
      status: 'todo'
      name: 'Part 2: Integrate Company Context into Core Messaging UI'
      reason: |
        With a solid data foundation, it's time for the payoff. This part is all about weaving the new company and colleague context into the UI. We'll make the information impossible to miss, turning our flat messaging interface into a rich, interconnected relationship map.
      steps:
        - uuid: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8b9c'
          status: 'todo'
          name: '1. Overhaul Contact Info Panel for Richer Context'
          reason: |
            The `ContactInfoPanel` is currently just a digital business card. We're turning it into an intelligence briefing. It will become the go-to place for understanding not just the person, but their entire organizational context.
          files:
            - 'src/pages/Messaging/components/ContactInfoPanel.tsx'
          operations:
            - "Import `useMessagingStore` and `Avatar` components."
            - "Fetch colleagues using the new store function: `const colleagues = useMessagingStore(state => state.getContactsByCompany(contact.company, contact.id));`"
            - "Restructure the panel's JSX. Create a prominent header showing the contact's `Avatar`, `name`, `role`, and `company`. Make the name the hero element."
            - "Add a new 'Colleagues' section. If `colleagues.length > 0`, map over the array and render each colleague as a list item, showing their `Avatar`, `name`, and `role`. This provides an instant view of the whole team."
            - "Group the existing email and phone `DetailRow`s under a new 'Contact Details' sub-header for better organization."
        - uuid: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8b9c0d'
          status: 'todo'
          name: '2. Surface Company Info in Task Header and List'
          reason: |
            Context is useless if it's buried. We need to surface the company name in high-velocity areas like the main task list and the active conversation header. This gives users instant context without forcing a click, which is a massive efficiency win.
          files:
            - 'src/pages/Messaging/components/TaskHeader.tsx'
            - 'src/pages/Messaging/components/TaskList.tsx'
          operations:
            - "In `TaskHeader.tsx`, modify the contact display. Under the main contact name (`task.contact.name`), add their company name with an '@' prefix, like `@ ${task.contact.company}`, styled as secondary text."
            - "In `TaskList.tsx`, locate the `Link` component that wraps each task. Find where the contact's name is rendered and update it to a format like `{task.contact.name} · {task.contact.company}` to show the company inline."
      context_files:
        compact:
          - 'src/pages/Messaging/components/ContactInfoPanel.tsx'
          - 'src/pages/Messaging/components/TaskHeader.tsx'
          - 'src/pages/Messaging/components/TaskList.tsx'
        medium:
          - 'src/pages/Messaging/components/ContactInfoPanel.tsx'
          - 'src/pages/Messaging/components/TaskHeader.tsx'
          - 'src/pages/Messaging/components/TaskList.tsx'
          - 'src/pages/Messaging/store/messaging.store.ts'
        extended:
          - 'src/pages/Messaging/components/ContactInfoPanel.tsx'
          - 'src/pages/Messaging/components/TaskHeader.tsx'
          - 'src/pages/Messaging/components/TaskList.tsx'
          - 'src/pages/Messaging/store/messaging.store.ts'
          - 'src/pages/Messaging/types.ts'
          - 'src/pages/Messaging/data/mockData.ts'
  conclusion: |
    Once this is done, the messaging page will be on another level. We're moving beyond a simple to-do list and into a proper command center. Users will have the organizational context they need baked right into their workflow. This refactor delivers a smarter, faster, and more intuitive experience, making the whole product feel more powerful and cohesive. It's a strategic upgrade, not just a cosmetic one.
  context_files:
    compact:
      - 'src/pages/Messaging/types.ts'
      - 'src/pages/Messaging/data/mockData.ts'
      - 'src/pages/Messaging/store/messaging.store.ts'
      - 'src/pages/Messaging/components/ContactInfoPanel.tsx'
      - 'src/pages/Messaging/components/TaskHeader.tsx'
      - 'src/pages/Messaging/components/TaskList.tsx'
    medium:
      - 'src/pages/Messaging/types.ts'
      - 'src/pages/Messaging/data/mockData.ts'
      - 'src/pages/Messaging/store/messaging.store.ts'
      - 'src/pages/Messaging/components/ContactInfoPanel.tsx'
      - 'src/pages/Messaging/components/TaskHeader.tsx'
      - 'src/pages/Messaging/components/TaskList.tsx'
      - 'src/pages/Messaging/index.tsx'
    extended:
      - 'src/pages/Messaging/types.ts'
      - 'src/pages/Messaging/data/mockData.ts'
      - 'src/pages/Messaging/store/messaging.store.ts'
      - 'src/pages/Messaging/components/ContactInfoPanel.tsx'
      - 'src/pages/Messaging/components/TaskHeader.tsx'
      - 'src/pages/Messaging/components/TaskList.tsx'
      - 'src/pages/Messaging/index.tsx'
      - 'src/pages/Messaging/components/TaskDetail.tsx'
```
