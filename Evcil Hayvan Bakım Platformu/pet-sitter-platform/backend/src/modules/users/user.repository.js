/**
 * User Repository
 * Handles direct database queries for user management
 */
const db = require('../../config/database');

class UserRepository {
  // ID'ye göre şifresiz temel kullanıcı bilgilerini getirir
  async findById(id) {
    const query = `
      SELECT id, name, email, role, is_active, terms_accepted, created_at 
      FROM users 
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  // Kullanıcının sadece adını/soyadını günceller
  async updateProfile(id, name) {
    const query = `
      UPDATE users 
      SET name = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2
      RETURNING id, name, email, role, is_active, created_at
    `;
    const result = await db.query(query, [name, id]);
    return result.rows[0];
  }

  // Kullanıcının aktiflik durumunu değiştirmek için (Admin kullanımı için)
  async updateStatus(id, isActive) {
    const query = `
      UPDATE users 
      SET is_active = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2
      RETURNING id, name, email, role, is_active
    `;
    const result = await db.query(query, [isActive, id]);
    return result.rows[0];
  }
}

module.exports = new UserRepository();