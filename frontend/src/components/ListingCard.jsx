/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Favorite,
} from "@mui/icons-material";
import { BASE_URL } from "../utils/config";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "../styles/ListingCard.scss";

function ListingCard({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  province,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
}) {
  const { user, setUser } = useUser();
  /* SLIDER FOR IMAGES */
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  const navigate = useNavigate();

  /* ADD TO WISHLIST */

  const wishList = user?.wishList || [];

  const isLiked = wishList?.find((item) => item?._id === listingId);

  const queryClient = useQueryClient();

  const { mutate: addToWishList } = useMutation({
    mutationFn: async () => {
      try {
        if (user?._id !== creator._id) {
          const { data } = await axios.patch(
            `${BASE_URL}/api/users/${user?._id}/${listingId}`,
            {},
            { withCredentials: true }
          );
          console.log(data.wishList);
          setUser((prev) => ({ ...prev, wishList: data.wishList }));
        }
      } catch (error) {
        console.log(error);
        //  toast.error(error.response.data.message);
        throw error;
      }
    },
    onSuccess: () => {
      //    navigate("/profile", { replace: true });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return (
    <div
      className="listing-card"
      onClick={() => {
        navigate(`/properties/${listingId}`);
      }}
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths?.map((photo, index) => (
            <div key={index} className="slide">
              <img
                src={`${BASE_URL}/${photo?.replace("public", "")}`}
                alt={`photo ${index + 1}`}
              />
              <div
                className="prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide(e);
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide(e);
                }}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3>
        {city}, {province}, {country}
      </h3>
      <p>{category}</p>

      {!booking ? (
        <>
          <p>{type}</p>
          <p>
            <span>${price}</span> per night
          </p>
        </>
      ) : (
        <>
          <p>
            {startDate} - {endDate}
          </p>
          <p>
            <span>${totalPrice}</span> total
          </p>
        </>
      )}

      <button
        className="favorite"
        onClick={(e) => {
          e.stopPropagation();
          addToWishList();
        }}
        disabled={!user}
      >
        {isLiked ? (
          <Favorite sx={{ color: "red" }} />
        ) : (
          <Favorite sx={{ color: "white" }} />
        )}
      </button>
    </div>
  );
}

export default ListingCard;
