/**
 * Profile Repository
 * Handles direct database queries for sitter profiles
 */
const db = require('../../config/database');

class ProfileRepository {
  async findByUserId(userId) {
    const query = 'SELECT * FROM sitter_profiles WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return result.rows[0] || null;
  }

  async create(userId, { bio, experienceYears, petTypesAllowed, active }) {
    const query = `
      INSERT INTO sitter_profiles (user_id, bio, experience_years, pet_types_allowed, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [userId, bio, experienceYears, petTypesAllowed, active ?? true];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async update(userId, { bio, experienceYears, petTypesAllowed, active }) {
    const query = `
      UPDATE sitter_profiles
      SET bio = COALESCE($2, bio),
          experience_years = COALESCE($3, experience_years),
          pet_types_allowed = COALESCE($4, pet_types_allowed),
          is_active = COALESCE($5, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *
    `;
    const values = [userId, bio, experienceYears, petTypesAllowed, active];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = new ProfileRepository();