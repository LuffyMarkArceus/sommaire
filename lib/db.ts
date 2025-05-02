"use server";
import { neon } from "@neondatabase/serverless";

export async function getDbConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables.");
  }
  // Initialize the Neon database connection using the provided URL
  const sql = neon(process.env.DATABASE_URL);
  return sql;
}
