const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const http = require('http');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'pet_sitter_db',
  user: 'postgres',
  password: 'password123'
});
(async () => {
  try {
    const users = await pool.query('SELECT id, name, email, role FROM users WHERE role = $1 LIMIT 1', ['sitter']);
    if (users.rows.length === 0) {
      console.error('No sitter user found');
      return;
    }
    const sitter = users.rows[0];
    const token = jwt.sign({id:sitter.id,email:sitter.email,role:sitter.role}, 'super-secret-local-development-key-123456', {expiresIn:'24h'});
    console.log('SITTER', sitter);

    const data = JSON.stringify({status:'accepted'});
    const options = {
      hostname:'localhost', port:5000, path:'/api/bookings/2/status', method:'PATCH',
      headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data), Authorization:'Bearer '+token}
    };
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log('STATUS', res.statusCode);
        console.log(body);
        pool.end();
      });
    });
    req.on('error', err => { console.error('ERROR', JSON.stringify(err, Object.getOwnPropertyNames(err))); pool.end(); });
    req.write(data);
    req.end();
  } catch(err) {
    console.error('EXC', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    await pool.end();
  }
})();
