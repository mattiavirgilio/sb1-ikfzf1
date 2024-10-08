import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

export async function executeQuery(query: string, params: any[] = []) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request();
    
    params.forEach((param, index) => {
      result.input(`param${index}`, param);
    });
    
    result = await result.query(query);
    return result.recordset;
  } catch (error) {
    console.error('SQL error', error);
    throw error;
  }
}