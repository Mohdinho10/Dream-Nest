import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { lazy, Suspense } from "react";
import { UserProvider } from "./context/UserContext";
import AppLayout from "./components/AppLayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import CreateListingPage from "./pages/CreateListingPage";
import ListingDetailsPage from "./pages/ListingDetailsPage";
import CategoryPage from "./pages/CategoryPage";
import TripListPage from "./pages/TripListPage";
import WishListPage from "./pages/WishListPage";
import PropertyListPage from "./pages/PropertyListPage";
import ReservationListPage from "./pages/ReservationListPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          {/* <Suspense fallback={<SpinnerFullPage />}> */}
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />

              <Route element={<ProtectedRoutes />}>
                <Route path="/create-listing" element={<CreateListingPage />} />

                <Route path="/:userId/trips" element={<TripListPage />} />
                <Route path="/:userId/wishList" element={<WishListPage />} />
                <Route
                  path="/:userId/properties"
                  element={<PropertyListPage />}
                />
                <Route
                  path="/:userId/reservations"
                  element={<ReservationListPage />}
                />
              </Route>
              {/* The following are routes that any user can access them */}
              <Route
                path="/properties/:listingId"
                element={<ListingDetailsPage />}
              />
              <Route
                path="/properties/category/:category"
                element={<CategoryPage />}
              />
              <Route
                path="/properties/search/:search"
                element={<SearchPage />}
              />
            </Route>
            {/* The following the navbar is not shown till the user is logged in */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={1000}
            closeOnClick
            pauseOnHover={false}
          />
          {/* </Suspense> */}
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
