import prisma from '../lib/prisma';
import { CreateUserDTO, UpdateUserDTO, LoginDTO, AppError, IUser } from '../types';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

export class UserService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

  // Get all users
  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        role: true,
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
        role: true,
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
    });
  }

  // Register user
  static async registerUser(data: CreateUserDTO) {
    // Check if email already exists
    const existingUser = await this.getUserByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findFirst({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new AppError(409, 'Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        phoneNumber: data.phoneNumber,
        role: 'USER',
      },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  // Login user
  static async loginUser(data: LoginDTO) {
    const user = await this.getUserByEmail(data.email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  // Generate JWT token
  static generateToken(id: number, email: string, role: string): string {
    return jwt.sign(
      { id, email, role },
      this.JWT_SECRET,
      {
        expiresIn: this.JWT_EXPIRY as any,
      }
    );
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new AppError(401, 'Invalid or expired token');
    }
  }

  // Create user (for admin)
  static async createUser(data: CreateUserDTO) {
    const existingUser = await this.getUserByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        phoneNumber: data.phoneNumber,
        role: 'USER',
      },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // Update user
  static async updateUser(id: number, data: UpdateUserDTO) {
    await this.getUserById(id);

    // If email is being updated, check for duplicates
    if (data.email) {
      const existingUser = await this.getUserByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new AppError(409, 'Email already in use');
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
        role: true,
        createdAt: true,
      },
    });
  }

  // Delete user
  static async deleteUser(id: number) {
    await this.getUserById(id);

    return prisma.user.delete({
      where: { id },
    });
  }

  // Get user items
  static async getUserItems(userId: number) {
    await this.getUserById(userId);

    return prisma.item.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
