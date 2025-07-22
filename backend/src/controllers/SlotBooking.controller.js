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
import mongoose from "mongoose";
import axios from "axios";
import crypto from "crypto";
import { SubscriptionPlan } from "../models/SubscriptionPlan.js";
import { type } from "os";

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
      {$pull:{DoctorSlot:slotid}},
      {new:true}
    )
    
    const finalSlot = await Slot.findByIdAndDelete(slotid);

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
const base64Auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
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

    await redisBook.set(key, userId, "NX", "EX", 1200);
    
    const expireBy=Math.floor(Date.now()/1000)+480;

    //  const order=await razorpay.orders.create({
    //    amount:200,
    //    currency:"INR",
    //    receipt:`order_${userId}`,
    //    payment_capture:1,
    //   //  expire_by:expireBy
    //  })
    //  Correct API Request to Razorpay
    const response = await axios.post(
      "https://api.razorpay.com/v1/orders",
      {
        amount: 20000, // ✅ Amount in paise (₹200)
        currency: "INR",
        receipt: `order_${userId}`,
        payment_capture: 1,
        // expire_by: expireBy,
        notes: {type: "Booking", userId, DoctorId, date, time},
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
        headers: { "Content-Type": "application/json" },
      }
    );

    await session.commitTransaction();
    session.endSession();
    

    return res.status(201).json({order:response.data, message: "Slot booked successfully"});

  } catch (error) {
    // await session.abortTransaction();
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
  console.log("expected key is",expectedSignature);
  const { event, payload } = req.body;
  console.log("payload",payload)
  if (event === "payment.captured") {
    console.log("webhook is triggered");
    const paymentId = payload.payment.entity.id;
    const type = payload.payment.entity.notes.type;
    console.log("payload is",payload.payment.entity);
    if(type==="Booking"){
    console.log("Booking is triggered");
    const userId = payload.payment.entity.notes.userId;
    const DoctorId = payload.payment.entity.notes.DoctorId;
    const date = payload.payment.entity.notes.date;
    const time = payload.payment.entity.notes.time;
    
    const key = `temp${DoctorId}${date}${time}`;
    console.log("key is",key);
    console.log("redisBook is",redisBook);
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
      // console.log("doctorId is",DoctorId);
      const slot=await Slot.create({ userId, doctorId:DoctorId, date, time, paymentId });
      console.log("slot is ",slot);
      const updateDoctor = await Doctor.findByIdAndUpdate(DoctorId, { $addToSet: { DoctorSlot: slot._id } }, {new:true });
      const updateUser = await User.findByIdAndUpdate(userId, { $addToSet: { YourSlot: slot._id } }, {new:true });
      console.log("updateDoctor is",updateDoctor);
      console.log("updateUser is",updateUser);
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
  }
  if (event === "subscription.activated") {
    console.log("Subscription activated",req.body.payload.subscription);
    const { entity } = req.body.payload.subscription;
    const userId = entity.notes.userId; 
    console.log("active userId is",userId);
    console.log("active entity is",entity);
    const FindData=await SubscriptionPlan.findOne({SubscriptionId:entity.id});
    console.log("active FindData is",FindData);
    if(!FindData){
      await SubscriptionPlan.create({
      userId:req.body.payload.subscription.entity.notes.userId,
      SubscriptionId:req.body.payload.subscription.entity.id,
      paymentId:req.body.payload.payment.entity.id,
      status:req.body.payload.subscription.entity.status
    })
    }
    await User.findOneAndUpdate(
      { _id: userId }, 
      { isSubscribed: true,subscriptionPlan:FindData._id, subscriptionStatus: "active" }
    );
  }
  if(event==="subscription.cancelled"){
    if (event === "subscription.cancelled") {
     const entity = payload.subscription.entity;
     const userId = entity.notes.userId;
     const subscriptionId = entity.id;

  // 1️⃣ Remove the SubscriptionPlan record
  const deleted = await SubscriptionPlan.findOneAndDelete({
    SubscriptionId: subscriptionId  // match by subscription.id, not _id
  });

  // 2️⃣ Update user document
  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: { isSubscribed: false },
      $unset: { subscriptionPlan: "" }  // removes the ObjectId reference
    },
    { new: true }
  );

  if (!user) {
    console.warn("No user found for ID:", userId);
  }
}

  }
  if (event === "subscription.charged") {
    console.log("payment is",req.body.payload);
    console.log("userId payment is",req.body.payload.subscription.entity.notes.userId)
    const findSub=await SubscriptionPlan.findOne({SubscriptionId:req.body.payload.subscription.entity.id});
    if(findSub){
      return res.status(400).json({message:"Subscription already charged"});
    }
    await SubscriptionPlan.create({
      userId:req.body.payload.subscription.entity.notes.userId,
      SubscriptionId:req.body.payload.subscription.entity.id,
      paymentId:req.body.payload.payment.entity.id,
      status:req.body.payload.subscription.entity.status
    })
  }
  if (event === "subscription.halted" || event === "subscription.pending") {
    await User.findOneAndUpdate(
      { razorpaySubscriptionId: subscriptionId },
      { isSubscribed: false, subscriptionStatus: "expired" }
    );
  }

  res.status(400).json({ message: "Unhandled event type" });
};

