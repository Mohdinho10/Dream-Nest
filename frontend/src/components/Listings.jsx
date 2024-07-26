import { useEffect, useState } from "react";
import { categories } from "../data";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../utils/config";
import Loader from "../components/Loader";
import ListingCard from "./ListingCard";
import axios from "axios";
import "../styles/Listings.scss";

function Listings() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const queryClient = useQueryClient();

  const { isPending, data: listings } = useQuery({
    queryKey: ["listings", selectedCategory],
    queryFn: async () => {
      try {
        const response = await axios.get(
          selectedCategory !== "All"
            ? `${BASE_URL}/api/listings?category=${selectedCategory}`
            : `${BASE_URL}/api/listings`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        return response?.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries(["listings", selectedCategory]);
  }, [selectedCategory, queryClient]);

  return (
    <>
      <div className="category-list">
        {categories?.map((category, index) => (
          <div
            className={`category ${
              category?.label === selectedCategory ? "selected" : ""
            }`}
            key={index}
            onClick={() => setSelectedCategory(category?.label)}
          >
            <div className="category_icon">{category?.icon}</div>
            <p>{category?.label}</p>
          </div>
        ))}
      </div>

      {isPending ? (
        <Loader />
      ) : (
        <div className="listings">
          {Array.isArray(listings) &&
            listings.length > 0 &&
            listings.map(
              ({
                _id,
                creator,
                listingPhotoPaths,
                city,
                province,
                country,
                category,
                type,
                price,
                booking = false,
              }) => (
                <ListingCard
                  key={_id}
                  listingId={_id}
                  creator={creator}
                  listingPhotoPaths={listingPhotoPaths}
                  city={city}
                  province={province}
                  country={country}
                  category={category}
                  type={type}
                  price={price}
                  booking={booking}
                />
              )
            )}
        </div>
      )}
    </>
  );
}

export default Listings;
