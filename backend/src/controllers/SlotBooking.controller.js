import {Slot} from "../models/Slot.js"
import Razorpay from "razorpay"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/User.js";
import { Doctor } from "../models/Doctor.js";
import {Queue} from "bullmq"
import IORedis from "ioredis"

const connection = new IORedis({
  host: 'localhost',
  port: 6379, 
  maxRetriesPerRequest: null,
});


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET 
});

const unBookQueue=new Queue('unbook-queue',connection);

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


export {bookSlot,fetchSlot,unBookSlot,askSlot};