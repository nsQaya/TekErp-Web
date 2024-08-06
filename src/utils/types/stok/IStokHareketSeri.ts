import { IStokHareket } from "../fatura/IStokHareket";

export interface IStokHareketSeri
{
    id?:number;
    stokHareketId?:number;
    stokhareket?:IStokHareket;
    seriNo1:string;
    seriNo2?:string;
    seriTarih1?:Date;
    seriTarih2?:Date;
    miktar:number;
    aciklama1?:string;
    aciklama2?:string;
    aciklama3?:string;
    sira:number;
}