import api from '@/lib/api';
import type {
  Project,
  ProjectCreateRequest,
  ProjectUpdateRequest,
} from '@/types/project';

export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    const { data } = await api.get<Project[]>('/project');
    return data;
  },

  getById: async (id: number): Promise<Project> => {
    const { data } = await api.get<Project>(`/project/${id}`);
    return data;
  },

  getByDepartmentId: async (departmentId: number): Promise<Project[]> => {
    const { data } = await api.get<Project[]>(`/project/department/${departmentId}`);
    return data;
  },

  search: async (keyword?: string): Promise<Project[]> => {
    const { data } = await api.get<Project[]>('/project/search', {
      params: { keyword },
    });
    return data;
  },

  create: async (payload: ProjectCreateRequest): Promise<Project> => {
    const { data } = await api.post<Project>('/project', payload);
    return data;
  },

  update: async (id: number, payload: ProjectUpdateRequest): Promise<Project> => {
    const { data } = await api.put<Project>(`/project/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/project/${id}`);
  },
};

export default projectApi;
