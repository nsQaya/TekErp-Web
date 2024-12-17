import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useUserStore } from "../../store/userStore";
import auth from "./auth";
import stok, { IStokAPI } from "./stok/stok";
import { IBaseResponse, IBaseResponseValue, ICrudBaseAPI, INetsisBaseAPI } from "../types";
import { IStokKartiWithDetail } from "../types/stok/IStokKartiWithDetail";
import { IStokOlcuBirim } from "../types/tanimlamalar/IStokOlcuBirim";
import { IStokKod } from "../types/stok/IStokKod";
import { IIlce } from "../types/tanimlamalar/IIlce";
import { IIl } from "../types/tanimlamalar/IIl";
import { IUlke } from "../types/tanimlamalar/IUlke";
import { IDovizTipi } from "../types/tanimlamalar/IDovizTipi";

import cari from "./cari/cari";
import {IIhtiyacPlanlamaRapor} from "../types/planlama/IIhtiyacPlanlamaRapor";
import stokKod from "./stok/stokKod";
import cariKod from "./cari/cariKod";
import ulke  from "./tanimlamalar/ulke";
import il from "./tanimlamalar/il";
import ilce from "./tanimlamalar/ilce";
import stokGrupKod from "./stok/stokGrupKod";
import cariGrupKod from "./cari/cariGrupKod";
import stokOlcuBirim from "./tanimlamalar/stokOlcuBirim";
import dovizTipi from "./tanimlamalar/dovizTipi";
import stokWithDetail from './stok/stokWithDetail';
import ihtiyacPlanlama from "./planlama/ihtiyacPlanlama";
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
import stokHareket from "../api/stok/stokHareket";
import stokHareketSeri from "../api/stok/stokHareketSeri"
import { IBelge, IBelgeNo } from "../types/fatura/IBelge";
import belge from "../api/fatura/belge";
import { IBelgeSeri } from "../types/tanimlamalar/IBelgeSeri";
import belgeSeri from "../api/tanimlamalar/belgeSeri";
import depolarArasiTransfer from "./fatura/depolarArasiTransfer";
import { ICariKod } from "../types/cari/ICariKod";
import { ICari } from "../types/cari/ICari";
import { IStokHareketSeri } from "../types/stok/IStokHareketSeri";
import { IStokSeriBakiye } from "../types/stok/IStokSeriBakiye";
import { IDepolarArasiTransfer } from "../types/fatura/IDepolarArasiTransfer";
import { IIsEmri } from "../types/planlama/IIsEmri";
import isEmri from "../api/fatura/isEmri";
import { ITransferDataDepolarArasiTransfer } from "../types/fatura/ITransferDataDepolarArasiTransfer";
import { ITransferDataAmbarFisi } from "../types/fatura/ITransferDataAmbarFisi";
import { IKullanici } from "../types/kullanici/IKullanici";
import { IKullaniciYetki } from "../types/kullanici/IKullaniciYetki";
import kullanici from "../api/kullanici/kullanici";
import kullaniciYetki from "../api/kullanici/kullaniciYetki";
import yetki from "../api/kullanici/yetki";
import { IYetki } from "../types/kullanici/IYetki";
import { INetsisStokHareket } from "../types/stok/INetsisStokHareket";
import netsisStokHareket from "../api/stok/netsisStokHareket";

import netsisStokHareketSeri from "../api/stok/netsisStokHareketSeri";
import { INetsisSirket } from "../types/tanimlamalar/INetsisSirket";
import netsisSirket from "../api/tanimlamalar/netsisSirket";

import { ITalepTeklif } from "../types/fatura/ITalepTeklif";
import talepTeklif from "../api/fatura/talepTeklif";
import { ITalepTeklifSaveData } from "../types/fatura/ITalepTeklifSaveData";
import talepTeklifStokHareket from "../api/fatura/talepTeklifStokHareket";
import { ITalepTeklifStokHareket } from "../types/fatura/ITalepTeklifStokHareket";
import { INetsisUretimSonuKaydi } from "../types/uretim/INetsisUretimSonuKaydi";
import siparis from "../api/fatura/siparis";
import siparisStokHareket from "../api/fatura/siparisHareket";

