import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://moedd361_db_user:0117063955m@cluster0.itflnjq.mongodb.net/ExpenseTracker?appName=Cluster0")

    .then(() => console.log("DB IS CONNECTED"));

}





//   await mongoose.connect("mongodb+srv://elnuormohammed94_db_user:0117063955m@cluster0.pzf4uxq.mongodb.net/ExpenseTracker")