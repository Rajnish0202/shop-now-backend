const express = require('express');
const {
  generateCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupon,
  getACoupon,
} = require('../controllers/couponController');

const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', isAuth, isAdmin, getAllCoupon);
router.get('/:id', isAuth, isAdmin, getACoupon);
router.post('/', isAuth, isAdmin, generateCoupon);
router.put('/:id', isAuth, isAdmin, updateCoupon);
router.delete('/:id', isAuth, isAdmin, deleteCoupon);

module.exports = router;
