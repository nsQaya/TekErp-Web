
import { IStokHareketSeri } from "../stok/IStokHareketSeri";
import { IBelge } from "./IBelge";
import { IDepolarArasiTransfer } from "./IDepolarArasiTransfer";

export interface TransferData  {
    depolarArasiTransferDto: IDepolarArasiTransfer;
    belgeDto: IBelge;
    stokHareketDto: StokHareketDto[];
}
// StokHareketDto interface
export interface StokHareketDto {
    id:number;
    belgeId: number;
    stokKartiId: number;
    miktar: number;
    fiyatTL: number;
    fiyatDoviz?: number;
    fiyatDovizTipiId?: number;
    olcuBirimId: number;
    cikisHucreId: number;
    girisHucreId: number;
    girisCikis: string;
    aciklama1?: string;
    aciklama2?: string;
    aciklama3?: string;
    projeId: number;
    uniteId: number;
    masrafStokKartiId?: number;
    sira: number;
    seriKodu?: string;
    stokHareketSeries?: IStokHareketSeri[];
}
