const { sql } = require('@vercel/postgres');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function check() {
  try {
    console.log('Connecting to:', process.env.POSTGRES_URL);
    const result =
      await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log(
      'Tables found:',
      result.rows.map((r) => r.table_name)
    );

    const userCount = await sql`SELECT count(*) FROM users`;
    console.log('Total users:', userCount.rows[0].count);

    if (result.rows.length === 0) {
      console.log('Database is empty.');
    }
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

check();
