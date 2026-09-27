export type Department = {
  departmentId: number;
  departmentName: string;
  departmentDescription?: string | null;
  isActive: boolean;
};

export type DepartmentCreateRequest = {
  departmentName: string;
  departmentDescription?: string | null;
};

export type DepartmentUpdateRequest = DepartmentCreateRequest & {
  isActive: boolean;
};
