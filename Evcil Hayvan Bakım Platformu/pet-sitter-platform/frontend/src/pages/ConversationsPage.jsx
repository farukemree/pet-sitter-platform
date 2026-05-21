import React, { useState } from 'react';

export default function ConversationsPage({ conversations, loading, totalUnread, onOpenConversation, onBack }) {
  const [isBackHovered, setIsBackHovered] = useState(false);
  // Hangi sohbet satırının hover olduğunu takip etmek için id tutuyoruz
  const [hoveredConversationId, setHoveredConversationId] = useState(null);

  return (
    <div style={containerStyle}>
      
      {/* Üst Başlık Bölümü */}
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

        <div style={titleContainerStyle}>
          <h3 style={titleStyle}>Sohbetlerim</h3>
          <p style={{
            ...subtitleStyle,
            color: totalUnread > 0 ? '#ff6b6b' : '#868e96',
            fontWeight: totalUnread > 0 ? '700' : '500'
          }}>
            {totalUnread > 0 ? `💬 ${totalUnread} yeni mesajınız var` : '✨ Tüm sohbetleriniz güncel'}
          </p>
        </div>
      </div>

      {/* İçerik Alanı */}
      {loading ? (
        <div style={loadingPlaceholderStyle}>
          <div style={spinnerStyle}>🐾</div>
          <p>Sohbetler yükleniyor...</p>
        </div>
      ) : conversations.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>✉️</div>
          <p>Henüz aktif bir sohbetiniz yok.</p>
          <span style={{ fontSize: '13px', color: '#868e96' }}>
            Rezervasyon talebi oluşturduğunuzda ya da bir bakıcı ile iletişime geçtiğinizde mesajlarınız burada görünür.
          </span>
        </div>
      ) : (
        <div style={listContainerStyle}>
          {conversations.map((conversation) => {
            const isHovered = hoveredConversationId === conversation.partner_id;
            // Kullanıcı isminin ilk harfini avatar için alıyoruz
            const avatarInitial = conversation.partner_name ? conversation.partner_name.charAt(0).toUpperCase() : '?';

            return (
              <button
                key={conversation.partner_id}
                onClick={() => onOpenConversation(conversation.partner_id, conversation.partner_name)}
                onMouseEnter={() => setHoveredConversationId(conversation.partner_id)}
                onMouseLeave={() => setHoveredConversationId(null)}
                style={{
                  ...conversationCardStyle,
                  ...(isHovered ? conversationCardHoverStyle : {}),
                  ...(conversation.unread_count > 0 ? unreadCardStyle : {})
                }}
              >
                {/* Sol Taraf: Avatar ve Mesaj Detayları */}
                <div style={leftSectionStyle}>
                  <div style={{
                    ...avatarStyle,
                    backgroundColor: conversation.unread_count > 0 ? '#ff6b6b' : '#f1f3f5',
                    color: conversation.unread_count > 0 ? '#fff' : '#495057'
                  }}>
                    {avatarInitial}
                  </div>
                  
                  <div style={textWrapperStyle}>
                    <div style={partnerNameStyle}>
                      {conversation.partner_name || `Kullanıcı #${conversation.partner_id}`}
                    </div>
                    <div style={{
                      ...lastMessageStyle,
                      fontWeight: conversation.unread_count > 0 ? '600' : '400',
                      color: conversation.unread_count > 0 ? '#212529' : '#495057'
                    }}>
                      {conversation.last_message || 'Henüz konuşma yok.'}
                    </div>
                  </div>
                </div>

                {/* Sağ Taraf: Zaman ve Okunmamış Sayacı */}
                <div style={rightSectionStyle}>
                  <span style={timeStyle}>
                    {conversation.last_message_at 
                      ? new Date(conversation.last_message_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) 
                      : ''}
                  </span>
                  {conversation.unread_count > 0 && (
                    <span style={badgeStyle}>
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Tasarım Sistemi (PatiBakım Tema) ---

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
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '25px',
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

const titleContainerStyle = {
  textAlign: 'right'
};

const titleStyle = {
  margin: 0,
  fontSize: '22px',
  fontWeight: '800',
  color: '#4e3f36'
};

const subtitleStyle = {
  margin: '6px 0 0',
  fontSize: '13px',
};

const listContainerStyle = {
  display: 'grid',
  gap: '12px'
};

const conversationCardStyle = {
  textAlign: 'left',
  padding: '16px 20px',
  borderRadius: '16px',
  border: '2px solid #f8f9fa',
  background: '#f8f9fa',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
};

const conversationCardHoverStyle = {
  background: '#ffffff',
  borderColor: '#ffe3e3', // Pati hafif pembesi sınır
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 20px rgba(255, 107, 107, 0.05)'
};

const unreadCardStyle = {
  background: '#fffafb', // Okunmamış mesajı olan kartlara hafif sıcak bir ton
  borderColor: '#fff0f1'
};

const leftSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  flex: 1,
  minWidth: 0 // Taşıma (ellipsis) özelliğinin çalışması için şart
};

const avatarStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: '700',
  fontSize: '16px',
  flexShrink: 0
};

const textWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  minWidth: 0
};

const partnerNameStyle = {
  fontWeight: '700',
  fontSize: '15px',
  color: '#4e3f36'
};

const lastMessageStyle = {
  fontSize: '14px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%'
};

const rightSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '8px',
  flexShrink: 0
};

const timeStyle = {
  fontSize: '12px',
  color: '#adb5bd',
  fontWeight: '500'
};

const badgeStyle = {
  backgroundColor: '#ff6b6b',
  color: '#ffffff',
  borderRadius: '10px',
  padding: '4px 9px',
  fontSize: '11px',
  fontWeight: '700',
  boxShadow: '0 4px 10px rgba(255, 107, 107, 0.25)'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '40px 20px',
  color: '#4e3f36',
  fontWeight: '500'
};

const loadingPlaceholderStyle = {
  textAlign: 'center',
  padding: '40px 20px',
  color: '#868e96'
};

const spinnerStyle = {
  fontSize: '28px',
  marginBottom: '8px',
  display: 'inline-block',
  animation: 'pulse 1.5s infinite'
};