import User from "../models/userModel.js";
import Listing from "../models/listingModel.js";
import Booking from "../models/bookingModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  /* The uploaded file is available as req.file */
  const profileImage = req.file;

  if (!profileImage) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  /* path to the uploaded profile photo */
  const profileImagePath = profileImage.path;
  console.log(profileImagePath);

  //   Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    profileImagePath,
  });

  res.status(200).json(user);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if email and password does not exists
  if (!email || !password) {
    throw new Error("Please provide email and password", 401);
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const { password, ...rest } = user._doc;

    generateToken(res, user._id);

    res.json({
      ...rest,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const logout = asyncHandler(async (req, res) => {
  // res.clearCookie("token").status(200).json({ message: "Logout Successfully" });
  res
    .clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "strict" })
    .status(200)
    .json({ message: "Logout Successfully" });
});

/* GET TRIP LIST */
export const getTripList = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const trips = await Booking.find({ customerId: userId }).populate(
    "customerId hostId listingId"
  );

  // if (trips) {
  //   res.status(404);
  //   throw new Error("Can not find trips!");
  // }

  res.status(202).json(trips);
});

/* ADD LISTING TO WISHLIST */
export const addToWishList = asyncHandler(async (req, res) => {
  const { userId, listingId } = req.params;
  const user = await User.findById(userId);
  const listing = await Listing.findById(listingId).populate("creator");

  const favoriteListing = user.wishList.find(
    (item) => item._id.toString() === listingId
  );

  if (favoriteListing) {
    user.wishList = user.wishList.filter(
      (item) => item._id.toString() !== listingId
    );
    await user.save();
    res.status(200).json({
      message: "Listing is removed from wish list",
      wishList: user.wishList,
    });
  } else {
    user.wishList.push(listing);
    await user.save();
    res.status(200).json({
      message: "Listing is added to wish list",
      wishList: user.wishList,
    });
  }
});

/* GET PROPERTY LIST */
export const getPropertyList = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const properties = await Listing.find({ creator: userId }).populate(
    "creator"
  );

  // if (properties) {
  //   res.status(404);
  //   throw new Error("Can not find properties!");
  // }

  res.status(202).json(properties);
});

/* GET RESERVATION LIST */
export const getReservationList = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const reservations = await Booking.find({ hostId: userId }).populate(
    "customerId hostId listingId"
  );

  // if (reservations) {
  //   res.status(404);
  //   throw new Error("Can not find reservations!");
  // }

  res.status(202).json(reservations);
});
