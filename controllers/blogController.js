const Blog = require('../models/blogModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require('../utils/cloudinary');
const fs = require('fs');

const createBlog = asyncHandler(async (req, res) => {
  const newBlog = await Blog.create(req.body);

  res.status(201).json({
    success: true,
    newBlog,
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    updateBlog,
  });
});

const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludeFields = ['limit', 'page', 'sort', 'fields'];

    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|eq)\b/g,
      (match) => `$${match}`
    );

    let query = Blog.find(JSON.parse(queryStr));

    const limit = req.query.limit || 4;

    query = query.limit(limit);

    const allBlog = await query.populate('category', 'title');

    const blogCount = await Blog.countDocuments();

    res.status(200).json({
      success: true,
      blogCount,
      allBlog,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const getABlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await Blog.findByIdAndUpdate(
    id,
    {
      $inc: { numViews: 1 },
    },
    { new: true }
  );

  const blog = await Blog.findById(id)
    .populate('likes', ['firstname', 'lastname', 'email'])
    .populate('dislikes', ['firstname', 'lastname', 'email'])
    .populate('category', 'title');

  if (!blog) {
    res.status(400);
    throw new Error('Blog does not found.');
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  let blog = await Blog.findById(id);

  // Deleting Images From Cloudinary

  for (let i = 0; i < blog.images.length; i++) {
    cloudinaryDeleteImg(blog, i);
  }

  await Blog.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Blog Deleted Successfully.',
  });
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  // Find the blog which you want to like
  const blog = await Blog.findById(blogId);

  if (!blog) {
    res.status(404);
    throw new Error('Blog Not Found');
  }

  // Find the user who liked the blog
  const loginUserId = req?.user?._id;

  // find the user if he disliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // find the user if he liked the blog
  const alreadyliked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      blog,
    });
  }

  if (alreadyliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      blog,
    });
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      blog,
    });
  }
});

const disLikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  // Find the blog which you want to like
  const blog = await Blog.findById(blogId);

  if (!blog) {
    res.status(404);
    throw new Error('Blog Not Found');
  }

  // Find the user who liked the blog
  const loginUserId = req?.user?._id;

  // find the user if he disliked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // find the user if he disliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      blog,
    });
  }

  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      blog,
    });
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      blog,
    });
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  let blog = await Blog.findById(id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog Not Found!');
  }

  try {
    const uploader = (path) => cloudinaryUploadImg(path, 500, 500, 'images');
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    // Deleting Images From Cloudinary
    if (req.files !== undefined) {
      for (let i = 0; i < blog.images.length; i++) {
        cloudinaryDeleteImg(blog, i);
      }
    }

    blog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );
    res.status(200).json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getAllBlog,
  getABlog,
  deleteBlog,
  likeBlog,
  disLikeBlog,
  uploadImages,
};
