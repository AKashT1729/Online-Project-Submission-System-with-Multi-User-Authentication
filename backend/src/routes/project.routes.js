import { Router } from "express";
import { checkRole } from "../middlewares/role.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getProjectStatus,
  submitProject,
  updateProjectStatus,
} from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/submit-project")
  .post(verifyJWT, upload.single("srsFile"), submitProject);
router
  .route("/review-submission")
  .patch(verifyJWT, checkRole("ProjectGuide", "HoD"), updateProjectStatus);

router.route("/project-status").get(verifyJWT,getProjectStatus)
export default router;
