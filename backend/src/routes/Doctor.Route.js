import { Router } from "express";
import { LoginDoctor, LogoutDoctor, registerDoctor } from "../controllers/Doctor.controller";

const router=Router();

router.route("/registerDoctor").post(registerDoctor)
router.route("/loginDoctor").post(LoginDoctor)
router.route("/logoutDoctor").post(LogoutDoctor);

export default router