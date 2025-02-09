import dotenv from "dotenv"
dotenv.config({
  path: "../.env"
});
import {Slot} from "../models/Slot.js"
import Razorpay from "razorpay"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/User.js";
import { Doctor } from "../models/Doctor.js";
import {Queue, tryCatch} from "bullmq"
import IORedis from "ioredis"

const redisBook = new IORedis(process.env.REDIS_URI, {
  maxRetriesPerRequest: null,
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET 
});

// const unBookQueue=new Queue('unbook-queue',{redis});
// unBookQueue.on("connect",()=>{console.log("connected successfully")})
// unBookQueue.on("error",(err)=>{console.log("error is here in queue",err)})

const fetchSlot=asyncHandler(async(req,res)=>{
  try{
     const AllSlot=await Slot.find();

     return res.status(200).json({data:AllSlot,msg:"All slots fetched successfully"});
  }catch(err){
    console.error("some error is here",err);
  }
})

const bookSlot = asyncHandler(async (req, res) => {
  const { DoctorId, time } = req.body;
  const userId = req.user._id;
  console.log("userId", userId);

  const session = await Slot.startSession();
  session.startTransaction();

  try {
    
    const locked = await Slot.findOneAndUpdate(
      { Doctor: DoctorId, Time: time, check: "available" },
      { $set: { check: "unavailable" } },
      { new: true, session } 
    );

    
    if (!locked) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ msg: "Slot is already booked or time has passed, please try another slot" });
    }

    
    const options = {
      amount: 250, 
      currency: "INR",
      receipt: `receipt#${new Date().getTime()}`,
      payment_capture: 1, 
    };

    const order = await razorpay.orders.create(options);

    
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

    
    if (!findSlot || !updateUser || !updateDoctor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ msg: "Some internal error occurred, please try again later" });
    }
    console.log("adding to the queue");
    unBookQueue.add('unbooking',{DoctorId,userId,time,slotid:locked._id},{
      delay:  15 * 1000, 
    });
    // unBookQueue.getJobs().then(jobs => {
    //   console.log("Jobs in queue:", jobs.data);
    // });
    await session.commitTransaction();
    session.endSession();

    
    return res.status(200).json({
      orderId: order.id,
      amount: 250, 
      data: findSlot, 
    });

  } catch (err) {
    console.error("Transaction failed", err);

    
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

const unBookSlot=asyncHandler(async(req,res)=>{
    const doctorId=req.doctor._id;
    const {slotid,userId}=req.body;

    if (!doctorId || !slotid || !userId) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    try{
    const user=await User.findByIdAndUpdate(
      userId,
      {$pull:{YourSlot:slotid}},
      {new:true}
    );
    const doctor=await Doctor.findByIdAndUpdate(
      doctorId,
      {$pull:{ToAttendSlot:slotid}},
      {new:true}
    )

    const finalSlot=await Slot.findByIdAndUpdate(
      slotid,
      {$set:{Patient:null,check:"available"}},
      {new:true}
    )

    return res.status(200).json({msg:"call ended successfully"});
  }catch(err){
    console.log("some error in unbookSlot",err);
    return res.status(500).json("some error is here");
  }

})

const askSlot=asyncHandler(async(req,res)=>{
    const {time,doctorId}=req.body;
    console.log("time is",time);
    console.log("doctorId SlotUnBook is",doctorId);
    console.log("response body is",req.body);
    try {
      const FindSlot=await Slot.find({Time:time,Doctor:doctorId});
      console.log("FindSlot Ask is",FindSlot);
      return res.status(200).json({msg:"slotId fetched successfullt",data:FindSlot});
    } catch (error) {
      
    }
})

// --------------------------------------------------------------REVAMP----------------------------------------------------------------------
// const bookSlotTemp=(async(req,res)=>{
//    const {DoctorId,date,time}=req.body
//    if (!DoctorId || !date || !time) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }
//    const userId=req.user;

//    const key=`temp${DoctorId}${date}${time}`
//    try {
//      const existBook=await Slot.findOne({date,time});
//      if(existBook){return res.status(201).json({message:"slot is already booked try another slot"})}

//      const tempHoldRedis=await redisBook.get(key);
//      if(tempHoldRedis){
//       return res.status(201).json({message:"slot Booking is in progress by another user please try another slot or try after 10 min"})
//      }
//      await redisBook.set(key,userId, "NX", "EX", 600);

//      return res.status(200).json({message:"slot is booked temporarily for 10min please book your slot"})
//    } catch (error) {
//     console.log("error is tempBook",error);
//      return res.status(500).json({message:"some internal server error is here try again later"});
//    }
// })
// const PaySlot=(async(req,res)=>{
//   const {DoctorId,date,time}=req.body
//   if (!DoctorId || !date || !time) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }
//   const userId=req.user._id;
//   const key = `temp${DoctorId}${date}${time}`; 
//   try {
//     const existBook=await Slot.findOne({date,time});
//      if(existBook){return res.status(201).json({message:"slot is already booked try another slot"})}

//      const tempHoldRedis=await redisBook.get(key);
//      if(tempHoldRedis!==userId){
//        return res.status(201).json({message:"slotBooking is in progress by some other try after 10 min"})
//      }
//      const expireBy=Math.floor(Date.now()/1000)+480;

//      const order=await razorpay.orders.create({
//        amount:200,
//        currency:"INR",
//        receipt:`order_${userId}`,
//        payment_capture:1,
//        expire_by:expireBy
//      })

//      if(order){
//        await Slot.create({
//         userId,date,time})
//      }
//      await redisBook.del(key);
//      res.status(201).json({message:"booked successfully"});

//   } catch (error) {
//     console.error("Error in PaySlot:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// })
// const mongoose = require("mongoose");

// const bookAndPaySlot = async (req, res) => {
//   const { DoctorId, date, time } = req.body;
//   if (!DoctorId || !date || !time) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const userId = req.user._id;
//   const key = `temp${DoctorId}${date}${time}`;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
    
//     const existBook = await Slot.findOne({ DoctorId, date, time }).session(session);
//     if (existBook) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(409).json({ message: "Slot is already booked, try another slot" });
//     }

    
//     const tempHoldRedis = await redisBook.get(key);
//     if (tempHoldRedis && tempHoldRedis !== userId) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(409).json({ message: "Slot is temporarily locked by another user. Try again later." });
//     }

    
//     await redisBook.set(key, userId, "NX", "EX", 600);

const bookSlotTemp = async (req, res) => {
  const { DoctorId, date, time } = req.body;
  if (!DoctorId || !date || !time) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const userId = req.user._id;
  const key = `temp${DoctorId}${date}${time}`;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existBook = await Slot.findOne({ DoctorId, date, time }).session(session);
    if (existBook) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: "Slot already booked. Try another." });
    }

    const tempHoldRedis = await redisBook.get(key);
    if (tempHoldRedis && tempHoldRedis !== userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: "Slot is temporarily locked. Try again later." });
    }

    await redisBook.set(key, userId, "NX", "EX", 900);
    
    const expireBy=Math.floor(Date.now()/1000)+480;

     const order=await razorpay.orders.create({
       amount:200,
       currency:"INR",
       receipt:`order_${userId}`,
       payment_capture:1,
       expire_by:expireBy
     })

    await session.commitTransaction();
    session.endSession();
    

    return res.status(201).json({ message: "Slot booked successfully" });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    await redisBook.del(key);
    console.error("Error in booking process:", error);
    return res.status(500).json({ message: "Internal server error"});
  }
};

