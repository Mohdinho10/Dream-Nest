import { Router } from "express";
import multer from "multer";
import {
  addToWishList,
  getPropertyList,
  getReservationList,
  getTripList,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

// Auth
router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.use(isAuthenticated);
// User
/* GET TRIP LIST */
router.get("/:userId/trips", getTripList);
/* ADD LISTING TO WISHLIST */
router.patch("/:userId/:listingId", addToWishList);
/* GET PROPERTY LIST */
router.get("/:userId/listings", getPropertyList);
/* GET RESERVATION LIST */
router.get("/:userId/reservations", getReservationList);

export default router;
