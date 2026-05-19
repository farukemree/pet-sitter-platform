/**
 * User Service
 * Manages business logic and validation for user operations
 */
const userRepository = require('./user.repository');

class UserService {
  async getUserProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }
    return user;
  }

  async updateProfile(userId, { name }) {
    if (!name || name.trim().length < 2) {
      throw new Error('İsim en az 2 karakter uzunluğunda olmalıdır');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Güncellenmek istenen kullanıcı bulunamadı');
    }

    return await userRepository.updateProfile(userId, name.trim());
  }
}

module.exports = new UserService();