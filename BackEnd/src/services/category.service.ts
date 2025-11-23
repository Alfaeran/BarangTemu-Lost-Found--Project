import prisma from '../lib/prisma';
import { CreateCategoryDTO, UpdateCategoryDTO, AppError } from '../types';

export class CategoryService {
  // Get all categories
  static async getAllCategories() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { items: true },
        },
      },
    });
  }

  // Get category by ID
  static async getCategoryById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    if (!category) {
      throw new AppError(404, `Category with ID ${id} not found`);
    }

    return category;
  }

  // Create category
  static async createCategory(data: CreateCategoryDTO) {
    return prisma.category.create({
      data: {
        name: data.name,
        icon: data.icon,
        formSchema: data.formSchema,
      },
    });
  }

  // Update category
  static async updateCategory(id: number, data: UpdateCategoryDTO) {
    await this.getCategoryById(id); // Check if category exists

    return prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        icon: data.icon,
        formSchema: data.formSchema,
      },
    });
  }

  // Delete category
  static async deleteCategory(id: number) {
    await this.getCategoryById(id); // Check if category exists

    return prisma.category.delete({
      where: { id },
    });
  }

  // Get items by category
  static async getItemsByCategory(categoryId: number) {
    const category = await this.getCategoryById(categoryId);

    const items = await prisma.item.findMany({
      where: { categoryId },
    });

    return {
      category,
      items,
    };
  }
}
