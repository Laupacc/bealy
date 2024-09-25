import Cookies from "js-cookie";
import axios from "axios";

// Create an instance of Axios
const api = axios.create({
  baseURL: "http://localhost:4001", // Your API base URL
  withCredentials: true,
});

// Add a request interceptor to attach the token to each request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found in cookies.");
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to check if a new token was sent in the response
api.interceptors.response.use(
  (response) => {
    const newToken = response.headers["authorization"]?.split(" ")[1];

    if (newToken) {
      Cookies.set("token", newToken, {
        secure: window.location.protocol === "https:", // true if using HTTPS
        sameSite: window.location.protocol === "https:" ? "None" : "Lax", // 'None' for HTTPS, 'Lax' for HTTP
        path: "/", // make it available on all paths
      });
      console.log("Token set in cookies:", Cookies.get("token"));
    }

    return response;
  },
  (error) => {
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export default api;
