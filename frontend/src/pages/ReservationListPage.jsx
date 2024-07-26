import { useQuery } from "@tanstack/react-query";
import ListingCard from "../components/ListingCard";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { BASE_URL } from "../utils/config";

function ReservationListPage() {
  const { user } = useUser();

  const { data: reservationList } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/${user._id}/reservations`,

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
      <h1 className="title-list">Your Reservation List</h1>
      <div className="list">
        {reservationList?.map(
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

export default ReservationListPage;
