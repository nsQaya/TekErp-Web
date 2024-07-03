
import { EAmbarFisiCikisYeri } from "../enums/EAmbarFisiCikisYeri"
import { EAmbarHareketTur } from "../enums/EAmbarHareketTur"

import { IBelge } from "./IBelge"

export interface IAmbarFisi
{
    id?:number,
    belge?:IBelge,
    belgeId:number,
    ambarHareketTur:EAmbarHareketTur,
    cikisYeri:EAmbarFisiCikisYeri,
    cikisYeriKodu?:string,
    cikisYeriId:number
}