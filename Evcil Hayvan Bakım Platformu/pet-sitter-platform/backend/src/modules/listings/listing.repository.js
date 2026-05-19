/**
 * Listing Repository
 * Handles direct database queries for the pet sitting listings
 */
const db = require('../../config/database');

class ListingRepository {
  // Yeni bir ilanı veri tabanına kaydeder
  async create(sitterId, { title, description, pricePerDay, location }) {
    const query = `
      INSERT INTO listings (sitter_id, title, description, price_per_day, location, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, sitter_id, title, description, price_per_day, location, is_active, created_at
    `;
    const values = [sitterId, title, description, pricePerDay, location, true];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Tüm aktif ilanları, ilan açan bakıcının ismiyle birlikte getirir
  async findAllActive() {
    const query = `
      SELECT l.*, u.name as sitter_name 
      FROM listings l
      JOIN users u ON l.sitter_id = u.id
      WHERE l.is_active = true
      ORDER BY l.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  // Belirli bir ilanı ID'sine göre getirir
  async findById(id) {
    const query = 'SELECT * FROM listings WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }
}

module.exports = new ListingRepository();