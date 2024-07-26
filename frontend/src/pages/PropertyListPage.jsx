import axios from "axios";
import { useUser } from "../context/UserContext";
import { BASE_URL } from "../utils/config";
import { useQuery } from "@tanstack/react-query";
import ListingCard from "../components/ListingCard";

function PropertyListPage() {
  const { user } = useUser();
  // const propertyList = user?.propertyList;
  const { data: propertyList } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/users/${user._id}/listings`,

          {
            withCredentials: true,
          }
        );
        console.log(response);
        return response?.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <h1 className="title-list">Your Property List</h1>
      <div className="list">
        {propertyList?.map(
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

export default PropertyListPage;
