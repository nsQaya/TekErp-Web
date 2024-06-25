import { AxiosResponse } from "axios";
import { DynamicQuery } from "./transformFilter";



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
  // getAll: (page: number, take: number)=> Promise<AxiosResponse<IBaseResponseValue<IPagedResponse<T>>, any>>
  getAllForGrid(page: number, take: number, dynamicQuery:DynamicQuery): Promise<{ data: { value: { items: T[], count: number } } }>;
  getAll(page: number, take: number): Promise<{ data: { value: { items: T[], count: number } } }>;
  get: (id: number) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>
  getByKod: (id: string) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>
  create: (params: Partial<T>) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>
  update: (params: Partial<T>) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>
  delete: (id: number) => Promise<AxiosResponse<IBaseResponseValue<IEntity>, any>>
}


export interface IRaporBaseAPI<T>{
  getAll: (page: number, take: number)=> Promise<AxiosResponse<IBaseResponseValue<IPagedResponse<T>>, any>>
  get: (id: number) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>
}

