import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { bookSlot } from "../controllers/SlotBooking.controller";

const router=Router();

router.route('/bookSlot').post(verifyJWT,bookSlot);

export default router;