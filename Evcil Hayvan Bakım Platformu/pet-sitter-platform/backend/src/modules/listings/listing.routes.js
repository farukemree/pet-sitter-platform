/**
 * Listing Routes
 * Defines routing endpoints for listing management
 */
const express = require('express');
const router = express.Router();
const listingController = require('./listing.controller');
const authMiddleware = require('../../shared/middlewares/auth.middleware');

// Herkes aktif ilanları görebilir (Giriş yapma şartı yok)
router.get('/', listingController.listAll);

// Sadece giriş yapmış yetkili bakıcılar ilan açabilir
router.post('/', authMiddleware, listingController.create);

module.exports = router;