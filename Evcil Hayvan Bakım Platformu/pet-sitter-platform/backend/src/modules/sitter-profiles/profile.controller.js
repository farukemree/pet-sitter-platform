/**
 * Profile Controller
 * Handles HTTP requests for sitter profiles
 */
const profileService = require('./profile.service');

class ProfileController {
  async getMyProfile(req, res) {
    try {
      const userId = req.user.id; // authMiddleware'den gelecek
      const profile = await profileService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Profil getirme başarısız'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { bio, experienceYears, petTypesAllowed, active } = req.body;

      const profile = await profileService.upsertProfile(userId, userRole, {
        bio,
        experienceYears,
        petTypesAllowed,
        active
      });

      res.status(200).json({
        success: true,
        message: 'Bakıcı profili başarıyla güncellendi',
        data: profile
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Profil güncelleme başarısız'
      });
    }
  }
}

module.exports = new ProfileController();