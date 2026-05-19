/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */

const authService = require('./auth.service');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, role, termsAccepted } = req.body;
      const user = await authService.register({ name, email, password, role, termsAccepted });

      const token = authService.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      res.status(201).json({
        success: true,
        message: 'Kayıt başarılı',
        data: { user, token }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Kayıt işlemi başarısız'
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Giriş başarılı',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Giriş başarısız'
      });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const user = await authService.findUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }

      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Kullanıcı bilgisi alınamadı'
      });
    }
  }

  async logout(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'Çıkış başarılı'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Çıkış işlemi başarısız'
      });
    }
  }

  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Mevcut şifre ve yeni şifre gereklidir'
        });
      }

      await authService.changePassword(userId, oldPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Şifre başarıyla değiştirildi'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Şifre değiştirme başarısız'
      });
    }
  }

  async verifyToken(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'Token geçerli',
        data: { user: req.user }
      });
    } catch (error) {
      console.error('Verify token error:', error);
      res.status(401).json({
        success: false,
        message: 'Token doğrulanamadı'
      });
    }
  }
}

module.exports = new AuthController();

