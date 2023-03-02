const express = require('express');
const {
  getAllProduct,
  createProduct,
  getAProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
} = require('../controllers/productController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const {
  productImgResize,
  uploadPhoto,
} = require('../middlewares/uploadImages');

const router = express.Router();

router.get('/', getAllProduct);
router.get('/:id', getAProduct);
router.put('/wishlist', isAuth, addToWishlist);
router.put('/rating', isAuth, rating);
router.post('/', isAuth, isAdmin, createProduct);
router.put('/:id', isAuth, isAdmin, updateProduct);
router.delete('/:id', isAuth, isAdmin, deleteProduct);
router.put(
  '/upload/:id',
  isAuth,
  isAdmin,
  uploadPhoto.array('images', 10),
  productImgResize,
  uploadImages
);

module.exports = router;
