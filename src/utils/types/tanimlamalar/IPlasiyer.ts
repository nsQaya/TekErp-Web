import { EAktarimDurumu } from "../enums/EAktarimDurumu";

export interface IPlasiyer {
  id?: number;
  kodu: string;
  adi: string;
  aktarimDurumu:EAktarimDurumu;
}
