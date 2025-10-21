import { FieldRenderer } from "@/features/dynamic-view/components/shared/FieldRenderer";
import type { ViewConfig, GenericItem } from "@/features/dynamic-view/types";

export const dataDemoViewConfig: ViewConfig = {
  // 1. Field Definitions
  fields: [
    { id: "id", label: "ID", type: "string" },
    { id: "title", label: "Title", type: "string" },
    { id: "description", label: "Description", type: "longtext" },
    { id: "thumbnail", label: "Thumbnail", type: "thumbnail" },
    { id: "category", label: "Category", type: "badge" },
    {
      id: "status",
      label: "Status",
      type: "badge",
      colorMap: {
        active: "bg-sky-500/10 text-sky-600 border-sky-500/20",
        pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        completed: "bg-emerald-600/10 text-emerald-700 border-emerald-600/20",
        archived: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
      },
    },
    {
      id: "priority",
      label: "Priority",
      type: "badge",
      colorMap: {
        critical: "bg-red-600/10 text-red-700 border-red-600/20",
        high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        medium: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        low: "bg-green-500/10 text-green-600 border-green-500/20",
      },
      indicatorColorMap: {
        critical: "bg-red-500",
        high: "bg-orange-500",
        medium: "bg-blue-500",
        low: "bg-green-500",
      }
    },
    { id: "assignee", label: "Assignee", type: "avatar" },
    { id: "tags", label: "Tags", type: "tags" },
    { id: "metrics", label: "Engagement", type: "metrics" },
    { id: "metrics.completion", label: "Progress", type: "progress" },
    { id: "dueDate", label: "Due Date", type: "date" },
    { id: "createdAt", label: "Created At", type: "date" },
    { id: "updatedAt", label: "Last Updated", type: "date" },
    // A custom field to replicate the composite "Project" column in the table view
    {
      id: "project_details",
      label: "Project",
      type: "custom",
      render: (item: GenericItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
            <FieldRenderer item={item} fieldId="thumbnail" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium group-hover:text-primary transition-colors truncate">
              <FieldRenderer item={item} fieldId="title" />
            </h4>
            <p className="text-sm text-muted-foreground truncate">
              <FieldRenderer item={item} fieldId="category" />
            </p>
          </div>
        </div>
      ),
    },
  ],
  // 2. Control Definitions
  sortableFields: [
    { id: "updatedAt", label: "Last Updated" },
    { id: "title", label: "Title" },
    { id: "status", label: "Status" },
    { id: "priority", label: "Priority" },
    { id: "metrics.completion", label: "Progress" },
  ],
  groupableFields: [
    { id: "none", label: "None" },
    { id: "status", label: "Status" },
    { id: "priority", label: "Priority" },
    { id: "category", label: "Category" },
  ],
  filterableFields: [
    {
      id: "status",
      label: "Status",
      options: [
        { id: "active", label: "Active" },
        { id: "pending", label: "Pending" },
        { id: "completed", label: "Completed" },
        { id: "archived", label: "Archived" },
      ],
    },
    {
      id: "priority",
      label: "Priority",
      options: [
        { id: "critical", label: "Critical" },
        { id: "high", label: "High" },
        { id: "medium", label: "Medium" },
        { id: "low", label: "Low" },
      ],
    },
  ],
  // 3. View Layouts
  listView: {
    iconField: "thumbnail",
    titleField: "title",
    metaFields: [
      { fieldId: "status", className: "hidden sm:flex" },
      { fieldId: "tags", className: "hidden lg:flex" },
      { fieldId: "updatedAt", className: "hidden md:flex" },
      { fieldId: "assignee" },
      { fieldId: "priority", className: "hidden xs:flex" },
    ],
  },
  cardView: {
    thumbnailField: "thumbnail",
    titleField: "title",
    descriptionField: "description",
    headerFields: ["priority"],
    statusField: "status",
    categoryField: "category",
    tagsField: "tags",
    progressField: "metrics.completion",
    assigneeField: "assignee",
    metricsField: "metrics",
    dateField: "updatedAt",
  },
  tableView: {
    columns: [
      { fieldId: "project_details", label: "Project", isSortable: true },
      { fieldId: "status", label: "Status", isSortable: true },
      { fieldId: "priority", label: "Priority", isSortable: true },
      { fieldId: "assignee", label: "Assignee", isSortable: true },
      { fieldId: "metrics.completion", label: "Progress", isSortable: true },
      { fieldId: "metrics", label: "Engagement", isSortable: true },
      { fieldId: "updatedAt", label: "Last Updated", isSortable: true },
    ],
  },
  kanbanView: {
    groupByField: "status",
    cardFields: {
      titleField: "title",
      descriptionField: "description",
      priorityField: "priority",
      tagsField: "tags",
      dateField: "dueDate",
      metricsField: "metrics",
      assigneeField: "assignee",
    },
  },
  calendarView: {
    dateField: "dueDate",
    titleField: "title",
    displayFields: ["tags", "priority", "assignee"],
    colorByField: "priority",
  },
  detailView: {
    header: {
      thumbnailField: "thumbnail",
      titleField: "title",
      descriptionField: "description",
      badgeFields: ["status", "priority", "category"],
      progressField: "metrics.completion",
    },
    body: {
      sections: [
        { title: "Assigned to", fields: ["assignee"] },
        { title: "Engagement Metrics", fields: ["metrics"] },
        { title: "Tags", fields: ["tags"] },
        {
          title: "Timeline",
          fields: ["createdAt", "updatedAt", "dueDate"],
        },
      ],
    },
  },
};
