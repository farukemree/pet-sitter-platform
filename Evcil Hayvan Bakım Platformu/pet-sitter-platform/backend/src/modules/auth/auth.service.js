/**
 * Authentication Service
 * Handles user registration, login, and password management
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

class AuthService {
  async register({ name, email, password, role, termsAccepted }) {
    this.validateRegistrationInput({ name, email, password, role, termsAccepted });

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Bu e-posta adresi zaten kayıtlı');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const query = `
      INSERT INTO users (name, email, password_hash, role, terms_accepted, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, role, terms_accepted, is_active, created_at
    `;
    const values = [name, email, passwordHash, role, termsAccepted, true];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Database error during registration:', error);
      throw new Error('Kayıt işlemi sırasında bir hata oluştu');
    }
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('E-posta ve şifre gereklidir');
    }

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('Geçersiz e-posta veya şifre');
    }

    if (!user.is_active) {
      throw new Error('Hesabınız aktif değil. Lütfen destek ekibi ile iletişime geçin');
    }

    if (!user.terms_accepted) {
      throw new Error('Kullanıcı sözleşmesini kabul etmelisiniz');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Geçersiz e-posta veya şifre');
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async findUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
      const result = await db.query(query, [email.toLowerCase()]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error while finding user:', error);
      throw new Error('Kullanıcı sorgulama hatası');
    }
  }

  async findUserById(userId) {
    const query = 'SELECT id, name, email, role, is_active, terms_accepted, created_at FROM users WHERE id = $1';
    try {
      const result = await db.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error while finding user by ID:', error);
      throw new Error('Kullanıcı sorgulama hatası');
    }
  }

  generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Geçersiz veya süresi dolmuş token');
    }
  }

  validateRegistrationInput({ name, email, password, role, termsAccepted }) {
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push('İsim en az 2 karakter olmalıdır');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push('Geçerli bir e-posta adresi giriniz');
    }

    if (!password || password.length < 6) {
      errors.push('Şifre en az 6 karakter olmalıdır');
    }

    if (!role || !['owner', 'sitter'].includes(role)) {
      errors.push('Geçerli bir rol seçiniz (owner veya sitter)');
    }

    if (termsAccepted !== true) {
      errors.push('Kullanıcı sözleşmesini kabul etmelisiniz');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [userId]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isOldPasswordValid) {
      throw new Error('Mevcut şifre hatalı');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('Yeni şifre en az 6 karakter olmalıdır');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const updateQuery = 'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await db.query(updateQuery, [newPasswordHash, userId]);

    return true;
  }
}

module.exports = new AuthService();
