import { EAktarimDurumu } from "../enums/EAktarimDurumu";
import { EBelgeTip } from "../enums/EBelgeTip";


export  interface IBelge{
    id?:number,
    belgeTip:EBelgeTip,
    seri:string,
    no:string,
    tarih:Date,
    aciklama1?:string,
    aciklama2?:string,
    aciklama3?:string,
    tamamlandi?:boolean,
    aktarimDurumu:EAktarimDurumu
}