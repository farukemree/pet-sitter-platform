/**
 * Profile Service
 * Manages business logic for sitter profiles
 */
const profileRepository = require('./profile.repository');

class ProfileService {
  async getProfile(userId) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw new Error('Bakıcı profili bulunamadı');
    }
    return profile;
  }

  async upsertProfile(userId, userRole, profileData) {
    // Güvenlik Kontrolü: Sadece bakıcılar profil oluşturabilir/güncelleyebilir
    if (userRole !== 'sitter') {
      throw new Error('Sadece bakıcı (sitter) rolündeki kullanıcılar profil yönetebilir');
    }

    this.validateProfileInput(profileData);

    const existingProfile = await profileRepository.findByUserId(userId);
    
    if (existingProfile) {
      return await profileRepository.update(userId, profileData);
    } else {
      return await profileRepository.create(userId, profileData);
    }
  }

  validateProfileInput({ bio, experienceYears, petTypesAllowed }) {
    if (bio && bio.trim().length < 10) {
      throw new Error('Biyografi alanı en az 10 karakter olmalıdır');
    }
    if (experienceYears !== undefined && (isNaN(experienceYears) || experienceYears < 0)) {
      throw new Error('Geçerli bir deneyim yılı giriniz');
    }
    if (petTypesAllowed && !Array.isArray(petTypesAllowed)) {
      throw new Error('Kabul edilen hayvan türleri bir dizi (array) olmalıdır');
    }
  }
}

module.exports = new ProfileService();