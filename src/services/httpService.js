import Axios from "axios";
import { toast } from "react-toastify";
import logService from "./logService";

Axios.defaults.baseURL = process.env.REACT_APP_API_URL;

Axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    logService.log(error);
    toast.error("An Unexpected error ocured");
  }

  return Promise.reject(error);
});

function setHeaders(token) {
  Axios.defaults.headers.common["x-auth-token"] = token;
}

export default {
  get: Axios.get,
  post: Axios.post,
  delete: Axios.delete,
  put: Axios.put,
  patch: Axios.patch,
  setHeaders
};
