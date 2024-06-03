import { aktarimDurumu } from "../enums/aktarimDurumu";

export interface IProje {
  id?: number;
  kodu: string;
  aciklama: string;
  aktarimDurumu:aktarimDurumu;
}
