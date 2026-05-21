import React, { useState } from 'react';
import axios from 'axios';
import { messageService } from './services/messageService';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SitterListPage from './pages/SitterListPage';
import ProfileEditPage from './pages/ProfileEditPage';
import SitterDetailPage from './pages/SitterDetailPage';
import MessagesPage from './pages/MessagesPage';
import ConversationsPage from './pages/ConversationsPage';

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
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [messagePartnerId, setMessagePartnerId] = useState(null);
  const [messagePartnerName, setMessagePartnerName] = useState('');

  const getToken = () => localStorage.getItem('token');

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const conv = await messageService.getConversations();
      setConversations(conv || []);
      setTotalUnread((conv || []).reduce((sum, item) => sum + (item.unread_count || 0), 0));
      return true;
    } catch (error) {
      console.error('Fetch conversations error:', error);
      alert(error.response?.message || 'Sohbet listesi yüklenemedi.');
      return false;
    } finally {
      setLoadingConversations(false);
    }
  };

  const openConversation = (partnerId, partnerName = '') => {
    setMessagePartnerId(partnerId);
    setMessagePartnerName(partnerName);
    setCurrentView('messages');
  };

  const openConversations = async () => {
    const success = await fetchConversations();
    if (success) {
      setCurrentView('conversations');
    }
  };

  const openMessagePage = (partnerId, partnerName = '') => {
    if (!partnerId) {
      alert('Mesajlaşmak için kullanıcı seçilmelidir.');
      return;
    }
    setMessagePartnerId(partnerId);
    setMessagePartnerName(partnerName);
    setCurrentView('messages');
  };

  const closeMessagePage = () => {
    setMessagePartnerId(null);
    setMessagePartnerName('');
    setCurrentView('conversations');
  };

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
    setConversations([]);
    setMessagePartnerId(null);
    setMessagePartnerName('');
    setTotalUnread(0);

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
    const parsedBookingId = Number(bookingId);
    if (!Number.isInteger(parsedBookingId) || parsedBookingId <= 0) {
      alert('Geçersiz rezervasyon IDsi.');
      return;
    }

    if (!['accepted', 'rejected'].includes(status)) {
      alert('Geçersiz rezervasyon durumu.');
      return;
    }

    try {
      setUpdatingBookingId(parsedBookingId);

      const token = getToken();

      if (!token) {
        alert('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await axios.patch(
        `${BOOKINGS_API_URL}/${parsedBookingId}/status`,
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
      alert(error.response?.data?.message || error.message || 'Rezervasyon durumu güncellenemedi.');
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
    return isLoginView ? (
      <LoginPage
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleAuthSubmit}
        onSwitchToRegister={() => {
          setIsLoginView(false);
          setErrorMessage('');
        }}
        errorMessage={errorMessage}
      />
    ) : (
      <RegisterPage
        name={name}
        email={email}
        password={password}
        role={role}
        termsAccepted={termsAccepted}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onRoleChange={setRole}
        onTermsChange={setTermsAccepted}
        onSubmit={handleAuthSubmit}
        onSwitchToLogin={() => {
          setIsLoginView(true);
          setErrorMessage('');
        }}
        errorMessage={errorMessage}
      />
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

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button onClick={fetchListings} style={actionButtonStyle}>
                  Bakıcıları Listele
                </button>

                <button onClick={fetchMyBookings} style={actionButtonStyle}>
                  Rezervasyonlarım
                </button>

                <button onClick={openConversations} style={actionButtonStyle}>
                  Sohbetlerim {totalUnread > 0 && <span style={badgeStyle}>{totalUnread}</span>}
                </button>
              </div>
            </div>

            {currentView === 'listings' && (
              <SitterListPage
                listings={listings}
                loading={loadingListings}
                onBook={openBookingForm}
                onMessage={openMessagePage}
                onBack={() => setCurrentView('dashboard')}
              />
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
                onMessage={openMessagePage}
              />
            )}

            {currentView === 'conversations' && (
              <ConversationsPage
                conversations={conversations}
                loading={loadingConversations}
                totalUnread={totalUnread}
                onOpenConversation={openConversation}
                onBack={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'messages' && messagePartnerId && (
              <MessagesPage partnerId={messagePartnerId} partnerName={messagePartnerName} onBack={closeMessagePage} />
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

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button onClick={fetchMyBookings} style={actionButtonStyle}>
                  Gelen Talepler
                </button>

                <button onClick={openConversations} style={actionButtonStyle}>
                  Sohbetlerim {totalUnread > 0 && <span style={badgeStyle}>{totalUnread}</span>}
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
                onMessage={openMessagePage}
              />
            )}

            {currentView === 'conversations' && (
              <ConversationsPage
                conversations={conversations}
                loading={loadingConversations}
                totalUnread={totalUnread}
                onOpenConversation={openConversation}
                onBack={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'messages' && messagePartnerId && (
              <MessagesPage partnerId={messagePartnerId} partnerName={messagePartnerName} onBack={closeMessagePage} />
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
  updatingBookingId,
  onMessage
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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              {(userRole === 'owner' || userRole === 'sitter') && (
                <button
                  type="button"
                  onClick={() => onMessage(
                    userRole === 'owner' ? booking.sitter_id : booking.owner_id,
                    userRole === 'owner' ? booking.sitter_name : booking.owner_name
                  )}
                  style={secondaryButtonStyle}
                >
                  Mesajlaş
                </button>
              )}

              {userRole === 'sitter' && booking.status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => updateBookingStatus(Number(booking.id), 'accepted')}
                    disabled={updatingBookingId === booking.id}
                    style={successButtonStyle}
                  >
                    Kabul Et
                  </button>

                  <button
                    type="button"
                    onClick={() => updateBookingStatus(Number(booking.id), 'rejected')}
                    disabled={updatingBookingId === booking.id}
                    style={dangerButtonStyle}
                  >
                    Reddet
                  </button>
                </>
              )}
            </div>
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

const badgeStyle = {
  display: 'inline-block',
  minWidth: '24px',
  padding: '2px 8px',
  borderRadius: '12px',
  backgroundColor: '#ff6b6b',
  color: '#fff',
  fontSize: '12px',
  fontWeight: '600',
  textAlign: 'center'
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