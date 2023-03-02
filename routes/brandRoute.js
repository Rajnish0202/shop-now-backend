const express = require('express');
const {
  getAllBrand,
  getABrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandController');

const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllBrand);
router.get('/:id', getABrand);
router.post('/', isAuth, isAdmin, createBrand);
router.put('/:id', isAuth, isAdmin, updateBrand);
router.delete('/:id', isAuth, isAdmin, deleteBrand);

module.exports = router;
