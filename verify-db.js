import { db } from './server/db.js';
import * as schema from './shared/schema.js';

async function verifyDatabase() {
  try {
    console.log("Checking database tables...");
    // List all tables in the database
    const tables = await db.query.sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log("Tables in the database:", tables.map(t => t.table_name));

    console.log("\nChecking for schema enums...");
    const enums = await db.query.sql`
      SELECT t.typname as enum_name, 
             e.enumlabel as enum_value
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid 
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      ORDER BY enum_name, e.enumsortorder;
    `;
    
    const enumsByName = {};
    for (const row of enums) {
      if (!enumsByName[row.enum_name]) {
        enumsByName[row.enum_name] = [];
      }
      enumsByName[row.enum_name].push(row.enum_value);
    }
    
    console.log("Enums in the database:", enumsByName);
    
    process.exit(0);
  } catch (error) {
    console.error("Error verifying database:", error);
    process.exit(1);
  }
}

verifyDatabase();