import netsisUretimSonuKaydi from "../api/uretim/netsisUretimSonuKaydi";
import netsisUretimSonuKaydiIsEmriRecete from "../api/uretim/netsisUretimSonuKaydiIsEmriRecete";
import netsisDepoIzin from "./uretim/netsisDepoIzin";
import netsisSiparisFaturaOnay from "./fatura/netsisSiparisFaturaOnay";
import { INetsisDepoIzin } from "../types/uretim/INetsisDepoIzin";
import { INetsisUretimSonuKaydiIsEmriRecete } from "../types/uretim/INetsisUretimSonuKaydiIsEmriRecete";
import { INetsisCariOdemeKodu } from "../types/cari/INetsisCariOdemeKodu";
import netsisCariOdemeKodu from "./cari/netsisCariOdemeKodu"
import { ISiparisSaveData } from "../types/fatura/ISiparisSaveData";
import { ISiparis } from "../types/fatura/ISiparis";
import { ISiparisStokHareket } from "../types/fatura/ISiparisStokHareket";
import { INetsisSiparisFaturaOnay } from "../types/fatura/INetsisSiparisFaturaOnay";
import { IDovizKur } from "../types/tanimlamalar/IDovizKur";
import netsisKur from "../api/tanimlamalar/dovizTipi";
import sayim from "./stok/sayim";
import { IStokSayimYetki } from "../types/stok/IStokSayimYetki";
import { IStokSayim } from "../types/stok/IStokSayim";
import sayimYetki from "./stok/sayimYetki";
import sayimDetay from "./stok/sayimDetay";
import { IStokSayimDetay } from "../types/stok/IStokSayimDetay";

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

