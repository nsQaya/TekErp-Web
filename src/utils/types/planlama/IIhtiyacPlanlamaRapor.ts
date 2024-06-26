export interface IIhtiyacPlanlamaRapor {
    id: number,
    tarih?: Date,
    projeKodu?:string,
    projeAciklama?:string,
    plasiyerKodu?:string,
    plasiyerAciklama?:string,
    mamulAdi?:string,
    stokKoduId:number,
    stokKodu:string,
    stokAdi?:string,
    miktar:number,
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
