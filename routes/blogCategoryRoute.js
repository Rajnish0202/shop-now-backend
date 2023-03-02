const express = require('express');
const {
  getAllBlogCategory,
  getABlogCategory,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} = require('../controllers/blogCategoryController');

const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllBlogCategory);
router.get('/:id', getABlogCategory);
router.post('/', isAuth, isAdmin, createBlogCategory);
router.put('/:id', isAuth, isAdmin, updateBlogCategory);
router.delete('/:id', isAuth, isAdmin, deleteBlogCategory);

module.exports = router;
