import axios from "axios";

const configureAxios = () => {
  // Conditionally choose the API URL based on the environment.
  const apiUrl =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_PROD
      : process.env.REACT_APP_API_DEV;

  const instance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
  });

  return instance;
};

export default configureAxios;
