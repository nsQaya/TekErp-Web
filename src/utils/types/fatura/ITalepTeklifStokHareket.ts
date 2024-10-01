import { IStok } from "../stok/IStok";
import { IDovizTipi } from "../tanimlamalar/IDovizTipi";
import { IProje } from "../tanimlamalar/IProje";
import { IStokOlcuBirim } from "../tanimlamalar/IStokOlcuBirim";
import { IUnite } from "../tanimlamalar/IUnite";

export interface ITalepTeklifStokHareket
{
    id?:number,
    belgeId?:number,
    stokKartiId:number,
    stokKarti?:IStok,
    miktar:number,
    fiyatTL:number,
    fiyatDoviz?:number,
    fiyatDovizTipiId?:number,
    fiyatDovizTipi?:IDovizTipi,
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