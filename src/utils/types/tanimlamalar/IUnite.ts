import { aktarimDurumu } from "../enums/aktarimDurumu";

export interface IUnite {
  id?: number;
  kodu: string;
  aciklama: string;
  aktarimDurumu:aktarimDurumu;
}
