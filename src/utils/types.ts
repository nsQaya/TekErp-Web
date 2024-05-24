import { AxiosResponse } from "axios";
import { IStok } from "./types/Stok/IStok";
import { IStokBarkod } from "./types/Stok/IStokBarkod";
import { IHucre } from "./types/tanimlamalar/IHucre";

export interface IError{
  property: string;
  Errors?: string[];
}

export interface IBaseResponse{
    status: boolean;
    detail: string;
    errors?: IError[];
  }
  export interface IBaseResponseValue<T> extends IBaseResponse{
      value: T;
  }
  export interface IPagedResponse<T>{
    items: T[];
    index: number;
    size: number;
    count : number;
    pages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  }

  
export interface TokenResponse{
    token: string;
    expirationDate: string;
}

export interface SuccessRespose{
    accessToken: TokenResponse;
}

export interface IEntity{
  id: number
}

export interface ICrudBaseAPI<T>{
  getAll: (page: number, take: number)=> Promise<AxiosResponse<IBaseResponseValue<IPagedResponse<T>>, any>>
  get: (id: number) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>
  create: (params: Partial<T>) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>
  update: (params: Partial<T>) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>
  delete: (id: number) => Promise<AxiosResponse<IBaseResponseValue<IEntity>, any>>
}

export interface IStokKartiWithDetail{
  stokKarti:IStok
  stokBarkods:IStokBarkod[]
  sAPKods:ISapKod[]
  hucres:IHucre[]
}

  export interface ISapKod {
    id?: number
    kod: string
    stokKartiId?: number
  }


