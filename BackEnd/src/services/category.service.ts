import prisma from '../lib/prisma';
import { CreateCategoryDTO, UpdateCategoryDTO, AppError } from '../types';

export class CategoryService {
  static async getAllCategories() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { items: true },
        },
      },
    });
  }

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

  static async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    if (!category) {
      throw new AppError(404, `Category with slug '${slug}' not found`);
    }

    return category;
  }

  static async createCategory(data: CreateCategoryDTO) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingCategory) {
      throw new AppError(409, `Category with slug '${data.slug}' already exists`);
    }

    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        icon: data.icon,
        formSchema: data.formSchema,
      },
    });
  }

  static async updateCategory(id: number, data: UpdateCategoryDTO) {
    await this.getCategoryById(id);

    if (data.slug) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: data.slug },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new AppError(409, `Category with slug '${data.slug}' already exists`);
      }
    }

    return prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        icon: data.icon,
        formSchema: data.formSchema,
      },
    });
  }

  static async deleteCategory(id: number) {
    await this.getCategoryById(id);

    return prisma.category.delete({
      where: { id },
    });
  }

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

  static async getItemsByCategorySlug(slug: string) {
    const category = await this.getCategoryBySlug(slug);

    const items = await prisma.item.findMany({
      where: { categoryId: category.id },
    });

    return {
      category,
      items,
    };
  }
}

