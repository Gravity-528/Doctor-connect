import mongoose from "mongoose"
import { type } from "os";

const SlotSchema=new mongoose.Schema(
{
   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
   },
   doctorId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Doctor"
   },
   date:{
    type:String
   },
   time:{
    type:String
   },
   
   paymentId:{
    type:String
   },

   
},{timestamps:true})

export const Slot=mongoose.model("Slot",SlotSchema);