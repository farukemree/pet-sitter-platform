/**
 * Listing Service
 * Manages business logic and rules for listings
 */
const listingRepository = require('./listing.repository');

class ListingService {
  async createNewListing(sitterId, userRole, listingData) {
    // Güvenlik kuralı: Sadece bakıcılar ilan açabilir
    if (userRole !== 'sitter') {
      throw new Error('Yalnızca bakıcı (sitter) rolündeki kullanıcılar ilan oluşturabilir');
    }

    this.validateListingInput(listingData);

    return await listingRepository.create(sitterId, listingData);
  }

  async getAllListings() {
    return await listingRepository.findAllActive();
  }

  validateListingInput({ title, pricePerDay, location }) {
    if (!title || title.trim().length < 5) {
      throw new Error('İlan başlığı en az 5 karakter uzunluğunda olmalıdır');
    }
    if (!pricePerDay || isNaN(pricePerDay) || pricePerDay <= 0) {
      throw new Error('Geçerli bir günlük ücret belirtmelisiniz');
    }
    if (!location || location.trim().length < 2) {
      throw new Error('Geçerli bir konum (ilçe/semt) girmelisiniz');
    }
  }
}

module.exports = new ListingService();