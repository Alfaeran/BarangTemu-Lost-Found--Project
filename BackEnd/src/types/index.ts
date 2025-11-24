export interface IUser {
  id: number;
  username: string;
  email: string;
  password?: string; // Excluded in responses
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  phoneNumber?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
    token: string;
  };
}

export interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

export interface ICategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  formSchema?: Record<string, any>;
}

export interface CreateCategoryDTO {
  name: string;
  slug: string;
  icon?: string;
  formSchema?: Record<string, any>;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  icon?: string;
  formSchema?: Record<string, any>;
}

export enum ItemType {
  LOST = 'LOST',
  FOUND = 'FOUND',
}

export enum ItemStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
}

export interface IItem {
  id: number;
  userId: number;
  categoryId?: number;
  type: ItemType;
  title: string;
  description?: string;
  location: string;
  dateIncident: Date;
  imageUrl?: string;
  contactInfo: string;
  additionalData?: Record<string, any>;
  status: ItemStatus;
  createdAt: Date;
}

export interface CreateItemDTO {
  userId: number;
  categoryId?: number;
  type: ItemType;
  title: string;
  description?: string;
  location: string;
  dateIncident: Date;
  imageUrl?: string;
  contactInfo: string;
  additionalData?: Record<string, any>;
}

export interface UpdateItemDTO {
  categoryId?: number;
  type?: ItemType;
  title?: string;
  description?: string;
  location?: string;
  dateIncident?: Date;
  imageUrl?: string;
  contactInfo?: string;
  additionalData?: Record<string, any>;
  status?: ItemStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}
