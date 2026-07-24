import mongoose from "mongoose";
import config from "./config.js";

async function connectdb() {
    try {

        mongoose.connection.on('disconnected', () => {
            console.log("Connection lost!")
        })

        mongoose.connection.on('error', (err) => {
            console.log(" Runtime error: ", err.message)
        })


        await mongoose.connect(config.MONGO_URL)

        console.log("Connected to Database")
    }

    catch (error){
        console.log("Connection failed", error.message)
        process.exit(1)
    }
}

export default connectdb