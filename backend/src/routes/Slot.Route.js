import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { askSlot, bookSlot, fetchSlot, unBookSlot } from "../controllers/SlotBooking.controller.js";

const router=Router();

router.route('/bookSlot').post(verifyJWT,bookSlot);
router.route('/Allslot').get(verifyJWT,fetchSlot);
router.route('/unBookSlot').post(verifyAdmin,unBookSlot);
router.route('/askSlotId').post(askSlot);


export default router;