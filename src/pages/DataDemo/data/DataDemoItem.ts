import type { GenericItem, Status, Priority } from '@/features/dynamic-view/types';

export interface DataDemoItem extends GenericItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  status: Status;
  priority: Priority;
  assignee: {
    name: string;
    email: string;
    avatar: string;
  };
  tags: string[];
  metrics: {
    views: number;
    likes: number;
    shares: number;
    completion: number;
  };
  dueDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}