import { EAktarimDurumu } from "../enums/EAktarimDurumu";


export interface IUnite {
  id?: number;
  kodu: string;
  aciklama: string;
  aktarimDurumu:EAktarimDurumu;
}
