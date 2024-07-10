import { IStok } from "../stok/IStok";
import { IProje } from "../tanimlamalar/IProje";
import { IStokOlcuBirim } from "../tanimlamalar/IStokOlcuBirim";
import { IUnite } from "../tanimlamalar/IUnite";

export interface IIhtiyacPlanlama {
    id?: number;
    projeId: number;
    proje?:IProje;
    uniteId: number;
    unite?:IUnite;
    mamulAdi?: string;
    stokKartiId: number;
    stokKarti?:IStok;
    miktar: number;
    stokOlcuBirimId: number;
    stokOlcuBirim?:IStokOlcuBirim;
    stokOlcuBirimString: string;
    tarih: Date;
    durum: string;
}
