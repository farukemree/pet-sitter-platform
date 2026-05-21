import React, { useState, useEffect, useRef } from 'react';
import { messageService } from '../services/messageService';

export default function MessagesPage({ partnerId, partnerName, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Hover durumları için state'ler
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [isSendHovered, setIsSendHovered] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async (showLoading = false) => {
    if (!partnerId) return;
    if (showLoading) setLoading(true);
    try {
      const data = await messageService.getChatHistory(partnerId);
      setMessages(Array.isArray(data) ? data : data.messages || []);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata oluştu:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(true);

    const interval = setInterval(() => {
      fetchHistory(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [partnerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    const parsedPartnerId = Number(partnerId);

    if (!trimmedMessage) return;

    if (!partnerId || Number.isNaN(parsedPartnerId)) {
      alert('Geçerli bir sohbet partneri seçin.');
      return;
    }

    try {
      const sentMessage = await messageService.sendMessage(parsedPartnerId, trimmedMessage);
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Send message error:', error);
      alert(error.response?.data?.message || error.message || 'Mesaj gönderilemedi.');
    }
  };

  if (!partnerId) {
    return (
      <div style={emptyPageState}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🐾</div>
        <h3>Sohbet başlatmak için lütfen rezervasyon kartlarından bir kullanıcı seçin.</h3>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      
      {/* Üst Bilgi Alanı (Header) */}
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
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
          
          <div style={avatarStyle}>
            {partnerName ? partnerName.charAt(0).toUpperCase() : '🐾'}
          </div>
          
          <div>
            <div style={partnerNameStyle}>{partnerName || 'Kullanıcı'}</div>
            <div style={statusStyle}>● Çevrimiçi</div>
          </div>
        </div>
        <div style={brandStyle}>🐾 PatiBakım</div>
      </div>

      {/* Mesaj Akış Alanı (Chat Body) */}
      <div style={chatBodyStyle}>
        {loading ? (
          <div style={centerTextStyle}>🐾 Mesajlar yükleniyor...</div>
        ) : messages.length === 0 ? (
          <div style={centerTextStyle}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👋</div>
            Henüz bir mesajlaşma yok. İlk adımı siz atın!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isIncoming = String(msg.sender_id) === String(partnerId);
            
            return (
              <div 
                key={msg.id || index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: isIncoming ? 'flex-start' : 'flex-end', 
                  marginBottom: '14px' 
                }}
              >
                <div style={{
                  ...bubbleStyle,
                  background: isIncoming ? '#ffffff' : '#ff6b6b',
                  color: isIncoming ? '#212529' : '#ffffff',
                  borderBottomLeftRadius: isIncoming ? '4px' : '18px',
                  borderBottomRightRadius: isIncoming ? '18px' : '4px',
                  border: isIncoming ? '1px solid #e9ecef' : 'none',
                  boxShadow: isIncoming ? '0 2px 8px rgba(0,0,0,0.04)' : '0 4px 12px rgba(255,107,107,0.2)'
                }}>
                  <div style={contentStyle}>{msg.content}</div>
                  <div style={{
                    ...timeStyle,
                    color: isIncoming ? '#868e96' : 'rgba(255,255,255,0.8)'
                  }}>
                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Alt Mesaj Yazma Alanı (Footer Input) */}
      <form onSubmit={handleSendMessage} style={footerFormStyle}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Dostumuz hakkında bir şeyler yazın..."
          style={inputStyle}
        />
        <button 
          type="submit" 
          style={{
            ...sendButtonStyle,
            ...(isSendHovered ? sendButtonHoverStyle : {})
          }}
          onMouseEnter={() => setIsSendHovered(true)}
          onMouseLeave={() => setIsSendHovered(false)}
        >
          Gönder
        </button>
      </form>
    </div>
  );
}

// --- Yenilenen Tasarım Sistemi (Sohbet Teması) ---

const containerStyle = {
  maxWidth: '650px',
  margin: '20px auto',
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  height: '82vh',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  boxShadow: '0 16px 48px rgba(139, 126, 116, 0.12)',
  background: '#ffffff',
  overflow: 'hidden'
};

const headerStyle = {
  padding: '16px 24px',
  background: '#ffffff',
  borderBottom: '1px solid #f1f3f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 10
};

const headerLeftStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const backButtonStyle = {
  padding: '8px 14px',
  borderRadius: '10px',
  border: '1.5px solid #ebebeb',
  background: '#ffffff',
  color: '#495057',
  fontWeight: '600',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const backButtonHoverStyle = {
  background: '#f8f9fa',
  transform: 'translateX(-2px)'
};

const avatarStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  background: '#fff0f1',
  color: '#ff6b6b',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: '700',
  fontSize: '16px'
};

const partnerNameStyle = {
  fontWeight: '700',
  fontSize: '15px',
  color: '#4e3f36'
};

const statusStyle = {
  fontSize: '11px',
  color: '#40c057',
  fontWeight: '600',
  marginTop: '2px'
};

const brandStyle = {
  color: '#ced4da',
  fontWeight: '700',
  fontSize: '14px',
  letterSpacing: '-0.3px'
};

const chatBodyStyle = {
  flex: 1,
  padding: '24px',
  overflowY: 'auto',
  // Tatlı bir sohbet arka planı için sıcak kırık beyaz tonu
  background: '#fcfaf8' 
};

const bubbleStyle = {
  maxWidth: '75%',
  padding: '12px 18px',
  borderRadius: '18px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const contentStyle = {
  wordBreak: 'break-word',
  fontSize: '15px',
  lineHeight: '1.4'
};

const timeStyle = {
  fontSize: '10px',
  textAlign: 'right',
  fontWeight: '500',
  marginTop: '2px'
};

const footerFormStyle = {
  display: 'flex',
  padding: '16px 20px',
  borderTop: '1px solid #f1f3f5',
  background: '#ffffff',
  gap: '12px',
  alignItems: 'center'
};

const inputStyle = {
  flex: 1,
  padding: '14px 18px',
  borderRadius: '14px',
  border: '2px solid #f1f3f5',
  backgroundColor: '#f8f9fa',
  outline: 'none',
  fontSize: '14px',
  transition: 'all 0.2s ease',
  color: '#212529'
};

// Not: Input focus rengini global css kullanmıyorsan, tarayıcıda tıklandığında border'ı elle renklendirebilirsin.

const sendButtonStyle = {
  padding: '14px 28px',
  background: '#ff6b6b',
  color: '#ffffff',
  border: 'none',
  borderRadius: '14px',
  fontWeight: '700',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)'
};

const sendButtonHoverStyle = {
  background: '#fa5252',
  transform: 'translateY(-1px)',
  boxShadow: '0 6px 16px rgba(255, 107, 107, 0.3)'
};

const centerTextStyle = {
  textAlign: 'center',
  color: '#868e96',
  marginTop: '40px',
  fontSize: '14px',
  fontWeight: '500'
};

const emptyPageState = {
  padding: '60px 20px',
  textAlign: 'center',
  color: '#4e3f36',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
};