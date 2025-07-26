import express, { Router } from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import roleRoutes from "./role.route.js";
import announcementRoute from "./announcement.route.js";
import visitorRoute from "./visitor.route.js";
import moduleRoutes from "./module.route.js";
import permissionRoutes from "./permission.route.js";
import complaintRoutes  from "./complaints.route.js";

const router: Router = express.Router();
router.use(cookieParser());

router.get("/status", (req, res) => res.send("OK"));

/**
 * @swagger
 * /v1/info:
 *   get:
 *     summary: Get API information
 *     description: Returns basic information about the API
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     version:
 *                       type: string
 *                     description:
 *                       type: string
 *                     endpoints:
 *                       type: object
 */
router.get("/info", (req, res) => {
    res.json({
        success: true,
        data: {
            name: "Falcon API",
            version: "1.0.0",
            description: "Access Control and Management API",
            endpoints: {
                auth: "/v1/auth",
                users: "/v1/users",
                roles: "/v1/roles",
                modules: "/v1/modules",
                permissions: "/v1/permissions",
                announcements: "/v1/announcement",
                visitors: "/v1/visitors"
            },
            documentation: "/api-docs"
        }
    });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/announcement", announcementRoute);
router.use("/visitors", visitorRoute);
router.use("/modules", moduleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/complaints", complaintRoutes);

export default router;