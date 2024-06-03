import { aktarimDurumu } from "../enums/aktarimDurumu";

export interface IDepo {
  id?: number;
  kodu: string;
  adi?: string;
  aktarimDurumu:aktarimDurumu;
}
