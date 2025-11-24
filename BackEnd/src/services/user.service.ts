import prisma from '../lib/prisma';
import { CreateUserDTO, UpdateUserDTO, LoginDTO, AppError, IUser } from '../types';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

export class UserService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

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

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async registerUser(data: CreateUserDTO) {
    const existingUser = await this.getUserByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const existingUsername = await prisma.user.findFirst({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new AppError(409, 'Username already taken');
    }

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

    const token = this.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  static async loginUser(data: LoginDTO) {
    const user = await this.getUserByEmail(data.email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

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

  static generateToken(id: number, email: string, role: string): string {
    return jwt.sign(
      { id, email, role },
      this.JWT_SECRET,
      {
        expiresIn: this.JWT_EXPIRY as any,
      }
    );
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new AppError(401, 'Invalid or expired token');
    }
  }

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

  static async updateUser(id: number, data: UpdateUserDTO) {
    await this.getUserById(id);

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

  static async deleteUser(id: number) {
    await this.getUserById(id);

    return prisma.user.delete({
      where: { id },
    });
  }

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
