===

I am obsessed with laravel filament... so make everything about data demo page is highly available to customizable for consumer and developer while also make them so easy to use in the most less code and effort.

===

data demo page: we need centralized control of (search, filter, sort) for amazing UX . reusable for all view mode

===

data demo page: stats card should only be horizontally scrollable, not vertically

===

fix: message page : opening message thread from list causing this error

===

data demo page: data demo detail page: overlay side pane: remove back to list text button

===

data demo page: list  view mode: remove line separator

===

data demo page: the data model should be based on message page,

===

data demo page: calendar view : just like date property that user can select, also add calendar item background color that user can select based on what data

===

data demo page: calendar view : fix flickering calendar items animation on load within blocks

===

data demo page: calendar view control: I want all the features real working, also make the UI styling and spacing consistent global style.

===

data demo page: list view should be super responsive, how many attributes to show is depending on the widht viewport size

=== DONE

data demo page: list view should be like notion list view, so the item not like cards

=== DONE

data demo page: lets turn stats card to become horizontally slideable, should only need one row even on small screen... for responsive design, just make the stats cards smaller

and add more stats cards than 4

=== DONE

data demo page: should gsap animamte auto hide stats card on page scroll down for all view mode, just like SliverAppBar in flutter, so user can focus on the content.

=== DONE

calendar view grid block should be aware of viewport so know how much columns to show for certain widht size

=== DONE

data demo page: calendar view

- add calendar view control (make sure UX cohesive) so user can control:
  1. wether to show all items on calendar blocks or only first 3/5 items with show all text button
  2. what data to show on calendar items within blocks
  3. user can select any timestamp type data to show on calendar view

=== DONE

data demo page:

- create calendar view mode with amazing UI... at least like below ex:
- the styling should consistent with other view mode and global style.
- should use existing components like @/components/ui/tabs etc

=== DONE

1. the kanban view mode should also has grouping selector just like other view mode
2. also make sure the kanban is horizontally scrollable for extensive data group

=== DONE

data demo page: create kanban board view mode with amazing UI... at least like below ex:

===

split view mode : loosing view mode switcher hover on pane active left:right pane

===

view mode switcher actions not working well from overlay side pane: especially fullscreen,and normal mode

===

-message page : message list: time ago use short word like 3s ago, 3m ago, 3h ago etc
-message thread : add message search feature

=== DONE

message page : message list:

1. we have open, unAssigned, done tabs. add `Me` (assigned to me)
2. reduce tabs size
3. show data count on tab hover only

=== DONE

mental model:

message page : sometimes each audience has relation to certain company, and we can relate that audience to another audience within the same company also we can give the job title of a company to each audience

1. present the mental model to message page UI UX with amazing look and cohesive manner
2. always follow the architecture model that each audience, message, company are basically task units

=== DONE

split mode view on message page: should always set right pane to default value on page refresh on load because sometimes user from another page resize the right pane so global appshell size applied also in message page

=== DONE

modify animated tab switcher: while user switch tabs, the content should gsap slide left right animate... also should not re render content like in datademo

=== DONE

msssage page : message thread: we need custom scrollbar component where certain audience journey like (Consult, Order, Complain, Reorder) is represented by a clickable dot on the track. Each dot should show a preview of the message on hover and scroll the main content to that message when clicked.

so it’s effectively a synthetic, content-aware minimap/scrollbar hybrid: it gives both continuous scrolling (via the handle) and discrete navigation (via the dots).

UI example like below

=== DONE

message page : message thread: bottom message input area should animate slide in/up responding to thread locked state

===

1. scroll to bottom not appear in dashboard page
2. also not working on message thread in message page

---

have you make sure the scroll to bottom icon button in message thread not obsturcting message input field area?

also make sure works in dashboard page

===

scroll to bottom in dashboard is not stick to right bottom.
also why not auto applied to another page like demo data?

===

view mode switcher should be on overlay side pane header, replacing current switcher.

make sure the feature working well from overlay side pane: especially fullscreen,and normal mode


=== DONE

login page, the two column left right needs distinctive background color

=== DONE

data demo page:

- data list is not rendered when view mode change: split view mode, overlay side pane view mode
- also view mode should not be affected when user interact with content like changing data view mode

  "src/App.tsx",
  "src/components/layout/ViewModeSwitcher.tsx",
  "src/hooks/useAppViewManager.hook.ts",
  "src/pages/DataDemo/components/DataViewModeSelector.tsx",
  "src/pages/DataDemo/index.tsx",
  "src/store/appShell.store.ts"

=== DONE

top bar: left aligned is only for the breadcrumb, everything else should right aligned

