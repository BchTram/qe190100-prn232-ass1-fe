export type Task = {
  taskId: number;
  title: string;
  description?: string | null;
  status: number;
  priority: number;
  dueDate?: string | null;
  projectId: number;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string | null;
};

export type TaskCreateRequest = {
  title: string;
  description?: string | null;
  status: number;
  priority: number;
  dueDate?: string | null;
  projectId: number;
};

export type TaskUpdateRequest = TaskCreateRequest & {
  isActive: boolean;
};

export type TaskSearchParams = {
  keyword?: string;
  status?: number;
  priority?: number;
  projectId?: number;
};
