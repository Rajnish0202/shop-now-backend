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
  getRelatedProduct,
  randomProduct,
  popularProducts,
  featuredProducts,
  specialProducts,
} = require('../controllers/productController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const {
  productImgResize,
  uploadPhoto,
} = require('../middlewares/uploadImages');

const router = express.Router();

router.get('/', getAllProduct);
router.get('/popular-product', popularProducts);
router.get('/featured-product', featuredProducts);
router.get('/special-product', specialProducts);
router.get('/random-product', randomProduct);
router.get('/:slug', getAProduct);
router.get('/related-product/:productid/:categoryid', getRelatedProduct);
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
