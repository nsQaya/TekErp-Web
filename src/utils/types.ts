import { AxiosResponse } from "axios";

export interface IBaseResponse{
    status: boolean;
    detail?: string;
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

export interface IStok {
    id: number
    kodu: string
    adi: string
    ingilizceIsim: string
    stokGrupKoduId: any
    stokKod1Id: any
    stokKod2Id: any
    stokKod3Id: any
    stokKod4Id: any
    stokKod5Id: any
    stokOlcuBirim1Id: number
    stokOlcuBirim2Id: any
    olcuBr2Pay: number
    olcuBr2Payda: number
    stokOlcuBirim3Id: any
    olcuBr3Pay: number
    olcuBr3Payda: number
    alisDovizTipiId: number
    satisDovizTipiId: number
    alisFiyati: number
    satisFiyati: number
    alisKDVOrani: number
    satisKDVOrani: number
    seriTakibiVarMi: boolean
    en: number
    boy: number
    genislik: number
    agirlik: number
    asgariStokMiktari: number
    azamiStokMiktari: number
    minimumSiparisMiktari: number
    aktarimDurumu: number
  }

  export interface IStokKod {
    id: number
    kodu: string
    adi: string
    aktarimDurumu: number
  }
  export interface IUlke {
    id: number
    kodu: string
    adi: string
    aktarimDurumu: number
  }
  export interface IIl {
    id: number
    adi: string
    plakaKodu: string
    ulkeId:number
    ulkeAdi:string
    aktarimDurumu: number
  }
  export interface IIlce {
    id: number
    adi: string
    ilceKodu: string
    ilId:number
    aktarimDurumu: number
  }
  