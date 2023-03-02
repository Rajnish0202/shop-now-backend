const express = require('express');
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getACategory,
} = require('../controllers/productCategoryController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllCategory);
router.get('/:id', getACategory);
router.post('/', isAuth, isAdmin, createCategory);
router.put('/:id', isAuth, isAdmin, updateCategory);
router.delete('/:id', isAuth, isAdmin, deleteCategory);

module.exports = router;
