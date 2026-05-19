/**
 * Authentication Service Unit Tests
 */

const authService = require('../../src/modules/auth/auth.service');
const bcrypt = require('bcrypt');
const db = require('../../src/config/database');

jest.mock('../../src/config/database');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'owner',
        terms_accepted: true,
        is_active: true,
        created_at: new Date()
      };

      db.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockUser] });

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'owner',
        termsAccepted: true
      };

      const result = await authService.register(userData);

      expect(result).toEqual(mockUser);
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it('should throw error if email already exists', async () => {
      const existingUser = { id: 1, email: 'existing@example.com' };
      db.query.mockResolvedValueOnce({ rows: [existingUser] });

      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
        role: 'owner',
        termsAccepted: true
      };

      await expect(authService.register(userData)).rejects.toThrow(
        'Bu e-posta adresi zaten kayıtlı'
      );
    });

    it('should throw error if terms not accepted', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'owner',
        termsAccepted: false
      };

      await expect(authService.register(userData)).rejects.toThrow(
        'Kullanıcı sözleşmesini kabul etmelisiniz'
      );
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password_hash: await bcrypt.hash('password123', 10),
        role: 'owner',
        is_active: true,
        terms_accepted: true
      };

      db.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await authService.login('test@example.com', 'password123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user).not.toHaveProperty('password_hash');
    });

    it('should throw error if user not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Geçersiz e-posta veya şifre');
    });
  });
});
