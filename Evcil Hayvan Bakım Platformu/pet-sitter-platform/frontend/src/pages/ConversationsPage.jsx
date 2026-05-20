import React from 'react';

export default function ConversationsPage({ conversations, loading, totalUnread, onOpenConversation, onBack }) {
  return (
    <div style={{ marginTop: '25px', padding: '25px', background: '#fff', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid #ced4da',
            background: '#fff',
            cursor: 'pointer'
          }}
        >
          ← Geri
        </button>

        <div>
          <h3 style={{ margin: 0 }}>Sohbetlerim</h3>
          <p style={{ margin: '4px 0 0', color: '#6c757d' }}>
            {totalUnread > 0 ? `${totalUnread} okunmamış mesajınız var` : 'Tüm sohbetleriniz güncel'}
          </p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#6c757d' }}>Sohbetler yükleniyor...</p>
      ) : conversations.length === 0 ? (
        <p style={{ color: '#6c757d' }}>
          Henüz aktif bir sohbetiniz yok. Rezervasyon talebi oluşturduğunuzda ya da bakıcı ile iletişime geçtiğinizde burada görünür.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '14px' }}>
          {conversations.map((conversation) => (
            <button
              key={conversation.partner_id}
              onClick={() => onOpenConversation(conversation.partner_id, conversation.partner_name)}
              style={{
                textAlign: 'left',
                padding: '18px',
                borderRadius: '14px',
                border: '1px solid #e9ecef',
                background: '#f8f9fa',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ fontWeight: '700', marginBottom: '8px' }}>{conversation.partner_name || `Kullanıcı ${conversation.partner_id}`}</div>
                <div style={{ color: '#495057', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '560px' }}>
                  {conversation.last_message || 'Henüz konuşma yok.'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: '#6c757d' }}>
                  {conversation.last_message_at ? new Date(conversation.last_message_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : ''}
                </span>
                {conversation.unread_count > 0 && (
                  <span style={{ backgroundColor: '#dc3545', color: '#fff', borderRadius: '999px', padding: '4px 10px', fontSize: '12px', fontWeight: '700' }}>
                    {conversation.unread_count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
