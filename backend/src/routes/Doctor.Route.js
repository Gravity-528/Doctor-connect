import { Router } from "express";
import { LoginDoctor, LogoutDoctor, registerDoctor, SlotAttend } from "../controllers/Doctor.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/registerDoctor").post(registerDoctor)
router.route("/loginDoctor").post(LoginDoctor)
router.route("/logoutDoctor").post(LogoutDoctor);
router.route("/doctorSlot").get(verifyAdmin,SlotAttend);

export default router