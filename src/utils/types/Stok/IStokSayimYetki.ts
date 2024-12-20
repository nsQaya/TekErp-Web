import { IKullanici } from "../kullanici/IKullanici";
import { IStokSayim } from "./IStokSayim";


export interface IStokSayimYetki

{
    id?: number;
    sayimId: number;
    sayim:IStokSayim;
    userId: string;
    user: IKullanici;
    gorme: number;
    ekleme: number;  
    degistirme: number;
    silme: number;
}