import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useUserStore } from "../../store/userStore";
import auth from "./auth";
import stok, { IStokAPI } from "./stok";
import { IBaseResponse, IBaseResponseValue, ICrudBaseAPI } from "../types";
import { IStokKartiWithDetail } from "../types/stok/IStokKartiWithDetail";
import { IStokOlcuBirim } from "../types/tanimlamalar/IStokOlcuBirim";
import { IStokKod } from "../types/stok/IStokKod";
import { IIlce } from "../types/tanimlamalar/IIlce";
import { IIl } from "../types/tanimlamalar/IIl";
import { IUlke } from "../types/tanimlamalar/IUlke";
import { IDovizTipi } from "../types/tanimlamalar/IDovizTipi";

import {IIhtiyacPlanlamaRapor} from "../types/planlama/IIhtiyacPlanlamaRapor";
import stokKod from "./stokKod";
import ulke  from "./tanimlamalar/ulke";
import il from "./tanimlamalar/il";
import ilce from "./tanimlamalar/ilce";
import stokGrupKod from "./stokGrupKod";
import stokOlcuBirim from "./tanimlamalar/stokOlcuBirim";
import dovizTipi from "./tanimlamalar/dovizTipi";
import stokWithDetail from './stokWithDetail';
import ihtiyacPlanlama from "./fatura/ihtiyacPlanlama";
import ihtiyacPlanlamaRapor from "./fatura/ihtiyacPlanlamaRapor";
import { IIhtiyacPlanlama } from "../types/planlama/IIhtiyacPlanlama";
import { IAmbarFisi } from "../types/fatura/IAmbarFisi";
import ambarCikisFisi from "./fatura/ambarCikisFisi";
import { apiURL } from "../config";
import { IDepo } from "../types/tanimlamalar/IDepo";
import depo from "./tanimlamalar/depo";
import hucre from "./tanimlamalar/hucre";
import { IHucre } from "../types/tanimlamalar/IHucre";
import plasiyer from "./tanimlamalar/plasiyer";
import { IPlasiyer } from "../types/tanimlamalar/IPlasiyer";
import proje from "./tanimlamalar/proje";
import { IProje } from "../types/tanimlamalar/IProje";
import unite from "./tanimlamalar/unite";
import { IUnite } from "../types/tanimlamalar/IUnite";
import { IStokHareket } from "../types/fatura/IStokHareket";
import stokHareket from "../api/stokHareket";
import { IBelge, IBelgeNo } from "../types/fatura/IBelge";
import belge from "../api/fatura/belge";
import { IBelgeSeri } from "../types/tanimlamalar/IBelgeSeri";
import belgeSeri from "../api/tanimlamalar/belgeSeri";

var instance: AxiosInstance = axios.create({
  baseURL: apiURL,
  timeout: 0,
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
  console.log(error);

  const response = {
    data:{
      status: false,
      value: null,
      detail: errorMessage,
      errors: (error.response?.data as any).Errors || undefined
    }
  };

  return response;
};

instance.interceptors.request.use(onRequest, onRequestError);
instance.interceptors.response.use(onResponse, onResponseError);

const repositories = {
  auth: auth(instance),
  stok: stok(instance) as unknown as IStokAPI,
  stokWithDetail: stokWithDetail(instance) as unknown as ICrudBaseAPI<IStokKartiWithDetail>,
  stokGrupKodu: stokGrupKod(instance) as unknown as ICrudBaseAPI<IStokKod>,
  stokKod1: stokKod(instance, 1) as unknown as ICrudBaseAPI<IStokKod>,
  stokKod2: stokKod(instance, 2) as unknown as ICrudBaseAPI<IStokKod>,
  stokKod3: stokKod(instance, 3)as unknown  as ICrudBaseAPI<IStokKod>,
  stokKod4: stokKod(instance, 4) as unknown as ICrudBaseAPI<IStokKod>,
  stokKod5: stokKod(instance, 5) as unknown as ICrudBaseAPI<IStokKod>,
  stokOlcuBirim: stokOlcuBirim(instance) as unknown as ICrudBaseAPI<IStokOlcuBirim>,
  stokHareket:stokHareket(instance) as unknown as ICrudBaseAPI<IStokHareket>,

  ulke: ulke(instance) as unknown as ICrudBaseAPI<IUlke>,
  il: il(instance) as unknown as ICrudBaseAPI<IIl>,
  ilce: ilce(instance) as unknown as ICrudBaseAPI<IIlce>,
  depo: depo(instance) as unknown as ICrudBaseAPI<IDepo>,
  hucre: hucre(instance) as unknown as ICrudBaseAPI<IHucre>,
  plasiyer: plasiyer(instance) as unknown as ICrudBaseAPI<IPlasiyer>,
  proje: proje(instance) as unknown as ICrudBaseAPI<IProje>,
  unite: unite(instance) as unknown as ICrudBaseAPI<IUnite>,
  belgeSeri: belgeSeri(instance) as unknown as ICrudBaseAPI<IBelgeSeri>,

  dovizTipi: dovizTipi(instance) as unknown as ICrudBaseAPI<IDovizTipi>,
  ihtiyacPlanlamaRapor: ihtiyacPlanlamaRapor(instance) as unknown as ICrudBaseAPI<IIhtiyacPlanlamaRapor>,
  ihtiyacPlanlama: ihtiyacPlanlama(instance) as unknown as ICrudBaseAPI<IIhtiyacPlanlama>,

  ambarFisi:ambarCikisFisi(instance) as unknown as ICrudBaseAPI<IAmbarFisi>,
  belge:belge(instance) as unknown as ICrudBaseAPI<IBelge>,
  belgeNo:belge(instance) as unknown as ICrudBaseAPI<IBelgeNo>

};

export default repositories;
