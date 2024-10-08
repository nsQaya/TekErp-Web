import { IDovizTipi } from "../tanimlamalar/IDovizTipi";
import { IHucreOzet } from "../tanimlamalar/IHucreOzet";
import { IStokOlcuBirim } from "../tanimlamalar/IStokOlcuBirim";
import { IStokKod } from "./IStokKod";

export interface IStok {
  id?: number;
  kodu: string;
  adi: string;
  ingilizceIsim: string;
  stokGrupKoduId: any;
  stokGrupKodu:IStokKod;
  stokKod1Id: any;
  stokKod1:IStokKod;
  stokKod2Id: any;
  stokKod2:IStokKod;
  stokKod3Id: any;
  stokKod3:IStokKod;
  stokKod4Id: any;
  stokKod4:IStokKod;
  stokKod5Id: any;
  stokKod5:IStokKod;
  stokOlcuBirim1Id: number;
  stokOlcuBirim1:IStokOlcuBirim;
  stokOlcuBirim2Id: any;
  stokOlcuBirim2:IStokOlcuBirim;
  olcuBr2Pay: number;
  olcuBr2Payda: number;
  stokOlcuBirim3Id: any;
  stokOlcuBirim3:IStokOlcuBirim;
  olcuBr3Pay: number;
  olcuBr3Payda: number;
  hucreOzets:IHucreOzet[];
  alisDovizTipiId: number;
  alisDovizTipi?:IDovizTipi;
  satisDovizTipiId: number;
  satisDovizTipi?:IDovizTipi;
  alisFiyati: number;
  satisFiyati: number;
  alisKDVOrani: number;
  satisKDVOrani: number;
  seriTakibiVarMi: boolean;
  seriMiktarKadarMi:boolean;
  en: number;
  boy: number;
  genislik: number;
  agirlik: number;
  asgariStokMiktari: number;
  azamiStokMiktari: number;
  minimumSiparisMiktari: number;
  aktarimDurumu: number;
  bakiye:number;
}
