const db = require('../../config/database');

class BookingRepository {
  async findListingById(listingId) {
    const query = `
      SELECT 
        l.*,
        u.name AS sitter_name
      FROM listings l
      JOIN users u ON u.id = l.sitter_id
      WHERE l.id = $1 AND l.is_active = true
    `;

    const result = await db.query(query, [listingId]);
    return result.rows[0] || null;
  }

  async create({ listingId, ownerId, sitterId, startDate, endDate, petName, petType, note }) {
    const query = `
      INSERT INTO bookings (
        listing_id,
        owner_id,
        sitter_id,
        start_date,
        end_date,
        pet_name,
        pet_type,
        note,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      RETURNING *
    `;

    const values = [
      listingId,
      ownerId,
      sitterId,
      startDate,
      endDate,
      petName,
      petType,
      note
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findByOwner(ownerId) {
    const query = `
      SELECT
        b.*,
        l.title AS listing_title,
        l.location AS listing_location,
        l.price_per_day,
        sitter.name AS sitter_name
      FROM bookings b
      JOIN listings l ON l.id = b.listing_id
      JOIN users sitter ON sitter.id = b.sitter_id
      WHERE b.owner_id = $1
      ORDER BY b.created_at DESC
    `;

    const result = await db.query(query, [ownerId]);
    return result.rows;
  }

  async findBySitter(sitterId) {
    const query = `
      SELECT
        b.*,
        l.title AS listing_title,
        l.location AS listing_location,
        l.price_per_day,
        owner.name AS owner_name
      FROM bookings b
      JOIN listings l ON l.id = b.listing_id
      JOIN users owner ON owner.id = b.owner_id
      WHERE b.sitter_id = $1
      ORDER BY b.created_at DESC
    `;

    const result = await db.query(query, [sitterId]);
    return result.rows;
  }

  async findById(bookingId) {
    const query = 'SELECT * FROM bookings WHERE id = $1';
    const result = await db.query(query, [bookingId]);
    return result.rows[0] || null;
  }

  async updateStatus(bookingId, sitterId, status) {
    const query = `
      UPDATE bookings
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND sitter_id = $3
      RETURNING *
    `;

    const result = await db.query(query, [status, bookingId, sitterId]);
    return result.rows[0] || null;
  }
}

module.exports = new BookingRepository();