// This is a browser-compatible mock implementation of SQLite
// It uses localStorage to simulate a database

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Initialize database in localStorage if it doesn't exist
const initializeDb = () => {
  if (!localStorage.getItem("sqlite_tables")) {
    localStorage.setItem("sqlite_tables", JSON.stringify({}));
  }
};

// Get all tables
const getTables = () => {
  initializeDb();
  return JSON.parse(localStorage.getItem("sqlite_tables") || "{}");
};

// Save tables
const saveTables = (tables: Record<string, any[]>) => {
  localStorage.setItem("sqlite_tables", JSON.stringify(tables));
};

// Get a specific table
const getTable = (tableName: string) => {
  const tables = getTables();
  if (!tables[tableName]) {
    tables[tableName] = [];
    saveTables(tables);
  }
  return tables[tableName];
};

// Save a specific table
const saveTable = (tableName: string, data: any[]) => {
  const tables = getTables();
  tables[tableName] = data;
  saveTables(tables);
};

// Mock SQLite client for browser
export const sqlite = {
  // Execute a query (simplified - only handles CREATE TABLE)
  exec: (sql: string): void => {
    console.log("Executing SQL:", sql);
    // Extract table names from CREATE TABLE statements
    const createTableRegex = /CREATE TABLE IF NOT EXISTS (\w+)/g;
    let match;
    while ((match = createTableRegex.exec(sql)) !== null) {
      const tableName = match[1];
      getTable(tableName); // Initialize the table if it doesn't exist
    }
  },

  // Query data
  query: <T = any>(sql: string, params: any = {}): T[] => {
    console.log("Query:", sql, params);

    // Very basic SQL parsing - only handles simple SELECT queries
    if (sql.toLowerCase().includes("select count(*) as count from")) {
      const tableNameMatch = sql.match(/from\s+(\w+)/i);
      if (tableNameMatch) {
        const tableName = tableNameMatch[1];
        const table = getTable(tableName);

        // Handle WHERE clause (very simplified)
        let filteredTable = table;
        if (params && Array.isArray(params) && params.length > 0) {
          const whereValue = params[0];
          // Assuming the WHERE clause is for a role field
          filteredTable = table.filter((row) => row.role === whereValue);
        }

        return [{ count: filteredTable.length }] as unknown as T[];
      }
    }

    // Handle basic SELECT queries
    if (sql.toLowerCase().includes("select * from")) {
      const tableNameMatch = sql.match(/from\s+(\w+)/i);
      if (tableNameMatch) {
        const tableName = tableNameMatch[1];
        const table = getTable(tableName);

        // Handle WHERE clause (very simplified)
        if (
          sql.toLowerCase().includes("where") &&
          params &&
          Array.isArray(params)
        ) {
          const whereField = sql.match(/where\s+(\w+)\s*=/i)?.[1];
          const whereValue = params[0];

          if (whereField) {
            return table.filter((row) => row[whereField] === whereValue) as T[];
          }
        }

        return table as T[];
      }
    }

    return [] as T[];
  },

  // Get a single record
  queryOne: <T = any>(sql: string, params: any = {}): T | null => {
    const results = sqlite.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  },

  // Insert a record
  insert: (table: string, data: Record<string, any>): number => {
    const tableData = getTable(table);

    // If no ID is provided, generate one
    if (!data.id) {
      data.id = generateId();
    }

    // Add timestamps if they don't exist
    if (!data.created_at) {
      data.created_at = new Date().toISOString();
    }
    if (!data.updated_at) {
      data.updated_at = new Date().toISOString();
    }

    tableData.push(data);
    saveTable(table, tableData);

    return tableData.length;
  },

  // Update records
  update: (
    table: string,
    data: Record<string, any>,
    whereClause: string,
    whereParams: Record<string, any> = {},
  ): number => {
    const tableData = getTable(table);
    let updatedCount = 0;

    // Very simplified WHERE clause handling
    const whereField = whereClause.match(/(\w+)\s*=\s*:?(\w+)/)?.[1];
    const whereParamName =
      whereClause.match(/(\w+)\s*=\s*:(\w+)/)?.[2] || whereField;

    if (
      whereField &&
      whereParamName &&
      whereParams[whereParamName] !== undefined
    ) {
      const updatedData = tableData.map((row) => {
        if (row[whereField] === whereParams[whereParamName]) {
          updatedCount++;
          return { ...row, ...data, updated_at: new Date().toISOString() };
        }
        return row;
      });

      saveTable(table, updatedData);
    }

    return updatedCount;
  },

  // Delete records
  delete: (
    table: string,
    whereClause: string,
    whereParams: Record<string, any> = {},
  ): number => {
    const tableData = getTable(table);
    const originalLength = tableData.length;

    // Very simplified WHERE clause handling
    const whereField = whereClause.match(/(\w+)\s*=\s*:?(\w+)/)?.[1];
    const whereParamName =
      whereClause.match(/(\w+)\s*=\s*:(\w+)/)?.[2] || whereField;

    if (
      whereField &&
      whereParamName &&
      whereParams[whereParamName] !== undefined
    ) {
      const filteredData = tableData.filter(
        (row) => row[whereField] !== whereParams[whereParamName],
      );

      saveTable(table, filteredData);
      return originalLength - filteredData.length;
    }

    return 0;
  },

  // Transaction support (simplified)
  transaction: (fn: (db: typeof sqlite) => void): void => {
    // In a real implementation, this would handle rollbacks
    fn(sqlite);
  },

  // Close connection (no-op in browser)
  close: (): void => {
    console.log("SQLite connection closed");
  },
};

export default sqlite;
