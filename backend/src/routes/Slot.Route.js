import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { askSlot, bookSlot, bookSlotTemp, fetchSlot, razorpayWebhook, unBookSlot } from "../controllers/SlotBooking.controller.js";

const router=Router();

router.route('/bookSlot').post(verifyJWT,bookSlot);
router.route('/Allslot').get(verifyJWT,fetchSlot);
router.route('/unBookSlot').post(verifyAdmin,unBookSlot);
router.route('/askSlotId').post(askSlot);
router.post("/create-payment", verifyJWT,bookSlotTemp);
router.post("/webhook",razorpayWebhook);

export default router;