/**
 * Profile Routes
 * Defines routing endpoints for sitter profiles
 */
const express = require('express');
const router = express.Router();
const profileController = require('./profile.controller');
const authMiddleware = require('../../shared/middlewares/auth.middleware');

// Tüm profil işlemlerinde kullanıcının giriş yapmış olması zorunludur
router.use(authMiddleware);

router.get('/me', profileController.getMyProfile);
router.put('/me', profileController.updateProfile);

module.exports = router;