import { ICari } from "../cari/ICari";
import { IBelge } from "./IBelge";

export interface ITalepTeklif
{
    id?:number,
    belgeId?:number,
    belge?:IBelge,
    cariId:number,
    cari?:ICari
}