import dotenv from "dotenv";
import connectDb from "./database/index.js";
import { app } from "./app.js";

import http from 'http';

dotenv.config({
    path: "./.env"
});

const server = http.createServer(app);

connectDb()
.then(() => {
    app.on("error", (err) => {
        console.log("error in running port", err);
        throw err;
    });

    app.listen(process.env.PORT || 8000, () => {
        console.log(`app is listening on Port :${process.env.PORT || 8000}`);
    });
})
.catch((err) => {
    console.error("MongoDB Connection failed");
});
