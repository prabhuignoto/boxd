import express, { Request, Response } from "express";
import {Authenticate, Authorize, RevokeToken} from "./auth";
import Download from "./download";
import Upload from "./upload";
import Multer from "multer";
import Path from "path";

const router = express.Router();
const DiskStorage = Multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + Path.extname(file.originalname)) //Appending extension
  }
})
const MulterUpload = Multer({ storage: DiskStorage});
  
router.get("/home", (req: Request, res: Response) => {
  res.send("Welcome Home");
});

router.get("/auth/login", Authorize);

router.get("/authenticate", Authenticate);

router.get("/revokeAccess", RevokeToken);

router.get("/download", Download);

router.route('/upload').post(MulterUpload.single("file"), Upload);

export default router;
