/**
 * SQLite Manager for PWA using sql.js
 * Uses IndexedDB for persistent storage
 * Provides same interface as React Native SQLite
 */

import { CreateTable } from './CreateTable';

// Types for sql.js
interface SqlJsStatic {
  Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
}

interface Database {
  run(sql: string, params?: (string | number | null | Uint8Array)[]): Database;
  exec(sql: string): { columns: string[]; values: unknown[][] }[];
  prepare(sql: string): Statement;
  export(): Uint8Array;
  close(): void;
  getRowsModified(): number;
}

interface Statement {
  bind(params?: (string | number | null | Uint8Array)[]): boolean;
  step(): boolean;
  getAsObject(): Record<string, unknown>;
  free(): boolean;
}

const DB_NAME = 'zyleminiplus_db';
const DB_STORE_NAME = 'sqlitedb';
const DB_VERSION = 1;

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;
let isInitialized = false;

/**
 * Initialize sql.js WASM
 */
const initSqlJsModule = async (): Promise<SqlJsStatic> => {
  if (SQL) return SQL;

  // Dynamic import for sql.js (CommonJS module)
  const sqlJsModule = await import('sql.js');
  const initSqlJs = sqlJsModule.default;

  SQL = await initSqlJs({
    // Load sql.js WASM from CDN
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
  });

  return SQL;
};

/**
 * Open IndexedDB for database persistence
 */
const openIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
        db.createObjectStore(DB_STORE_NAME);
      }
    };
  });
};

/**
 * Load database from IndexedDB
 */
const loadDatabaseFromIndexedDB = async (): Promise<Uint8Array | null> => {
  try {
    const idb = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = idb.transaction(DB_STORE_NAME, 'readonly');
      const store = transaction.objectStore(DB_STORE_NAME);
      const request = store.get('database');

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to load database from IndexedDB'));
      };
    });
  } catch (error) {
    console.error('Error loading database from IndexedDB:', error);
    return null;
  }
};

/**
 * Save database to IndexedDB
 */
const saveDatabaseToIndexedDB = async (data: Uint8Array): Promise<void> => {
  try {
    const idb = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = idb.transaction(DB_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(DB_STORE_NAME);
      const request = store.put(data, 'database');

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to save database to IndexedDB'));
      };
    });
  } catch (error) {
    console.error('Error saving database to IndexedDB:', error);
    throw error;
  }
};

/**
 * Initialize the database
 */
