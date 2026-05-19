import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';
const LISTINGS_API_URL = 'http://localhost:5000/api/listings';
const BOOKINGS_API_URL = 'http://localhost:5000/api/bookings';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('owner');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [userProfile, setUserProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [currentView, setCurrentView] = useState('dashboard');

  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);

  const [listingForm, setListingForm] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    location: ''
  });

  const [creatingListing, setCreatingListing] = useState(false);

  const [selectedListing, setSelectedListing] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    petName: '',
    petType: '',
    note: ''
  });

  const [creatingBooking, setCreatingBooking] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  const getToken = () => localStorage.getItem('token');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      if (isLoginView) {
        const response = await axios.post(`${API_URL}/login`, {
          email: email.trim().toLowerCase(),
          password
        });

        if (response.data.success) {
          const { token, user } = response.data.data;

          localStorage.setItem('token', token);
          setUserProfile(user);
          setIsLoggedIn(true);
          setCurrentView('dashboard');
        }
      } else {
        if (!termsAccepted) {
          setErrorMessage('Kullanıcı sözleşmesini kabul etmelisiniz.');
          return;
        }

        const response = await axios.post(`${API_URL}/register`, {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
          termsAccepted: true
        });

        if (response.data.success) {
          alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
          setIsLoginView(true);
          setPassword('');
          setTermsAccepted(false);
        }
      }
    } catch (error) {
      console.error('Auth Error:', error);
      setErrorMessage(error.response?.data?.message || 'Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');

    setIsLoggedIn(false);
    setUserProfile(null);

    setEmail('');
    setPassword('');
    setName('');
    setRole('owner');
    setTermsAccepted(false);

    setCurrentView('dashboard');
    setListings([]);
    setBookings([]);
    setSelectedListing(null);

    setListingForm({
      title: '',
      description: '',
      pricePerDay: '',
      location: ''
    });

    setBookingForm({
      startDate: '',
      endDate: '',
      petName: '',
      petType: '',
      note: ''
    });
  };

  const fetchListings = async () => {
    try {
      setLoadingListings(true);
      setCurrentView('listings');

      const response = await axios.get(LISTINGS_API_URL);

      if (response.data.success) {
        setListings(response.data.data);
      }
    } catch (error) {
      console.error('Listings Error:', error);
      alert(error.response?.data?.message || 'Bakıcılar listelenemedi.');
    } finally {
      setLoadingListings(false);
    }
  };

  const handleListingFormChange = (e) => {
    const { name, value } = e.target;

    setListingForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const createListing = async (e) => {
    e.preventDefault();

    try {
      setCreatingListing(true);

      const token = getToken();

      if (!token) {
        alert('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await axios.post(
        LISTINGS_API_URL,
        {
          title: listingForm.title.trim(),
          description: listingForm.description.trim(),
          pricePerDay: Number(listingForm.pricePerDay),
          location: listingForm.location.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert('İlan başarıyla oluşturuldu.');

        setListingForm({
          title: '',
          description: '',
          pricePerDay: '',
          location: ''
        });

        setCurrentView('dashboard');
      }
    } catch (error) {
      console.error('Create listing error:', error);
      alert(error.response?.data?.message || 'İlan oluşturulamadı.');
    } finally {
      setCreatingListing(false);
    }
  };

  const openBookingForm = (listing) => {
    setSelectedListing(listing);
    setBookingForm({
      startDate: '',
      endDate: '',
      petName: '',
      petType: '',
      note: ''
    });
    setCurrentView('create-booking');
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;

    setBookingForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const createBooking = async (e) => {
    e.preventDefault();

    try {
      setCreatingBooking(true);

      const token = getToken();

      if (!token) {
        alert('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      if (!selectedListing) {
        alert('Rezervasyon için ilan seçilmedi.');
        return;
      }

      const response = await axios.post(
        BOOKINGS_API_URL,
        {
          listingId: selectedListing.id,
          startDate: bookingForm.startDate,
          endDate: bookingForm.endDate,
          petName: bookingForm.petName.trim(),
          petType: bookingForm.petType.trim(),
          note: bookingForm.note.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert('Rezervasyon talebi oluşturuldu.');

        setBookingForm({
          startDate: '',
          endDate: '',
          petName: '',
          petType: '',
          note: ''
        });

        setSelectedListing(null);
        await fetchMyBookings();
      }
    } catch (error) {
      console.error('Create booking error:', error);
      alert(error.response?.data?.message || 'Rezervasyon oluşturulamadı.');
    } finally {
      setCreatingBooking(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      setLoadingBookings(true);
      setCurrentView('bookings');

      const token = getToken();

      if (!token) {
        alert('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await axios.get(`${BOOKINGS_API_URL}/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      alert(error.response?.data?.message || 'Rezervasyonlar getirilemedi.');
    } finally {
      setLoadingBookings(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      setUpdatingBookingId(bookingId);

      const token = getToken();

      if (!token) {
        alert('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await axios.patch(
        `${BOOKINGS_API_URL}/${bookingId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert(status === 'accepted' ? 'Rezervasyon kabul edildi.' : 'Rezervasyon reddedildi.');
        await fetchMyBookings();
      }
    } catch (error) {
      console.error('Update booking status error:', error);
      alert(error.response?.data?.message || 'Rezervasyon durumu güncellenemedi.');
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const getStatusText = (status) => {
    const labels = {
      pending: 'Onay Bekliyor',
      accepted: 'Kabul Edildi',
      rejected: 'Reddedildi',
      cancelled: 'İptal Edildi',
      completed: 'Tamamlandı'
    };

    return labels[status] || status;
  };

  if (!isLoggedIn) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={{ color: '#ff6b6b', marginBottom: '10px' }}>🐾 PatiBakım</h1>

          <p style={{ color: '#6c757d', marginBottom: '25px' }}>
            {isLoginView ? 'Hesabınıza giriş yapın' : 'Platformumuza kayıt olun'}
          </p>

          {errorMessage && <div style={errorAlertStyle}>{errorMessage}</div>}

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {!isLoginView && (
              <input
                type="text"
                placeholder="Adınız Soyadınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
            )}

            <input
              type="email"
              placeholder="E-posta Adresi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />

            {!isLoginView && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '5px 0', fontSize: '14px' }}>
                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="role"
                      value="owner"
                      checked={role === 'owner'}
                      onChange={() => setRole('owner')}
                    />{' '}
                    Evcil Hayvan Sahibi
                  </label>

                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="role"
                      value="sitter"
                      checked={role === 'sitter'}
                      onChange={() => setRole('sitter')}
                    />{' '}
                    Bakıcı
                  </label>
                </div>

                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                  Kullanıcı sözleşmesini kabul ediyorum.
                </label>
              </>
            )}

            <button type="submit" style={buttonStyle}>
              {isLoginView ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '14px', color: '#6c757d' }}>
            {isLoginView ? 'Hesabınız yok mu?' : 'Zaten üye misiniz?'}{' '}
            <span
              onClick={() => {
                setIsLoginView(!isLoginView);
                setErrorMessage('');
              }}
              style={linkStyle}
            >
              {isLoginView ? 'Kayıt Ol' : 'Giriş Yap'}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={navStyle}>
        <h2>🐾 PatiBakım Panel</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={roleBadgeStyle}>
            Rol: {userProfile?.role?.toUpperCase()}
          </span>

          <span>{userProfile?.name}</span>

          <button onClick={handleLogout} style={logoutButtonStyle}>
            Çıkış Yap
          </button>
        </div>
      </nav>

      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {userProfile?.role === 'owner' && (
          <>
            <div style={panelCardStyle('#d1ecf1', '#0c5460')}>
              <h3>🐾 Evcil Hayvan Sahibi Paneli</h3>

              <p>
                Sistemdeki bakıcıları listeleyebilir, yorumları inceleyebilir ve rezervasyon
                oluşturabilirsiniz.
              </p>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button onClick={fetchListings} style={actionButtonStyle}>
                  Bakıcıları Listele
                </button>

                <button onClick={fetchMyBookings} style={actionButtonStyle}>
                  Rezervasyonlarım
                </button>
              </div>
            </div>

            {currentView === 'listings' && (
              <div style={{ marginTop: '25px' }}>
                <h3>Aktif Bakıcı İlanları</h3>

                {loadingListings && <p>Bakıcılar yükleniyor...</p>}

                {!loadingListings && listings.length === 0 && (
                  <p>Henüz aktif bakıcı ilanı bulunamadı.</p>
                )}

                <div style={gridStyle}>
                  {listings.map((listing) => (
                    <div key={listing.id} style={listingCardStyle}>
                      <h4 style={{ marginTop: 0 }}>{listing.title}</h4>

                      <p>
                        <strong>Bakıcı:</strong> {listing.sitter_name}
                      </p>

                      <p>{listing.description}</p>

                      <p>
                        <strong>Konum:</strong> {listing.location}
                      </p>

                      <p>
                        <strong>Günlük Ücret:</strong> {listing.price_per_day} TL
                      </p>

                      <button onClick={() => openBookingForm(listing)} style={buttonStyle}>
                        Rezervasyon Talebi Oluştur
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'create-booking' && selectedListing && (
              <div style={formCardStyle}>
                <h3>Rezervasyon Talebi Oluştur</h3>

                <p>
                  <strong>Seçilen ilan:</strong> {selectedListing.title}
                </p>

                <form onSubmit={createBooking} style={formStyle}>
                  <input
                    type="date"
                    name="startDate"
                    value={bookingForm.startDate}
                    onChange={handleBookingFormChange}
                    required
                    style={inputStyle}
                  />

                  <input
                    type="date"
                    name="endDate"
                    value={bookingForm.endDate}
                    onChange={handleBookingFormChange}
                    required
                    style={inputStyle}
                  />

                  <input
                    type="text"
                    name="petName"
                    placeholder="Evcil hayvan adı"
                    value={bookingForm.petName}
                    onChange={handleBookingFormChange}
                    required
                    style={inputStyle}
                  />

                  <input
                    type="text"
                    name="petType"
                    placeholder="Hayvan türü: Kedi, Köpek vb."
                    value={bookingForm.petType}
                    onChange={handleBookingFormChange}
                    required
                    style={inputStyle}
                  />

                  <textarea
                    name="note"
                    placeholder="Bakıcıya not"
                    value={bookingForm.note}
                    onChange={handleBookingFormChange}
                    rows="4"
                    style={textareaStyle}
                  />

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={creatingBooking} style={buttonStyle}>
                      {creatingBooking ? 'Talep Oluşturuluyor...' : 'Talebi Gönder'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentView('listings')}
                      style={secondaryButtonStyle}
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentView === 'bookings' && (
              <BookingsList
                title="Rezervasyonlarım"
                userRole={userProfile.role}
                bookings={bookings}
                loadingBookings={loadingBookings}
                getStatusText={getStatusText}
                updateBookingStatus={updateBookingStatus}
                updatingBookingId={updatingBookingId}
              />
            )}
          </>
        )}

        {userProfile?.role === 'sitter' && (
          <>
            <div style={panelCardStyle('#fff3cd', '#856404')}>
              <h3>🏡 Bakıcı Yönetim Paneli</h3>

              <p>
                Gelen bakım taleplerini görebilir, ilanınızı ve müsaitlik durumunuzu
                güncelleyebilirsiniz.
              </p>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button onClick={fetchMyBookings} style={actionButtonStyle}>
                  Gelen Talepler
                </button>

                <button onClick={() => setCurrentView('create-listing')} style={actionButtonStyle}>
                  İlan Oluştur
                </button>
              </div>
            </div>

            {currentView === 'create-listing' && (
              <div style={formCardStyle}>
                <h3>Yeni Bakıcı İlanı Oluştur</h3>

                <form onSubmit={createListing} style={formStyle}>
                  <input
                    type="text"
                    name="title"
                    placeholder="İlan başlığı"
                    value={listingForm.title}
                    onChange={handleListingFormChange}
                    required
                    style={inputStyle}
                  />

                  <textarea
                    name="description"
                    placeholder="Açıklama"
                    value={listingForm.description}
                    onChange={handleListingFormChange}
                    required
                    rows="4"
                    style={textareaStyle}
                  />

                  <input
                    type="number"
                    name="pricePerDay"
                    placeholder="Günlük ücret"
                    value={listingForm.pricePerDay}
                    onChange={handleListingFormChange}
                    required
                    min="1"
                    style={inputStyle}
                  />

                  <input
                    type="text"
                    name="location"
                    placeholder="Konum"
                    value={listingForm.location}
                    onChange={handleListingFormChange}
                    required
                    style={inputStyle}
                  />

                  <button type="submit" disabled={creatingListing} style={buttonStyle}>
                    {creatingListing ? 'İlan Oluşturuluyor...' : 'İlanı Yayınla'}
                  </button>
                </form>
              </div>
            )}

            {currentView === 'bookings' && (
              <BookingsList
                title="Gelen Rezervasyon Talepleri"
                userRole={userProfile.role}
                bookings={bookings}
                loadingBookings={loadingBookings}
                getStatusText={getStatusText}
                updateBookingStatus={updateBookingStatus}
                updatingBookingId={updatingBookingId}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BookingsList({
  title,
  userRole,
  bookings,
  loadingBookings,
  getStatusText,
  updateBookingStatus,
  updatingBookingId
}) {
  return (
    <div style={{ marginTop: '25px' }}>
      <h3>{title}</h3>

      {loadingBookings && <p>Rezervasyonlar yükleniyor...</p>}

      {!loadingBookings && bookings.length === 0 && (
        <p>Henüz rezervasyon bulunamadı.</p>
      )}

      <div style={gridStyle}>
        {bookings.map((booking) => (
          <div key={booking.id} style={listingCardStyle}>
            <h4 style={{ marginTop: 0 }}>{booking.listing_title}</h4>

            {userRole === 'owner' && (
              <p>
                <strong>Bakıcı:</strong> {booking.sitter_name}
              </p>
            )}

            {userRole === 'sitter' && (
              <p>
                <strong>Talep Sahibi:</strong> {booking.owner_name}
              </p>
            )}

            <p>
              <strong>Konum:</strong> {booking.listing_location}
            </p>

            <p>
              <strong>Tarih:</strong> {booking.start_date?.slice(0, 10)} / {booking.end_date?.slice(0, 10)}
            </p>

            <p>
              <strong>Evcil Hayvan:</strong> {booking.pet_name} - {booking.pet_type}
            </p>

            {booking.note && (
              <p>
                <strong>Not:</strong> {booking.note}
              </p>
            )}

            <p>
              <strong>Durum:</strong> {getStatusText(booking.status)}
            </p>

            {userRole === 'sitter' && booking.status === 'pending' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => updateBookingStatus(booking.id, 'accepted')}
                  disabled={updatingBookingId === booking.id}
                  style={successButtonStyle}
                >
                  Kabul Et
                </button>

                <button
                  onClick={() => updateBookingStatus(booking.id, 'rejected')}
                  disabled={updatingBookingId === booking.id}
                  style={dangerButtonStyle}
                >
                  Reddet
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f4f6f9'
};

const cardStyle = {
  background: '#fff',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px',
  textAlign: 'center'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #ced4da',
  width: '100%',
  boxSizing: 'border-box'
};

const textareaStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #ced4da',
  width: '100%',
  boxSizing: 'border-box',
  resize: 'vertical',
  fontFamily: 'sans-serif'
};

const buttonStyle = {
  background: '#ff6b6b',
  color: '#fff',
  border: 'none',
  padding: '12px',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const secondaryButtonStyle = {
  background: '#6c757d',
  color: '#fff',
  border: 'none',
  padding: '12px',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const successButtonStyle = {
  background: '#28a745',
  color: '#fff',
  border: 'none',
  padding: '10px 14px',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const dangerButtonStyle = {
  background: '#dc3545',
  color: '#fff',
  border: 'none',
  padding: '10px 14px',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: '15px 40px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const logoutButtonStyle = {
  background: 'none',
  color: '#dc3545',
  border: '1px solid #dc3545',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer'
};

const actionButtonStyle = {
  padding: '10px 20px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  cursor: 'pointer',
  fontWeight: '500'
};

const panelCardStyle = (bg, color) => ({
  background: bg,
  color,
  padding: '30px',
  borderRadius: '8px',
  border: `1px solid ${color}33`
});

const listingCardStyle = {
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  color: '#212529'
};

const formCardStyle = {
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '10px',
  padding: '25px',
  marginTop: '25px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  color: '#212529'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '20px'
};

const roleBadgeStyle = {
  backgroundColor: '#e9ecef',
  padding: '5px 12px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 'bold'
};

const checkboxLabelStyle = {
  fontSize: '13px',
  color: '#6c757d',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  textAlign: 'left',
  cursor: 'pointer'
};

const linkStyle = {
  color: '#ff6b6b',
  fontWeight: 'bold',
  cursor: 'pointer',
  textDecoration: 'underline'
};

const errorAlertStyle = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '10px',
  borderRadius: '6px',
  marginBottom: '15px',
  fontSize: '14px',
  textAlign: 'left'
};

export default App;