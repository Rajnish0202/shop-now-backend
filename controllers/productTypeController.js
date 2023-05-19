const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const slugify = require('slugify');
const Type = require('../models/productType');
const {
  cloudinaryUploadImg,
  cloudinaryDeleteSingleImg,
} = require('../utils/cloudinary');
const fs = require('fs');

const createType = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(401);
    throw new Error('Type title is required.');
  }

  const existingType = await Type.findOne({ title });

  if (existingType) {
    res.status(200);
    throw new Error('Type already exists');
  }

  const type = await Type.create({
    title,
    slug: slugify(title),
  });

  res.status(201).json({
    success: true,
    type,
  });
});

const updateType = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  const type = await Type.findByIdAndUpdate(
    id,
    { title, slug: slugify(title) },
    {
      new: true,
    }
  );

  res.status(201).json({
    success: true,
    type,
  });
});

const deleteType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  let type = await Type.findById(id);
  if (!type) {
    res.status(404);
    throw new Error('Type Not Found!');
  }

  cloudinaryDeleteSingleImg(type);

  await Type.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product Type Deleted.',
  });
});

const getAllType = asyncHandler(async (req, res) => {
  const types = await Type.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: types.length,
    types,
  });
});

// A single Type

const getAType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const type = await Type.findById(id);

  if (!type) {
    res.status(404);
    throw new Error('Type not found.');
  }

  res.status(200).json({
    success: true,
    type,
  });
});

// Upload Image

const updateTypeImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  let type = await Type.findById(id);
  if (!type) {
    res.status(404);
    throw new Error('Type Not Found!');
  }

  try {
    const uploader = (path) => cloudinaryUploadImg(path, 480, 805, 'image');

    const file = req.file;
    const { path } = file;

    const newPath = await uploader(path);
    fs.unlinkSync(path);

    // Deleting Image From Cloudinary
    if (type?.image?.public_id) {
      cloudinaryDeleteSingleImg(type);
    }

    type = await Type.findByIdAndUpdate(
      id,
      {
        image: newPath,
      },
      { new: true }
    );
    res.status(200).json(type);
  } catch (error) {
    throw new Error(error);
  }
});

// Get Product Count with Each Type
const typesOfProducts = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  let productType = await Type.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'type',
        as: 'products',
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        image: 1,
        slug: 1,
        number_of_product: { $size: '$products' },
      },
    },
    {
      $limit: +limit || 4,
    },
  ]);

  res.status(200).json(productType);
});

module.exports = {
  createType,
  updateType,
  deleteType,
  getAllType,
  getAType,
  updateTypeImage,
  typesOfProducts,
};
