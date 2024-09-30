import mongoose from "mongoose"

const SlotSchema=new mongoose.Schema(
{
   Doctor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Doctor"
   },
   Time:{
    type:Date
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

export default Slot=mongoose.model("Doctor",SlotSchema);