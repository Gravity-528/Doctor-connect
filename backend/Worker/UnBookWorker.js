import dotenv from "dotenv"
dotenv.config({
  path: "../.env"
});
import {Worker} from "bullmq";
import { Doctor } from "../src/models/Doctor.js";
import { User } from "../src/models/User.js";
import { Slot } from "../src/models/Slot.js";
import IORedis from "ioredis"

// import mongoose from "mongoose";
import connectDb from "../src/database/index.js"

(async () => {
  await connectDb();
})();

// const connection = new IORedis({
//     host: 'localhost',
//     port: 6379, 
//     maxRetriesPerRequest: null,
//   });
const connection = new IORedis(process.env.REDIS_URI, {
  maxRetriesPerRequest: null,
});

connection.on('connect', () => {
  console.log('Connected to Redis');
});

console.log("process env consumer",process.env.REDIS_URI)

connection.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

  console.log("starting the worker");

const unBookWorker=new Worker('unbook-queue', async(job)=>{
    console.log("job",job.data);
     const {DoctorId,userId,time,slotid}=job.data;

     try{
        const user=await User.findByIdAndUpdate(
          userId,
          {$pull:{YourSlot:slotid}},
          {new:true,maxTimeMS: 30000}
        );
        const doctor=await Doctor.findByIdAndUpdate(
          DoctorId,
          {$pull:{ToAttendSlot:slotid}},
          {new:true,maxTimeMS: 30000}
        )
    
        const finalSlot=await Slot.findByIdAndUpdate(
          slotid,
          {$set:{Patient:null,check:"available"}},
          {new:true,maxTimeMS: 30000}
        )
    }catch(err){
          console.log("some error is here",err);
    }
},{ connection,
    concurrency:1
})

unBookWorker.on('completed', (job) => {
    console.log(`Job completed successfully: ${job.id}`);
  });
  
  unBookWorker.on('failed', (job, err) => {
    console.error(`Job failed: ${job.id}`, err);
  });