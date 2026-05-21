import React, { useState } from 'react';

export default function SitterDetailPage({ listing, onBack, onBook, onMessage }) {
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [isBookHovered, setIsBookHovered] = useState(false);
  const [isMsgHovered, setIsMsgHovered] = useState(false);

  if (!listing) {
    return (
      <div style={containerStyle}>
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
          ← Geri
        </button>
        <div style={emptyStateStyle}>
          <p>Seçili bir ilan bulunmuyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Üst Başlık ve Geri Butonu */}
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
        <div style={brandStyle}>🐾 PatiBakım</div>
      </div>

      {/* Detay Kartı */}
      <div style={detailCardStyle}>
        <h2 style={titleStyle}>{listing.title}</h2>
        
        {/* Bakıcı Özeti ve Bilgi Rozetleri */}
        <div style={metaGridStyle}>
          <div style={metaItemStyle}>
            <span style={metaIconStyle}>👤</span>
            <div>
              <div style={metaLabelStyle}>Bakıcı</div>
              <div style={metaValueStyle}>{listing.sitter_name}</div>
            </div>
          </div>

          <div style={metaItemStyle}>
            <span style={metaIconStyle}>📍</span>
            <div>
              <div style={metaLabelStyle}>Konum</div>
              <div style={metaValueStyle}>{listing.location}</div>
            </div>
          </div>

          <div style={metaItemStyle}>
            <span style={metaIconStyle}>💰</span>
            <div>
              <div style={metaLabelStyle}>Günlük Ücret</div>
              <div style={{ ...metaValueStyle, color: '#ff6b6b', fontWeight: '700' }}>
                {listing.price_per_day} TL
              </div>
            </div>
          </div>
        </div>

        {/* Açıklama Alanı */}
        <div style={descriptionContainerStyle}>
          <h4 style={descriptionTitleStyle}>İlan Açıklaması</h4>
          <p style={descriptionTextStyle}>{listing.description}</p>
        </div>

        {/* Aksiyon Butonları */}
        <div style={actionAreaStyle}>
          <button 
            type="button" 
            style={{
              ...primaryButtonStyle,
              ...(isBookHovered ? primaryButtonHoverStyle : {})
            }} 
            onClick={() => onBook(listing)}
            onMouseEnter={() => setIsBookHovered(true)}
            onMouseLeave={() => setIsBookHovered(false)}
          >
            🗓️ Rezervasyon Yap
          </button>
          
          <button 
            type="button" 
            style={{
              ...secondaryButtonStyle,
              ...(isMsgHovered ? secondaryButtonHoverStyle : {})
            }} 
            onClick={() => onMessage(listing.sitter_id, listing.sitter_name)}
            onMouseEnter={() => setIsMsgHovered(true)}
            onMouseLeave={() => setIsMsgHovered(false)}
          >
            💬 Mesajlaş
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Tasarım Sistemi (PatiBakım Detay Teması) ---

const containerStyle = {
  marginTop: '25px',
  background: '#ffffff',
  borderRadius: '24px',
  padding: '30px',
  boxShadow: '0 12px 40px rgba(139, 126, 116, 0.06)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '25px',
  gap: '15px',
  borderBottom: '1px solid #f1f3f5',
  paddingBottom: '15px'
};

const backButtonStyle = {
  padding: '10px 18px',
  borderRadius: '12px',
  border: '1.5px solid #ebebeb',
  background: '#ffffff',
  color: '#495057',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center'
};

const backButtonHoverStyle = {
  background: '#f8f9fa',
  transform: 'translateX(-2px)'
};

const brandStyle = {
  color: '#ff6b6b',
  fontWeight: '800',
  fontSize: '16px'
};

const detailCardStyle = {
  padding: '10px 5px'
};

const titleStyle = {
  margin: '0 0 25px 0',
  fontSize: '24px',
  fontWeight: '800',
  color: '#4e3f36',
  lineHeight: '1.3',
  textAlign: 'left'
};

const metaGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '16px',
  marginBottom: '30px'
};

const metaItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px',
  borderRadius: '16px',
  background: '#f8f9fa',
  border: '1px solid #f1f3f5'
};

const metaIconStyle = {
  fontSize: '22px',
  background: '#ffffff',
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
};

const metaLabelStyle = {
  fontSize: '11px',
  color: '#868e96',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '2px'
};

const metaValueStyle = {
  fontSize: '14px',
  color: '#212529',
  fontWeight: '600'
};

const descriptionContainerStyle = {
  textAlign: 'left',
  background: '#fffaf8', // Hafif sıcak kırık beyaz dokusu
  padding: '20px 24px',
  borderRadius: '18px',
  border: '1px solid #fff0e6',
  marginBottom: '30px'
};

const descriptionTitleStyle = {
  margin: '0 0 10px 0',
  fontSize: '15px',
  fontWeight: '700',
  color: '#4e3f36'
};

const descriptionTextStyle = {
  margin: 0,
  color: '#495057',
  fontSize: '15px',
  lineHeight: '1.6',
  whiteSpace: 'pre-line'
};

const actionAreaStyle = {
  display: 'flex',
  gap: '14px',
  flexWrap: 'wrap'
};

const primaryButtonStyle = {
  background: '#ff6b6b',
  color: '#ffffff',
  border: 'none',
  padding: '14px 28px',
  borderRadius: '14px',
  fontWeight: '700',
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const primaryButtonHoverStyle = {
  background: '#fa5252',
  transform: 'translateY(-1px)',
  boxShadow: '0 6px 16px rgba(255, 107, 107, 0.3)'
};

const secondaryButtonStyle = {
  background: '#f1f3f5',
  color: '#495057',
  border: 'none',
  padding: '14px 28px',
  borderRadius: '14px',
  fontWeight: '700',
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const secondaryButtonHoverStyle = {
  background: '#e9ecef',
  color: '#212529',
  transform: 'translateY(-1px)'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '40px 20px',
  color: '#868e96',
  fontWeight: '500'
};