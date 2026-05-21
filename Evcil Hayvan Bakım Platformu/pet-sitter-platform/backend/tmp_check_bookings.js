const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'pet_sitter_db',
  user: 'postgres',
  password: 'password123'
});
(async () => {
  try {
    const users = await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
    console.log('USERS', users.rows);
    const bookings = await pool.query('SELECT * FROM bookings ORDER BY id');
    console.log('BOOKINGS', bookings.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
