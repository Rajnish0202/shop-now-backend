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
  // handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  removeFromCart,
  applyCoupon,
  createOrder,
  getOrders,
  loadUser,
  emptyCart,
  getOrderDetails,
  addWishlists,
  removeWishlists,
  updateUserCart,
  updateUserRole,
} = require('../controllers/userController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/all-users', getAllUser);
// router.get('/refresh', handleRefreshToken);
router.post('/forgot-password', forgotPassword);
router.get('/logout', logoutUser);
router.put('/reset-password/:resetToken', resetPassword);

router.put('/empty-cart', isAuth, removeFromCart);
router.put('/all-empty-cart', isAuth, emptyCart);
router.put('/edit-user', isAuth, updateUser);
router.put('/password', isAuth, updatePassword);
router.get('/wishlist', isAuth, getWishlist);
router.put('/add-wishlist', isAuth, addWishlists);
router.put('/remove-wishlist', isAuth, removeWishlists);
router.put('/cart', isAuth, userCart);
router.put('/cart-update', isAuth, updateUserCart);
router.put('/address', isAuth, saveAddress);
router.get('/cart', isAuth, getUserCart);
router.post('/cart/apply-coupon', isAuth, applyCoupon);
router.post('/order', isAuth, createOrder);
router.get('/get-orders', isAuth, getOrders);
router.get('/get-orders/:id', isAuth, getOrderDetails);
router.get('/loaduser', isAuth, loadUser);

router.get('/:id', isAuth, isAdmin, getUser);
router.delete('/:id', isAuth, isAdmin, deleteUser);

router.put('/block-user/:id', isAuth, isAdmin, blockUser);
router.put('/unblock-user/:id', isAuth, isAdmin, unblockUser);
router.put('/update-role-user/:id', isAuth, isAdmin, updateUserRole);

module.exports = router;
