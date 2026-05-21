import React, { useState } from 'react';

export default function LoginPage({ email, password, onEmailChange, onPasswordChange, onSubmit, onSwitchToRegister, errorMessage }) {
  // Buton ve link hover durumları için küçük state'ler (Inline style animasyonları için)
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        {/* Logo Bölümü */}
        <div style={logoContainerStyle}>
          <div style={logoIconStyle}>🐾</div>
          <h1 style={logoTitleStyle}>PatiBakım</h1>
          <p style={subtitleStyle}>Dostlarımızın mutluluğu için buradayız</p>
        </div>

        {/* Hata Mesajı */}
        {errorMessage && (
          <div style={errorAlertStyle}>
            <span style={{ marginRight: '8px' }}>⚠️</span>
            {errorMessage}
          </div>
        )}

        {/* Form Alanı */}
        <form onSubmit={onSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>E-posta Adresi</label>
            <input
              type="email"
              placeholder="ornek@patibakim.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Şifre</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...buttonStyle,
              ...(isBtnHovered ? buttonHoverStyle : {})
            }}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
          >
            Giriş Yap
          </button>
        </form>

        {/* Alt Link */}
        <p style={footerTextStyle}>
          Hesabınız yok mu?{' '}
          <span 
            onClick={onSwitchToRegister} 
            style={{
              ...linkStyle,
              ...(isLinkHovered ? linkHoverStyle : {})
            }}
            onMouseEnter={() => setIsLinkHovered(true)}
            onMouseLeave={() => setIsLinkHovered(false)}
          >
            Kayıt Ol
          </span>
        </p>
      </div>
    </div>
  );
}

// --- Yenilenen Modern Tasarım Kuralları (Tasarım Sistemi) ---

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  // Tatlı bir pati teması gradyanı (Yumuşak şeftali ve pembe tonları)
  background: 'linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '20px'
};

const cardStyle = {
  background: '#ffffff',
  padding: '45px 35px',
  borderRadius: '24px', // Daha yumuşak köşeler
  boxShadow: '0 12px 40px rgba(255, 107, 107, 0.12)', // Temaya uygun hafif renkli gölge
  width: '100%',
  maxWidth: '400px',
  boxSizing: 'border-box'
};

const logoContainerStyle = {
  textAlign: 'center',
  marginBottom: '30px'
};

const logoIconStyle = {
  fontSize: '40px',
  marginBottom: '8px',
  display: 'inline-block',
  animation: 'bounce 2s infinite' // CSS'iniz varsa tatlı durur
};

const logoTitleStyle = {
  color: '#ff6b6b',
  fontSize: '28px',
  fontWeight: '800',
  margin: '0 0 6px 0',
  letterSpacing: '-0.5px'
};

const subtitleStyle = {
  color: '#868e96',
  fontSize: '14px',
  margin: 0,
  fontWeight: '500'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  textAlign: 'left'
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#495057',
  paddingLeft: '2px'
};

const inputStyle = {
  padding: '14px 16px',
  borderRadius: '12px',
  border: '2px solid #ebebeb', // Daha belirgin ve temiz sınır
  fontSize: '15px',
  outline: 'none',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box',
  color: '#212529',
  backgroundColor: '#ffcfc', // Çok hafif kırık beyaz
};

// Not: Input focus rengini CSS kullanmıyorsanız yakalamak zor olduğundan, 
// saf CSS dosyasına veya styled-components'a geçerseniz border'ı focus'ta #ff6b6b yapmanızı öneririm.

const buttonStyle = {
  background: '#ff6b6b',
  color: '#fff',
  border: 'none',
  padding: '15px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
  marginTop: '10px'
};

const buttonHoverStyle = {
  background: '#fa5252',
  transform: 'translateY(-1px)',
  boxShadow: '0 6px 18px rgba(255, 107, 107, 0.4)'
};

const footerTextStyle = {
  marginTop: '25px',
  fontSize: '14px',
  color: '#868e96',
  textAlign: 'center'
};

const linkStyle = {
  color: '#ff6b6b',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  textDecoration: 'underline',
  textDecorationColor: 'rgba(255,107,107,0.3)'
};

const linkHoverStyle = {
  color: '#fa5252',
  textDecorationColor: '#fa5252'
};

const errorAlertStyle = {
  backgroundColor: '#fff5f5',
  color: '#c92a2a',
  border: '1px solid #ffc9c9',
  padding: '12px 16px',
  borderRadius: '12px',
  marginBottom: '20px',
  fontSize: '14px',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  fontWeight: '500'
};