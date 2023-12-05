import "../style/inscription.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Inscription({ setTest }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectUrl ? redirectUrl : "/";
  const [userdata, setUserdata] = useState([]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUserdata((values) => ({ ...values, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post(
        `http://127.0.0.1:8000/register/`,
        userdata
      );
      if (data.data.user !== undefined) {
        let userInfo = {
          token: data.data.token,
          username: data.data.user.username,
          email: data.data.user.email,
          first_name: data.data.user.first_name,
          last_name: data.data.user.last_name,
          id: data.data.user.id,
          is_superuser: data.data.user.is_superuser,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setTest(localStorage.getItem("userInfo"));
        navigate(redirect || "/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post(`http://127.0.0.1:8000/login/`, userdata);

      let userInfo = {
        token: data.data.token,
        username: data.data.username,
        email: data.data.email,
        first_name: data.data.first_name,
        last_name: data.data.last_name,
        id: data.data.id,
        is_superuser: data.data.is_superuser,
      };

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setTest(localStorage.getItem("userInfo"));
      navigate(redirect || "/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("userInfo"))) {
      navigate(redirect);
    }
  }, [navigate, redirect]);

  return (
    <div className="login-signup-body">
      <div className="login-signup-main">
        <input
          className="signup-input"
          type="checkbox"
          id="chk"
          aria-hidden="true"
        />
        <div className="signup">
          <form onSubmit={handleSignup}>
            <label className="signup-label" htmlFor="chk" aria-hidden="true">
              Sign up
            </label>
            <input
              className="signup-input"
              type="text"
              name="username"
              placeholder="User name"
              required=""
              onChange={handleChange}
            />
            <input
              className="signup-input"
              type="text"
              name="first_name"
              placeholder="First name"
              required=""
              onChange={handleChange}
            />
            <input
              className="signup-input"
              type="text"
              name="last_name"
              placeholder="Last name"
              required=""
              onChange={handleChange}
            />
            <input
              className="signup-input"
              type="email"
              name="email"
              placeholder="Email"
              required=""
              onChange={handleChange}
            />
            <input
              className="signup-input"
              type="password"
              name="password"
              placeholder="Password"
              required=""
              onChange={handleChange}
            />
            <button className="signup-button">Sign up</button>
          </form>
        </div>

        <div className="login">
          <form onSubmit={handleLogin}>
            <label className="login-label" htmlFor="chk" aria-hidden="true">
              Login
            </label>
            <input
              className="login-input"
              type="text"
              name="username"
              placeholder="Username"
              required=""
              onChange={handleChange}
            />
            <input
              className="login-input"
              type="password"
              name="password"
              placeholder="Password"
              required=""
              onChange={handleChange}
            />
            <button className="login-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
