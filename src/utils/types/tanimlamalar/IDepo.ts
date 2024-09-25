import { EAktarimDurumu } from "../enums/EAktarimDurumu";

export interface IDepo {
  id?: number;
  kodu: string;
  adi: string;
  aktarimDurumu:EAktarimDurumu;
}
