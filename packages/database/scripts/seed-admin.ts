import { db } from "../src/client";
import { users } from "../src/schema";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" });

async function seed() {
  const username = "admin";
  const password = "adminpassword"; // Change this immediately after first login
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Seeding admin user...");

  try {
    await db.insert(users).values({
      name: "Super Admin",
      username,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });
    console.log("Admin user seeded successfully!");
    console.log("Username: admin");
    console.log("Password: adminpassword");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

seed().then(() => process.exit());
