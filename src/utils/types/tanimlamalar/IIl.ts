import { IUlke } from "./IUlke";

export interface IIl {
  id?: number;
  adi: string;
  plakaKodu: string;
  ulkeId: number;
  ulke:IUlke;
  ulkeAdi: string;
  aktarimDurumu: number;
}
