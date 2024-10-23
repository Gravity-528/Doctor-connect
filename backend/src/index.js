import dotenv from "dotenv";
import http from "http";
import connectDb from "./database/index.js";
import { app } from "./app.js";
import {Server} from "socket.io"

// import http from 'http';

dotenv.config({
    path: "./.env"
});

const server = http.createServer(app);
const io=new Server(server);
console.log(io);

io.on('connection',(socket)=>{
    socket.on('disconnect',()=>{
        console.log("user disconnected");
    })
    socket.on('chat-message',(msg)=>{
        io.emit('chat-message',msg);
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
