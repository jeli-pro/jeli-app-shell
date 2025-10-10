===

top bar should show after hidden while scrolling stop

=== DONE

make codebase highly DRY for super less codebase without UI look regression or degradation of consumer flexibility

===

notification page

=== DONE

profile

=== DONE

workspace switcher should be as popover, never constrained by sidebar size

=== DONE

this project is for creating UI library to be reuse to another project as deps... so please make everything production ready from pluggable architecture to final touch...

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
