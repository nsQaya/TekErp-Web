import { IYetki } from "./IYetki";

export interface IKullaniciYetki{
    userId:string,
    operationClaimId:number,
    operationClaim:IYetki
}