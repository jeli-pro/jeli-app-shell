import type { ReactNode } from 'react';

// --- GENERIC DATA & ITEM ---
export type GenericItem = Record<string, any> & { id: string };

// --- FIELD DEFINITIONS ---
// Describes a single piece of data within a GenericItem.
export type FieldType = 
  | 'string'
  | 'longtext'
  | 'badge'
  | 'avatar'
  | 'progress'
  | 'date'
  | 'tags'
  | 'metrics'
  | 'thumbnail'
  | 'custom';

export interface BaseFieldDefinition {
  id: string; // Corresponds to a key in GenericItem
  label: string;
  type: FieldType;
  // Optional custom render function for ultimate flexibility.
  render?: (item: GenericItem, options?: Record<string, any>) => ReactNode;
}

export interface BadgeFieldDefinition extends BaseFieldDefinition {
  type: 'badge';
  colorMap?: Record<string, string>; // e.g., { 'active': 'bg-green-500', 'pending': 'bg-yellow-500' }
  indicatorColorMap?: Record<string, string>; // e.g., { 'critical': 'bg-red-500' }
}

// Add other specific field types if they need unique properties
// For now, most can be handled by the base definition.

export type FieldDefinition = BaseFieldDefinition | BadgeFieldDefinition;


// --- VIEW CONFIGURATION ---
// The master configuration object that defines the entire view.

export type ViewMode = 'list' | 'cards' | 'grid' | 'table' | 'kanban' | 'calendar';

export interface ListViewConfig {
  iconField: string;
  titleField: string;
  metaFields: Array<{
    fieldId: string;
    className?: string;
  }>;
}

export interface CardViewConfig {
  thumbnailField: string;
  titleField: string;
  descriptionField: string;
  headerFields: string[];
  // Specific fields to recreate the original layout
  statusField: string;
  categoryField: string;
  tagsField: string;
  progressField: string;
  assigneeField: string;
  metricsField: string;
  dateField: string;
}

export interface TableColumnConfig {
  fieldId: string;
  label: string;
  isSortable: boolean;
}

export interface TableViewConfig {
  columns: TableColumnConfig[];
}

export interface KanbanViewConfig {
  groupByField: string; // Field ID to group by (e.g., 'status')
  cardFields: {
    titleField: string;
    descriptionField: string;
    priorityField: string;
    tagsField: string;
    // footer fields
    dateField: string;
    metricsField: string; // for comments/attachments
    assigneeField: string;
  };
}

export interface CalendarViewConfig {
  dateField: string;
  titleField: string;
  displayFields: string[];
  colorByField?: string; // Field ID to color events by (e.g., 'priority', 'status')
}

export interface ControlOption {
  id: string;
  label: string;
}

export interface FilterableFieldConfig {
  id: string; // fieldId
  label: string;
  options: ControlOption[];
}

export interface ViewConfig {
  fields: FieldDefinition[];
  sortableFields: ControlOption[];
  groupableFields: ControlOption[];
  filterableFields: FilterableFieldConfig[];
  
  // Layouts for each view mode
  listView: ListViewConfig;
  cardView: CardViewConfig;
  tableView: TableViewConfig;
  kanbanView: KanbanViewConfig;
  calendarView: CalendarViewConfig;
  detailView: DetailViewConfig;
}

// --- DETAIL VIEW ---
export interface DetailViewSection {
  title: string;
  fields: string[];
}

export interface DetailViewConfig {
  header: {
    thumbnailField: string;
    titleField: string;
    descriptionField: string;
    badgeFields: string[];
    progressField: string;
  };
  body: {
    sections: DetailViewSection[];
  };
}

// --- GENERIC CONTROL & DATA TYPES ---

export type Status = 'active' | 'pending' | 'completed' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface FilterConfig {
  searchTerm: string;
  [key: string]: any; // For dynamic filter keys like status, priority
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export type GroupableField = 'status' | 'priority' | 'category';

export type CalendarDateProp = 'dueDate' | 'createdAt' | 'updatedAt';
export type CalendarDisplayProp = 'priority' | 'assignee' | 'status';
export type CalendarColorProp = 'priority' | 'status' | 'category' | 'none';