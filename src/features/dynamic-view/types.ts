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
  // Optional custom render function for ultimate flexibility
  render?: (item: GenericItem) => ReactNode;
}

export interface BadgeFieldDefinition extends BaseFieldDefinition {
  type: 'badge';
  colorMap?: Record<string, string>; // e.g., { 'active': 'bg-green-500', 'pending': 'bg-yellow-500' }
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
  metaFields: string[]; // IDs of fields to show on the right
}

export interface CardViewConfig {
  thumbnailField: string;
  titleField: string;
  descriptionField: string;
  headerFields: string[];
  contentFields: string[];
  footerFields: string[];
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
    footerFields: string[];
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
}