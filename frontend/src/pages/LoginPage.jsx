import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import ClipLoader from "react-spinners/ClipLoader";
import "../styles/Login.scss";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLogin } = useLogin();

  const submitHandler = async (e) => {
    e.preventDefault();

    login({ email, password });
  };

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={submitHandler}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button disabled={isLogin}>
            {isLogin ? <ClipLoader color="white" size={20} /> : "Login"}
          </button>
        </form>
        <Link to="/register">Don`t have an account? Register</Link>
      </div>
    </div>
  );
}

export default LoginPage;
