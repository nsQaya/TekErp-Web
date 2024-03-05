import { DovizTipi } from "../../dovizTipi/models/doviztipi";
import { GrupKodu } from "../../grupKodu/models/grupkodu";
import { Kod1 } from "../../kod1/models/kod1";
import { Kod2 } from "../../kod2/models/kod2";
import { Kod3 } from "../../kod3/models/kod3";
import { Kod4 } from "../../kod4/models/kod4";
import { Kod5 } from "../../kod5/models/kod5";
import { OlcuBr } from "../../olcuBr/models/olcubr";
import { SAPKod } from "../../sAPKod/models/sapkod";

export class StokKarti{
    id?:number; 
kodu?:string; 
adi?:string; 
ingilizceIsim?:string; 
grupKoduId?:number; 
grupKodu?:GrupKodu
kod1Id?:number; 
kod1?:Kod1;
kod2Id?:number; 
kod2?:Kod2;
kod3Id?:number; 
kod3?:Kod3;
kod4Id?:number; 
kod4?:Kod4;
kod5Id?:number; 
kod5?:Kod5;
olcuBr1Id?:number; 
olcuBr1?:OlcuBr;
olcuBr2Id?:number; 
olcuBr2?:OlcuBr;
olcuBr2Pay?:number; 
olcuBr2Payda?:number; 
olcuBr3Id?:number; 
olcuBr3?:OlcuBr;
olcuBr3Pay?:number; 
olcuBr3Payda?:number; 
alisDovizTipiId?:number; 
alisDovizTipi?:DovizTipi;
satisDovizTipiId?:number; 
satisDovizTipi?:DovizTipi;
alisFiyati?:number; 
satisFiyati?:number; 
alisKDVOrani?:number; 
satisKDVOrani?:number; 
seriTakibiVarMi:boolean; 
en?:number; 
boy?:number; 
genislik?:number; 
agirlik?:number; 
asgariStokMiktari?:number; 
azamiStokMiktari?:number; 
minimumSiparisMiktari?:number; 
sapKodlari?:SAPKod[]; 
barkodlar?:any;
dinamikDepoOzets?:any;
 

}