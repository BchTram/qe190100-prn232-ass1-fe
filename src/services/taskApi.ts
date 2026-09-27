import api from '@/lib/api';
import type { Task, TaskCreateRequest, TaskSearchParams, TaskUpdateRequest } from '@/types/task';

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const { data } = await api.get<Task[]>('/task');
    return data;
  },

  getById: async (id: number): Promise<Task> => {
    const { data } = await api.get<Task>(`/task/${id}`);
    return data;
  },

  getByProjectId: async (projectId: number): Promise<Task[]> => {
    const { data } = await api.get<Task[]>(`/task/project/${projectId}`);
    return data;
  },

  search: async (params: TaskSearchParams = {}): Promise<Task[]> => {
    const { data } = await api.get<Task[]>('/task/search', {
      params,
    });
    return data;
  },

  create: async (payload: TaskCreateRequest): Promise<Task> => {
    const { data } = await api.post<Task>('/task', payload);
    return data;
  },

  update: async (id: number, payload: TaskUpdateRequest): Promise<Task> => {
    const { data } = await api.put<Task>(`/task/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/task/${id}`);
  },
};

export default taskApi;
