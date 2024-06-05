import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename(req, file, cb) {
    cb(null, `${nanoid()}_${file.originalname}`);
  },
});

export default multer({ storage });
