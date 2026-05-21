import React, { useState } from 'react';

export default function ProfileEditPage({ userProfile, name, email, onNameChange, onEmailChange, onSubmit, onBack, errorMessage }) {
  // Butonların hover durumları için stateler
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const [isPasswordHovered, setIsPasswordHovered] = useState(false);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        {/* Üst Alan: Geri Butonu ve Logo */}
        <div style={headerStyle}>
          <button 
            type="button" 
            onClick={onBack} 
            style={{
              ...backButtonStyle,
              ...(isBackHovered ? backButtonHoverStyle : {})
            }}
            onMouseEnter={() => setIsBackHovered(true)}
            onMouseLeave={() => setIsBackHovered(false)}
          >
            ← Geri <span style={{ fontSize: '12px', marginLeft: '2px' }}>🐾</span>
          </button>
          
          <div style={brandStyle}>
            <span style={{ marginRight: '4px' }}>🐾</span>PatiBakım
          </div>
        </div>

        {/* Sayfa Başlığı */}
        <h2 style={titleStyle}>Profil Düzenle</h2>

        {/* Hata / Uyarı Mesajı */}
        {errorMessage && (
          <div style={errorAlertStyle}>
            <span style={{ marginRight: '8px', fontSize: '16px' }}>⚠️</span>
            {errorMessage}
          </div>
        )}

        {/* Düzenleme Formu */}
        <form onSubmit={onSubmit} style={formStyle}>
          
          {/* Ad Soyad Girişi */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Ad Soyad <span style={labelHintStyle}>(Örn: Ayşe Yılmaz)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
              style={inputStyle}
              placeholder="Adınızı ve soyadınızı girin"
            />
          </div>

          {/* E-posta Girişi */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              style={inputStyle}
              placeholder="ayse@example.com"
            />
          </div>

          {/* Rol Bilgisi (Değiştirilemez Kilitli Alan) */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Rol</label>
            <div style={infoBoxStyle}>
              <span style={{ marginRight: '8px', color: '#adb5bd' }}>🔒</span>
              {userProfile?.role || 'Pati Sahibi'}
            </div>
          </div>

          {/* Şifre Değiştir Linki */}
          <button
            type="button"
            style={{
              ...passwordLinkStyle,
              ...(isPasswordHovered ? passwordLinkHoverStyle : {})
            }}
            onMouseEnter={() => setIsPasswordHovered(true)}
            onMouseLeave={() => setIsPasswordHovered(false)}
            onClick={() => alert('Şifre değiştirme sayfasına yönlendiriliyorsunuz...')}
          >
            Şifreyi Değiştir
          </button>

          {/* Kaydet Butonu */}
          <button 
            type="submit" 
            style={{
              ...buttonStyle,
              ...(isSubmitHovered ? buttonHoverStyle : {})
            }}
            onMouseEnter={() => setIsSubmitHovered(true)}
            onMouseLeave={() => setIsSubmitHovered(false)}
          >
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Yeni Nesil Tasarım Sistemi CSS-in-JS ---

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #fbf7f4 0%, #f3ece7 100%)', // Görseldeki gibi sıcak, doğal krem tonu
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '20px'
};

const cardStyle = {
  background: '#ffffff',
  padding: '40px 35px',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(139, 126, 116, 0.1)', // Yumuşak doğal gölge
  width: '100%',
  maxWidth: '520px',
  boxSizing: 'border-box'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'between',
  alignItems: 'center',
  width: '100%',
  marginBottom: '20px',
  position: 'relative'
};

const backButtonStyle = {
  padding: '8px 16px',
  borderRadius: '12px',
  border: '1.5px solid #e9ecef',
  background: '#ffffff',
  color: '#495057',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.2s ease'
};

const backButtonHoverStyle = {
  background: '#f8f9fa',
  borderDark: '#ced4da',
  transform: 'translateX(-2px)'
};

const brandStyle = {
  position: 'absolute',
  right: 0,
  color: '#ff6b6b',
  fontWeight: '800',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center'
};

const titleStyle = {
  textAlign: 'center',
  color: '#4e3f36', // Daha sıcak bir koyu kahve/gri tonu
  fontSize: '26px',
  fontWeight: '700',
  margin: '10px 0 30px 0'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  textAlign: 'left'
};

const labelStyle = {
  color: '#4e3f36',
  fontWeight: '600',
  fontSize: '14px',
  paddingLeft: '2px'
};

const labelHintStyle = {
  color: '#adb5bd',
  fontWeight: '400',
  fontSize: '12px'
};

const inputStyle = {
  padding: '14px 16px',
  borderRadius: '12px',
  border: '2px solid #f1f3f5',
  backgroundColor: '#fdfdfd',
  fontSize: '15px',
  color: '#212529',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'all 0.2s ease',
  // Odaklanma durumunda (Focus) tatlı bir efekt vermek için idealdir.
  ':focus': {
    borderColor: '#ff8787',
    backgroundColor: '#ffffff'
  }
};

const infoBoxStyle = {
  background: '#f1f3f5', // Kilitli olduğunu hissettiren şık gri arka plan
  padding: '14px 16px',
  borderRadius: '12px',
  border: '2px solid #e9ecef',
  color: '#495057',
  fontSize: '15px',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  cursor: 'not-allowed'
};

const passwordLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#ff6b6b',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
  alignSelf: 'center',
  padding: '4px 8px',
  transition: 'all 0.2s ease',
  textDecoration: 'none'
};

const passwordLinkHoverStyle = {
  color: '#fa5252',
  textDecoration: 'underline'
};

const buttonStyle = {
  background: '#ff6b6b',
  color: '#ffffff',
  border: 'none',
  padding: '15px',
  borderRadius: '14px',
  fontWeight: '700',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 6px 20px rgba(255, 107, 107, 0.25)',
  marginTop: '10px'
};

const buttonHoverStyle = {
  background: '#fa5252',
  transform: 'translateY(-1px)',
  boxShadow: '0 8px 24px rgba(255, 107, 107, 0.35)'
};

const errorAlertStyle = {
  backgroundColor: '#fff5f5',
  color: '#c92a2a',
  border: '1px solid #ffc9c9',
  padding: '12px 16px',
  borderRadius: '12px',
  marginBottom: '15px',
  fontSize: '14px',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  fontWeight: '500'
};