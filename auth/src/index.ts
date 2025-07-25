import mongoose from 'mongoose';
import { app } from './app';

const start = async() =>{
    if(!process.env.JWT_KEY){
        throw new Error("JWT Key must be defined!");
    }
    if(!process.env.MONGO_URI){
        throw new Error("JWT Key must be defined!");
    }
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("Connected to mongoDB")
    } catch (error) {
        console.error(error)
    }
    
    app.listen(3000, ()=>{
        console.log("Listening on 3000 version 1")
    })
}

start()