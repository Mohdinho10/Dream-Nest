import Booking from "../models/bookingModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const createBooking = asyncHandler(async (req, res) => {
  const { customerId, hostId, listingId, startDate, endDate, totalPrice } =
    req.body;

  const newBooking = await Booking.create({
    customerId,
    hostId,
    listingId,
    startDate,
    endDate,
    totalPrice,
  });

  res.status(200).json(newBooking);
});
