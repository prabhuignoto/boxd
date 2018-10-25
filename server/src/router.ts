import express, { Request, Response } from "express";
import Multer from "multer";
import Path from "path";
import {Authenticate, Authorize, isUserLoggedIn, RevokeToken} from "./auth";
import Download from "./download";
import Logout from "./logout";
import Upload from "./upload";

const router = express.Router();
const DiskStorage = Multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + Path.extname(file.originalname)); // Appending extension
  },
});
const MulterUpload = Multer({ storage: DiskStorage}).any();

router.get("/home", (req: Request, res: Response) => {
  res.send("Welcome Home");
});

router.get("/auth/login", Authorize);

router.get("/authenticate", Authenticate);

router.get("/revokeAccess", RevokeToken);

router.get("/download", Download);

router.post("/logout", Logout);

router.get("/isLoggedIn", isUserLoggedIn);

router.route("/upload").post(MulterUpload, Upload);

export default router;