=== DONE

dark light mode is not persisted on refresh

=== DONE

message page: sidebar should always be collapsed for message page on first load and page refresh

=== DONE

overlay side pane: fix erratic close open movement while user resizing the pane

  "src/App.tsx",
  "src/components/layout/AppShell.tsx",
  "src/hooks/useAppViewManager.hook.ts",
  "src/hooks/useResizablePanes.hook.ts",
  "src/store/appShell.store.ts"

=== DONE

on overlay side pane active: the main right content view should not be re-rendered

=== DONE

 animated tabs: should horizontally scrollable by default. so consumer no need to implement individually, also prevent from vertically scrollable

=== DONE

message page:

lets refactor the architecture of message:

- we need to have mental model of message is basically to do list with its properties like (due date, status, relationship, description, labels)

- present the mental model to UI UX with amazing look and cohesive manner

=== DONE

we need UI UX state for case where certain message is currently handled by another agent. if human agent, should request for approval to take over, if AI agent, no need for approval

=== DONE

message page: message list

1. we need more advanced feature than [ all | unread ] like [ Open, Close ] , [ Assigned | unAssigned ] etc

  1.1 those shorcuts should also available as child/sub page in sidebar

2. message list item:

  2.1. we need kind of badge/tag to show each customer journey point for each contact
  2.2. we alo need avatar of which human/ai agent that the item currently assigned

=== DONE

message page:

1. view mode switcher action/purpose is not working well for message page. make it work!
2. also message list with its profil detail cannot be opened as overlay side pane. fix it!
3. cannot open notification page and setting page as overlay side pane from message page. fix it!

message page should comply the app shell view mode!

=== DONE

message page: message list column pane: animated tabs

the tab line should inline with header bottom line

===

message page: message list column pane:

1. when app view mode management tell that the widht is so narrow, then message list column pane should automatically turn into collapsed state

2. also when message list column pane is collapsed, the widht of the column should auto follow the shrinked widht of the children

=== DONE

message page: message list column: resizable sidebar border: I hate when it perceived like there is doubling vertical line

=== DONE

message page:
should has capability to inform the view mode managemnt about the split view mode ;

widht portion:

message list : 20%
message thread : 40%
profile detail : 40%

all above should be sensitive to sidebar collapse and decollapse

=== DONE

each page should can decide to view mode management about how much proportion of screen widht for split view mod and overlay side pane mode

example like case of message split view mode layout, currently the message list left pane too widht eats right pane of message thread and profile detail

=== DONE

1.  sidebar toggle should not in top bar, it should be within sidebar, just right side of logo.
2. breadcrumb should left aligned in top bar at edge left side

=== DONE

on splid view mode active, should hide top bar... only reveal on hovering top area

=== DONE

data demo page: on each view mode, need additional item as CTA to lure user to add more data

=== DONE

create omni (WA, IG, FB) channel CRM messaging page. make sure UI amazing and UX cohesive

the page should be as split view mode: right pane consist of two columns, left column is for showing message list, right column is for showing profile detail with AI summaries ... and right pane is for showing message thread

at the end make sure no bun tsc -b problems

----

 messaging page: please make every components, layout, UI UX more beautiful amazing also cohesive. with a bit glassmorphism effect but not too much.. also add many advanced features to profil detail column, also many advanced features to message thread column. message list and profile detail should be de/expandable█

===

please make buttons and forms spacious for minimalism

===

 creaate a page named Dialogs that showcasing many dialogs with many variant and many state... make sure they are UI amazing and UX cohesive█

=== DONE

implement the eslint

=== DONE

make the codebase radically DRY without UI UX regression by;
1. extract out all stores to [domain].store.ts file
2. eliminating props drilling, so should use global state at leaf components
3. tsx files only for renders

===

make the codebase highly DRY without UI UX regression

===

make the codebase highly DRY without UI UX regression... by eliminating props drilling, so should use global state at leaf components

===

split view: loosing switch animation, there was cool gsap sliding left/right animation while switching pane

=== DONE

1. login state should be persisted
2. also on refresh the login page forget the dark/light mode
3. when user go to react route url like http://localhost:5173/data-demo?sort=title-asc&groupBy=priority&tab=critical&status=active&view=table while not login, then after succesful login should go to the route

===

create amazing kanban view
calendar view

=== DONE

data demo page:

we want the view mode, data view mode, search, sort, filter, pagination, grouping: all managed by react router as insensitive case

=== DONE

1. disable vertical scroll on group tab title... only horizontal
2. hide line when group by is none

=== DONE

data demo page: we need amazing grouping feature for all view (list, card grid , table , tree)

