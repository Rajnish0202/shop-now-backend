const express = require('express');

const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const {
  getAllOrders,
  getOrderDetails,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/', isAuth, isAdmin, getAllOrders);
router.get('/:orderId', isAuth, isAdmin, getOrderDetails);

module.exports = router;
