import prisma from '../lib/prisma';
import { CreateUserDTO, UpdateUserDTO, AppError } from '../types';

export class UserService {
  // Get all users
  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
      },
    });
  }

  // Get user by ID
  static async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, `User with ID ${id} not found`);
    }

    return user;
  }

  // Get user by email
  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
      },
    });
  }

  // Create user
  static async createUser(data: CreateUserDTO) {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    return prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
      },
    });
  }

  // Update user
  static async updateUser(id: number, data: UpdateUserDTO) {
    await this.getUserById(id); // Check if user exists

    // If email is being updated, check for duplicates
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new AppError(400, 'Email already in use');
      }
    }

    return prisma.user.update({
      where: { id },
      data: {
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
      },
    });
  }

  // Delete user
  static async deleteUser(id: number) {
    await this.getUserById(id); // Check if user exists

    return prisma.user.delete({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  }
}
