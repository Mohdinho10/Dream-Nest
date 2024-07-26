import ListingCard from "../components/ListingCard";
import { useParams } from "react-router-dom";
import "../styles/List.scss";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { useEffect } from "react";

function SearchPage() {
  const { search } = useParams();
  const queryClient = useQueryClient();

  const { data: listings } = useQuery({
    queryKey: ["listings", search],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/listings/search/${search}`,

          {
            withCredentials: true,
          }
        );
        // console.log(response);
        return response?.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries(["listings", search]);
  }, [search, queryClient]);

  console.log(listings);

  return (
    <>
      {" "}
      {listings?.length !== 0 && <h1 className="title-list">{search}</h1>}
      <div className="list">
        {listings?.length === 0 && <h1 className="title-list">No results!</h1>}
        {listings?.map(
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
    </>
  );
}

export default SearchPage;
