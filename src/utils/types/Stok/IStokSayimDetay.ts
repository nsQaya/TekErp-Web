
import { IHucre } from "../tanimlamalar/IHucre";
import { IStokOlcuBirim } from "../tanimlamalar/IStokOlcuBirim";
import { IStokSayim } from "./IStokSayim";
import { IStok } from "./IStok";


export interface IStokSayimDetay

{
    id?: number;
    stokSayimId: number;
    stokSayim?:IStokSayim;
    stokKartiId: number;
    stokKarti?: IStok;
    miktar: number;
    seri: string;
    hucreId: number;
    hucre?: IHucre;
    olcuBirimId: number;
    olcuBirim?: IStokOlcuBirim;
    aciklama: string;
}