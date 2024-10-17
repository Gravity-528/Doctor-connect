import mongoose from "mongoose"

const DoctorSchema=new mongoose.Schema(
{
   name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:[True,"email is required"]
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

UserSchema.pre("save", async function (next) {
   if (!this.isModified("password")) { return next(); }
   this.password = await bcrypt.hash(this.password, 10);
   next();
});

UserSchema.methods.isPasswordTrue = async function (password) {
   return await bcrypt.compare(password, this.password);
}

UserSchema.methods.jwtAccessToken = function () {
   return jwt.sign({
       _id: this._id,
       username: this.username,
       email: this.email
   }, process.env.ACCESS_TOKEN_SECRET, {
       expiresIn: process.env.ACCESS_TOKEN_EXPIRY
   });
}

UserSchema.methods.jwtRefreshToken = function () {
   return jwt.sign({
       _id: this._id
   }, process.env.REFRESH_TOKEN_SECRET, {
       expiresIn: process.env.REFRESH_TOKEN_EXPIRY
   });
}

export default Doctor=mongoose.model("Doctor",DoctorSchema);