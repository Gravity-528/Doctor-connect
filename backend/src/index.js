import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import connectDb from "./database/index.js";
import { app } from "./app.js";
import {Server} from "socket.io";


dotenv.config({
    path: "./.env"
});

cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})
const server = http.createServer(app);
const io=new Server(server,{
    cors:({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
});
// console.log(io);
const map=new Map();
io.on('connection',(socket)=>{
    console.log("server connected",socket.id);
    
    socket.on('register',({you})=>{
        socket.userId=you;
        map.set(you,socket.id);
        console.log("user hashed successfully");
    })
    socket.emit("welcome",`welcome to server server connected ${socket.id}`)
    socket.on('disconnect',()=>{
        if(socket.userId){
            map.delete(socket.userId);
        }
        console.log("user disconnected");
    })
    socket.on('message',({type,sdp,you,other})=>{
        const target=map.get(other);
        if(type=='create-Offer'){
            socket.to(target).emit('create-offer',sdp);
        }
        else if(type=='create-answer'){
            socket.to(target).emit('create-answer',sdp);
        }else if(type=="candidate"){
            socket.to(target).emit("candidate",sdp);
        }else if(type=="disconnect-peer"){
            socket.to(target).emit("disconnect-peer");
            if(socket.userId){
                map.delete(socket.userId);
            }
            console.log("user disconnected for disconnect peer");
        }
    })
})

connectDb()
.then(() => {
    server.on("error", (err) => {
        console.log("error in running port", err);
        throw err;
    });

    server.listen(process.env.PORT || 8000, () => {
        console.log(`app is listening on Port :${process.env.PORT || 8000}`);
    });
})
.catch((err) => {
    console.error("MongoDB Connection failed");
});
