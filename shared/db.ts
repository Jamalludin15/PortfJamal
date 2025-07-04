import 'dotenv/config';
console.log('DATABASE_URL:', process.env.DATABASE_URL);
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL!);
export const db = drizzle(pool); 