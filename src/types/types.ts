export interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

export interface Participant {
  email: string;
  role: "Admin" | "Viewer";
}

export interface TaskList {
  id: string;
  name: string;
  owner: string;
  participants: Participant[];
}

export interface User {
  email: string | null;
  uid: string;
  role?: string;
}

export interface UserContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  loading: boolean;
}

export interface RouterQuery {
  id?: string | string[];
}

export interface TaskListItemProps {
  list: { id: string; name: string };
  userRole: string;
  isShared: boolean;
  onDelete: () => void;
  onUpdate: (name: string) => void;
  onClickList?: () => void;
}
