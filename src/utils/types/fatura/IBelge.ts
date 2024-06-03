import { aktarimDurumu } from "../enums/aktarimDurumu";
import { belgeTip } from "../enums/belgeTip";

export  interface IBelge{
    id?:number,
    belgeTip:belgeTip,
    no:string,
    tarih:Date,
    aciklama1:string,
    aciklama2:string,
    aciklama3:string,
    tamamlandi:boolean,
    aktarimDurumu:aktarimDurumu
}