src/components/global/CommandPalette.tsx:11:46 - error TS2307: Cannot find module 'react-router-dom' or its corresponding type declarations.

11 import { useNavigate, useSearchParams } from 'react-router-dom'
                                                ~~~~~~~~~~~~~~~~~~

src/components/global/CommandPalette.tsx:12:28 - error TS6133: 'ActivePage' is declared but its value is never read.

12 import { useAppStore, type ActivePage } from '@/store/appStore'
                              ~~~~~~~~~~

src/components/global/CommandPalette.tsx:18:39 - error TS6133: 'openSidePane' is declared but its value is never read.

18   const { dispatch, toggleFullscreen, openSidePane } = useAppShell();
                                         ~~~~~~~~~~~~

src/components/layout/AppShell.tsx:2:42 - error TS2307: Cannot find module 'react-router-dom' or its corresponding type declarations.

2 import { useLocation, useNavigate } from 'react-router-dom';
                                           ~~~~~~~~~~~~~~~~~~

src/components/layout/AppShell.tsx:180:60 - error TS2304: Cannot find name 'handleNavigation'.

180   }, [draggedPage, activePage, bodyState, sidePaneContent, handleNavigation, dispatch, closeSidePane]);
                                                               ~~~~~~~~~~~~~~~~

src/components/layout/EnhancedSidebar.tsx:22:59 - error TS2307: Cannot find module 'react-router-dom' or its corresponding type declarations.

22 import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
                                                             ~~~~~~~~~~~~~~~~~~

src/components/layout/EnhancedSidebar.tsx:23:10 - error TS6133: 'useAppStore' is declared but its value is never read.

23 import { useAppStore, type ActivePage } from '@/store/appStore';
            ~~~~~~~~~~~

src/components/layout/EnhancedSidebar.tsx:25:1 - error TS6133: 'BODY_STATES' is declared but its value is never read.

25 import { BODY_STATES } from '@/lib/utils';
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/components/layout/EnhancedSidebar.tsx:184:24 - error TS6133: 'bodyState' is declared but its value is never read.

184   const { compactMode, bodyState, sidePaneContent, openSidePane, dispatch } = useAppShell()
                           ~~~~~~~~~

src/components/layout/EnhancedSidebar.tsx:184:35 - error TS6133: 'sidePaneContent' is declared but its value is never read.

184   const { compactMode, bodyState, sidePaneContent, openSidePane, dispatch } = useAppShell()
                                      ~~~~~~~~~~~~~~~

src/components/layout/EnhancedSidebar.tsx:184:52 - error TS6133: 'openSidePane' is declared but its value is never read.

184   const { compactMode, bodyState, sidePaneContent, openSidePane, dispatch } = useAppShell()
                                                       ~~~~~~~~~~~~

src/components/layout/ViewModeSwitcher.tsx:3:59 - error TS2307: Cannot find module 'react-router-dom' or its corresponding type declarations.

3 import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
                                                            ~~~~~~~~~~~~~~~~~~

src/components/layout/ViewModeSwitcher.tsx:32:5 - error TS6133: 'openSidePane' is declared but its value is never read.

32     openSidePane,
       ~~~~~~~~~~~~

src/components/layout/ViewModeSwitcher.tsx:33:5 - error TS6133: 'closeSidePane' is declared but its value is never read.

33     closeSidePane,
       ~~~~~~~~~~~~~

src/components/layout/ViewModeSwitcher.tsx:36:5 - error TS6133: 'dispatch' is declared but its value is never read.

36     dispatch,
       ~~~~~~~~


Found 15 errors.

error: "tsc" exited with code 1
`
