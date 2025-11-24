import axios, { AxiosInstance } from 'axios';
import { Item, Category, User, CreateItemRequest, UpdateItemRequest, PaginatedResponse, ApiResponse } from '../types';

class ApiClient {
  private api: AxiosInstance;
  private baseURL: string;
  private backendBaseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    this.backendBaseURL = this.baseURL.replace('/api', '');
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });

    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Set Content-Type to application/json only for non-FormData requests
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
      return config;
    });

    // Add response interceptor to convert relative image URLs to absolute URLs
    this.api.interceptors.response.use((response) => {
      if (response.data?.data) {
        this.convertImageUrls(response.data.data);
      }
      return response;
    });
  }

  // Helper method to convert relative image URLs to absolute URLs
  private convertImageUrls(data: any): void {
    if (Array.isArray(data)) {
      data.forEach((item) => this.convertImageUrls(item));
    } else if (data && typeof data === 'object') {
      if (data.imageUrl && typeof data.imageUrl === 'string' && data.imageUrl.startsWith('/uploads')) {
        data.imageUrl = `${this.backendBaseURL}${data.imageUrl}`;
      }
      // Recursively convert nested objects
      Object.values(data).forEach((value) => {
        if (typeof value === 'object') {
          this.convertImageUrls(value);
        }
      });
    }
  }

  // ===== ITEMS =====
  async getItems(filters?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    location?: string;
    title?: string;
    userId?: number;
    categoryId?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<PaginatedResponse<Item>> {
    const { data } = await this.api.get('/items', { params: filters });
    return data;
  }

  async getItemById(id: number): Promise<ApiResponse<Item>> {
    const { data } = await this.api.get(`/items/${id}`);
    return data;
  }

  async createItem(item: CreateItemRequest & { userId: number }): Promise<ApiResponse<Item>> {
    const { data } = await this.api.post('/items', item);
    return data;
  }

  async createItemWithImage(formData: FormData): Promise<ApiResponse<Item>> {
    // Let axios handle the Content-Type header automatically for FormData
    const { data } = await this.api.post('/items', formData);
    return data;
  }

  async updateItem(id: number, item: UpdateItemRequest): Promise<ApiResponse<Item>> {
    const { data } = await this.api.put(`/items/${id}`, item);
    return data;
  }

  async deleteItem(id: number): Promise<ApiResponse<null>> {
    const { data } = await this.api.delete(`/items/${id}`);
    return data;
  }

  async searchItems(query: string, searchType: 'location' | 'title'): Promise<ApiResponse<Item[]>> {
    const { data } = await this.api.get(`/items/search/${searchType}`, {
      params: { [searchType]: query },
    });
    return data;
  }

  // ===== CATEGORIES =====
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const { data } = await this.api.get('/categories');
    return data;
  }

  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    const { data } = await this.api.get(`/categories/${id}`);
    return data;
  }

  async createCategory(category: { name: string; icon?: string; formSchema?: any }): Promise<ApiResponse<Category>> {
    const { data } = await this.api.post('/categories', category);
    return data;
  }

  async updateCategory(id: number, category: { name?: string; icon?: string; formSchema?: any }): Promise<ApiResponse<Category>> {
    const { data } = await this.api.put(`/categories/${id}`, category);
    return data;
  }

  async deleteCategory(id: number): Promise<ApiResponse<null>> {
    const { data } = await this.api.delete(`/categories/${id}`);
    return data;
  }

  // ===== USERS =====
  async registerUser(user: { username: string; email: string; password: string; phoneNumber?: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    const { data } = await this.api.post('/users/auth/register', user);
    return data;
  }

  async loginUser(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    const { data } = await this.api.post('/users/auth/login', credentials);
    return data;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const { data } = await this.api.get('/users/auth/me');
    return data;
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    const { data } = await this.api.get('/users');
    return data;
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    const { data } = await this.api.get(`/users/${id}`);
    return data;
  }

  async createUser(user: { username: string; email: string; phoneNumber?: string }): Promise<ApiResponse<User>> {
    const { data } = await this.api.post('/users', user);
    return data;
  }

  async updateUser(id: number, user: { username?: string; email?: string; phoneNumber?: string }): Promise<ApiResponse<User>> {
    const { data } = await this.api.put(`/users/${id}`, user);
    return data;
  }

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    const { data } = await this.api.delete(`/users/${id}`);
    return data;
  }
}

export default new ApiClient();
