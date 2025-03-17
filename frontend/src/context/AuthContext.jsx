import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_BASE_URL from "../apiConfig";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          console.warn("Token expired. Logging out...");
          logout();
          navigate("/login");
        } else {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUser(JSON.parse(localStorage.getItem("user")));
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
        navigate("/login");
      }
    }
    setLoading(false);
  }, [navigate]);
  //===========================================================================================//
  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}login`, credentials);
      const { user, token } = response.data;

      // console.log("Login Response:", response.data);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };
  //===========================================================================================//
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
