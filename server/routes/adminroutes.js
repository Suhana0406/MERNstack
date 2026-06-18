import express from "express";
import {
  getAdminConfig,
  updateAdminConfig,
  getAllUsers,
  deleteUser,
  getDashboardStats,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly); // All admin routes require admin auth

router.get("/config", getAdminConfig);
router.put("/config", updateAdminConfig);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/stats", getDashboardStats);

export default router;