const express = require('express');
const {
  getAllColor,
  getAColor,
  createColor,
  updateColor,
  deleteColor,
} = require('../controllers/productColorController');

const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllColor);
router.get('/:id', getAColor);
router.post('/', isAuth, isAdmin, createColor);
router.put('/:id', isAuth, isAdmin, updateColor);
router.delete('/:id', isAuth, isAdmin, deleteColor);

module.exports = router;
