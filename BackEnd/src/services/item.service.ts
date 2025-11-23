import prisma from '../lib/prisma';
import { CreateItemDTO, UpdateItemDTO, AppError } from '../types';

export class ItemService {
  // Get all items with pagination
  static async getAllItems(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phoneNumber: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.item.count(),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  // Get item by ID
  static async getItemById(id: number) {
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phoneNumber: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });

    if (!item) {
      throw new AppError(404, `Item with ID ${id} not found`);
    }

    return item;
  }

  // Get items by user
  static async getItemsByUser(userId: number) {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, `User with ID ${userId} not found`);
    }

    return prisma.item.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get items by type (LOST or FOUND)
  static async getItemsByType(type: string) {
    const validTypes = ['LOST', 'FOUND'];
    if (!validTypes.includes(type)) {
      throw new AppError(400, `Invalid item type. Must be one of: ${validTypes.join(', ')}`);
    }

    return prisma.item.findMany({
      where: { type: type as any },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get items by status
  static async getItemsByStatus(status: string) {
    const validStatuses = ['OPEN', 'RESOLVED'];
    if (!validStatuses.includes(status)) {
      throw new AppError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    return prisma.item.findMany({
      where: { status: status as any },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Search items by location
  static async searchByLocation(location: string) {
    return prisma.item.findMany({
      where: {
        location: {
          contains: location,
          mode: 'insensitive',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });
  }

  // Search items by title
  static async searchByTitle(title: string) {
    return prisma.item.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });
  }

  // Create item
  static async createItem(data: CreateItemDTO) {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new AppError(404, `User with ID ${data.userId} not found`);
    }

    // Check if category exists (if provided)
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new AppError(404, `Category with ID ${data.categoryId} not found`);
      }
    }

    return prisma.item.create({
      data: {
        userId: data.userId,
        categoryId: data.categoryId,
        type: data.type,
        title: data.title,
        description: data.description,
        location: data.location,
        dateIncident: data.dateIncident,
        imageUrl: data.imageUrl,
        contactInfo: data.contactInfo,
        additionalData: data.additionalData,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });
  }

  // Update item
  static async updateItem(id: number, data: UpdateItemDTO) {
    await this.getItemById(id); // Check if item exists

    // Check if category exists (if provided in update)
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new AppError(404, `Category with ID ${data.categoryId} not found`);
      }
    }

    return prisma.item.update({
      where: { id },
      data: {
        categoryId: data.categoryId,
        type: data.type,
        title: data.title,
        description: data.description,
        location: data.location,
        dateIncident: data.dateIncident,
        imageUrl: data.imageUrl,
        contactInfo: data.contactInfo,
        additionalData: data.additionalData,
        status: data.status,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });
  }

  // Delete item
  static async deleteItem(id: number) {
    await this.getItemById(id); // Check if item exists

    return prisma.item.delete({
      where: { id },
    });
  }
}
