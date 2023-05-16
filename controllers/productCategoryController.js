const asyncHandler = require('express-async-handler');
const ProductCategory = require('../models/productCategoryModel');
const validateMongoDbId = require('../utils/validateMongodbId');
const slugify = require('slugify');
const {
  cloudinaryUploadImg,
  cloudinaryDeleteSingleImg,
} = require('../utils/cloudinary');
const fs = require('fs');

const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(401);
    throw new Error('Category title is required. ');
  }

  const existingCategory = await ProductCategory.findOne({ title });

  if (existingCategory) {
    res.status(200);
    throw new Error('Category already exists');
  }

  const category = await ProductCategory.create({
    title,
    slug: slugify(title),
  });

  res.status(201).json({
    success: true,
    category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  const category = await ProductCategory.findByIdAndUpdate(
    id,
    { title, slug: slugify(title) },
    {
      new: true,
    }
  );

  res.status(201).json({
    success: true,
    category,
  });
});

const updateCategoryImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  let category = await ProductCategory.findById(id);
  if (!category) {
    res.status(404);
    throw new Error('Category Not Found!');
  }

  try {
    const uploader = (path) => cloudinaryUploadImg(path, 300, 300, 'image');

    const file = req.file;
    const { path } = file;

    const newPath = await uploader(path);
    fs.unlinkSync(path);

    // Deleting Image From Cloudinary
    if (category?.image?.public_id) {
      cloudinaryDeleteSingleImg(category);
    }

    category = await ProductCategory.findByIdAndUpdate(
      id,
      {
        image: newPath,
      },
      { new: true }
    );
    res.status(200).json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  let category = await ProductCategory.findById(id);
  if (!category) {
    res.status(404);
    throw new Error('Category Not Found!');
  }

  cloudinaryDeleteSingleImg(category);

  await ProductCategory.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product Category Deleted.',
  });
});

const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await ProductCategory.find()
    .collation({ locale: 'en', strength: 2 })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

// Get A category

const getACategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await ProductCategory.findOne({ slug });

  if (!category) {
    res.status(404);
    throw new Error('Category not found.');
  }

  res.status(200).json({
    success: true,
    category,
  });
});

// Get Product Count and Category with each Category

const categoriesOfProducts = asyncHandler(async (req, res) => {
  let productCategory = await ProductCategory.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'category',
        as: 'products',
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        image: 1,
        number_of_product: { $size: '$products' },
      },
    },
  ]);

  res.status(200).json(productCategory);
});

const getQuickCategory = asyncHandler(async (req, res) => {
  const count = await ProductCategory.countDocuments();

  const random = Math.floor(Math.random() * count);

  const categories = await ProductCategory.find()
    .collation({ locale: 'en', strength: 2 })
    .sort({ title: 1 })
    .skip(random)
    .limit(5)
    .select('title');

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryImage,
  getAllCategory,
  getACategory,
  categoriesOfProducts,
  getQuickCategory,
};
