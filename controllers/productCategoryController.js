const asyncHandler = require('express-async-handler');
const ProductCategory = require('../models/productCategoryModel');
const validateMongoDbId = require('../utils/validateMongodbId');
const slugify = require('slugify');
const cloudinaryUploadImg = require('../utils/cloudinary');
const fs = require('fs');
const { log } = require('console');

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

  try {
    const uploader = (path) => cloudinaryUploadImg(path, 'image');

    const file = req.file;
    const { path } = file;

    const newPath = await uploader(path);

    fs.unlinkSync(path);

    const findCategory = await ProductCategory.findByIdAndUpdate(
      id,
      {
        image: newPath,
      },
      { new: true }
    );
    res.status(200).json(findCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await ProductCategory.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product Category Deleted.',
  });
});

const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await ProductCategory.find()
    .collation({ locale: 'en', strength: 2 })
    .sort({ title: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

//

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

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryImage,
  getAllCategory,
  getACategory,
  categoriesOfProducts,
};
