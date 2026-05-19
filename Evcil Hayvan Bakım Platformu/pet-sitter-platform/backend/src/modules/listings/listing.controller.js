/**
 * Listing Controller
 * Handles HTTP requests for pet sitting listings
 */
const listingService = require('./listing.service');

class ListingController {
  // Yeni ilan oluşturma endpoint'i
  async create(req, res) {
    try {
      const sitterId = req.user.id;
      const userRole = req.user.role;
      const { title, description, pricePerDay, location } = req.body;

      const listing = await listingService.createNewListing(sitterId, userRole, {
        title,
        description,
        pricePerDay,
        location
      });

      res.status(201).json({
        success: true,
        message: 'İlanınız başarıyla yayına alındı',
        data: listing
      });
    } catch (error) {
      console.error('Create listing error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'İlan oluşturulamadı'
      });
    }
  }

  // Tüm aktif ilanları listeleme endpoint'i
  async listAll(req, res) {
    try {
      const listings = await listingService.getAllListings();
      res.status(200).json({
        success: true,
        data: listings
      });
    } catch (error) {
      console.error('List listings error:', error);
      res.status(500).json({
        success: false,
        message: 'İlanlar getirilirken bir sistem hatası oluştu'
      });
    }
  }
}

module.exports = new ListingController();