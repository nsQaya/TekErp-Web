import { IStok } from "./IStok";
import { IStokBarkod } from "./IStokBarkod";
import { IHucre } from "../tanimlamalar/IHucre";
import { ISapKod } from "./ISapKod";


export interface IStokKartiWithDetail {
  stokKarti: IStok;
  stokBarkods: IStokBarkod[];
  sAPKods: ISapKod[];
  hucres: IHucre[];
}
