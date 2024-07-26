import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Suspense } from "react";
import { UserProvider } from "./context/UserContext";
import AppLayout from "./components/AppLayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import "react-toastify/dist/ReactToastify.css";
import SpinnerFullPage from "./components/SpinnerFullPage";
// Implemented lazy loading
const HomePage = lazy(() => import("./pages/HomePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const CreateListingPage = lazy(() => import("./pages/CreateListingPage"));
const ListingDetailsPage = lazy(() => import("./pages/ListingDetailsPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const WishListPage = lazy(() => import("./pages/WishListPage"));
const TripListPage = lazy(() => import("./pages/TripListPage"));
const PropertyListPage = lazy(() => import("./pages/PropertyListPage"));
const ReservationListPage = lazy(() => import("./pages/ReservationListPage"));

// import HomePage from "./pages/HomePage";
// import RegisterPage from "./pages/RegisterPage";
// import LoginPage from "./pages/LoginPage";
// import SearchPage from "./pages/SearchPage";
// import CreateListingPage from "./pages/CreateListingPage";
// import ListingDetailsPage from "./pages/ListingDetailsPage";
// import CategoryPage from "./pages/CategoryPage";
// import TripListPage from "./pages/TripListPage";
// import WishListPage from "./pages/WishListPage";
// import PropertyListPage from "./pages/PropertyListPage";
// import ReservationListPage from "./pages/ReservationListPage";

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
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />

                <Route element={<ProtectedRoutes />}>
                  <Route
                    path="/create-listing"
                    element={<CreateListingPage />}
                  />
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
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={1000}
              closeOnClick
              pauseOnHover={false}
            />
          </Suspense>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
