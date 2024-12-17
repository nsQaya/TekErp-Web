
import { IHucre } from "../tanimlamalar/IHucre";
import { IStokOlcuBirim } from "../tanimlamalar/IStokOlcuBirim";
import { IStokSayim } from "./IStokSayim";
import { IStok } from "./IStok";


export interface IStokSayimDetay

{
    id?: number;
    sayimId: number;
    sayim:IStokSayim;
    stokId: number;
    stok: IStok;
    miktar: number;
    seri: string;
    hucreId: number;
    hucre: IHucre;
    olcuBirimiId: number;
    olcuBirimi: IStokOlcuBirim;
    aciklama: string;
}