import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useLogout } from "../hooks/useLogout";
import ClipLoader from "react-spinners/ClipLoader";
import "../styles/Navbar.scss";
import { BASE_URL } from "../utils/config";
// import variables from "../styles/variables.scss";

function Navbar() {
  const { user } = useUser();
  const { logout, isLogout } = useLogout();
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (dropdownMenu) {
        setDropdownMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dropdownMenu]);

  return (
    <div className="navbar">
      <a href="/">
        <img src="/assets/logo.png" alt="logo" />
      </a>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton disabled={search === ""}>
          <Search
            // sx={{ color: variables.pinkred }}
            onClick={() => {
              navigate(`/properties/search/${search}`);
            }}
          />
        </IconButton>
      </div>

      <div className="navbar_right">
        {user ? (
          <a href="/create-listing" className="host">
            Become A Host
          </a>
        ) : (
          <a href="/login" className="host">
            Become A Host
          </a>
        )}

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu
          //   sx={{ color: variables.darkgrey }}
          />
          {!user?.profileImagePath ? (
            <Person
            // sx={{ color: variables.darkgrey }}
            />
          ) : (
            <img
              src={`${BASE_URL}/${user?.profileImagePath?.replace(
                "public",
                ""
              )}`}
              alt="profile photo"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link to={`/${user._id}/trips`}>Trip List</Link>
            <Link to={`/${user._id}/wishList`}>Wish List</Link>
            <Link to={`/${user._id}/properties`}>Property List</Link>
            <Link to={`/${user._id}/reservations`}>Reservation List</Link>
            <Link to="/create-listing" className="mobile-host">
              Become A Host
            </Link>
            <Link onClick={logout} disabled={isLogout}>
              {isLogout ? <ClipLoader color="white" size={20} /> : "Logout"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
