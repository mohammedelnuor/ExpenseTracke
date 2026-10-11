import mongoose from "mongoose";

export const connectDB = async () => {
     await mongoose.connect("mongodb+srv://elnuormohammed94_db_user:0117063955m@cluster0.pzf4uxq.mongodb.net/Expense")
    .then(() => console.log("DB CONNECTED"));

}