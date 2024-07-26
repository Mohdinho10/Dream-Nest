import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../utils/config";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useCreateBooking } from "../hooks/useCreateBooking";
import { facilities } from "../data";
import { DateRange } from "react-date-range";
import axios from "axios";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/ListingDetails.scss";
import Loader from "../components/Loader";

function ListingDetailsPage() {
  const { listingId } = useParams();
  const { user } = useUser();
  const { createBooking } = useCreateBooking();
  const navigate = useNavigate();

  const { isPending, data: listing } = useQuery({
    queryKey: ["post", listingId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/listings/${listingId}`,
          {
            withCredentials: true,
          }
        );

        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const owner = listing?.creator?._id === user?._id;
  console.log(owner);

  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const selectHandler = (ranges) => {
    // Update the selected date range when user makes a selection
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); // Calculate the difference in day unit

  /* SUBMIT BOOKING */
  const customerId = user._id;

  const submitHandler = (e) => {
    e.preventDefault();

    const bookingForm = {
      customerId,
      listingId,
      hostId: listing.creator._id,
      startDate: dateRange[0].startDate.toDateString(),
      endDate: dateRange[0].endDate.toDateString(),
      totalPrice: listing.price * dayCount,
    };

    createBooking(bookingForm, {
      onSuccess: () => {
        navigate(`/${customerId}/trips`);
      },
    });
  };

  return isPending ? (
    <Loader />
  ) : (
    <>
      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>

        <div className="photos">
          {listing.listingPhotoPaths?.map((item, index) => (
            <img
              key={index}
              src={`${BASE_URL}/${item.replace("public", "")}`}
              alt="listing photo"
            />
          ))}
        </div>

        <h2>
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          <img
            src={`http://localhost:3000/${listing.creator.profileImagePath.replace(
              "public",
              ""
            )}`}
          />
          <h3>
            Hosted by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {!owner && (
            <div>
              <h2>How long do you want to stay?</h2>
              <div className="date-range-calendar">
                <DateRange ranges={dateRange} onChange={selectHandler} />
                {dayCount > 1 ? (
                  <h2>
                    ${listing.price} x {dayCount} nights
                  </h2>
                ) : (
                  <h2>
                    ${listing.price} x {dayCount} night
                  </h2>
                )}

                <h2>Total price: ${listing.price * dayCount}</h2>
                <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
                <p>End Date: {dateRange[0].endDate.toDateString()}</p>

                <button
                  className="button"
                  type="submit"
                  onClick={submitHandler}
                >
                  BOOKING
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ListingDetailsPage;
