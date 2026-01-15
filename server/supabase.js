require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
// if (true) {
  console.log('⚠️ No Supabase credentials found. Using in-memory database (data will be lost on restart).');
  console.warn('⚠️ Supabase credentials not found. Using in-memory mock database.');
  
  // Simple in-memory mock for development without keys
  const mockDb = {
    meetings: {},
    participants: {}
  };

  supabase = {
    from: (table) => {
      return {
        insert: (dataOrArray) => {
          const data = Array.isArray(dataOrArray) ? dataOrArray : [dataOrArray];
          const result = data.map(item => {
             // Generate simplistic IDs for mock
            const id = item.id || Math.random().toString(36).substring(7);
            const newItem = { ...item, id, created_at: new Date().toISOString() };
            
            if (!mockDb[table]) mockDb[table] = {};
            mockDb[table][id] = newItem;
            return newItem;
          });
          
          // Return chainable object
          return {
              select: () => ({
                  single: async () => ({ data: result[0], error: null }),
                  then: (resolve) => resolve({ data: result, error: null })
              }),
              then: (resolve) => resolve({ data: null, error: null }) // Default insert returns null data if select not chained
          };
        },
        select: (columns) => ({
           eq: (column, value) => {
               const rows = mockDb[table] ? Object.values(mockDb[table]).filter(row => row[column] === value) : [];
               
               return { 
                   single: async () => ({ data: rows.length > 0 ? rows[0] : null, error: null }),
                   then: (resolve) => resolve({ data: rows, error: null })
               };
           }
        }),
        update: (updates) => ({
          eq: (column, value) => {
             if (mockDb[table]) {
                 // Find and update
                 Object.values(mockDb[table]).forEach(row => {
                     if (row[column] === value) {
                         Object.assign(row, updates);
                     }
                 });
             }
             return {
                 then: (resolve) => resolve({ data: null, error: null })
             };
          }
        })
      };
    },
    // Mock RPC calls if needed
    rpc: async (func, args) => { return { data: null, error: null }; }
  };
}

module.exports = supabase;
