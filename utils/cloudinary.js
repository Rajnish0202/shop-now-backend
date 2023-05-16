const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImg = async (
  fileToUploads,
  width = 300,
  height = 300
) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      fileToUploads,

      (result) => {
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      },
      {
        folder: 'Shop-now',
        width: width,
        height: height,
        resource_type: 'auto',
      }
    );
  });
};

const cloudinaryDeleteImg = async (deleteObj, i) => {
  await cloudinary.uploader.destroy(deleteObj?.images[i]?.public_id, {
    folder: 'Shop-now',
  });
};

const cloudinaryDeleteSingleLogo = async (deleteObj) => {
  await cloudinary.uploader.destroy(deleteObj?.logo?.public_id, {
    folder: 'Shop-now',
  });
};

const cloudinaryDeleteSingleImg = async (deleteObj) => {
  await cloudinary.uploader.destroy(deleteObj?.image?.public_id, {
    folder: 'Shop-now',
  });
};

module.exports = {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
  cloudinaryDeleteSingleImg,
  cloudinaryDeleteSingleLogo,
};