export const initDatabase = async (): Promise<Database> => {
  if (db && isInitialized) return db;

  try {
    const sqlModule = await initSqlJsModule();

    // Try to load existing database from IndexedDB
    const savedData = await loadDatabaseFromIndexedDB();

    if (savedData) {
      db = new sqlModule.Database(savedData);
      console.log('Database loaded from IndexedDB');
    } else {
      db = new sqlModule.Database();
      console.log('New database created');
    }

    isInitialized = true;
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Get the database instance
 */
export const getDatabase = async (): Promise<Database> => {
  if (!db || !isInitialized) {
    return await initDatabase();
  }
  return db;
};

/**
 * Create all tables
 */
export const createTables = async (): Promise<void> => {
  const database = await getDatabase();

  for (const tableName in CreateTable) {
    const createTableQuery = CreateTable[tableName];
    try {
      database.run(createTableQuery);
      // console.log(`Table ${tableName} created successfully`);
    } catch (error) {
      console.error(`Error creating table ${tableName}:`, error);
    }
  }

  // Save database after creating tables
  await saveDatabase();
};

/**
 * Save database to IndexedDB
 */
export const saveDatabase = async (): Promise<void> => {
  if (!db) return;

  try {
    const data = db.export();
    const buffer = new Uint8Array(data);
    await saveDatabaseToIndexedDB(buffer);
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

/**
 * Execute SQL query
 */
export const executeSql = async (
  query: string,
  params: unknown[] = []
): Promise<{ rows: unknown[]; rowsAffected: number }> => {
  const database = await getDatabase();

  try {
    database.run(query, params as (string | number | null | Uint8Array)[]);
    const changes = database.getRowsModified();
    await saveDatabase();
    return { rows: [], rowsAffected: changes };
  } catch (error) {
    console.error('Error executing SQL:', error, { query, params });
    throw error;
  }
};

/**
 * Execute SELECT query
 */
export const executeSelect = async <T = unknown>(
  query: string,
  params: unknown[] = []
): Promise<T[]> => {
  const database = await getDatabase();

  try {
    const stmt = database.prepare(query);
    stmt.bind(params as (string | number | null | Uint8Array)[]);

    const results: T[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject() as T;
      results.push(row);
    }
    stmt.free();

    return results;
  } catch (error) {
    console.error('Error executing SELECT:', error, { query, params });
    throw error;
  }
};

/**
 * Execute multiple queries in a transaction
 */
export const executeTransaction = async (
  queries: Array<{ sql: string; params?: unknown[] }>
): Promise<void> => {
  const database = await getDatabase();

  try {
    database.run('BEGIN TRANSACTION');

    for (const { sql, params = [] } of queries) {
      database.run(sql, params as (string | number | null | Uint8Array)[]);
    }

    database.run('COMMIT');
    await saveDatabase();
  } catch (error) {
    database.run('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  }
};

/**
 * Insert data with error tolerance
 */
export const insertDataWithErrorTolerance = async <T>(
  tableName: string,
  data: T[],
  insertQuery: string,
  getParams: (item: T) => unknown[],
  validateItem: (item: T) => { isValid: boolean; errorMsg?: string }
): Promise<{ successCount: number; errorCount: number; errorDetails: string[] }> => {
  const database = await getDatabase();

  let successCount = 0;
  let errorCount = 0;
  const errorDetails: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    // Validate item
    const validation = validateItem(item);
    if (!validation.isValid) {
      const errorMsg = `Invalid ${tableName} item at index ${i}: ${validation.errorMsg}`;
      console.error(errorMsg, item);
      errorCount++;
      errorDetails.push(errorMsg);
      continue;
    }

    try {
      const params = getParams(item);
      database.run(insertQuery, params as (string | number | null | Uint8Array)[]);
      successCount++;
    } catch (error) {
      const err = error as Error;
      const errorMsg = `SQL error inserting ${tableName} item ${i + 1}: ${err.message}`;
      console.error(errorMsg, { item, error });
      errorCount++;
      errorDetails.push(errorMsg);
    }
  }

  await saveDatabase();

  console.log(
    `${tableName} insertion summary: ${successCount} successful, ${errorCount} failed`
  );

  return { successCount, errorCount, errorDetails };
};

/**
 * Clear all data from a table
 */
export const clearTable = async (tableName: string): Promise<void> => {
  await executeSql(`DELETE FROM ${tableName}`);
};

/**
 * Drop a table
 */
export const dropTable = async (tableName: string): Promise<void> => {
  await executeSql(`DROP TABLE IF EXISTS ${tableName}`);
};

/**
 * Check if table exists
 */
export const tableExists = async (tableName: string): Promise<boolean> => {
  const result = await executeSelect<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
    [tableName]
  );
  return result.length > 0;
};

/**
 * Get count of rows in a table
 */
export const getRowCount = async (tableName: string): Promise<number> => {
  const result = await executeSelect<{ count: number }>(
    `SELECT COUNT(*) as count FROM ${tableName}`
  );
  return result[0]?.count || 0;
};

/**
 * Close the database
 */
export const closeDatabase = (): void => {
  if (db) {
    db.close();
    db = null;
    isInitialized = false;
  }
};

/**
 * Reset the database (clear all data and recreate tables)
 */
export const resetDatabase = async (): Promise<void> => {
  closeDatabase();

  // Clear IndexedDB
  try {
    const idb = await openIndexedDB();
    const transaction = idb.transaction(DB_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(DB_STORE_NAME);
    store.delete('database');
  } catch (error) {
    console.error('Error clearing IndexedDB:', error);
  }

  // Reinitialize
  await initDatabase();
  await createTables();
};

/**
 * Get database size in bytes
 */
export const getDatabaseSize = async (): Promise<number> => {
  if (!db) return 0;
  const data = db.export();
  return data.length;
};

// Export database object for direct access
export { db as SqlDB };

export default {
  initDatabase,
  getDatabase,
  createTables,
  saveDatabase,
  executeSql,
  executeSelect,
  executeTransaction,
  insertDataWithErrorTolerance,
  clearTable,
  dropTable,
  tableExists,
  getRowCount,
  closeDatabase,
  resetDatabase,
  getDatabaseSize,
};
