import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/config";
import axios from "axios";

export function useCreateBooking() {
  const { mutate: createBooking, isPending } = useMutation({
    mutationFn: async (bookingData) => {
      try {
        const { data } = await axios.post(
          `${BASE_URL}/bookings/create`,
          bookingData,
          {
            withCredentials: true,
          }
        );
        console.log(data);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
        throw error;
      }
    },
  });

  return { createBooking, isPending };
}