const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (expectedSignature !== req.headers["x-razorpay-signature"]) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const { event, payload } = req.body;

  if (event === "payment.captured") {
    const paymentId = payload.payment.entity.id;
    const userId = payload.payment.entity.notes.userId;
    const DoctorId = payload.payment.entity.notes.DoctorId;
    const date = payload.payment.entity.notes.date;
    const time = payload.payment.entity.notes.time;
    
    const key = `temp${DoctorId}${date}${time}`;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const tempHoldRedis = await redisBook.get(key);

      if (!tempHoldRedis || tempHoldRedis !== userId) {
        await session.abortTransaction();
        session.endSession();

        await razorpayRefund(paymentId);
        return res.status(409).json({ message: "Slot expired. Refund initiated." });
      }

      await Slot.create([{ userId, DoctorId, date, time, paymentId }], { session });

      await session.commitTransaction();
      session.endSession();

      await redisBook.del(key);

      return res.status(200).json({ message: "Payment successful, slot booked" });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error in webhook processing:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.status(400).json({ message: "Unhandled event type" });
};


const razorpayRefund = async (paymentId) => {
  try {
    const response = await axios.post(
      `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
      {},
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Refund failed:", error.response ? error.response.data : error.message);
    throw new Error("Refund process failed");
  }
};

export {bookSlot,fetchSlot,unBookSlot,askSlot,bookSlotTemp,razorpayWebhook};