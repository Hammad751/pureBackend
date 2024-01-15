import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // path where to save all files
  },
  filename: function (req, file, cb) {
    console.log("file.originalname: ", file.originalname);
    cb(null, file.originalname);
  }

  // filename: function (req, file, cb) {
  //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  //   cb(null, file.fieldname + '-' + uniqueSuffix)
  // }
})
  
export const upload = multer({ storage })