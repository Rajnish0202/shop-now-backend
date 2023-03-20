const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const slugify = require('slugify');
const Type = require('../models/productType');

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
  await Type.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product Type Deleted.',
  });
});

const getAllType = asyncHandler(async (req, res) => {
  const types = await Type.find();

  res.status(200).json({
    success: true,
    count: types.length,
    types,
  });
});

//

const getAType = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const type = await Type.findOne({ slug });

  if (!type) {
    res.status(404);
    throw new Error('Type not found.');
  }

  res.status(200).json({
    success: true,
    type,
  });
});

module.exports = {
  createType,
  updateType,
  deleteType,
  getAllType,
  getAType,
};
