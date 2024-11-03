import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { bookSlot, fetchSlot } from "../controllers/SlotBooking.controller.js";

const router=Router();

router.route('/bookSlot').post(verifyJWT,bookSlot);
router.route('/Allslot').get(verifyJWT,fetchSlot);

export default router;