import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import { notFound, errorHandler } from "./middleware/ErrorMiddleware.js";

dotenv.config();

const app = express();

const port = process.env.PORT;

// middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/listings", listingRoutes);

// if (process.env.NODE_ENV === "production") {
//   const __dirname = path.resolve();
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));
//   app.use("/uploads", express.static("/var/data/uploads"));
//   app.use(express.static("public"));
//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
//   );
// } else {
//   const __dirname = path.resolve();
//   app.use("/images", express.static(path.join(__dirname, "images")));
//   app.get("/", (req, res) => {
//     res.send("API is running....");
//   });
// }

// Serve static files
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend", "dist"))); // Serve frontend build
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "public", "uploads"))
  ); // Serve uploads

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  const __dirname = path.resolve();
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "public", "uploads"))
  ); // Serve uploads in development
}

app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoose connected successfully"))
  .catch((err) => err);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
