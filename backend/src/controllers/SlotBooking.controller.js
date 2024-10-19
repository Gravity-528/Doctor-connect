import Slot from "../models/Slot.js"
import razorpay from "razorpay"
import asyncHandler from "../utils/asyncHandler.js"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET 
});


const bookSlot=asyncHandler(async(req,res)=>{
     
     const { DoctorId, time } = req.body;   
     
     const locked=await Slot.findOneAndUpdate({Doctor:DoctorId,Time:time,check:"available"},{$set:{check:"unavailable"}},{new:true})
     if(!locked){
      //  await session.abortTransaction();
      res.status(201).json("slot is already booked or time has passed please try some another slot");
     }
     const session = await Slot.startSession();
     session.startTransaction();
     try{

       //transaction logic
       const options = {
        amount: amount * 100, 
        currency: "INR",
        receipt: `receipt#${new Date().getTime()}`, 
        payment_capture: 1 
    };
    const order = await razorpay.orders.create(options);

       await session.commitTransaction();
       return res.status(200).json({ orderId: order.id, amount });
     }catch(err){
       console.log("transaction failed")
       await session.abortTransaction();
       const unlock=await Slot.findOneAndUpdate({Doctor:DoctorId,Time:time},{$set:{check:"available"}},{new:true});

     }finally{
      session.endSession();
     }
})

export {bookSlot};