const express = require('express');
const {
  createType,
  updateType,
  deleteType,
  getAType,
  getAllType,
  updateTypeImage,
  typesOfProducts,
} = require('../controllers/productTypeController');

const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const {
  uploadPhoto,
  productImgResize,
} = require('../middlewares/uploadImages');

const router = express.Router();

router.get('/', getAllType);
router.get('/type', typesOfProducts);
router.get('/:slug', getAType);
router.post('/', isAuth, isAdmin, createType);
router.put('/:id', isAuth, isAdmin, updateType);
router.delete('/:id', isAuth, isAdmin, deleteType);
router.put(
  '/upload/:id',
  isAuth,
  isAdmin,
  uploadPhoto.single('image'),
  productImgResize,
  updateTypeImage
);

module.exports = router;
