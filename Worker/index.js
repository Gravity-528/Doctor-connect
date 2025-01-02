import mongoose from "mongoose";

const connectDb=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`,{serverSelectionTimeoutMS: 30000, useNewUrlParser: true, useUnifiedTopology: true,});
        // console.log("-------------------->",`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`DB connected successfully,`)
        
    } catch (error) {
        // console.log("-------------------->",`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.error("there is error in connecting the database",error);
    }
}

export default connectDb;