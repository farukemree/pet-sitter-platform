import React, { useState } from 'react';

export default function SitterListPage({ listings, loading, onBook, onMessage, onBack }) {
  const [isBackHovered, setIsBackHovered] = useState(false);
  // Kartların ve butonların hover durumlarını id bazlı takip etmek için state'ler
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredBookId, setHoveredBookId] = useState(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);

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
        
        <div style={titleWrapperStyle}>
          <h3 style={titleStyle}>Bakıcı İlanları</h3>
          <p style={subtitleStyle}>Dostunuz için en güvenli yuvayı bulun</p>
        </div>
      </div>

      {/* Durum Yönetimleri (Loading / Empty / Grid) */}
      {loading ? (
        <div style={loadingPlaceholderStyle}>
          <div style={spinnerStyle}>🐾</div>
          <p>Güvenilir bakıcılar yükleniyor...</p>
        </div>
      ) : listings.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏡</div>
          <p>Henüz aktif bakıcı ilanı bulunamadı.</p>
          <span style={{ fontSize: '13px', color: '#868e96' }}>Daha sonra tekrar kontrol edebilir veya ilk ilanı siz oluşturabilirsiniz!</span>
        </div>
      ) : (
        <div style={gridStyle}>
          {listings.map((listing) => {
            const isCardHovered = hoveredCardId === listing.id;
            const isBookHovered = hoveredBookId === listing.id;
            const isMsgHovered = hoveredMsgId === listing.id;

            return (
              <div
                key={listing.id}
                onMouseEnter={() => setHoveredCardId(listing.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                style={{
                  ...cardStyle,
                  ...(isCardHovered ? cardHoverStyle : {})
                }}
              >
                {/* İlan Başlığı */}
                <h4 style={cardTitleStyle}>{listing.title}</h4>
                
                {/* Bakıcı İsmi (Avatar Detaylı) */}
                <div style={sitterInfoStyle}>
                  <div style={miniAvatarStyle}>👤</div>
                  <span style={sitterNameStyle}>{listing.sitter_name}</span>
                </div>
                
                {/* Açıklama */}
                <p style={descriptionStyle}>{listing.description}</p>
                
                {/* Konum ve Ücret Satırı */}
                <div style={metaRowStyle}>
                  <div style={metaItemStyle}>
                    <span style={{ color: '#ff6b6b' }}>📍</span> {listing.location}
                  </div>
                  <div style={priceBadgeStyle}>
                    {listing.price_per_day} TL <span style={dayLabelStyle}>/ gün</span>
                  </div>
                </div>

                {/* Aksiyon Butonları */}
                <div style={actionWrapperStyle}>
                  <button
                    type="button"
                    onClick={() => onBook(listing)}
                    onMouseEnter={() => setHoveredBookId(listing.id)}
                    onMouseLeave={() => setHoveredBookId(null)}
                    style={{
                      ...primaryButtonStyle,
                      ...(isBookHovered ? primaryButtonHoverStyle : {})
                    }}
                  >
                    🗓️ Rezervasyon Talebi
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => onMessage(listing.sitter_id, listing.sitter_name)}
                    onMouseEnter={() => setHoveredMsgId(listing.id)}
                    onMouseLeave={() => setHoveredMsgId(null)}
                    style={{
                      ...secondaryButtonStyle,
                      ...(isMsgHovered ? secondaryButtonHoverStyle : {})
                    }}
                  >
                    💬 Mesajlaş
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Tasarım Sistemi (PatiBakım Liste Teması) ---

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
  marginBottom: '30px',
  gap: '15px',
  borderBottom: '1px solid #f1f3f5',
  paddingBottom: '20px'
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

const titleWrapperStyle = {
  textAlign: 'right'
};

const titleStyle = {
  margin: 0,
  fontSize: '22px',
  fontWeight: '800',
  color: '#4e3f36'
};

const subtitleStyle = {
  margin: '4px 0 0',
  fontSize: '13px',
  color: '#868e96',
  fontWeight: '500'
};

const gridStyle = {
  display: 'grid',
  gap: '20px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
};

const cardStyle = {
  background: '#f8f9fa',
  border: '2px solid #f8f9fa',
  borderRadius: '20px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '280px',
  boxSizing: 'border-box',
  textAlign: 'left',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
};

const cardHoverStyle = {
  background: '#ffffff',
  borderColor: '#ffe3e3',
  transform: 'translateY(-4px)',
  boxShadow: '0 12px 28px rgba(255, 107, 107, 0.06)'
};

const cardTitleStyle = {
  margin: '0 0 12px 0',
  fontSize: '17px',
  fontWeight: '800',
  color: '#4e3f36',
  lineHeight: '1.4'
};

const sitterInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '14px'
};

const miniAvatarStyle = {
  width: '26px',
  height: '26px',
  background: '#ffffff',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '12px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const sitterNameStyle = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#495057'
};

const descriptionStyle = {
  margin: '0 0 16px 0',
  fontSize: '14px',
  color: '#6c757d',
  lineHeight: '1.5',
  display: '-webkit-box',
  WebkitLineClamp: '3', // Metni maksimum 3 satırda kesip üç nokta koyar
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flexGrow: 1
};

const metaRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  gap: '10px',
  background: '#ffffff',
  padding: '10px 14px',
  borderRadius: '12px',
  border: '1px solid #f1f3f5'
};

const metaItemStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#495057',
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
};

const priceBadgeStyle = {
  fontSize: '15px',
  fontWeight: '800',
  color: '#ff6b6b'
};

const dayLabelStyle = {
  fontSize: '11px',
  color: '#adb5bd',
  fontWeight: '500'
};

const actionWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const primaryButtonStyle = {
  background: '#ff6b6b',
  color: '#ffffff',
  border: 'none',
  padding: '12px',
  borderRadius: '12px',
  fontWeight: '700',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 10px rgba(255, 107, 107, 0.15)',
  textAlign: 'center',
  width: '100%'
};

const primaryButtonHoverStyle = {
  background: '#fa5252',
  boxShadow: '0 6px 14px rgba(255, 107, 107, 0.25)'
};

const secondaryButtonStyle = {
  background: '#f1f3f5',
  color: '#495057',
  border: 'none',
  padding: '12px',
  borderRadius: '12px',
  fontWeight: '700',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textAlign: 'center',
  width: '100%'
};

const secondaryButtonHoverStyle = {
  background: '#e9ecef',
  color: '#212529'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '50px 20px',
  color: '#4e3f36',
  fontWeight: '500'
};

const loadingPlaceholderStyle = {
  textAlign: 'center',
  padding: '50px 20px',
  color: '#868e96'
};

const spinnerStyle = {
  fontSize: '28px',
  marginBottom: '8px',
  display: 'inline-block',
  animation: 'pulse 1.5s infinite'
};