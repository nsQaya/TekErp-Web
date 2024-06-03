import { aktarimDurumu } from "../enums/aktarimDurumu";

export interface IPlasiyer {
  id?: number;
  kodu: string;
  adi: string;
  aktarimDurumu:aktarimDurumu;
}
