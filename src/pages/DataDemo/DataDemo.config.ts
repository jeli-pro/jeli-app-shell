import type { ViewConfig } from '@/features/dynamic-view/types';
import { DATA_DEMO_PRIORITY_COLORS, DATA_DEMO_STATUS_COLORS } from './data/mockData';

export const dataDemoViewConfig: ViewConfig = {
  // Field definitions: The source of truth for all data properties
  fields: [
    { id: 'title', label: 'Title', type: 'string' },
    { id: 'description', label: 'Description', type: 'longtext' },
    { id: 'thumbnailEmoji', label: 'Thumbnail', type: 'thumbnail' },
    {
      id: 'status',
      label: 'Status',
      type: 'badge',
      colorMap: DATA_DEMO_STATUS_COLORS,
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'badge',
      colorMap: DATA_DEMO_PRIORITY_COLORS,
    },
    { id: 'assignee', label: 'Assignee', type: 'avatar' },
    { id: 'metrics.completion', label: 'Completion', type: 'progress' },
    { id: 'updatedAt', label: 'Last Updated', type: 'date' },
    { id: 'createdAt', label: 'Created', type: 'date' },
    { id: 'dueDate', label: 'Due Date', type: 'date' },
    { id: 'tags', label: 'Tags', type: 'tags' },
    { id: 'metrics', label: 'Metrics', type: 'metrics' },
  ],

  // Control options: What users can sort, filter, and group by
  sortableFields: [
    { id: 'title', label: 'Title' },
    { id: 'status', label: 'Status' },
    { id: 'priority', label: 'Priority' },
    { id: 'updatedAt', label: 'Last Updated' },
    { id: 'createdAt', label: 'Created' },
    { id: 'assignee.name', label: 'Assignee' },
    { id: 'metrics.views', label: 'Views' },
    { id: 'metrics.completion', label: 'Completion' },
  ],
  groupableFields: [
    { id: 'none', label: 'None' },
    { id: 'status', label: 'Status' },
    { id: 'priority', label: 'Priority' },
    { id: 'category', label: 'Category' },
  ],
  filterableFields: [
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'active', label: 'Active' },
        { id: 'pending', label: 'Pending' },
        { id: 'completed', label: 'Completed' },
        { id: 'archived', label: 'Archived' },
      ],
    },
    {
      id: 'priority',
      label: 'Priority',
      options: [
        { id: 'low', label: 'Low' },
        { id: 'medium', label: 'Medium' },
        { id: 'high', label: 'High' },
        { id: 'critical', label: 'Critical' },
      ],
    },
  ],
  
  // View layouts: How each view mode should render the data
  listView: {
    iconField: 'thumbnailEmoji',
    titleField: 'title',
    metaFields: ['status', 'priority', 'assignee', 'updatedAt'],
  },
  cardView: {
    thumbnailField: 'thumbnailEmoji',
    titleField: 'title',
    descriptionField: 'description',
    headerFields: ['priority'],
    contentFields: ['metrics.completion'],
    footerFields: ['tags', 'assignee'],
  },
  tableView: {
    columns: [
      { fieldId: 'title', label: 'Title', isSortable: true },
      { fieldId: 'status', label: 'Status', isSortable: true },
      { fieldId: 'priority', label: 'Priority', isSortable: true },
      { fieldId: 'assignee', label: 'Assignee', isSortable: true },
      { fieldId: 'metrics.completion', label: 'Completion', isSortable: true },
      { fieldId: 'updatedAt', label: 'Last Update', isSortable: true },
    ],
  },
  kanbanView: {
    groupByField: 'status', // This is a suggestion; the user can change it.
    cardFields: {
      titleField: 'title',
      descriptionField: 'description',
      footerFields: ['tags', 'assignee'],
    },
  },
  calendarView: {
    dateField: 'dueDate', // Default date field
    titleField: 'title',
    displayFields: ['priority', 'assignee'],
    colorByField: 'priority', // Default coloring
  },
};