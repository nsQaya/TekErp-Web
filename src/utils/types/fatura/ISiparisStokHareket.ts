
import { IStok } from "../stok/IStok";
import { IDovizTipi } from "../tanimlamalar/IDovizTipi";
import { IProje } from "../tanimlamalar/IProje";
import { IStokOlcuBirim } from "../tanimlamalar/IStokOlcuBirim";
import { IUnite } from "../tanimlamalar/IUnite";
import { IBelge } from "./IBelge";
import { ITalepTeklifStokHareket } from "./ITalepTeklifStokHareket";

export interface ISiparisStokHareket
{
    id?:number,
    belgeId?:number,
    belge?:IBelge,
    stokKartiId:number,
    stokKarti?:IStok,
    talepTeklifStokHareketId:number,
    talepTeklifStokHareket?:ITalepTeklifStokHareket,
    girisCikis:string,
    sira?:number,
    seriKodu?:string,
    olcuBirimId:number,
    olcuBirim?:IStokOlcuBirim,
    miktar:number,
    teslimTarihi:Date,
    istenilenTeslimTarihi:Date,
    fiyatOlcuBirimId:number,
    fiyatOlcuBirim?:IStokOlcuBirim,
    fiyatDovizTipiId:number,
    fiyatDovizTipi:IDovizTipi,
    fiyatDoviz:number,
    fiyatTL:number,
    fiyatNet:number,
    //iskontoTL:number,
    tutar:number,
    projeId:number,
    proje?:IProje,
    uniteId:number,
    unite?:IUnite
    kalanMiktar?: number,
    durum?: number,
    teslimMiktar?:number
}