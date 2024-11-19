import { EAktarimDurumu } from "../enums/EAktarimDurumu";
import { EBelgeTip } from "../enums/EBelgeTip";

export interface IAktarim {
id:number,
kayitId:number,
belgeTip:EBelgeTip,
aktarimDurumu:EAktarimDurumu,
aciklama:string
}