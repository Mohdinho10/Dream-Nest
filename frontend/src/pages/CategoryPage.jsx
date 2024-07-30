import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../utils/config";
import Loader from "../components/Loader";
import ListingCard from "../components/ListingCard";
import axios from "axios";
import "../styles/List.scss";

const CategoryPage = () => {
  const { category } = useParams();

  const { isPending, data: listings } = useQuery({
    queryKey: ["listings", category],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/listings?category=${category}`,
          {
            withCredentials: true,
          }
        );
        return response?.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return isPending ? (
    <Loader />
  ) : (
    <>
      <h1 className="title-list">{category} listings</h1>
      <div className="list">
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
        {/* {listings?.map(
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
        )} */}
      </div>
    </>
  );
};

export default CategoryPage;
