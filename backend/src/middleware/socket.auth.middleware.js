import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // extract token from http-only cookies
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Từ chối kết nối socket: Không tìm thấy token");
      return next(new Error("Chưa xác thực - Không có token"));
    }

    // verify the token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Từ chối kết nối socket: Token không hợp lệ");
      return next(new Error("Chưa xác thực - Token không hợp lệ"));
    }

    // find the user fromdb
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Từ chối kết nối socket: Không tìm thấy người dùng");
      return next(new Error("Không tìm thấy người dùng"));
    }

    // attach user info to socket
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`Xác thực socket thành công cho người dùng: ${user.fullName} (${user._id})`);

    next();
  } catch (error) {
    console.log("LỖI XÁC THỰC SOCKET:", error.message);
    next(new Error("Chưa xác thực - Xác thực thất bại"));
  }
};