const onResponseError = (error: AxiosError) => {
  let errorMessage = "Bilinmeyen hata";
  let errors: Record<string, string[]> | undefined;

  if (error.response?.data && typeof error.response.data === "object") {
    const errorData = error.response.data as IBaseResponse;

    // `detail` alanını kontrol et
    if (errorData.detail) {
      errorMessage = errorData.detail;
    }

    // `errors` alanını kontrol et ve varsa ata
    if (errorData.errors) {
      errors = errorData.errors;
    } else if ((error.response.data as any).errors) {
      // `Record<string, string[]>` olarak `errors` alanını al
      errors = (error.response.data as any).errors;
    }

    // Eğer errors varsa, errorMessage'ı errors'dan türet
    if (errors) {
      errorMessage = Object.entries(errors)
        .map(([key, messages]) => `${key}: ${messages.join(", ")}`)
        .join("\n");
    }
  }

  const response = {
    data: {
      status: false,
      value: null,
      detail: errorMessage,
      errors: errors
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
  stokHareketSeri:stokHareketSeri(instance) as unknown as ICrudBaseAPI<IStokHareketSeri>,
  stokSeriBakiye:stokHareketSeri(instance) as unknown as ICrudBaseAPI<IStokSeriBakiye>,
  sayim: sayim (instance) as unknown as ICrudBaseAPI<IStokSayim>,
  sayimYetki: sayimYetki (instance) as unknown as ICrudBaseAPI<IStokSayimYetki>,
  sayimDetay: sayimDetay (instance) as unknown as ICrudBaseAPI<IStokSayimDetay>,
 
  
 


  netsisStokHareket:netsisStokHareket(instance) as unknown as INetsisBaseAPI<INetsisStokHareket>,
  netsisStokHareketSeri:netsisStokHareketSeri(instance) as unknown as INetsisBaseAPI<INetsisStokHareket>,

  cari: cari(instance) as unknown as ICrudBaseAPI<ICari>,
  netsisCariOdemeKodu: netsisCariOdemeKodu(instance) as unknown as ICrudBaseAPI<INetsisCariOdemeKodu>,
  // stokWithDetail: stokWithDetail(instance) as unknown as ICrudBaseAPI<IStokKartiWithDetail>,
  cariGrupKodu: cariGrupKod(instance) as unknown as ICrudBaseAPI<ICariKod>,
  cariKod1: cariKod(instance, 1) as unknown as ICrudBaseAPI<IStokKod>,
  cariKod2: cariKod(instance, 2) as unknown as ICrudBaseAPI<IStokKod>,
  cariKod3: cariKod(instance, 3)as unknown  as ICrudBaseAPI<IStokKod>,
  cariKod4: cariKod(instance, 4) as unknown as ICrudBaseAPI<IStokKod>,
  cariKod5: cariKod(instance, 5) as unknown as ICrudBaseAPI<IStokKod>,

  ulke: ulke(instance) as unknown as ICrudBaseAPI<IUlke>,
  il: il(instance) as unknown as ICrudBaseAPI<IIl>,
  ilce: ilce(instance) as unknown as ICrudBaseAPI<IIlce>,
  depo: depo(instance) as unknown as ICrudBaseAPI<IDepo>,
  hucre: hucre(instance) as unknown as ICrudBaseAPI<IHucre>,
  plasiyer: plasiyer(instance) as unknown as ICrudBaseAPI<IPlasiyer>,
  proje: proje(instance) as unknown as ICrudBaseAPI<IProje>,
  unite: unite(instance) as unknown as ICrudBaseAPI<IUnite>,
  belgeSeri: belgeSeri(instance) as unknown as ICrudBaseAPI<IBelgeSeri>,
  netsisSirket: netsisSirket(instance) as unknown as ICrudBaseAPI<INetsisSirket>,

  kullanici: kullanici(instance) as unknown as ICrudBaseAPI<IKullanici>,
  kullaniciYetki: kullaniciYetki(instance) as unknown as ICrudBaseAPI<IKullaniciYetki>,
  yetki: yetki(instance) as unknown as ICrudBaseAPI<IYetki>,

  dovizTipi: dovizTipi(instance) as unknown as ICrudBaseAPI<IDovizTipi>,
  
  ihtiyacPlanlamaRapor: ihtiyacPlanlamaRapor(instance) as unknown as ICrudBaseAPI<IIhtiyacPlanlamaRapor>,
  ihtiyacPlanlama: ihtiyacPlanlama(instance) as unknown as ICrudBaseAPI<IIhtiyacPlanlama>,
  isEmri: isEmri(instance) as unknown as ICrudBaseAPI<IIsEmri>,

  belge:belge(instance) as unknown as ICrudBaseAPI<IBelge>,

  ambarFisi:ambarCikisFisi(instance) as unknown as ICrudBaseAPI<IAmbarFisi>,
  ambarFisiSave:ambarCikisFisi(instance) as unknown as ICrudBaseAPI<ITransferDataAmbarFisi>,

  depolarArasiTransfer:depolarArasiTransfer(instance) as unknown as ICrudBaseAPI<IDepolarArasiTransfer>,
  depolarArasiTransferSave:depolarArasiTransfer(instance) as unknown as ICrudBaseAPI<ITransferDataDepolarArasiTransfer>,

  belgeNo:belge(instance) as unknown as ICrudBaseAPI<IBelgeNo>,

  talepTeklif:talepTeklif(instance) as unknown as ICrudBaseAPI<ITalepTeklif>,
  talepTeklifSave:talepTeklif(instance) as unknown as ICrudBaseAPI<ITalepTeklifSaveData>,
  talepTeklifStokHareket:talepTeklifStokHareket(instance) as unknown as ICrudBaseAPI<ITalepTeklifStokHareket>,

  siparis:siparis(instance) as unknown as ICrudBaseAPI<ISiparis>,
  siparisSave:siparis(instance) as unknown as ICrudBaseAPI<ISiparisSaveData>,
  siparisStokHareket:siparisStokHareket(instance) as unknown as ICrudBaseAPI<ISiparisStokHareket>,

  netsisUretimSonuKaydi:netsisUretimSonuKaydi(instance) as unknown as ICrudBaseAPI<INetsisUretimSonuKaydi>,
  netsisUretimSonuKaydiIsEmriRecete:netsisUretimSonuKaydiIsEmriRecete(instance) as unknown as INetsisBaseAPI<INetsisUretimSonuKaydiIsEmriRecete>,
  netsisDepoIzin:netsisDepoIzin(instance) as unknown as ICrudBaseAPI<INetsisDepoIzin>,
  netsisSiparisFaturaOnay:netsisSiparisFaturaOnay (instance) as unknown as ICrudBaseAPI<INetsisSiparisFaturaOnay>,
  netsisDovizKur: netsisKur(instance) as unknown as INetsisBaseAPI<IDovizKur>,


};

export default repositories;
