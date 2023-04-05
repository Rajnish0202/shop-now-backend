const express = require('express');
const {
  getAllBrand,
  getABrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
} = require('../controllers/brandController');

const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const {
  uploadPhoto,
  productImgResize,
} = require('../middlewares/uploadImages');

const router = express.Router();

router.get('/', getAllBrand);
router.get('/:id', getABrand);
router.post('/', isAuth, isAdmin, createBrand);
router.put('/:id', isAuth, isAdmin, updateBrand);
router.delete('/:id', isAuth, isAdmin, deleteBrand);
router.put(
  '/upload/:id',
  isAuth,
  isAdmin,
  uploadPhoto.single('image'),
  productImgResize,
  uploadBrandImage
);

module.exports = router;
