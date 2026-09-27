import api from '@/lib/api';
import type {
  Department,
  DepartmentCreateRequest,
  DepartmentUpdateRequest,
} from '@/types/department';

export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    const { data } = await api.get<Department[]>('/department');
    return data;
  },

  getById: async (id: number): Promise<Department> => {
    const { data } = await api.get<Department>(`/department/${id}`);
    return data;
  },

  search: async (keyword?: string): Promise<Department[]> => {
    const { data } = await api.get<Department[]>('/department/search', {
      params: { keyword },
    });
    return data;
  },

  create: async (payload: DepartmentCreateRequest): Promise<Department> => {
    const { data } = await api.post<Department>('/department', payload);
    return data;
  },

  update: async (id: number, payload: DepartmentUpdateRequest): Promise<Department> => {
    const { data } = await api.put<Department>(`/department/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/department/${id}`);
  },
};

export default departmentApi;
