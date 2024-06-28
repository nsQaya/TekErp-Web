import { AxiosInstance, AxiosResponse } from "axios";
import { IBaseResponseValue, ICrudBaseAPI, IPagedResponse } from "../types";
import { IStok } from "../types/stok/IStok";
import { DynamicQuery } from "../transformFilter";

const controller="StokKartis";

export interface IStokAPI extends ICrudBaseAPI<IStok> {
    getBarkod: (ids: number[]) => AxiosResponse<IBaseResponseValue<{url: string}>>
}

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IStok>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStok>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take,
            }
        });
    },
    getBarkod(ids: number[]){
        return $axios.get<IBaseResponseValue<{url: string}>>(`/${controller}/GetStokKartiBarkodPdfUrl?stokIds=${ids.join('&stokIds=')}`);
    },
    getByKod(kod: string){
        return $axios.get<IBaseResponseValue<IStok>>(`/${controller}/GetByKod?Kod=${kod}`);
    }

});