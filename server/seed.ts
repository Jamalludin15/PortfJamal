import { db } from "../shared/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  const username = "admin";
  const password = "jamal2121";

  // Check if admin user already exists
  const existingUsers = await db.select().from(users).where(eq(users.username, username));

  if (existingUsers.length > 0) {
    console.log("✅ Admin user already exists. Seeding skipped.");
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the admin user
  await db.insert(users).values({
    username: username,
    password: hashedPassword,
  });

  console.log("✅ Admin user created successfully!");
  console.log(`   Username: ${username}`);
  console.log(`   Password: ${password}`);
  console.log("\nNow you can log in to the admin dashboard.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("🌱 Seeding finished.");
    process.exit(0);
  }); 