const express = require('express');

const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const {
  getAllFaq,
  getAFaq,
  createFaq,
  updateFaq,
  deleteFaq,
} = require('../controllers/faqController');

const router = express.Router();

router.get('/', getAllFaq);
router.get('/:id', isAuth, getAFaq);
router.post('/', isAuth, isAdmin, createFaq);
router.put('/:id', isAuth, isAdmin, updateFaq);
router.delete('/:id', isAuth, isAdmin, deleteFaq);

module.exports = router;
