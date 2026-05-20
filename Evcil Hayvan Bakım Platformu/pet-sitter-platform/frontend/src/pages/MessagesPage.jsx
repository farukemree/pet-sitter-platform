import React, { useState, useEffect, useRef } from 'react';
import { messageService } from '../services/messageService';

export default function MessagesPage({ partnerId, partnerName, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Her yeni mesaj geldiğinde sohbet penceresini otomatik en aşağı kaydırır
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Mesaj geçmişini API'den çeken ana fonksiyon
  const fetchHistory = async (showLoading = false) => {
    if (!partnerId) return;
    if (showLoading) setLoading(true);
    try {
      const data = await messageService.getChatHistory(partnerId);
      // Backend'den dönen veri doğrudan array değilse emniyete alıyoruz
      setMessages(Array.isArray(data) ? data : data.messages || []);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata oluştu:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Sayfa açıldığında geçmişi yükle ve 4 saniyede bir arkada Polling yap
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

  // Mesaj Gönderme Tetikleyicisi
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !partnerId) return;

    try {
      const sentMessage = await messageService.sendMessage(partnerId, newMessage.trim());
      // Ekranda gecikme hissi olmasın diye gönderilen mesajı state'e anında push'luyoruz
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      alert('Mesaj gönderilemedi, lütfen tekrar deneyin.');
    }
  };

  if (!partnerId) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h3>Sohbet başlatmak için lütfen panellerdeki Rezervasyon kartlarından bir kullanıcı seçin.</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', border: '1px solid #ddd', borderRadius: '12px', display: 'flex', flexDirection: 'column', height: '80vh', fontFamily: 'sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      {/* Üst Bilgi Alanı */}
      <div style={{ padding: '15px 20px', background: '#f8f9fa', borderBottom: '1px solid #eee', fontWeight: 'bold', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button type="button" onClick={onBack} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', background: '#fff', color: '#333', cursor: 'pointer' }}>
            ← Geri
          </button>
          <span style={{ fontSize: '20px' }}>💬</span>
          <span>Sohbet: {partnerName || `Kullanıcı ID: ${partnerId}`}</span>
        </div>
      </div>

      {/* Mesaj Akış Alanı */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#fdfdfd' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Mesajlar yükleniyor...</p>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>Henüz bir mesajlaşma yok. İlk adımı siz atın!</p>
        ) : (
          messages.map((msg, index) => {
            // Gelen mesaj mı giden mesaj mı kontrolü
            const isIncoming = String(msg.sender_id) === String(partnerId);
            
            return (
              <div 
                key={msg.id || index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: isIncoming ? 'flex-start' : 'flex-end', 
                  marginBottom: '12px' 
                }}
              >
                <div style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: isIncoming ? '#e9ecef' : '#007bff',
                  color: isIncoming ? '#212529' : '#fff',
                  borderTopLeftRadius: isIncoming ? '0px' : '16px',
                  borderTopRightRadius: isIncoming ? '16px' : '0px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ wordBreak: 'break-word', fontSize: '15px' }}>{msg.content}</div>
                  <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '5px', opacity: 0.6 }}>
                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Alttaki Input Formu */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '15px', borderTop: '1px solid #eee', background: '#fff', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesajınızı buraya yazın..."
          style={{ flex: 1, padding: '12px 15px', borderRadius: '8px', border: '1px solid #ced4da', marginRight: '10px', outline: 'none', fontSize: '14px' }}
        />
        <button type="submit" style={{ padding: '12px 24px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
          Gönder
        </button>
      </form>
    </div>
  );
}