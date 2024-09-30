import mongoose from "mongoose"

const DoctorSchema=new mongoose.Schema(
{
   name:{
    type:String,
    required:true
   },
   username:{
    type:String,
    required:[True,"username is required"]
   },
   password:{
    type:String,
    required:[True,"password is required"]
   },
   
   Patients:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Slot"
   }]
},{timestamps:true})

export default Doctor=mongoose.model("Doctor",DoctorSchema);