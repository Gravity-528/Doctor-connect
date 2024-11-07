import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User}  from "../models/User.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";

const generateAccessAndRefreshTokens= async(userid)=>{
    try {
       const user=await User.findById(userid);

       console.log(user);
       
       const accessToken=user.jwtAccessToken();
       const refreshToken=user.jwtRefreshToken();

      console.log("access ",accessToken);
      console.log("refresh ",refreshToken);

      user.refreshToken=refreshToken;

      await user.save({validateBeforeSave:false});

      return {accessToken , refreshToken};
       
        
    } catch (error) {
        console.error(error);
        throw new ApiError(409,"some error while generating access Token and refresh Token")
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    
    const {name,username,password,email}=req.body;

    
    if(!name || !username || !password || !email){
        throw new ApiError(400,"all fields required");
    }

    
    const exist=await User.findOne({
        $or:[{email},{username}]
    })
    console.log(exist);
    if(exist){
        throw new ApiError(400,"this account already exists");
    }

    
    const user=await User.create({
        name,
        username,
        password,
        email
    });

    const check=await User.findById(user._id).select("-password -refreshToken");

    if(!check){
        throw new ApiError(500,"user has not been registered");
    }

    //return to database
    return res.status(201).json(
       new ApiResponse(201,check,"user registered successfully")
    )
});

const LoginUser=asyncHandler(async(req,res)=>{
    
    const {username,password}=req.body
 
    
    if(!username || !password){
     console.log(req.body);
     throw new ApiError(401,"all details are missing");
    }
 
    
    const exist=await User.findOne({
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
 
    const loggedDetail=await User.findById(exist._id).select("-password -referenceToken")
 
    const options={
       httpOnly:true,
       secure:true
    }
    
    const val={
        valid:true,
        role:"user"
    }
 
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json({data:loggedDetail,val:val,msg:"logged successfully"})
 });
 
 const LogoutUser=asyncHandler((req,res)=>{
     const id=req.user._id;
 
     User.findByIdAndUpdate(id,{
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

    const check= await User.findById(decoded?._id);
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

const editUser=asyncHandler(async(req,res)=>{
    const {name,username}=req.body;

    const id=req.user._id;
    const updateFind=await User.findByIdAndUpdate(id,
        {
            $set:{
                username:username,
                name:name
            }
        },{
            new:true
        });
        res.status(201).json(new ApiResponse(201,updateFind,"user data is updated"));
})

const FetchBookedSlot=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    try{
      const findSlot=await User.find({_id:userId}).populate('YourSlot');
      console.log(findSlot);
      return res.status(200).json({msg:"fetched successfully",data:findSlot.YourSlot});
    }catch(err){
        console.error("some error is here",err);
        return res.status(500).json({ msg: "Failed to fetch slots", error: error.message });
    }
})

const FetchDoctorByUserName=asyncHandler(async(req,res)=>{
    const {username}=req.body;
     const FindDoctor=await Doctor.find({username});

     return res.status(200).json({msg:"DoctorId fetched successfully",data:FindDoctor._id});
})

const GetUserById=asyncHandler(async(req,res)=>{
   const user=req.user;
   try{
   if(!user){
    return res.status(401).json({msg:"error is here in fetching the user by id"});
   }
   return res.status(200).json({msg:"fetched the user by id successfully",user});
  }catch(err){
    console.error("error is here in fetching the user by id",err);
    return res.status(500).json({msg:"error is here in fetching the user by id"});
  }
})

export {registerUser,LoginUser,LogoutUser,refreshAccesToken,editUser,FetchBookedSlot,FetchDoctorByUserName,GetUserById};