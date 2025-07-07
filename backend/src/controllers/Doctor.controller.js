import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { Doctor}  from "../models/Doctor.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Slot} from "../models/Slot.js";
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

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

const registerDoctor=async(req,res)=>{
    console.log("registeration starts",req.body);
    const {name,email,qualification,username,password}=req.body;

    try{
        console.log("registration start");
    if(!name || !username || !password || !email || !qualification){
        console.error("some error in fields");
        return res.status(500).json({msg:"all fields required"});
    }

    
    const exist=await Doctor.findOne({
        $or:[{email},{username}]
    })
    // console.log(exist);
    if(exist){
        console.error("this account already exists");
        return res.status(400).json({msg:"this account already exists"});
    }
    console.log("image is",req.file);
    const DoctorLocalPath = req.files?.DoctorPhoto[0]?.path;
    console.log("image is",DoctorLocalPath);
  if (!DoctorLocalPath) {
     return res.status(500).json({msg:"image is required"});
  }

  const DoctorPhoto = await uploadOnCloudinary(DoctorLocalPath);
  console.log(DoctorPhoto);
  if (!DoctorPhoto) {
     return res.status(500).json({msg:"image is not uploaded"});
  }
    const doctor=await Doctor.create({
        name,
        username,
        password,
        email,
        image:DoctorPhoto.url,
        qualification:qualification
    });
    console.log("doctor is",doctor);
    const check=await Doctor.findById(doctor._id).select("-password -refreshToken");

    if(!check){
        throw new ApiError(500,"user has not been registered");
    }

    console.log("user registered successfully",check);

    return res.status(201).json(
       {data:check,msg:"user registered successfully"}
    )
}catch(err){
    console.error("some error in registering backend",err);
    res.status(500).json({msg:`some error in registering backend ${err}`,err});
}
};

const LoginDoctor=asyncHandler(async(req,res)=>{
    
    const {username,password}=req.body
 
    if(!username || !password){
     console.log(req.body);
     throw new ApiError(401,"all details are missing");
    }
 
    const exist=await Doctor.findOne({
     $or:[{username}]
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

    const val={
        valid:true,
        role:"doctor"
    }
 
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json({loggedDetail,msg:"logged successfully",val});
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
     console.log("doctor id",doctor);
     try{
     const FindSlot=await Doctor.findById(doctor).populate({path:'DoctorSlot',populate:[{path:'userId'},{path:'doctorId'}]});
     console.log("FindSlot",FindSlot);
     return res.status(200).json({msg:"Slot fetched Successfully",data:FindSlot.DoctorSlot});
     }catch(err){
        console.error("some error is here",err);
     }
})

const FindDoctorById=asyncHandler(async(req,res)=>{
    const {username}=req.body;
    try{
    const FindDoctor=await Doctor.findOne({username:username}).populate('DoctorSlot');
    console.log("FindDoctor is",FindDoctor.DoctorSlot);
    return res.status(200).json({msg:"findDoctor by id FEtched successfully",data:FindDoctor.DoctorSlot});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:"error in fetching DoctorById",err});
    }
})

const AllDoctor=asyncHandler(async(req,res)=>{
    try{
       
       const find=await Doctor.find();
       res.status(200).json({msg:"All Doctor Fetched Successfully",data:find});

    }catch(err){
       console.error("error in AllDoctor backend",err);
       res.status(500).json("error in AllDoctor backend");
    }
})
const GetDoctorId=asyncHandler(async(req,res)=>{
    const {id}=req.body;
    try {
        
       const response=await Doctor.findById(id);
       if(!response){
        return res.status(400).json({msg:"user not found"});
       }

       res.status(201).json({data:response,msg:"data fetched successfully"});

    } catch (error) {
        console.error("error in backend GetDoctorId",error);
        return res.status(400).json({msg:"user not found"});
    }
})

const GetUser=asyncHandler(async(req,res)=>{
    const {id}=req.body;

    try{
        const user=await User.findById(id);
        console.log("user is---------------------------------",user);
        if(!user){
         return res.status(401).json({msg:"error is here in fetching the user by id"});
        }
        return res.status(200).json({data:user,msg:"fetched the user by id successfully"});
       }catch(err){
         console.error("error is here in fetching the user by id",err);
         return res.status(500).json({msg:"error is here in fetching the user by id"});
       }
})

const DoctorBhai=asyncHandler(async(req,res)=>{
    const id=req.doctor._id;

    try{
        const user=await Doctor.findById(id);
        if(!user){
         return res.status(401).json({msg:"error is here in fetching the user by id"});
        }
        return res.status(200).json({data:user,msg:"fetched the user by id successfully"});
       }catch(err){
         console.error("error is here in fetching the user by id",err);
         return res.status(500).json({msg:"error is here in fetching the user by id"});
       }
})

const GetDoctorByUsername=asyncHandler(async(req,res)=>{    
    const {username}=req.body;
    try{
    const FindDoctor=await Doctor.findOne({username:username});
    console.log("FindDoctor is",FindDoctor);
    return res.status(200).json({msg:"findDoctor by id FEtched successfully",data:FindDoctor});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:"error in fetching DoctorById",err});
    }
})

export {registerDoctor,LoginDoctor,LogoutDoctor,refreshAccesToken,editDoctor,SlotAttend,FindDoctorById,AllDoctor,GetDoctorId,GetUser,DoctorBhai,GetDoctorByUsername}