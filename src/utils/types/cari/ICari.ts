import { IIlce } from "../tanimlamalar/IIlce";
import { IPlasiyer } from "../tanimlamalar/IPlasiyer";
import { ICariKod } from "./ICariKod";

export interface ICari {
    id?: number;
    kodu: string;
    adi: string;
    telefon:string;
    ilceId:number;
    ilId:number;
    ulkeId:number;
    ilce?:IIlce;
    tip:string;
    adres:string;
    cariGrupKoduId?:number;
    cariGrupKodu?:ICariKod;
    cariKod1Id?:number;
    cariKod1?:ICariKod;
    cariKod2Id?:number;
    cariKod2?:ICariKod;
    cariKod3Id?:number;
    cariKod3?:ICariKod;
    cariKod4Id?:number;
    cariKod4?:ICariKod;
    cariKod5Id?:number;
    cariKod5?:ICariKod;
    vergiDairesi?:string;
    vergiNumarasi?:string;
    tcKimlikNo?:string;
    postaKodu:string;
    aciklama1?:string;
    aciklama2?:string;
    aciklama3?:string;
    muhasebeKodu?:string;
    plasiyerId?:number;
    plasiyer?:IPlasiyer
}