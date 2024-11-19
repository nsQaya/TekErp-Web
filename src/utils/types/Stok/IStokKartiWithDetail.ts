

import { IHucre } from "../tanimlamalar/IHucre";
import { ISapKod } from "./ISapKod";
import { IStokBarkod } from "./IStokBarkod";



export interface IStokKartiWithDetail {
  id?: number;
  kodu: string;
  adi: string;
  ingilizceIsim: string;
  stokGrupKoduId: any;
  stokKod1Id: any;
  stokKod2Id: any;
  stokKod3Id: any;
  stokKod4Id: any;
  stokKod5Id: any;
  stokOlcuBirim1Id: any;
  stokOlcuBirim2Id: any;
  olcuBr2Pay: number;
  olcuBr2Payda: number;
  stokOlcuBirim3Id: any;
  olcuBr3Pay: number;
  olcuBr3Payda: number;
  alisDovizTipiId: any;
  satisDovizTipiId: any;
  alisFiyati: number;
  satisFiyati: number;
  alisKDVOrani: number;
  satisKDVOrani: number;
  seriTakibiVarMi: boolean;
  en: number;
  boy: number;
  genislik: number;
  agirlik: number;
  asgariStokMiktari: number;
  azamiStokMiktari: number;
  minimumSiparisMiktari: number;
  aktarimDurumu: number;
  stokBarkods: IStokBarkod[];
  sapKods: ISapKod[];
   hucres: IHucre[];
  
}
