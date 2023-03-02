const express = require('express');
const {
  processPayment,
  sendStripeApiKey,
} = require('../controllers/paymentController');
const { isAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/process', isAuth, processPayment);
router.get('/stripeapikey', isAuth, sendStripeApiKey);

module.exports = router;
