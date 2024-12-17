import { IHucre } from "../tanimlamalar/IHucre";

export interface IIhtiyacPlanlamaRapor {
    id: number,
    tarih?: Date,
    cikisHucre?:IHucre[],
    cikisHucreId:number,
    projeKoduId:number,
    projeKodu:string,
    projeAciklama?:string,
    uniteKoduId:number,
    plasiyerKodu:string,
    plasiyerAciklama?:string,
    mamulAdi?:string,
    stokKartiId:number,
    stokKodu:string,
    stokAdi?:string,
    miktar:number,
    istenilenMiktar:number,
    olcuBirimId:number,
    olcuBirim?:string,
    belgeNo?:string,
    cikisMiktar:number,
    yuruyenIhtiyac:number,
    bakiye:number,
    stokTalepMiktari:number,
    stokSiparisMiktari:number,
    toplamIhtiyac:number,
    yuruyenBakiye:number,
    olcuBrId:number,
    olcuBr:string,
}
export interface IIhtiyacPlanlamaRaporForTalep {
    stokKodu:string,
    miktar:number,
    dahilMi:boolean
}
