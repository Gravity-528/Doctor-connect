import mongoose from "mongoose"

const SlotSchema=new mongoose.Schema(
{
   Doctor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Doctor"
   },
   Time:{
    type:String
   },
   price:{
    type:Number,
    required:true
   },
   Patient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },

   check:{
    type:String,
    enum:["available","unavailable"],
    default:"available"
   }

   
},{timestamps:true})

export const Slot=mongoose.model("Slot",SlotSchema);