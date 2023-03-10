const express = require('express');
const {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
} = require('../controllers/userController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/all-users', getAllUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

router.delete('/empty-cart', isAuth, emptyCart);
router.delete('/:id', isAuth, deleteUser);
router.put('/edit-user', isAuth, updateUser);
router.put('/password', isAuth, updatePassword);
router.get('/wishlist', isAuth, getWishlist);
router.put('/cart', isAuth, userCart);
router.put('/address', isAuth, saveAddress);
router.get('/cart', isAuth, getUserCart);
router.post('/cart/apply-coupon', isAuth, applyCoupon);
router.post('/order', isAuth, createOrder);
router.get('/get-orders', isAuth, getOrders);

router.get('/:id', isAuth, isAdmin, getUser);
router.put('/block-user/:id', isAuth, isAdmin, blockUser);
router.put('/unblock-user/:id', isAuth, isAdmin, unblockUser);
router.put('/update-order/:id', isAuth, isAdmin, updateOrderStatus);

module.exports = router;
