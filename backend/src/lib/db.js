import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("Chưa cấu hình biến môi trường MONGO_URI");

    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("KẾT NỐI MONGODB THÀNH CÔNG:", conn.connection.host);
  } catch (error) {
    console.error("LỖI KẾT NỐI ĐẾN MONGODB:", error);
    process.exit(1); // 1 status code means fail, 0 means success
  }
};