const express = require('express');
const {
  createType,
  updateType,
  deleteType,
  getAType,
  getAllType,
} = require('../controllers/productTypeController');

const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllType);
router.get('/:slug', getAType);
router.post('/', isAuth, isAdmin, createType);
router.put('/:id', isAuth, isAdmin, updateType);
router.delete('/:id', isAuth, isAdmin, deleteType);

module.exports = router;
