import { EAktarimDurumu } from "../enums/EAktarimDurumu";
import { EBelgeTip } from "../enums/EBelgeTip";


export  interface IBelge{
    id:number,
    belgeTip:EBelgeTip,
    no:string,
    tarih:Date,
    aciklama1?:string,
    aciklama2?:string,
    aciklama3?:string,
    aciklama4?:string,
    aciklama5?:string,
    aciklama6?:string,
    aciklama7?:string,
    aciklama8?:string,
    aciklama9?:string,
    aciklama10?:string,
    tamamlandi?:boolean,
    aktarimDurumu:EAktarimDurumu
}
export interface IBelgeNo{
    belgeNo:string
}