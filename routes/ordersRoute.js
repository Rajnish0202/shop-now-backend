const express = require('express');

const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const {
  getAllOrders,
  getOrderDetails,
  getPendingOrders,
  getShippedOrders,
  getDeliverdOrders,
  updateOrderStatus,
  getOutForDeliveryOrders,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/', isAuth, isAdmin, getAllOrders);
router.get('/pending', isAuth, isAdmin, getPendingOrders);
router.get('/shipped', isAuth, isAdmin, getShippedOrders);
router.get('/out-for-delivery', isAuth, isAdmin, getOutForDeliveryOrders);
router.get('/delivered', isAuth, isAdmin, getDeliverdOrders);
router.put('/update-order/:id', isAuth, isAdmin, updateOrderStatus);
router.get('/:orderId', isAuth, isAdmin, getOrderDetails);

module.exports = router;
