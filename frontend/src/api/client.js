import axios from "axios";

const api = axios.create({
  // Live এ কাজ করার জন্য Dynamic Base URL
  baseURL: import.meta.env.PROD
    ? "https://booking.dreamwebdev.com/prizebond_draw/api"
    : "http://localhost:8000/api",
});

export default api;