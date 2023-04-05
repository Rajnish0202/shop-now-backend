const express = require('express');
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getACategory,
  updateCategoryImage,
  categoriesOfProducts,
} = require('../controllers/productCategoryController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const {
  uploadPhoto,
  productImgResize,
} = require('../middlewares/uploadImages');

const router = express.Router();

router.get('/', getAllCategory);
router.get('/product-count-category', categoriesOfProducts);
router.get('/:slug', getACategory);
router.post('/', isAuth, isAdmin, createCategory);
router.put('/:id', isAuth, isAdmin, updateCategory);
router.put(
  '/upload/:id',
  isAuth,
  isAdmin,
  uploadPhoto.single('image'),
  productImgResize,
  updateCategoryImage
);
router.delete('/:id', isAuth, isAdmin, deleteCategory);

module.exports = router;
