import dotenv from "dotenv"

dotenv.config()

if(!process.env.MONGO_URL){
    throw new Error("MONGO DB URL IS NOT DEFINED")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT SECRET IS NOT DEFINED")
}

const config = {
    MONGO_URL : process.env.MONGO_URL,
    JWT_SECRET : process.env.JWT_SECRET,
    PORT: process.env.PORT || 7001 
}

export default config