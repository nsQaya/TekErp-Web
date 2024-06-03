import { aktarimDurumu } from "../enums/aktarimDurumu";

export interface IUnite {
  id?: number;
  kodu: string;
  adi: string;
  aktarimDurumu:aktarimDurumu;
}
