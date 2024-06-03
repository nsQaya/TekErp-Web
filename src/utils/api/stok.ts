import { AxiosInstance, AxiosResponse } from "axios";
import { IBaseResponseValue, ICrudBaseAPI, IPagedResponse } from "../types";
import { IStok } from "../types/stok/IStok";

export interface IStokAPI extends ICrudBaseAPI<IStok> {
    getBarkod: (ids: number[]) => AxiosResponse<IBaseResponseValue<{url: string}>>
}

export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStok>>>(`/StokKartis`, {
            params: {
                pageIndex: page,
                pageSize: take,
            }
        });
    },
    getBarkod(ids: number[]){
        return $axios.get<IBaseResponseValue<{url: string}>>(`/StokKartis/GetStokKartiBarkodPdfUrl?stokIds=${ids.join('&stokIds=')}`);
    }

});