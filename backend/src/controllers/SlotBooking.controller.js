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
// const bookSlot=asyncHandler(async(req,res)=>{
     
//      const { DoctorId, time } = req.body;   
//      const userId=req.user._id;
//      console.log("userId" ,userId);
//      const session = await Slot.startSession();
//      session.startTransaction();
//     //  const locked=await Slot.findOneAndUpdate({Doctor:DoctorId,Time:time,check:"available"},{$set:{check:"unavailable"}},{new:true})
//     //  if(!locked){
//     //    await session.abortTransaction();
//     //   res.status(201).json("slot is already booked or time has passed please try some another slot");
//     //  }
     
//      try{
//       const locked=await Slot.findOneAndUpdate({Doctor:DoctorId,Time:time,check:"available"},{$set:{check:"unavailable"}},{new:true})
//       if(!locked){
//         await session.abortTransaction();
//         session.endSession();
//         res.status(500).json("slot is already booked or time has passed please try some another slot");
//       }
//        const options = {
//         amount: 250, 
//         currency: "INR",
//         receipt: `receipt#${new Date().getTime()}`, 
//         payment_capture: 1 
//     };
//     console.log("new user is",locked._id);
//     const order = await razorpay.orders.create(options);
//     const findSlot=await Slot.findOneAndUpdate({Doctor:DoctorId,Time:time},{$set:{Patient:userId}},{new:true});
//     const updateUser=await User.findOneAndUpdate({_id:userId},{$addToSet:{YourSlot:locked._id}},{new:true});
//     console.log("new user is",locked._id);
//     const updateDoctor=await Doctor.findOneAndUpdate({_id:DoctorId},{$addToSet:{ToAttendSlot:locked._id}},{new:true});
//     console.log(updateDoctor);
    
//     if(!findSlot){
//       // await session.abortTransaction();
//       return res.status(500).json({msg:"some internal error is here ,please try again later"});
//     }
//        await session.commitTransaction();
//        return res.status(200).json({ orderId: order.id, amount:250 ,data:findSlot});
//      }catch(err){
//        console.error("transaction failed",err);
//        const unlock=await Slot.findOneAndUpdate({Doctor:DoctorId,Time:time},{$set:{check:"available"}},{new:true});
//        await session.abortTransaction();

//      }finally{
//       session.endSession();
//      }
// })

const bookSlot = asyncHandler(async (req, res) => {
  const { DoctorId, time } = req.body;
  const userId = req.user._id;
  console.log("userId", userId);

  const session = await Slot.startSession();
  session.startTransaction();

  try {
    // Lock the slot and ensure it's marked as unavailable for the transaction
    const locked = await Slot.findOneAndUpdate(
      { Doctor: DoctorId, Time: time, check: "available" },
      { $set: { check: "unavailable" } },
      { new: true, session } // Make sure session is passed for atomicity
    );

    // If the slot is not found or already booked, abort the transaction
    if (!locked) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ msg: "Slot is already booked or time has passed, please try another slot" });
    }

    // Proceed to create Razorpay order for the payment
    const options = {
      amount: 250, // Amount in INR (250 paise = 2.50 INR)
      currency: "INR",
      receipt: `receipt#${new Date().getTime()}`,
      payment_capture: 1, // Capture payment after successful authorization
    };

    const order = await razorpay.orders.create(options);

    // Update the Slot, User, and Doctor collections
    const findSlot = await Slot.findOneAndUpdate(
      { Doctor: DoctorId, Time: time },
      { $set: { Patient: userId } },
      { new: true, session }
    );

    const updateUser = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { YourSlot: locked._id } },
      { new: true, session }
    );

    const updateDoctor = await Doctor.findOneAndUpdate(
      { _id: DoctorId },
      { $addToSet: { ToAttendSlot: locked._id } },
      { new: true, session }
    );

    // Check if all updates were successful, if not, abort transaction
    if (!findSlot || !updateUser || !updateDoctor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ msg: "Some internal error occurred, please try again later" });
    }

    // Commit the transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    // Return the order details and slot info to the user
    return res.status(200).json({
      orderId: order.id,
      amount: 250, // The amount in INR
      data: findSlot, // Slot details
    });

  } catch (err) {
    console.error("Transaction failed", err);

    // If any error occurs, unlock the slot and abort the transaction
    await Slot.findOneAndUpdate(
      { Doctor: DoctorId, Time: time },
      { $set: { check: "available" } },
      { new: true }
    );

    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({ msg: "Transaction failed, please try again later" });
  }
});


export {bookSlot,fetchSlot};