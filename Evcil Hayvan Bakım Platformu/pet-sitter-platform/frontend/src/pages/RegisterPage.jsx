import React from 'react';

export default function RegisterPage({ name, email, password, role, termsAccepted, onNameChange, onEmailChange, onPasswordChange, onRoleChange, onTermsChange, onSubmit, onSwitchToLogin, errorMessage }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>🐾 PatiBakım</h1>
            <p style={subtitleStyle}>Kayıt olarak bakıcı veya evcil hayvan sahibi olabilirsiniz.</p>
          </div>
          <div style={badgeStyle}>{role === 'sitter' ? 'Bakıcı' : 'Evcil Hayvan Sahibi'}</div>
        </div>

        {errorMessage && (
          <div style={errorAlertStyle}>
            <strong>Hata:</strong> {errorMessage}
          </div>
        )}

        <form onSubmit={onSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Adınız Soyadınız</label>
            <input
              type="text"
              placeholder="Adınız Soyadınız"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

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

          <div style={radioGroupStyle}>
            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="role"
                value="owner"
                checked={role === 'owner'}
                onChange={() => onRoleChange('owner')}
              />
              Evcil Hayvan Sahibi
            </label>

            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="role"
                value="sitter"
                checked={role === 'sitter'}
                onChange={() => onRoleChange('sitter')}
              />
              Bakıcı
            </label>
          </div>

          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => onTermsChange(e.target.checked)}
              required
              style={checkboxInputStyle}
            />
            Kullanıcı sözleşmesini kabul ediyorum.
          </label>

          <button type="submit" style={buttonStyle}>Kayıt Ol</button>
        </form>

        <p style={footerTextStyle}>
          Zaten üyeyim{' '}
          <span onClick={onSwitchToLogin} style={linkStyle}>Giriş Yap</span>
        </p>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '20px'
};

const cardStyle = {
  background: '#ffffff',
  padding: '40px',
  borderRadius: '24px',
  boxShadow: '0 12px 40px rgba(255, 107, 107, 0.12)',
  width: '100%',
  maxWidth: '450px',
  boxSizing: 'border-box'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '25px'
};

const titleStyle = {
  margin: 0,
  color: '#ff6b6b',
  fontSize: '28px',
  fontWeight: '800'
};

const subtitleStyle = {
  margin: 0,
  color: '#868e96',
  fontSize: '14px'
};

const badgeStyle = {
  padding: '8px 14px',
  borderRadius: '999px',
  background: '#ffe3e3',
  color: '#ff6b6b',
  fontWeight: '700',
  fontSize: '12px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  textAlign: 'left'
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: '700',
  color: '#495057'
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid #ebe7e7',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box'
};

const checkboxInputStyle = {
  width: '18px',
  height: '18px',
  accentColor: '#ff6b6b'
};

const radioGroupStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px'
};

const radioLabelStyle = {
  background: '#f8f2f2',
  padding: '13px 16px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '14px',
  color: '#4c4c4c',
  cursor: 'pointer'
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#495057',
  fontSize: '13px'
};

const buttonStyle = {
  width: '100%',
  padding: '15px',
  borderRadius: '16px',
  border: 'none',
  background: '#ff6b6b',
  color: '#fff',
  fontWeight: '800',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '0 14px 26px rgba(255, 107, 107, 0.18)'
};

const footerTextStyle = {
  marginTop: '10px',
  textAlign: 'center',
  color: '#868e96',
  fontSize: '14px'
};

const linkStyle = {
  color: '#ff6b6b',
  fontWeight: '700',
  cursor: 'pointer'
};

const errorAlertStyle = {
  backgroundColor: '#fff0f0',
  color: '#b02a37',
  padding: '12px 16px',
  borderRadius: '14px',
  border: '1px solid #ffccd5',
  marginBottom: '12px',
  fontSize: '14px'
};
