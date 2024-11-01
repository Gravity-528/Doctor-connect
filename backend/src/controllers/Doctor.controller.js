import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { Doctor}  from "../models/Doctor.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import Slot from "../models/Slot.js";

const generateAccessAndRefreshTokens= async(doctorid)=>{
    try {
       const doctor=await Doctor.findById(doctorid);

       console.log(doctor);
       
       const accessToken=doctor.jwtAccessToken();
       const refreshToken=doctor.jwtRefreshToken();

      console.log("access ",accessToken);
      console.log("refresh ",refreshToken);

      doctor.refreshToken=refreshToken;

      await doctor.save({validateBeforeSave:false});

      return {accessToken , refreshToken};
       
        
    } catch (error) {
        throw new ApiError(409,"some error while generating access Token and refresh Token")
    }
}

const registerDoctor=asyncHandler(async(req,res)=>{
    
    const {name,username,password,email}=req.body;

    
    if(!name || !username || !password || !email){
        throw new ApiError(400,"all fields required");
    }

    
    const exist=await Doctor.findOne({
        $or:[{email},{username}]
    })
    console.log(exist);
    if(exist){
        throw new ApiError(400,"this account already exists");
    }

    
    const doctor=await Doctor.create({
        username,
        password,
        email
    });

    const check=await Doctor.findById(doctor._id).select("-password -refreshToken");

    if(!check){
        throw new ApiError(500,"user has not been registered");
    }

    //return to database
    const Slot1=await Slot.create({
        Doctor:doctor.id,
        Time:"3:00 pm",
        price:250,
        check:"unavailable"
    });
    const Slot2=await Slot.create({
        Doctor:doctor.id,
        Time:"9:00 pm",
        price:250,
        check:"unavailable"
    });
    return res.status(201).json(
       new ApiResponse(201,check,"user registered successfully")
    )
});

const LoginDoctor=asyncHandler(async(req,res)=>{
    
    const {username,password,email}=req.body
 
    if(!username || !password || !email){
     console.log(req.body);
     throw new ApiError(401,"all details are missing");
    }
 
    const exist=await Doctor.findOne({
     $or:[{username},{email}]
    })
 
    if(!exist){
     throw new ApiError(500,"there is no account with this username or email please register first");
    }
    
 
    const check=exist.isPasswordTrue(password);
    if(!check){
      throw new ApiError(409,"incorrect password given");
    }
 
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(exist._id);
    console.log(exist._id);
    console.log("accessToken",accessToken);
     console.log("refreshToken",refreshToken);
 
    const loggedDetail=await Doctor.findById(exist._id).select("-password -referenceToken")
 
    const options={
       httpOnly:true,
       secure:true
    }
 
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,loggedDetail,"logged successfully"))
 });
 
 const LogoutDoctor=asyncHandler((req,res)=>{
     const id=req.doctor._id;
 
     Doctor.findByIdAndUpdate(id,{
         $set:{
             refreshToken:undefined
         }
     },{
         new:true
     })
 
     const options={
         httponly:true,
         secure:true
      }
 
      return res.status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(new ApiResponse(200,{},"user logged out successfully"))
 })

 const refreshAccesToken=asyncHandler(async(req,res)=>{
    const token=req.cookie.refreshToken || req.body

    if(!token){
       throw new ApiError(401,"some error in getting refreshToken");
    }
    const decoded=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);

    const check= await Doctor.findById(decoded?._id);
    if(!check){
       throw new ApiError(401,"error in authorisation")
    }
    if(check.refreshToken!==token){
       throw new ApiError(401,"some error in refreshing");
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(check._id)

    const options={
       httpOnly:true,
       secure:true
    }
    res.status(201).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(201,{accessToken,refreshToken},"ok AccessToken refreshed"));
})

const editDoctor=asyncHandler(async(req,res)=>{
    const {name,username}=req.body;

    const id=req.doctor._id;
    const updateFind=await Doctor.findByIdAndUpdate(id,
        {
            $set:{
                username:username,
                name:name
            }
        },{
            new:true
        });
        res.status(201).json(new ApiResponse(201,updateFind,"user data is updated"));
});

const SlotAttend=asyncHandler(async(req,res)=>{
     const doctor=req.doctor._id;
     try{
     const FindSlot=await Slot.find({Doctor:doctor}).populate('ToAttendSlot');

     return res.status(200).json({msg:"Slot fetched Successfully",data:FindSlot});
     }catch(err){
        console.error("some error is here",err);
     }


})

export {registerDoctor,LoginDoctor,LogoutDoctor,refreshAccesToken,editDoctor,SlotAttend}