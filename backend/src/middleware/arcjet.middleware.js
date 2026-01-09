import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Truy cập bị từ chối do phát hiện bot." });
      } else {
        return res.status(403).json({
          message: "Truy cập bị chặn bởi chính sách bảo mật.",
        });
      }
    }

    // check for spoofed bots
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Phát hiện bot giả mạo",
        message: "Phát hiện hoạt động bot độc hại.",
      });
    }

    next();
  } catch (error) {
    console.log("LỖI BẢO VỆ ARCJET:", error);
    next();
  }
};