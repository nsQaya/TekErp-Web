import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useUserStore } from "../../store/userStore";
import auth from "./auth";
import stok from "./stok";
import { IBaseResponse, IBaseResponseValue, ICrudBaseAPI, IDovizTipi, IIl, IIlce, IStok, IStokKod, IStokOlcuBirim, IUlke } from "../types";
import stokKod from "./stokKod";
import ulke  from "./ulke";
import il from "./il";
import ilce from "./ilce";
import stokGrupKod from "./stokGrupKod";
import stokOlcuBirim from "./stokOlcuBirim";
import dovizTipi from "./dovizTipi";

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

const onResponseError = (error: AxiosError)=> {
  
  let errorMessage = "Bilinmeyen hata";

  if (error.response?.data && typeof error.response.data === "object") {
    const errorData = error.response.data as IBaseResponse;
    if (errorData.detail) {
      errorMessage = errorData.detail;
    }
  }
  
  const response = {
    data:{
      status: false,
      value: null,
      detail: errorMessage,
    }
  };
  
  return response;
};

instance.interceptors.request.use(onRequest, onRequestError);
instance.interceptors.response.use(onResponse, onResponseError);

const repositories = {
  auth: auth(instance),
  stok: stok(instance) as ICrudBaseAPI<IStok>,
  stokGrupKodu: stokGrupKod(instance) as ICrudBaseAPI<IStokKod>,
  stokKod1: stokKod(instance, 1) as ICrudBaseAPI<IStokKod>,
  stokKod2: stokKod(instance, 2) as ICrudBaseAPI<IStokKod>,
  stokKod3: stokKod(instance, 3) as ICrudBaseAPI<IStokKod>,
  stokKod4: stokKod(instance, 4) as ICrudBaseAPI<IStokKod>,
  stokKod5: stokKod(instance, 5) as ICrudBaseAPI<IStokKod>,
  stokOlcuBirim: stokOlcuBirim(instance) as ICrudBaseAPI<IStokOlcuBirim>,

  ulke: ulke(instance) as ICrudBaseAPI<IUlke>,
  il: il(instance) as ICrudBaseAPI<IIl>,
  ilce: ilce(instance) as ICrudBaseAPI<IIlce>,

  dovizTipi: dovizTipi(instance) as ICrudBaseAPI<IDovizTipi>,

};

export default repositories;
