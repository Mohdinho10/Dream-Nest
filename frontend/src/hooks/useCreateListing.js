import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import axios from "axios";

export function useCreateListing() {
  const navigate = useNavigate();

  const { mutate: createList, isPending } = useMutation({
    mutationFn: async (listData) => {
      try {
        const { data } = await axios.post(
          `${BASE_URL}/api/listings/create`,
          listData,
          {
            withCredentials: true,
          }
        );
        console.log(data);
        navigate("/", { replace: true });
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
        throw error;
      }
    },
    // onSuccess: () => {
    //   navigate(`${data.id}`, { replace: true });
    // },
  });

  return { createList, isPending };
}
