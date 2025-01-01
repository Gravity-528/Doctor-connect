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

// const MONGODB_URI='mongodb+srv://garvitraj004:ivNpZq3Gcy4ZUj30@cluster0.ebprw.mongodb.net'
// const DB_NAME='MENTORS_CONNECT'
// const connectDb=async()=>{
//     try {
//         await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`,{serverSelectionTimeoutMS: 30000, useNewUrlParser: true, useUnifiedTopology: true,});
//         console.log("-------------------->",`${MONGODB_URI}/${DB_NAME}`)
//         console.log(`DB connected successfully,`)
        
//     } catch (error) {
//         console.log("-------------------->",`${MONGODB_URI}/${DB_NAME}`)
//         console.error("there is error in connecting the database",error);
//     }
// }
// const pathF=path.join(__dirname, '..', '.env');
// console.log(pathF);
// const connectDb=async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`,{serverSelectionTimeoutMS: 30000, useNewUrlParser: true, useUnifiedTopology: true,});
//         console.log("-------------------->",`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
//         console.log(`DB connected successfully,`)
        
//     } catch (error) {
//         console.log("-------------------->",`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
//         console.error("there is error in connecting the database",error);
//     }
// }
(async () => {
  await connectDb();
})();

const connection = new IORedis({
    host: 'localhost',
    port: 6379, 
    maxRetriesPerRequest: null,
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