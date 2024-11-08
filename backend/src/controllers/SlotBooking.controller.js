import {Slot} from "../models/Slot.js"
import Razorpay from "razorpay"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/User.js";
import { Doctor } from "../models/Doctor.js";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET 
});

const fetchSlot=asyncHandler(async(req,res)=>{
  try{
     const AllSlot=await Slot.find();

     return res.status(200).json({data:AllSlot,msg:"All slots fetched successfully"});
  }catch(err){
    console.error("some error is here",err);
  }
})
const bookSlot=asyncHandler(async(req,res)=>{
     
     const { DoctorId, time } = req.body;   
     const userId=req.user._id;
     console.log("userId" ,userId);
     const locked=await Slot.findOneAndUpdate({Doctor:DoctorId,Time:time,check:"available"},{$set:{check:"unavailable"}},{new:true})
     if(!locked){
      //  await session.abortTransaction();
      res.status(201).json("slot is already booked or time has passed please try some another slot");
     }
     const session = await Slot.startSession();
     session.startTransaction();
     try{
       const options = {
        amount: 250, 
        currency: "INR",
        receipt: `receipt#${new Date().getTime()}`, 
        payment_capture: 1 
    };
    const order = await razorpay.orders.create(options);
    const findSlot=await Slot.findOneAndUpdate({Doctor:DoctorId,Time:time},{$set:{Patient:userId}},{new:true});
    const updateUser=await User.findOneAndUpdate({_id:userId},{$addToSet:{YourSlot:locked._id}},{new:true});
    console.log("new user is",locked._id);
    const updateDoctor=await Doctor.findOneAndUpdate({_id:DoctorId},{$addToSet:{ToAttendSlot:locked._id}},{new:true});
    console.log(updateDoctor);
    
    if(!findSlot){
      await session.abortTransaction();
      return res.status(500).json({msg:"some internal error is here ,please try again later"});
    }
       await session.commitTransaction();
       return res.status(200).json({ orderId: order.id, amount:250 });
     }catch(err){
       console.error("transaction failed",err);
       const unlock=await Slot.findOneAndUpdate({Doctor:DoctorId,Time:time},{$set:{check:"available"}},{new:true});
       await session.abortTransaction();

     }finally{
      session.endSession();
     }
})

export {bookSlot,fetchSlot};