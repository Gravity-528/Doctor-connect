import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User}  from "../models/User.js";
import {Doctor} from "../models/Doctor.js";


const verifyJWT = asyncHandler(async (req, res, next) => {
  try {

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ApiError(401, "Unauthorized request!");
    }


    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("token is",token);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    // console.log("userAccount",user);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }


    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
    try {
  
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
      
      if (!token) {
        throw new ApiError(401, "Unauthorized request!");
      }
  
      console.log(req.cookies);
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET1);
  
  
      const doctor = await Doctor.findById(decodedToken?._id).select("-password -refreshToken");
      // console.log("userAccount",user);
  
      if (!doctor) {
        throw new ApiError(401, "Invalid Access Token");
      }
  
  
      req.doctor = doctor;
      next();
    } catch (error) {
      console.error("error in admin",error);
      throw new ApiError(401, error?.message || "Invalid Access Token");
    }
  });

export { verifyJWT,verifyAdmin };
