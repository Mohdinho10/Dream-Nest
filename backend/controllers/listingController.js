import Listing from "../models/listingModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Create Listing
export const createListing = asyncHandler(async (req, res) => {
  const {
    creator,
    category,
    type,
    streetAddress,
    aptSuite,
    city,
    province,
    country,
    guestCount,
    bedroomCount,
    bedCount,
    bathroomCount,
    amenities,
    title,
    description,
    highlight,
    highlightDesc,
    price,
  } = req.body;

  const listingPhotos = req.files;

  if (!listingPhotos) {
    res.status(400);
    throw new Error("No file uploaded.");
  }

  const listingPhotoPaths = listingPhotos.map((file) => file.path);

  const listing = await Listing.create({
    creator,
    category,
    type,
    streetAddress,
    aptSuite,
    city,
    province,
    country,
    guestCount,
    bedroomCount,
    bedCount,
    bathroomCount,
    amenities,
    listingPhotoPaths,
    title,
    description,
    highlight,
    highlightDesc,
    price,
  });

  res.status(200).json(listing);
});

// Get Listings
export const getListings = asyncHandler(async (req, res) => {
  const qCategory = req.query.category;
  console.log(qCategory);

  let listings;
  if (qCategory) {
    listings = await Listing.find({ category: qCategory }).populate("creator");
  } else {
    listings = await Listing.find().populate("creator");
  }

  res.status(200).json(listings);
});

// Get Listing By Search
export const getListingBySearch = asyncHandler(async (req, res) => {
  const { search } = req.params;

  let listings = [];

  if (search === "all") {
    listings = await Listing.find().populate("creator");
  } else {
    listings = await Listing.find({
      $or: [
        { category: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ],
    }).populate("creator");
  }

  res.status(200).json(listings);
});

export const getListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  const listing = await Listing.findById(listingId).populate("creator");

  res.status(200).json(listing);
});
