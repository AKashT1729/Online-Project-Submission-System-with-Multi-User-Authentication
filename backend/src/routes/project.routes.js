import { Router } from "express";
import { checkRole } from "../middlewares/role.middlewares";
import { verifyJWT } from "../middlewares/auth.middlewares";
import { reviewSubmission } from "../controllers/project.controller";


const router = Router();

router.route('/review-submission').post(verifyJWT, checkRole("ProjectGuide", "HoD"),reviewSubmission)



export default router;