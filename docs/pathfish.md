✔ Written: src/views/viewRegistry.ts (+111, -0)
✔ Written: src/components/layout/ViewRenderer.tsx (+56, -0)
✔ Written: src/components/layout/MainContent.tsx (+11, -10)
✔ Written: src/components/layout/RightPane.tsx (+19, -26)
✔ Deleted: src/components/layout/ViewModeSwitcher.tsx:81:31 - error TS2322: Type '"dataItemDetail"' is not assignable to type '"settings" | "toaster" | "notifications" | "messaging" | "details" | "main" | "dataDemo" | "dataItem"'.

81       messaging: 'messaging', dataItemDetail: 'dataItemDetail',
                                 ~~~~~~~~~~~~~~

src/components/layout/ViewRenderer.tsx:1:1 - error TS6133: 'React' is declared but its value is never read.

1 import React from 'react';
  ~~~~~~~~~~~~~~~~~~~~~~~~~~

src/components/layout/ViewRenderer.tsx:19:40 - error TS2345: Argument of type 'string | null' is not assignable to parameter of type 'string | undefined'.
  Type 'null' is not assignable to type 'string | undefined'.

19   const selectedItem = useSelectedItem(pathItemId || sidePaneItemId);
                                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/features/dynamic-view/components/shared/DetailPanel.tsx:18:46 - error TS6196: 'DetailViewSection' is declared but never used.

18 import type { GenericItem, DetailViewConfig, DetailViewSection } from '../../types'
                                                ~~~~~~~~~~~~~~~~~

src/features/dynamic-view/components/shared/DetailPanel.tsx:53:26 - error TS2345: Argument of type 'readonly DetailViewSection<TFieldId>[]' is not assignable to parameter of type 'DetailViewSection<TFieldId>[]'.
  The type 'readonly DetailViewSection<TFieldId>[]' is 'readonly' and cannot be assigned to the mutable type 'DetailViewSection<TFieldId>[]'.

53         return arrayMove(currentSections, oldIndex, newIndex);
                            ~~~~~~~~~~~~~~~

src/features/dynamic-view/components/shared/EditableField.tsx:139:48 - error TS2352: Conversion of type '{ assignee: { name: string; email: string; avatar: string; }; }' to type 'TItem' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  'TItem' could be instantiated with an arbitrary type which could be unrelated to '{ assignee: { name: string; email: string; avatar: string; }; }'.

139                           <FieldRenderer item={{ assignee: user } as TItem} fieldId={'assignee' as TFieldId} />
                                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/features/dynamic-view/components/shared/EventTooltipContent.tsx:12:11 - error TS2339: Property 'config' does not exist on type '{ statusField: string; priorityField: string; assigneeField: string; dateField: string; }'.

12   const { config } = {
             ~~~~~~

src/features/dynamic-view/components/shared/EventTooltipContent.tsx:15:5 - error TS2353: Object literal may only specify known properties, and 'statusField' does not exist in type '{ config: any; }'.

15     statusField: 'status',
       ~~~~~~~~~~~

src/features/dynamic-view/components/shared/EventTooltipContent.tsx:16:5 - error TS2353: Object literal may only specify known properties, and 'priorityField' does not exist in type '{ config: any; }'.

16     priorityField: 'priority',
       ~~~~~~~~~~~~~

src/features/dynamic-view/components/shared/EventTooltipContent.tsx:17:5 - error TS2353: Object literal may only specify known properties, and 'assigneeField' does not exist in type '{ config: any; }'.

17     assigneeField: 'assignee',
       ~~~~~~~~~~~~~

src/features/dynamic-view/components/shared/EventTooltipContent.tsx:18:5 - error TS2353: Object literal may only specify known properties, and 'dateField' does not exist in type '{ config: any; }'.

18     dateField: 'dueDate'
       ~~~~~~~~~

src/pages/Messaging/components/ActivityFeed.tsx:1:8 - error TS6133: 'React' is declared but its value is never read.

1 import React, { forwardRef } from 'react';
         ~~~~~

src/pages/Messaging/components/TaskList.tsx:150:77 - error TS2322: Type '{ className: string; title: string; }' is not assignable to type 'IntrinsicAttributes & LucideProps'.
  Property 'title' does not exist on type 'IntrinsicAttributes & LucideProps'.

150                           {isHandledByOther && <Eye className="w-3.5 h-3.5" title="Being handled by another user" />}
                                                                                ~~~~~

src/pages/Messaging/index.tsx:3:1 - error TS6133: 'useAppShellStore' is declared but its value is never read.

3 import { useAppShellStore } from "@/store/appShell.store";
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/pages/Messaging/index.tsx:54:9 - error TS6133: 'conversationId' is declared but its value is never read.

54   const { conversationId } = useParams<{ conversationId?: string }>();
           ~~~~~~~~~~~~~~~~~~


Found 15 errors.

error: "tsc" exited with code 1src/hooks/useRightPaneContent.hook.tsx
✔ Written: src/App.tsx (+49, -59)
`
