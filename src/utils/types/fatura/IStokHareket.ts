import { IStok } from "../stok/IStok";
import { IStokHareketSeri } from "../stok/IStokHareketSeri";
import { IHucre } from "../tanimlamalar/IHucre";
import { IProje } from "../tanimlamalar/IProje";
import { IStokOlcuBirim } from "../tanimlamalar/IStokOlcuBirim";
import { IUnite } from "../tanimlamalar/IUnite";

export interface IStokHareket {
    id:number;
    belgeId:number;
    stokKartiId:number;
    stokKarti?:IStok;
    miktar:number;
    istenilenMiktar:number;
    fiyatTL:number;
    fiyatDoviz?:number;
    fiyatDovizTipId?:number;
    olcuBirimId:number;
    olcuBirim?:IStokOlcuBirim;
    cikisHucreId?:number;
    cikisHucre?:IHucre;
    girisHucreId?:number;
    girisHucre?:IHucre;
    bakiye?:number;
    girisCikis:string;
    aciklama1?:string;
    aciklama2?:string;
    aciklama3?:string;
    projeId:number;
    proje?:IProje;
    uniteId:number;
    unite?:IUnite;
    masrafStokKartiId:number;
    sira:number;
    seriKodu?:string;
    seriler?:IStokHareketSeri[];
}