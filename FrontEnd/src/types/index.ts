// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  phoneNumber?: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  icon?: string;
  formSchema?: Record<string, any>;
}

// Item Types
export enum ItemType {
  LOST = 'LOST',
  FOUND = 'FOUND',
}

export enum ItemStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
}

export interface Item {
  id: number;
  userId: number;
  categoryId?: number;
  type: ItemType;
  title: string;
  description?: string;
  location: string;
  dateIncident: string;
  imageUrl?: string;
  contactInfo: string;
  additionalData?: Record<string, any>;
  status: ItemStatus;
  createdAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
    phoneNumber?: string;
  };
  category?: Category;
}

export interface CreateItemRequest {
  categoryId?: number;
  type: ItemType;
  title: string;
  description?: string;
  location: string;
  dateIncident: string;
  imageUrl?: string;
  contactInfo: string;
  additionalData?: Record<string, any>;
}

export interface UpdateItemRequest extends Partial<CreateItemRequest> {
  status?: ItemStatus;
}

// API Response Types
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

// Search & Filter Types
export interface SearchFilters {
  type?: ItemType;
  status?: ItemStatus;
  location?: string;
  title?: string;
  userId?: number;
  categoryId?: number;
  page?: number;
  limit?: number;
}
