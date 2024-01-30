import { Barkod } from "../../barkod/models/barkod";
import { SAPKod } from "../../sAPKod/models/sapkod";

export class StokKarti{
    id?:number; 
kodu?:string; 
adi?:string; 
ingilizceIsim?:string; 
grupKoduId?:number; 
kod1Id?:number; 
kod2Id?:number; 
kod3Id?:number; 
kod4Id?:number; 
kod5Id?:number; 
olcuBr1Id?:number; 
olcuBr2Id?:number; 
olcuBr2Pay?:number; 
olcuBr2Payda?:number; 
olcuBr3Id?:number; 
olcuBr3Pay?:number; 
olcuBr3Payda?:number; 
alisDovizTipiId?:number; 
satisDovizTipiId?:number; 
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
barkodlar?:Barkod[]; 

}