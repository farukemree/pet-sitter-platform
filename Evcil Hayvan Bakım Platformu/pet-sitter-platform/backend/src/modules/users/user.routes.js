/**
 * User Routes
 * Defines routing endpoints for user profile management
 */
const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../shared/middlewares/auth.middleware');

// Bu rotalara erişebilmek için sisteme geçerli bir token ile giriş yapılmış olmalıdır
router.use(authMiddleware);

// Profil bilgilerini getir: GET /api/users/profile
router.get('/profile', userController.getProfile);

// Profil bilgilerini güncelle: PUT /api/users/profile
router.put('/profile', userController.updateProfile);

module.exports = router;