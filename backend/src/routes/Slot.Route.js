import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import {verifySubscription} from "../middlewares/Subscription.middleware.js";
import { askSlot, bookSlot, bookSlotTemp, CancelSubscription, createSubscription, fetchSlot, GetSubInfo, razorpayWebhook, SubInfo, unBookSlot } from "../controllers/SlotBooking.controller.js";

const router=Router();

router.route('/bookSlot').post(verifyJWT,bookSlot);
router.route('/Allslot').get(verifyJWT,fetchSlot);
router.route('/unBookSlot').post(verifyAdmin,unBookSlot);
router.route('/askSlotId').post(askSlot);
router.post("/create-payment", verifyJWT,verifySubscription,bookSlotTemp);
router.post("/webhook",razorpayWebhook);
router.post("/createSubscription",verifyJWT,createSubscription);
router.post("/cancel-subscription",verifyJWT,CancelSubscription);
router.post("/SubPayment",verifyJWT,SubInfo);
router.get("/SubInfo",verifyJWT,GetSubInfo);

export default router;