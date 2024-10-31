import { IIsEmri } from "../planlama/IIsEmri";
import { IPlasiyer } from "../tanimlamalar/IPlasiyer";
import { IProje } from "../tanimlamalar/IProje";

export interface INetsisDepoIzin
{
    id?:number,

    isEmriNo?:string,
    isEmri?:IIsEmri,

    projeKodu?:string,
    proje?:IProje

    plasiyerKodu?:string,
    plasiyer?:IPlasiyer,

    kilitliMi:number
}