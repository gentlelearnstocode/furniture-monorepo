"use server";

import { db } from "@repo/database";
import { users } from "@repo/database/schema";
import { auth } from "@/auth";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(["admin", "editor"]),
});

export async function createUser(data: z.infer<typeof createUserSchema>) {
  const session = await auth();
  
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized: Only admins can create users");
  }

  const validated = createUserSchema.parse(data);
  const hashedPassword = await bcrypt.hash(validated.password, 10);

  try {
    await db.insert(users).values({
      name: validated.name,
      username: validated.username,
      password: hashedPassword,
      role: validated.role,
      isActive: true,
    });
    
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Username already exists" };
  }
}

export async function toggleUserStatus(id: string) {
  const session = await auth();
  
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  // Prevent self-deactivation (optional but recommended)
  if (session.user.id === id) {
    return { error: "You cannot deactivate your own account" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) return { error: "User not found" };

  await db.update(users)
    .set({ isActive: !user.isActive, updatedAt: new Date() })
    .where(eq(users.id, id));

  revalidatePath("/users");
  return { success: true };
}

export async function deleteUser(id: string) {
  const session = await auth();
  
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  if (session.user.id === id) {
    return { error: "You cannot delete your own account" };
  }

  await db.delete(users).where(eq(users.id, id));

  revalidatePath("/users");
  return { success: true };
}
