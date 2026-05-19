const express = require('express');
const router = express.Router();

const bookingController = require('./booking.controller');
const authMiddleware = require('../../shared/middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/', bookingController.create);
router.get('/my', bookingController.getMyBookings);
router.patch('/:id/status', bookingController.updateStatus);

module.exports = router;