import { AxiosResponse } from "axios";
import { DynamicQuery } from "./transformFilter";
import { EBelgeTip } from "./types/enums/EBelgeTip";

export interface IError {
  property: string;
  Errors?: string[];
}

export interface IBaseResponse {
  status: boolean;
  detail: string;
  errors?: Record<string, string[]>;//IError[];
}
export interface IBaseResponseValue<T> extends IBaseResponse {
  value: T;
}
export interface IPagedResponse<T> {
  items: T[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface TokenResponse {
  token: string;
  expirationDate: string;
}

export interface SuccessRespose {
  accessToken: TokenResponse;
}

export interface IEntity {
  id: number;
}

export interface ICrudBaseAPI<T> {
  // getAll: (page: number, take: number)=> Promise<AxiosResponse<IBaseResponseValue<IPagedResponse<T>>, any>>
  getListBakiyeByStokKodu(stokKodu: string): Promise<{ data: { value: { items: T[]; count: number } } }>;
  getListOtomatikSeriByStokKodu(stokKodu: string,miktar:number): Promise<{ data: { value: { items: T[]; count: number } } }>;
  getAllForGrid(
    page: number,
    take: number,
    dynamicQuery: DynamicQuery
  ): Promise<{ data: { value: { items: T[]; count: number } } }>;
  getListForAmbarCikisFisi(dynamicQuery: DynamicQuery): Promise<{ data: { value: { items: T[]; count: number } } }>;
  getListForDepolarArasiTransferFisi(dynamicQuery: DynamicQuery): Promise<{ data: { value: { items: T[]; count: number } } }>;
  getAll(page: number,take: number): Promise<{ data: { value: { items: T[]; count: number } } }>;
  getListByBelgeId(id: number): Promise<{ data: { value: { items: T[]; count: number } } }>;
  getListByUserId(id: string): Promise<{ data: { value: { items: T[]; count: number } } }>;
  get: (id: number) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>;
  getByKod: (id: string) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>;
  getByBelgeId: (id: number) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>;
  getBySeri: (seri: string,belgeTip: EBelgeTip) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>;
  create: (params: Partial<T>) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>;
  update: (params: Partial<T>) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>;
  delete: (id: number) => Promise<AxiosResponse<IBaseResponseValue<IEntity>, any>>;
  deleteByString: (id: string) => Promise<AxiosResponse<IBaseResponseValue<IEntity>, any>>;
  getListTalepStokForSiparis(
    page: number,
    take: number,
    dynamicQuery: DynamicQuery
  ): Promise<{ data: { value: { items: T[]; count: number } } }>;

  save: (params: Partial<T>) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>;
  
}

export interface IRaporBaseAPI<T> {
  getAll: (
    page: number,
    take: number
  ) => Promise<AxiosResponse<IBaseResponseValue<IPagedResponse<T>>, any>>;
  get: (id: number) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>;
}

export interface INetsisBaseAPI<T> {
  getAllNetsisStokHareket: (kod: string,depoKodu:string,netsisSirketKodu:string) => Promise<AxiosResponse<IBaseResponseValue<IPagedResponse<T>>, any>>;
  getAll2: (kod: string,depoKodu:string) => Promise<AxiosResponse<IBaseResponseValue<IPagedResponse<T>>, any>>;
  getAll: (kod: string) => Promise<AxiosResponse<IBaseResponseValue<IPagedResponse<T>>, any>>;
  get: (id: number) => Promise<AxiosResponse<IBaseResponseValue<T>, any>>;
}
