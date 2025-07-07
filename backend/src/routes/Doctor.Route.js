import { Router } from "express";
import { AllDoctor, DoctorBhai, FindDoctorById, GetDoctorByUsername, GetDoctorId, GetUser, LoginDoctor, LogoutDoctor, registerDoctor, SlotAttend } from "../controllers/Doctor.controller.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router=Router();

router.route("/registerDoctor").post(upload.fields([{name:"DoctorPhoto",maxCount:1}]),registerDoctor)
router.route("/loginDoctor").post(LoginDoctor)
router.route("/logoutDoctor").post(LogoutDoctor);
router.route("/doctorSlot").get(verifyAdmin,SlotAttend);
router.route("/FindDoctorById").post(FindDoctorById);
router.route("/allDoctor").get(AllDoctor);
router.route("/doctorId").post(GetDoctorId);
router.route("/fetchById").post(verifyAdmin,GetUser);
router.route("/DoctorBhai").get(verifyAdmin,DoctorBhai);
router.route("/GetDoctorByUsername").post(verifyJWT,GetDoctorByUsername);

export default router;