const express = require('express');
const {
  createBlog,
  updateBlog,
  getAllBlog,
  getABlog,
  deleteBlog,
  likeBlog,
  disLikeBlog,
  uploadImages,
} = require('../controllers/blogController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');

const router = express.Router();

router.get('/', getAllBlog);
router.get('/:id', getABlog);
router.put('/likes', isAuth, likeBlog);
router.put('/dislikes', isAuth, disLikeBlog);
router.post('/', isAuth, isAdmin, createBlog);
router.put('/:id', isAuth, isAdmin, updateBlog);
router.delete('/:id', isAuth, isAdmin, deleteBlog);
router.put(
  '/upload/:id',
  isAuth,
  isAdmin,
  uploadPhoto.array('images', 2),
  blogImgResize,
  uploadImages
);

module.exports = router;
