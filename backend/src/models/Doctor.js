import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const DoctorSchema=new mongoose.Schema(
{
   name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:[true,"email is required"]
   },
   qualification:{
      type:String,
      required:[true,"qualification is a required field"]
   },
   image:{
      type:String,
      required:[true,"your image is required"]
   },
   username:{
    type:String,
    required:[true,"username is required"]
   },
   password:{
    type:String,
    required:[true,"password is required"]
   },
   DoctorSlot:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Slot'
   }],
   ToAttendSlot:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Slot'
   }],
   // Patients:[{
   //  type:mongoose.Schema.Types.ObjectId,
   //  ref:"Slot"
   // }]
},{timestamps:true})

DoctorSchema.pre("save", async function (next) {
   if (!this.isModified("password")) { return next(); }
   this.password = await bcrypt.hash(this.password, 10);
   next();
});

DoctorSchema.methods.isPasswordTrue = async function (password) {
   return await bcrypt.compare(password, this.password);
}

DoctorSchema.methods.jwtAccessToken = function () {
   return jwt.sign({
       _id: this._id,
       username: this.username,
       email: this.email
   }, process.env.ACCESS_TOKEN_SECRET, {
       expiresIn: process.env.ACCESS_TOKEN_EXPIRY
   });
}

DoctorSchema.methods.jwtRefreshToken = function () {
   return jwt.sign({
       _id: this._id
   }, process.env.REFRESH_TOKEN_SECRET, {
       expiresIn: process.env.REFRESH_TOKEN_EXPIRY
   });
}

export const Doctor=mongoose.model("Doctor",DoctorSchema);