make sure the UI amazing and UX so cohesive

=== DONE

implement the react route 7.9.4

===

data demo page: table view header should be sticky on scroll

make sure the sticky header is below top bar with some gap

also make sure the row not overloading top of the header while scroll down

=== DONE

1. demo data page: opening data item detail should defaulting as overlay side pane mode.

2. make sure the mental model is that the data item detail view should be distinct page with its address bar url. so user can enjoy in all view mode format

3. direct url access /data-demo/:itemId should open the data detail in overlay side pane with main normal view of the data list page

4. again,  user should still can enjoy data item detail page in all view mode format

5. also the breadcrumb navigation should aware the data detail page

6. when data item detail overlay side pane opened, the normal view should persist state of data list page so user can explore another data from list while viewing the data item detail in overlay side pane mode

=== DONE

sidebar item: while hover, show ViewModeSwitcher so user can open page with desired view mode

=== DONE

viewmodeswitcher: no need to show all iconbuttons, just let user hover first then gsap spread the iconbuttons to make the UI feel minimalism

=== DONE

demo data page: not working on overlay side pane mode. also not working in split pane right side. just blank

=== DONE

demo data page: we need feature like sort, filter for all the view mode (list, card grid , table , tree)

=== DONE

create a page to demonstrate presenting data to four view mode (list, card grid , table , tree). make sure the UI UX so amazing█

=== DONE

currently, the page content has two view mode, side pane view and full page view. now I also want to add a third view mode, a split view mode.

=== DONE

tsx only for renders, so please extract out all hooks to *.hook.ts files

=== DONE

fix project structure, naming and organization

=== DONE

top bar background color should be same as main content background color so seen as minimalist

=== DONE

top bar should show after hidden while scrolling stop

=== DONE

make codebase highly DRY for super less codebase without UI look regression or degradation of consumer flexibility

=== DONE

notification page

=== DONE

profile

=== DONE

workspace switcher should be as popover, never constrained by sidebar size

=== DONE

this project is for creating UI library to be reuse to another project as deps... so please make everything production ready from pluggable architecture to readme...

so the lib user can use it with ease, flexibility while also in minimal codebase

maybe something like

<SidebarMenuItem>
  <SidebarMenuButton asChild>
    <a href="#">
      <Home />
      <span>Home</span>
    </a>
  </SidebarMenuButton>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <SidebarMenuAction>
        <MoreHorizontal />
      </SidebarMenuAction>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="right" align="start">
      <DropdownMenuItem>
        <span>Edit Project</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <span>Delete Project</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</SidebarMenuItem>

=== DONE

on every create new page, the view mode should automatically available to maximize or minimize from/to side pane view or full page view.

currenly, toast page has no that option, also toast page should be as side pane view by default

=== DONE

page control like search, filter should be at top bar. when search focused, the form should expand full width replacing up to breadcrumbs

=== DONE

color accent should configurable trough setting page

=== DONE

1. topbar should auto hide while on scroll down, show while scrolling up
2. add scroll to bottom iconbutton
3. full page scroll indicator, should at right most viewport

=== DONE

1. breadcrumbs should aware of route changes like dashboard/setting page
2. need more left right spacing for content while on side pane view or full page view

=== DONE

mental model: every page main content body can be side pane able. reversible. so user can enjoy wether to minimize or maximize page to side pane or full page view

===

mental model: side pane is basically the minimalistic version of the main body content,,, so we need full body button to the sidepane. so now it triggered at full strect of resiable or trough button well actually it should basically transitioned to (example: setting page)

so pay attention to aware of url, breadcrumbs etc

so lets say when page pane with setting content get fullscreen pressed, it directly replace the dashboard main content view

=== DONE

1. fix broken layout of fullscreen mode
2. side pane close button should not within pane, it should be outside of pane

=== DONE

1. setting content should use side pane
2. add scroll to bottom icon
3. no need scrollbar within header
4. activating full screen content mode, should hide top bar and sidebar completely

=== DONE

1. collapsed sidebar icons should be horizontally centered
2. also active icons should be horizontally centered
3. add logo and logotext at sidebar header
4. we dont need logo in top bar, we need breadcrumbs system

=== DONE

many broken estetic things like

1. margin/padding unproperly set
2. transparent setting panel where it should not be transparent
3. side pane behavior where it should overlay the content not constrainting... like a modal also should resiable. 60% default widht

=== DONE

many broken estetic things like

1. doubling sidebar line
2. sidepanel not showing
3. transparent setting panel
4. transition issues
etc

=== DONE

1. make the UI more clean, minimalist... also add more border redius
2. make the UX more cohesive
