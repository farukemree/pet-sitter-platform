{/* Owner'ın "Rezervasyonlarım" listesindeki kartın/satırın içine eklenecek buton */}
<button 
  onClick={() => window.location.href = `/messages?partnerId=${booking.sitter_id || booking.listing?.sitter_id}`}
  style={{ padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '8px' }}
>
  💬 Bakıcıya Yaz
</button>