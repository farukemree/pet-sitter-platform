/**
 * Message Repository
 * Handles direct database queries for the messaging system
 */
const db = require('../../config/database');

class MessageRepository {
  // Yeni bir mesajı veri tabanına kaydeder
  async create(senderId, receiverId, content) {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, sender_id, receiver_id, content, is_read, created_at
    `;
    const values = [senderId, receiverId, content];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // İki kullanıcı arasındaki tüm konuşma geçmişini getirir
  async getChatHistory(userId, chatPartnerId) {
    const query = `
      SELECT id, sender_id, receiver_id, content, is_read, created_at
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
    `;
    const result = await db.query(query, [userId, chatPartnerId]);
    return result.rows;
  }

  async getConversations(userId) {
    const query = `
      SELECT
        sub.partner_id,
        u.name AS partner_name,
        sub.last_message,
        sub.last_message_at,
        sub.unread_count
      FROM (
        SELECT
          CASE
            WHEN sender_id = $1 THEN receiver_id
            ELSE sender_id
          END AS partner_id,
          content AS last_message,
          created_at AS last_message_at,
          SUM(CASE WHEN receiver_id = $1 AND is_read = false THEN 1 ELSE 0 END) OVER (PARTITION BY CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END) AS unread_count,
          ROW_NUMBER() OVER (PARTITION BY CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END ORDER BY created_at DESC) AS rn
        FROM messages
        WHERE sender_id = $1 OR receiver_id = $1
      ) sub
      JOIN users u ON u.id = sub.partner_id
      WHERE sub.rn = 1
      ORDER BY sub.last_message_at DESC
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }

  // Okunmamış mesajları "okundu" olarak işaretler
  async markAsRead(receiverId, senderId) {
    const query = `
      UPDATE messages
      SET is_read = true
      WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false
    `;
    await db.query(query, [receiverId, senderId]);
    return true;
  }
}

module.exports = new MessageRepository();