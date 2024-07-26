import { Router } from "express";
import { createBooking } from "../controllers/bookingController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/create", isAuthenticated, createBooking);

export default router;
