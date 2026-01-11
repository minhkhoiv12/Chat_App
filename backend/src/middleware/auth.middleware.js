import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập - Không tìm thấy token" });

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Chưa đăng nhập - Token không hợp lệ" });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    req.user = user;
    next();
  } catch (error) {
    console.log("LỖI MIDDLEWARE protectRoute:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};