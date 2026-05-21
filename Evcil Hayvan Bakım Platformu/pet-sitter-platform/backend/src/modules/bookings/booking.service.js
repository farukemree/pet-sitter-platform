const bookingRepository = require('./booking.repository');

class BookingService {
  async createBooking(user, bookingData) {
    if (user.role !== 'owner') {
      throw new Error('Yalnızca evcil hayvan sahipleri rezervasyon talebi oluşturabilir');
    }

    const {
      listingId,
      startDate,
      endDate,
      petName,
      petType,
      note
    } = bookingData;

    if (!listingId) {
      throw new Error('İlan bilgisi zorunludur');
    }

    if (!startDate || !endDate) {
      throw new Error('Başlangıç ve bitiş tarihi zorunludur');
    }

    if (new Date(endDate) < new Date(startDate)) {
      throw new Error('Bitiş tarihi başlangıç tarihinden önce olamaz');
    }

    const listing = await bookingRepository.findListingById(listingId);

    if (!listing) {
      throw new Error('İlan bulunamadı veya aktif değil');
    }

    if (listing.sitter_id === user.id) {
      throw new Error('Kendi ilanınıza rezervasyon oluşturamazsınız');
    }

    return await bookingRepository.create({
      listingId,
      ownerId: user.id,
      sitterId: listing.sitter_id,
      startDate,
      endDate,
      petName,
      petType,
      note
    });
  }

  async getMyBookings(user) {
    if (user.role === 'owner') {
      return await bookingRepository.findByOwner(user.id);
    }

    if (user.role === 'sitter') {
      return await bookingRepository.findBySitter(user.id);
    }

    throw new Error('Geçersiz kullanıcı rolü');
  }

  async updateBookingStatus(user, bookingId, status) {
    if (user.role !== 'sitter') {
      throw new Error('Yalnızca bakıcılar rezervasyon durumunu değiştirebilir');
    }

    if (!['accepted', 'rejected'].includes(status)) {
      throw new Error('Geçersiz rezervasyon durumu');
    }

    const booking = await bookingRepository.findById(bookingId);
    if (!booking || booking.sitter_id !== user.id) {
      throw new Error('Rezervasyon bulunamadı veya bu işlem için yetkiniz yok');
    }

    if (booking.status !== 'pending') {
      throw new Error('Bu rezervasyon artık kabul edilemez');
    }

    const updatedBooking = await bookingRepository.updateStatus(bookingId, user.id, status);

    if (!updatedBooking) {
      throw new Error('Rezervasyon durumu güncellenemedi');
    }

    return updatedBooking;
  }
}

module.exports = new BookingService();