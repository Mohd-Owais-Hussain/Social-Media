import axios from "axios";
import {
  KEY_ACCESS_TOKEN,
  getItem,
  removeItem,
  setItem,
} from "./localStorageManager";
import { setLoading, showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use(async (request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  const { default: store } = await import("../redux/store");
  store.dispatch(setLoading(true));
  return request;
});

axiosClient.interceptors.response.use(
  async (response) => {
    const { default: store } = await import("../redux/store");
    store.dispatch(setLoading(false));

    const data = response.data;
    if (data.status === "ok") {
      return data;
    }

    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const error = data.message;

    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error,
      })
    );

    if (statusCode === 401 && !originalRequest._retry) {
      const response = await axios
        .create({
          withCredentials: true,
        })
        .get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);

      if (response.data.status === "ok") {
        setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.result.accessToken}`;

        return axios(originalRequest);
      } else {
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace("/login", "_self");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
  async (error) => {
    const { default: store } = await import("../redux/store");

    store.dispatch(setLoading(false));
    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error.message,
      })
    );
    return Promise.reject(error);
  }
);