// const CancelSubscription=( async (req, res) => {
//   const { userId } = req.user._id;
//   const Subscription= await SubscriptionPlan.findOne({userId:userId});
//   if(!Subscription){
//     return res.status(404).json({ message: "Subscription not found" });
//   }
//   const user = await User.findById(userId);
//   if (!user || !user.razorpaySubscriptionId) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   try {
//     await razorpay.subscriptions.cancel(user.razorpaySubscriptionId);

    
//     const daysRemaining = 30 - new Date().getDate(); 
//     const refundAmount = Math.round((daysRemaining / 30) * user.subscriptionAmount); 

    
//     const paymentId = "pay_xxx"; 
//     await razorpay.payments.refund(paymentId, {
//       amount: refundAmount * 100, 
//     });

    
//     await User.findByIdAndUpdate(userId, {
//       isSubscribed: false,
//       subscriptionStatus: "cancelled",
//     });

//     res.json({ message: "Subscription cancelled & refunded", refundAmount });
//   } catch (error) {
//     res.status(500).json({ message: "Error cancelling subscription", error });
//   }
// });

const CancelSubscription = async (req, res) => {
  const userId = req.user._id;

  const subscription = await SubscriptionPlan.findOne({ userId });
  if (!subscription?.SubscriptionId) {
    return res.status(404).json({ message: "Subscription not found" });
  }
  const subId = subscription.SubscriptionId;
  console.log("subId is", subId);
  try {
    const inv = await razorpay.invoices.all({ subscription_id: subId });
    const latest = inv.items[0];
    console.log("latest invoice is", latest);
    console.log("invoice items are", inv.items);
    if (!latest?.payment_id) {
      return res.status(400).json({ message: "No valid payment found for refund" });
    }
    const paymentId = latest.payment_id;
    console.log("paymentId is", paymentId);
    const canceled = await razorpay.subscriptions.cancel(subId, { cancel_at_cycle_end: true });
    // const canceled = await razorpay.subscriptions.cancel(subId);
    console.log("canceled subscription is", canceled);
    const plan = await razorpay.plans.fetch(canceled.plan_id);
    const cycleAmount = plan.item.amount;
    const cycleEndMs = canceled.current_end * 1000;

    const daysLeft = Math.max(0, (cycleEndMs - Date.now()) / (1000 * 60 * 60 * 24));
    const refundPaise = Math.round((daysLeft / 30) * cycleAmount);

    let refundId = null;
    if (refundPaise > 0) {
      const refund = await razorpay.payments.refund(paymentId, { amount: refundPaise });
      refundId = refund.id;
    }

    return res.json({
      message: "Subscription canceled",
      status: canceled.status,
      cycleEndsAt: cycleEndMs,
      refundAmount: refundPaise / 100,
      refundId
    });

  } catch (err) {
    console.error("Error in cancelSubscription:", err);
    return res.status(500).json({ message: "Error canceling subscription", error: err.message });
  }
};


const createSubscription = async (req, res) => {
  try {
    const { plan_id } = req.body; 
    console.log("request id is",req.user)
    const userId = req.user._id; 
    
    const subscription = await razorpay.subscriptions.create({ 
      plan_id: plan_id,
      customer_notify: 1,
      total_count: 12, 
      notes: { userId } ,
    });

    res.json({ subscriptionId: subscription.id });
  } catch (error) {
    console.log("error is",error);
    res.status(500).json({ error: "Subscription creation failed" });
  }
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

const SubInfo=async(req,res)=>{
  const {subscriptionId}=req.body;
  try {
    const subscription=await razorpay.subscriptions.fetch(subscriptionId);
    return res.status(200).json({data:subscription});
  } catch (error) {
    console.log("error is",error);
    return res.status(500).json({message:"some error is here"});
  }
}

const GetSubInfo=async(req,res)=>{
  const userId=req.user._id
  console.log("userId is",userId);
  const subscription=await SubscriptionPlan.findOne({userId:userId});
  console.log("subscription is",subscription);
  const SubscriptionId=subscription?.SubscriptionId;
  if(!SubscriptionId || subscription.status!=="active"){
    return res.status(200).json({message:"Subscription not found renew your subscription",type:"NotActive"});
  }

  const sub = await razorpay.subscriptions.fetch(SubscriptionId);
  const plan = await razorpay.plans.fetch(sub.plan_id);

  res.json({
    message: "Subscription details fetched successfully",
    type: "Active",
      subscription: {
      planId: sub.plan_id,
      status: sub.status,
      paidCount: sub.paid_count,
      totalCount: sub.total_count,
      nextBilling: sub.charge_at * 1000,
      currentEnd: sub.current_end * 1000,
      amountPaid: (sub.paid_count || 0) * (plan.item.amount || 0),
  }
});

}

export {bookSlot,fetchSlot,unBookSlot,askSlot,bookSlotTemp,razorpayWebhook,createSubscription,CancelSubscription,SubInfo,GetSubInfo};