import { useQuery } from "@tanstack/react-query";
import ListingCard from "../components/ListingCard";
import { useUser } from "../context/UserContext";
import { BASE_URL } from "../utils/config";
import axios from "axios";

function TripListPage() {
  const { user } = useUser();
  // const { tripList } = user;
  console.log(user);

  const { data: tripList } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/${user._id}/trips`,

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
      {" "}
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {/* {!tripList && "No Trip List found!"} */}
        {tripList?.map(
          ({
            listingId,
            hostId,
            startDate,
            endDate,
            totalPrice,
            booking = true,
          }) => (
            <ListingCard
              key={listingId?._id}
              listingId={listingId?._id}
              creator={hostId?._id}
              listingPhotoPaths={listingId?.listingPhotoPaths}
              city={listingId?.city}
              province={listingId?.province}
              country={listingId?.country}
              category={listingId?.category}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              booking={booking}
            />
          )
        )}
      </div>
    </>
  );
}

export default TripListPage;
