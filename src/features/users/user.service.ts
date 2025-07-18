import prisma from "@utils/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NotFoundError, BadRequestError } from "@middlewares/errorHandler";
import { string } from "zod";

export class UserService {
  async createUser(data: {
    name?: string;
    email: string;
    password: string;
  }): Promise<Omit<User, "password">> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
      });

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error: any) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        throw new BadRequestError("User already exists");
      }
      throw error;
    }
  }
  async getAllUsers(): Promise<Omit<User, "password">[]> {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return allUsers;
  }

  async getUserById(id: string): Promise<Omit<User, "password"> | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    return user;
  }

  async updateUser(
    id: string,
    data: { name?: string; email?: string; password?: string }
  ): Promise<Omit<User, "password">> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    try {
      const updatedData: any = {};
      if (data.name) updatedData.name = data.name;
      if (data.email) updatedData.email = data.email;
      if (data.password) {
        updatedData.password = await bcrypt.hash(data.password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updatedData,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError(`User with ID: ${id} not found for update.`);
      }
      throw error;
    }
  }
  async deleteUser(id: string): Promise<Omit<User, "password">> {
    try {
      const user = await prisma.user.delete({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError(`User with the ID: ${id} not found.`);
      }
	  throw error;
    }
  }
}
