import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.scss";
import { useRegister } from "../hooks/useRegister";
import ClipLoader from "react-spinners/ClipLoader";

function RegisterPage() {
  const { register, isRegister } = useRegister();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const changeHandler = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ""
    );
  }, [formData]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formInputs = new FormData(e.target);
    // const inputs = Object.fromEntries(formInputs);

    register(formInputs);
  };

  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form" onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={changeHandler}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={changeHandler}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={changeHandler}
            required
          />
          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}
          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={changeHandler}
            required
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile photo" />
            <p>Upload your photo</p>
          </label>
          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile photo"
              style={{ maxWidth: "80px", borderRadius: "50px" }}
            />
          )}
          <button disabled={isRegister}>
            {isRegister ? <ClipLoader color="white" size={20} /> : "Register"}
          </button>
        </form>
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
