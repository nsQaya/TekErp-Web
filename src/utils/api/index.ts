import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useUserStore } from "../../store/userStore";
import auth from "./auth";


export interface IBaseResponse{
  status: boolean;
  detail?: string;
}
export interface IBaseResponseValue<T> extends IBaseResponse{
    value: T;
}

var instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:60805/api/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json; charset=utf-8",
  },
});

const onRequest = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig<any>> => {
  const { token, isLogged } = useUserStore.getState();
  if (isLogged()) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): any => {
  response.data = {
    status: true,
    value: response.data,
    detail: "OK",
  } as IBaseResponseValue<any>;

  return response;
};

const onResponseError = (error: AxiosError): IBaseResponseValue<null> => {
  let errorMessage = "Bilinmeyen hata";

  if (error.response?.data && typeof error.response.data === "object") {
    const errorData = error.response.data as IBaseResponse;
    if (errorData.detail) {
      errorMessage = errorData.detail;
    }
  }

  const response: IBaseResponseValue<null> = {
    status: false,
    value: null,
    detail: errorMessage,
  };

  return response;
};

instance.interceptors.request.use(onRequest, onRequestError);
instance.interceptors.response.use(onResponse, onResponseError);

const repositories = {
  auth: auth(instance),
};

export default repositories;
