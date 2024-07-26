import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import { BASE_URL } from "../utils/config";
import axios from "axios";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser } = useUser();
  const { mutate: logout, isPending: isLogout } = useMutation({
    mutationFn: async () => {
      try {
        await axios.post(
          `${BASE_URL}/api/users/logout`,
          {},
          { withCredentials: true }
        );
        setUser(null);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/login", { replace: true });
      toast.success("Logout successfully");
    },
  });
  return { logout, isLogout };
}
