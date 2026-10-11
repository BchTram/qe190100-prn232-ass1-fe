export type Account = {
  accountId: number;
  fullName: string;
  email: string;
  role: number;
  createdDate: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  fullName: string;
};

export type LoginResponse = {
  token: string;
  tokenType: string;
  expiresAt: string;
  account: Account;
};

export type UpdateAccountRequest = {
  fullName: string;
  email: string;
  role: number;
};
