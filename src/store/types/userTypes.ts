export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  username: string | null;
  email: string;
  role: string;
  phone: string | number;
  avatar: string;
  cover: string;
  location: string | null;
  level: string | null;
  socialId?: string | null;
  socialProvider?: string | null;
}

// export interface UserState {
//   email: string | null;
//   token: string | null;
//   data: any | null;
// }

// export interface PaginatedUsers {
//   items: User[];
//   totalItems: number;
//   totalPages: number;
//   currentPage: number;
// }
