/**
 * Authentication Middleware
 * Validates the JWT token from incoming request headers
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

module.exports = (req, res, next) => {
  // İstek başlığından (Header) Authorization kısmını alıyoruz
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Yetkilendirme tokenı bulunamadı, lütfen giriş yapın.'
    });
  }

  // "Bearer TOKEN_STRING" yapısından sadece token kısmını cımbızlıyoruz
  const token = authHeader.split(' ')[1];

  try {
    // Token'ı gizli anahtarımızla çözüyoruz
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Çözülen kullanıcı bilgilerini (id, email, role) req.user içine atıyoruz
    req.user = decoded;
    
    next(); // Her şey yolundaysa bir sonraki aşamaya (Controller'a) geç
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(401).json({
      success: false,
      message: 'Geçersiz veya süresi dolmuş token.'
    });
  }
};