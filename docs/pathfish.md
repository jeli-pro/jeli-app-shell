src/features/dynamic-view/components/views/CalendarView.tsx:79:69 - error TS2339: Property 'displayProps' does not exist on type '{ item: GenericItem; isSelected: boolean; isDragging: boolean; onDragStart: (e: DragEvent<HTMLDivElement>, itemId: string) => void; colorProp: CalendarColorProp; }'.

79 function CalendarEvent({ item, isSelected, isDragging, onDragStart, displayProps, colorProp }: {
                                                                       ~~~~~~~~~~~~

src/features/dynamic-view/components/views/CalendarView.tsx:79:69 - error TS6133: 'displayProps' is declared but its value is never read.

79 function CalendarEvent({ item, isSelected, isDragging, onDragStart, displayProps, colorProp }: {
                                                                       ~~~~~~~~~~~~

src/features/dynamic-view/components/views/CalendarView.tsx:145:5 - error TS6133: 'calendarDisplayProps' is declared but its value is never read.

145     calendarDisplayProps,
        ~~~~~~~~~~~~~~~~~~~~

src/hooks/useAppViewManager.hook.ts:113:24 - error TS2304: Cannot find name 'SortableField'.

113   return { key: key as SortableField, direction: direction as 'asc' | 'desc' };
                           ~~~~~~~~~~~~~

src/hooks/useAppViewManager.hook.ts:265:32 - error TS2304: Cannot find name 'SortableField'.

265   const setTableSort = (field: SortableField) => {
                                   ~~~~~~~~~~~~~

src/hooks/useAppViewManager.hook.ts:268:11 - error TS18047: 'sortConfig' is possibly 'null'.

268       if (sortConfig.direction === 'desc') newSort = `${field}-asc`;
              ~~~~~~~~~~

src/hooks/useAppViewManager.hook.ts:269:16 - error TS18047: 'sortConfig' is possibly 'null'.

269       else if (sortConfig.direction === 'asc') newSort = null;
                   ~~~~~~~~~~

src/pages/Dashboard/index.tsx:125:30 - error TS2554: Expected 0 arguments, but got 1.

125         handleScrollToBottom(e);
                                 ~

src/pages/DataDemo/data/mockData.ts:1:31 - error TS2307: Cannot find module '../types' or its corresponding type declarations.

1 import type { DataItem } from '../types'
                                ~~~~~~~~~~


Found 9 errors.

error: "tsc" exited with code 1
