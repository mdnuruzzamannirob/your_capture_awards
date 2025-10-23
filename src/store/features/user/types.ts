export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string | null;
  email: string;
  role: string;
  phone: number;
  avatar: string;
  cover: string;
  location: string | null;
  level: string | null;
  socialId: string | null;
  socialProvider: string | null;
}

// export interface PaginatedUsers {
//   items: User[];
//   totalItems: number;
//   totalPages: number;
//   currentPage: number;
// }
