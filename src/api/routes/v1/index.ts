import express, { Router } from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import roleRoutes from "./role.route.js";
import announcementRoute from "./announcement.route.js";
import visitorRoute from "./visitor.route.js";


const router: Router = express.Router();
router.use(cookieParser());

router.get("/status", (req, res) => res.send("OK"));

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/announcement", announcementRoute);
router.use("/visitors", visitorRoute);


export default router;