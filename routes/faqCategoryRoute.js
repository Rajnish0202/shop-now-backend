const express = require('express');
const router = express.Router();

const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const {
  getAllFaqCategory,
  getAFaqCategory,
  createFaqCategory,
  updateFaqCategory,
  deleteFaqCategory,
} = require('../controllers/faqCategoryController');

router.get('/', getAllFaqCategory);
router.get('/:id', getAFaqCategory);
router.post('/', isAuth, isAdmin, createFaqCategory);
router.put('/:id', isAuth, isAdmin, updateFaqCategory);
router.delete('/:id', isAuth, isAdmin, deleteFaqCategory);

module.exports = router;
