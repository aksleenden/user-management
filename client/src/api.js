import axios from "axios";

const api = axios.create({
  baseURL: "https://user-management-server-kxvf.onrender.com" || "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const redirectTo =
      error.response && error.response.data
        ? error.response.data.redirectTo
        : null;

    if ((status === 401 || status === 403) && redirectTo) {
      if (window.location.pathname !== redirectTo) {
        window.location.assign(redirectTo);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
