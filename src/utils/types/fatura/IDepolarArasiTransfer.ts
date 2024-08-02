import { ICari } from "../cari/ICari"
import { EAmbarHareketTur } from "../enums/EAmbarHareketTur"

import { IBelge } from "./IBelge"

export interface IAmbarFisi
{
    id?:number,
    belge?:IBelge,
    belgeId:number,
    cariId:number,
    cari:ICari,
    ambarHareketTur:EAmbarHareketTur,
 
}