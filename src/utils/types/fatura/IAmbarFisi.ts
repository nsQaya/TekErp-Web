import { ambarFisiCikisYeri } from "../enums/ambarFisiCikisYeri"
import { ambarHareketTur } from "../enums/ambarHareketTur"
import { IBelge } from "./IBelge"

export interface IAmbarFisi
{
    id?:number,
    belge:IBelge,
    belgeId:number,
    ambarHareketTur:ambarHareketTur,
    cikisYeri:ambarFisiCikisYeri,
    cikisYeriId:number
}