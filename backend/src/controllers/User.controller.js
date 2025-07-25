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

// const registerUser=asyncHandler(async(req,res)=>{
//     console.log("registeration starts",req.body);
//     const {name,username,password,email}=req.body;

    
//     if(!name){
//         throw new ApiError(400,"all fields required name");
//     }
//     if(!username){
//         throw new ApiError(400,"username is required");
//     }
//     if(!password){
//         throw new ApiError(400,"password is required");
//     }
//     if(!email){
//         throw new ApiError(400,"email is required");
//     }
    
//     const exist=await User.findOne({
//         $or:[{email},{username}]
//     })
//     console.log(exist);
//     if(exist){
//         throw new ApiError(400,"this account already exists");
//     }

    
//     const user=await User.create({
//         name,
//         username,
//         password,
//         email
//     });

//     const check=await User.findById(user._id).select("-password -refreshToken");

//     if(!check){
//         throw new ApiError(500,"user has not been registered");
//     }

//     //return to database
//     console.log("user registered successfully",check);
//     return res.status(201).json(
//        new ApiResponse(201,check,"user registered successfully")
//     )
// });
const registerUser = asyncHandler(async (req, res) => {
    try {
        console.log("Registration starts", req.body);
        const { name, username, password, email } = req.body;

        if (!name || !username || !password || !email) {
            throw new ApiError(400, "All fields are required: name, username, password, and email.");
        }

        const exist = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (exist) {
            throw new ApiError(400, "An account with this email or username already exists.");
        }

        // Optionally hash the password here using bcrypt if not handled in User schema
        // const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            username,
            password, // Use `hashedPassword` if hashing manually
            email
        });

        // No need to re-fetch, just sanitize before sending
        const userResponse = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
        };

        console.log("User registered successfully", userResponse);
        return res.status(201).json(
            new ApiResponse(201, userResponse, "User registered successfully")
        );

    } catch (error) {
        console.error("Error in registration:", error);
        throw error; // Let `asyncHandler` handle the thrown error
    }
});


const LoginUser=asyncHandler(async(req,res)=>{
    
    const {username,password}=req.body
    console.log("logging in system");
    console.log(req.body);
    if(!username || !password){
     console.log(req.body);
     throw new ApiError(401,"all details are missing");
    }
 
    
    const exist=await User.findOne({
     $or:[{username}]
    })
    console.log("exist is",exist);
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
    console.log("logged in");
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
      const findSlot=await User.findById(userId).populate({path:'YourSlot',populate: [{ path: 'userId' },{ path: 'doctorId' }]});
    //   console.log("YourSlot backend",findSlot);
      return res.status(200).json({data:findSlot.YourSlot,msg:"fetched successfully"});
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
   console.log("user token is",user);
   try{
    
   if(!user){
    return res.status(401).json({msg:"error is here in fetching the user by id"});
   }
   return res.status(200).json({data:user,msg:"fetched the user by id successfully"});
  }catch(err){
    console.error("error is here in fetching the user by id",err);
    return res.status(500).json({msg:"error is here in fetching the user by id"});
  }
})

const GetUserByUserName=asyncHandler(async(req,res)=>{
    const {username}=req.body;
    console.log("username backend--------------------------------------",username);
    try {
        const fetchUser=await User.find({username:username});
        console.log("fetching fetching",fetchUser);
        return res.status(200).json({msg:"userId fetched successfully",data:fetchUser});
    } catch (error) {
        console.error("some error in backend for fetching userId",error);
        res.status(500).json("error in backend in fetching userId");
    }
})

export {registerUser,LoginUser,LogoutUser,refreshAccesToken,editUser,FetchBookedSlot,FetchDoctorByUserName,GetUserById,GetUserByUserName};