import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        // required:[True,"name is required"]
    },
    username:{
        type:String,
        required:[True,"username is required"]
    },
    password:{
        type:String,
        required:[True,"password is required"]
    },
    Doctors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Slot'
    }]
},{timestamps:true})

export default User=mongoose.model('User',UserSchema);