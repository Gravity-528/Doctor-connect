import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"]
    },
    username:{
        type:String,
        required:[true,"username is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken: {
        type: String
    },
    email:{
       type:String,
       required:[true,"email is required"]
    },
    YourSlot:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Slot'
    }],
    // Doctors:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Slot'
    // }]
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

export const User =mongoose.model('User',UserSchema);