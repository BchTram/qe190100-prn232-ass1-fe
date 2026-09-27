export type Project = {
  projectId: number;
  projectName: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  status: number;
  departmentId: number;
  isActive: boolean;
  createdDate: string;
};

export type ProjectCreateRequest = {
  projectName: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  status: number;
  departmentId: number;
};

export type ProjectUpdateRequest = ProjectCreateRequest & {
  isActive: boolean;
};
