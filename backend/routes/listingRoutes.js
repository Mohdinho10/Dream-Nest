import { Router } from "express";
import multer from "multer";
import {
  createListing,
  getListings,
  getListingBySearch,
  getListing,
} from "../controllers/listingController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

router.post(
  "/create",
  isAuthenticated,
  upload.array("listingPhotos"),
  createListing
);
router.get("/", getListings);
router.get("/search/:search", getListingBySearch);
router.get("/:listingId", getListing);

export default router;
