import multer, { diskStorage } from "multer";

export const fileUpload = () => {
  const fileFilter = (req, file, cb) => {
    // check mimetype
    if (!["image/png", "image/jpeg"].includes(file.mimetype))
      return cb(new Error("Invalid format"), false);

    return cb(null, true);
  };
  return multer({ storage: diskStorage({}), fileFilter });
};
