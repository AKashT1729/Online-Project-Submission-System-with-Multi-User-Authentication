import { Router } from "express";
import { checkRole } from "../middlewares/role.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  reviewSubmission,
  submitProject,
} from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/submit-project")
  .post(verifyJWT, upload.single("srsFile"), submitProject);
router
  .route("/review-submission")
  .post(verifyJWT, checkRole("ProjectGuide", "HoD"), reviewSubmission);

export default router;
