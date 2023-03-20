const express = require('express');
const {
  getAllSize,
  getASize,
  createSize,
  updateSize,
  deleteSize,
} = require('../controllers/productSizeController');

const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllSize);
router.get('/:id', getASize);
router.post('/', isAuth, isAdmin, createSize);
router.put('/:id', isAuth, isAdmin, updateSize);
router.delete('/:id', isAuth, isAdmin, deleteSize);

module.exports = router;
