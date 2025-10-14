===

I am obsessed with laravel filament... so make everything about data demo page is highly available to customizable for consumer and developer while also make them so easy to use in the most less code and effort.

===

scroll to bottom in dashboard is not stick to right bottom.
also why not auto applied to another page like demo data?

=== DONE

implement the eslint

===

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
