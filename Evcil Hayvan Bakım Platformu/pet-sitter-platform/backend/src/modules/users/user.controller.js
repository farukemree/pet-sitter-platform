/**
 * User Controller
 * Handles HTTP requests for user endpoints
 */
const userService = require('./user.service');

class UserController {
  // Giriş yapmış olan kullanıcının kendi detaylarını getirmesini sağlar
  async getProfile(req, res) {
    try {
      const userId = req.user.id; // authMiddleware'den gelen ID
      const user = await userService.getUserProfile(userId);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Kullanıcı bilgileri alınamadı'
      });
    }
  }

  // Profil bilgilerini güncelleme endpoint'i
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      const updatedUser = await userService.updateProfile(userId, { name });

      res.status(200).json({
        success: true,
        message: 'Profil bilgileri başarıyla güncellendi',
        data: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Profil güncelleme işlemi başarısız'
      });
    }
  }
}

module.exports = new UserController();