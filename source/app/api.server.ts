import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type TUser = {
  id?: number;
  firstName?: string;
  lastName?: string;
  age?: number;
  image?: string;
  email?: string;
  favorite?: boolean;
  address?: {
    country?: string;
    city?: string;
    address?: string;
  };
};

type TPost = {
  id?: number;
  title?: string;
  body?: string;
  userId?: number;
  tags?: string[];
  reactions?: {
    likes?: number;
    dislikes?: number;
  };
};

export async function getUsers(): Promise<TUser[]> {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [{ id: 1, firstName: "Failed to fetch" }];
  }
}

export async function searchUsers(query: string): Promise<TUser[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    });
    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    return [{ id: 1, firstName: "Failed to fetch" }];
  }
}

export async function getUserById(id: string): Promise<TUser> {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    return user || { id: 1, firstName: "Failed to fetch" };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return { id: 1, firstName: "Failed to fetch" };
  }
}

export async function createEmptyUser(): Promise<TUser> {
  try {
    const createdUser = await prisma.user.create({
      data: {
        firstName: "",
        lastName: "",
        email: "",
      },
    });
    return createdUser;
  } catch (error) {
    console.error("Error creating empty user:", error);
    return { id: 1, firstName: "Failed to fetch" };
  }
}

export async function updateUser(id: string, data: TUser): Promise<TUser> {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...data,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    return { id: 1, firstName: "Failed to fetch" };
  }
}

export async function deleteUser(id: string): Promise<TUser> {
  try {
    const deletedUser = await prisma.user.delete({ where: { id: Number(id) } });
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    return { id: 1, firstName: "Failed to fetch" };
  }
}

export async function getUserPosts(id: string): Promise<TPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { userId: Number(id) },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [{ id: 1, title: "Failed to fetch posts" }];
  }
}
