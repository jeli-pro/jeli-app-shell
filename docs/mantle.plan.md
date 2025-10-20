

# Mantle ORM

> The Drizzle You Love, The Flexibility You Need.

Mantle is a developer experience (DX) toolkit for building highly flexible, item-centric applications with [Drizzle ORM](https://orm.drizzle.team/). It allows your product developers to write simple, familiar Drizzle schemas while persisting everything to a universal, EAV-style database structure.

-   **For Product Developers:** Write and query your models (`Task`, `Contact`, `Company`) as if they were real SQL tables. Get full type-safety, autocompletion, and a simple API.
-   **For Platform/Infra Teams:** Manage one single, stable, universal database schema that never needs migrations for new product features.

Mantle is the bridge between these two worlds.

---

## The Core Idea

The traditional EAV (Entity-Attribute-Value) pattern is incredibly flexible but notoriously painful to work with. Queries are complex, and you lose all the benefits of a typed ORM.

Mantle solves this with a **build-time code generator**.

1.  **You write a "logical schema"**: A simple file that looks and feels exactly like a normal Drizzle schema.
2.  **Mantle's CLI runs**: It reads your logical schema and does two things:
    a. **Persists Metadata**: It automatically creates the necessary rows in your universal `item_types` and `custom_field_definitions` tables.
    b. **Generates a Typed Repository**: It creates a fully-typed `TaskRepository.ts` file with `create`, `get`, `find`, `update`, and `delete` methods.
3.  **You use the repository**: Your application code imports the generated repository, which handles all the complex EAV joins under the hood, giving you back clean, typed objects.

```
+----------------------------+
| Developer writes:          |
|  `task.schema.ts`          |
| (Looks like Drizzle)       |
+----------------------------+
            |
            | runs...
            v
+----------------------------+
| `npx mantle-codegen`       |
| (The magic bridge)         |
+----------------------------+
            |
            | generates & upserts...
            v
+--------------------------+  +--------------------------------+
| Universal DB Tables      |  | Generated `task.repository.ts` |
| (`items`, `field_values`) |  | (Looks like a clean API)       |
+--------------------------+  +--------------------------------+
```

## Project Structure

Mantle is designed for a monorepo setup.

```
/
├── packages/
│   ├── db/
│   │   └── src/schema.ts     # The REAL, universal Drizzle schema (items, users, etc.)
│   ├── mantle-schemas/
│   │   └── src/
│   │       ├── task.schema.ts    # Dev-facing logical schema for Tasks
│   │       └── company.schema.ts # Dev-facing logical schema for Companies
│   ├── mantle-codegen/
│   │   └── src/cli.ts        # The CLI script that powers the system
│   └── mantle-repos/
│       └── src/              # << OUTPUT DIRECTORY >>
│           ├── task.ts       # Auto-generated Task repository
│           └── company.ts    # Auto-generated Company repository
└── mantle.config.ts          # Config file for the codegen CLI
```

## Quick Start

### 1. Installation

This assumes you already have Drizzle ORM and your universal `@your-org/db` package set up.

```bash
# Install the codegen tool
npm install @your-org/mantle-codegen --save-dev

# The repos package is a dependency for your app
npm install @your-org/mantle-repos
```

### 2. Create a Logical Schema

In your `mantle-schemas` package, define your entity.

`packages/mantle-schemas/src/task.schema.ts`:
```typescript
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from '@your-org/db/schema'; // Can reference real tables!

// This looks and feels exactly like a standard Drizzle schema definition.
export const tasks = pgTable('tasks', {
  id: varchar('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date'),

  // This column will be mapped to a 'USER' type custom field.
  // The value stored will be a user ID.
  assigneeId: varchar('assignee_id').references(() => users.id),
});
```

### 3. Configure the Codegen

Create a config file in your repository root.

`mantle.config.ts`:
```typescript
import { defineConfig } from '@your-org/mantle-codegen';

export default defineConfig({
  // Path to your dev-facing logical schemas
  schemaDir: './packages/mantle-schemas/src/ A glob pattern works here

  // Path to the output directory for generated repositories
  repoDir: './packages/mantle-repos/src',

  // Path to your universal DB schema for type generation
  dbSchemaPath: './packages/db/src/schema.ts',

  // A function to get your database instance for writing metadata
  dbProvider: () => import('./packages/db').then(m => m.db),
});
```

### 4. Run the Codegen

Execute the CLI. This is typically done in a CI/CD pipeline or as a pre-build step.

```bash
npx mantle-codegen
```

This will:
1.  Connect to your database and ensure an `item_type` for "Task" exists.
2.  Ensure `custom_field_definitions` for "title", "description", "dueDate", and "assigneeId" exist and are linked to the "Task" type.
3.  Generate the file `packages/mantle-repos/src/tasks.ts`.

### 5. Use the Generated Repository

Now, in your application code, you can use the clean, generated API.

```typescript
import { tasksRepo } from '@your-org/mantle-repos';

async function main() {
  const newTaskId = await tasksRepo.create({
    title: 'Implement the Mantle README',
    dueDate: new Date(),
    assigneeId: 'user_clerk_123abc',
  });

  console.log('Created new task:', newTaskId);

  const task = await tasksRepo.getById(newTaskId);

  if (task) {
    // `task` is fully typed!
    // { id: string, title: string, dueDate: Date | null, ... }
    console.log('Fetched Task:', task.title);
    console.log('Due:', task.dueDate?.toLocaleDateString());
  }
}
```

## The Developer Workflow

### How to Add a New Field

1.  **Edit the Schema**: Add a `priority` field to `packages/mantle-schemas/src/task.schema.ts`.
    ```typescript
    export const tasks = pgTable('tasks', {
      // ... existing fields
      priority: text('priority').default('Medium'), // e.g., 'Low', 'Medium', 'High'`
    ```
2.  **Re-run the Codegen**:
    ```bash
    npx mantle-codegen
    ```
    The CLI will detect the new `priority` field, create the corresponding `custom_field_definition` row in the database, and regenerate the `tasks.ts` repository.

3.  **Use the New Field**: The `create` and `getById` methods are now automatically updated.
    ```typescript
    // The `create` method now accepts `priority`
    await tasksRepo.create({
      title: 'Update documentation',
      priority: 'High', // <-- Your new field!
    });

    const task = await tasksRepo.getById('...');
    // The return type now includes `priority`
    console.log(task.priority); // "High"
    ```

### How to Create a New Model

1.  **Add a New Schema File**: Create `packages/mantle-schemas/src/company.schema.ts`.
    ```typescript
    import { pgTable, text, varchar } from 'drizzle-orm/pg-core';

    export const companies = pgTable('companies', {
      id: varchar('id').primaryKey(),
      name: text('name').notNull(),
      website: text('website'),
    });
    ```
2.  **Run Codegen**: `npx mantle-codegen`. A new `packages/mantle-repos/src/companies.ts` file will be generated.
3.  **Use It**: You can now import and use `companiesRepo` just like `tasksRepo`.

### How to Define Relations

Mantle's codegen understands Drizzle's `references()` syntax to create relationships between logical models.

Let's link a `Task` to a `Company`.

1.  **Add the Reference**: In `task.schema.ts`, reference the logical `companies` schema.
    ```typescript
    import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
    import { users } from '@your-org/db/schema';
    import { companies } from './company.schema'; // <-- Import the logical schema

    export const tasks = pgTable('tasks', {
      // ... existing fields
      companyId: varchar('company_id').references(() => companies.id),
    });
    ```
2.  **Run Codegen**: `npx mantle-codegen`.
3.  **Use the Relation**: The codegen automatically maps this to an `ITEM_RELATION` custom field type. The generated repository will now handle storing the company's item ID. Future versions will include helpers for automatic joins.

---

## Advanced Usage & Concepts

### Type Mapping

The codegen CLI uses a set of rules to map Drizzle schema column types to the universal schema's `custom_field_type` enum.

| Drizzle Column Type | Maps to `custom_field_type` | Stored `value` is... |
| :------------------ | :-------------------------- | :------------------- |
| `text`, `varchar`   | `TEXT`                      | The string itself.   |
| `integer`, `numeric`| `NUMBER`                    | The number as a string. |
| `timestamp`, `date` | `DATE`                      | An ISO 8601 string. |
| `boolean`           | `TEXT`                      | `'true'` or `'false'`. |
| `.references(() => users.id)` | `USER`            | The user's ID. |
| `.references(() => anotherMantleSchema.id)` | `ITEM_RELATION` | The related item's ID. |

### The Generated Repository

The generated code is meant to be a robust foundation. It provides:
-   `create(input)`: Creates the base item and all its custom field values in a single transaction.
-   `update(id, input)`: Updates the base item and upserts the specified custom field values.
-   `getById(id)`: Fetches an item and its values, pivoting the rows into a single, typed object.
-   `find(filter)`: A basic query builder for finding items based on their properties.
-   `delete(id)`: Deletes the base item, which cascades to all its values.

### Extending a Repository

The generated repositories are not meant to be edited by hand, as changes will be overwritten. For custom logic, use composition.

`packages/my-app/src/features/tasks/custom-task-logic.ts`:
```typescript
import { tasksRepo } from '@your-org/mantle-repos';

// Custom logic that uses the generated repo
export async function getTasksDueThisWeekForUser(userId: string) {
  const allTasks = await tasksRepo.find({
    where: { assigneeId: userId }
  });

  // Your custom filtering logic here...
  return allTasks.filter(task => /* ... */);
}
```

## Why Mantle?

This architecture strikes a deliberate balance. It acknowledges two truths:
1.  **Products need to evolve fast.** Hard-coding every new field into a SQL table and running migrations is too slow. A flexible, metadata-driven approach is required for user-facing features.
2.  **Developers need sanity.** Raw EAV queries are un-typed, error-prone, and kill productivity. A typed, predictable DX is non-negotiable.

Mantle provides the rigid, type-safe development contract on top of a fluid, dynamic database structure. It's the best of both worlds, with the cost of a single, fast build step.

## Contributing

Mantle is an internal toolset, but we welcome contributions. Key areas for improvement include:
-   **Improved Relational Queries**: Auto-generating `get...` methods that can "expand" related items (e.g., `tasksRepo.getById('...', { expand: ['company'] })`).
-   **More Sophisticated `find` Filters**: Supporting `gt`, `lt`, `in`, `contains` operators in the `where` clause.
-   **AST-based Relation Detection**: Making the relation detection more robust by parsing the Drizzle `relations()` helper in addition to `references()`.
