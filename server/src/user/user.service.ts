import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {} // Inject PrismaService

  async registerUser(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number | string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: +id,
      },
    });
    console.log(user);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async createUser(data: { email: string; name?: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword, // Save hashed password
      },
    });
  }

  async updateUser(id: number, data: Partial<{ email: string; name: string }>) {
    return this.prisma.user.update({
      where: { id: +id },
      data: {
        ...data,
        // You don't need to set `updatedAt`; Prisma will handle it automatically
      },
    });
  }

  async deleteUser(id: number | string) {
    const user = await this.prisma.user.findUnique({ where: { id: +id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({
      where: { id: +id },
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }
}
