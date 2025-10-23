src/components/global/CommandPalette.tsx:67:69 - error TS2551: Property 'openSidePane' does not exist on type '{ mainViewId: "dashboard" | "settings" | "toaster" | "notifications" | "data-demo" | "messaging" | "dataItemDetail" | "messagingPage" | "messagingContextPanel"; rightPaneViewId: ViewId | null; ... 10 more ...; setMessagingView: (view: TaskView) => void; }'. Did you mean 'openPane'?

67           <CommandItem onSelect={() => runCommand(() => viewManager.openSidePane('settings'))}>
                                                                       ~~~~~~~~~~~~

  src/hooks/useAppViewManager.hook.ts:237:5
    237     openPane,
            ~~~~~~~~
    'openPane' is declared here.

src/components/layout/ViewModeSwitcher.tsx:25:5 - error TS2339: Property 'toggleSplitView' does not exist on type '{ mainViewId: "dashboard" | "settings" | "toaster" | "notifications" | "data-demo" | "messaging" | "dataItemDetail" | "messagingPage" | "messagingContextPanel"; rightPaneViewId: ViewId | null; ... 10 more ...; setMessagingView: (view: TaskView) => void; }'.

25     toggleSplitView,
       ~~~~~~~~~~~~~~~

src/components/layout/ViewModeSwitcher.tsx:26:5 - error TS2339: Property 'setNormalView' does not exist on type '{ mainViewId: "dashboard" | "settings" | "toaster" | "notifications" | "data-demo" | "messaging" | "dataItemDetail" | "messagingPage" | "messagingContextPanel"; rightPaneViewId: ViewId | null; ... 10 more ...; setMessagingView: (view: TaskView) => void; }'.

26     setNormalView,
       ~~~~~~~~~~~~~

src/components/layout/ViewModeSwitcher.tsx:28:5 - error TS2339: Property 'switchSplitPanes' does not exist on type '{ mainViewId: "dashboard" | "settings" | "toaster" | "notifications" | "data-demo" | "messaging" | "dataItemDetail" | "messagingPage" | "messagingContextPanel"; rightPaneViewId: ViewId | null; ... 10 more ...; setMessagingView: (view: TaskView) => void; }'.

28     switchSplitPanes,
       ~~~~~~~~~~~~~~~~

src/components/layout/ViewModeSwitcher.tsx:29:5 - error TS2339: Property 'closeSplitPane' does not exist on type '{ mainViewId: "dashboard" | "settings" | "toaster" | "notifications" | "data-demo" | "messaging" | "dataItemDetail" | "messagingPage" | "messagingContextPanel"; rightPaneViewId: ViewId | null; ... 10 more ...; setMessagingView: (view: TaskView) => void; }'.

29     closeSplitPane,
       ~~~~~~~~~~~~~~

src/components/layout/ViewModeSwitcher.tsx:85:20 - error TS2345: Argument of type '"settings" | "toaster" | "notifications" | "messaging" | "details" | "main" | "dataDemo" | "dataItem"' is not assignable to parameter of type 'ViewId'.
  Type '"details"' is not assignable to type 'ViewId'.

85     toggleSidePane(paneContent);
                      ~~~~~~~~~~~

src/components/layout/ViewModeSwitcher.tsx:93:18 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'ViewId'.

93       navigateTo(targetPage);
                    ~~~~~~~~~~

src/components/layout/ViewModeSwitcher.tsx:125:22 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'ViewId'.

125           navigateTo(targetPage);
                         ~~~~~~~~~~

src/components/layout/ViewRenderer.tsx:44:20 - error TS2604: JSX element type 'Component' does not have any construct or call signatures.

44   const content = <Component {...componentProps} />;
                      ~~~~~~~~~

src/components/layout/ViewRenderer.tsx:44:20 - error TS2786: 'Component' cannot be used as a JSX component.
  Its type 'ComponentType<any> | undefined' is not a valid JSX element type.
    Type 'undefined' is not assignable to type 'ElementType'.

44   const content = <Component {...componentProps} />;
                      ~~~~~~~~~

src/pages/DataDemo/index.tsx:44:40 - error TS2345: Argument of type 'string | null' is not assignable to parameter of type 'string | undefined'.
  Type 'null' is not assignable to type 'string | undefined'.

44   const selectedItem = useSelectedItem(viewManager.itemId);
                                          ~~~~~~~~~~~~~~~~~~

src/pages/Messaging/index.tsx:73:21 - error TS2322: Type '{ conversationId: string | undefined; }' is not assignable to type 'IntrinsicAttributes'.
  Property 'conversationId' does not exist on type 'IntrinsicAttributes'.

73         <TaskDetail conversationId={conversationId} />
                       ~~~~~~~~~~~~~~

src/views/viewRegistry.tsx:8:3 - error TS6133: 'MessageSquare' is declared but its value is never read.

8   MessageSquare,
    ~~~~~~~~~~~~~


Found 13 errors.

error: "tsc" exited with code 1
