import { ICari } from "../cari/ICari";
import { EFaturaTip } from "../enums/EFaturaTip";
import { EIhracatIthalatTip } from "../enums/EIhracatIthalatTip";
import { IBelge } from "./IBelge";

export interface ISiparis
{
    id?:number,
    belgeId?:number,
    belge?:IBelge,
    cariId:number,
    cari?:ICari,
    faturaTip:EFaturaTip,
    ithalatIhracatTip?:EIhracatIthalatTip,
    exportReferansNo?:string,
    odemeKodu:string,
    cikisEvrakTarihi?:Date,
    gumrukVarisTarihi?:Date,
    tasiyiciFirma?:string,
    varisEvraklariTarihi?:Date,
    dovizAraToplam:number,
    dovizIskonto:number,
    dovizKDV:number,
    dovizNetToplam:number,
    araToplamTL:number,
    iskontoTL:number,
    kdvTL:number,
    netToplamTL:number

}