const bookingService = require('./booking.service');

class BookingController {
  async create(req, res) {
    try {
      const booking = await bookingService.createBooking(req.user, req.body);

      res.status(201).json({
        success: true,
        message: 'Rezervasyon talebiniz oluşturuldu',
        data: booking
      });
    } catch (error) {
      console.error('Create booking error:', error);

      res.status(400).json({
        success: false,
        message: error.message || 'Rezervasyon oluşturulamadı'
      });
    }
  }

  async getMyBookings(req, res) {
    try {
      const bookings = await bookingService.getMyBookings(req.user);

      res.status(200).json({
        success: true,
        data: bookings
      });
    } catch (error) {
      console.error('Get bookings error:', error);

      res.status(400).json({
        success: false,
        message: error.message || 'Rezervasyonlar getirilemedi'
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const bookingId = req.params.id;
      const { status } = req.body;

      const booking = await bookingService.updateBookingStatus(req.user, bookingId, status);

      res.status(200).json({
        success: true,
        message: 'Rezervasyon durumu güncellendi',
        data: booking
      });
    } catch (error) {
      console.error('Update booking status error:', error);

      res.status(400).json({
        success: false,
        message: error.message || 'Rezervasyon durumu güncellenemedi'
      });
    }
  }
}

module.exports = new BookingController();