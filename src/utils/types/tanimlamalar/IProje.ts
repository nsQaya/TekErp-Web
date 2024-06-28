import { EAktarimDurumu } from "../enums/EAktarimDurumu";


export interface IProje {
  id?: number;
  kodu: string;
  aciklama: string;
  aktarimDurumu:EAktarimDurumu;
}
