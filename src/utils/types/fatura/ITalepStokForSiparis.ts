import { IStok } from "../stok/IStok";
import { IProje } from "../tanimlamalar/IProje";
import { IStokOlcuBirim } from "../tanimlamalar/IStokOlcuBirim";
import { IUnite } from "../tanimlamalar/IUnite";
import { IBelge } from "./IBelge";

export interface ITalepStokForSiparis
{
    id?:number,
    belgeId?:number,
    belge?:IBelge,
    stokKartiId:number,
    stokKarti?:IStok,
    miktar:number,
    siparisMiktar:number,
    kalanMiktar:number,
    olcuBirimId:number,
    olcuBirim?:IStokOlcuBirim,
    girisCikis:string,
    aciklama1?:string,
    aciklama2?:string,
    aciklama3?:string,
    sira?:number,
    seriKodu?:string,
    teslimTarihi:Date,
    projeId:number,
    proje?:IProje,
    uniteId:number,
    unite?:IUnite
}