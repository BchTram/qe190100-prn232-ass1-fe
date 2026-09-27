import api from '@/lib/api';
import type { Tag, TagCreateRequest, TagUpdateRequest } from '@/types/tag';

export const tagApi = {
  getAll: async (): Promise<Tag[]> => {
    const { data } = await api.get<Tag[]>('/tag');
    return data;
  },

  getById: async (id: number): Promise<Tag> => {
    const { data } = await api.get<Tag>(`/tag/${id}`);
    return data;
  },

  create: async (payload: TagCreateRequest): Promise<Tag> => {
    const { data } = await api.post<Tag>('/tag', payload);
    return data;
  },

  update: async (id: number, payload: TagUpdateRequest): Promise<Tag> => {
    const { data } = await api.put<Tag>(`/tag/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/tag/${id}`);
  },
};

export default tagApi;
