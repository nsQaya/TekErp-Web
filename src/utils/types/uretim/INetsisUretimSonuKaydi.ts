import { IKullanici } from "../kullanici/IKullanici";
import { IStok } from "../stok/IStok";
import { IStokHareketSeri } from "../stok/IStokHareketSeri";
import { IProje } from "../tanimlamalar/IProje";

export interface INetsisUretimSonuKaydi
{
    id?:number,
    isEmriNo?:string,
    stokKartiId:number,
    stokKarti?:IStok,
    miktar:number,
    projeId:number,
    proje?:IProje,
    uretimYapanUserId:string,
    uretimYapanUser?:IKullanici,
    aciklama?:string,
    girisDepo?:number,
    cikisDepo?:number,
    otoYariMamulStokKullan:boolean,
    Seri?:IStokHareketSeri[]
}