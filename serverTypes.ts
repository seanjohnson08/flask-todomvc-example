export type Todo = {
  id: number;
  title: string;
  order: number;
  completed: boolean;
};

export type Role = {
  id: number;
  name: string;
  description: string;
};

export type User = {
  id: number;
  email: string;
  password: string;
  active: boolean;
};

export type UserRole = {
  user_id: number;
  role_id: number;
};
