import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";

import { DynamicQuery } from "../../transformFilter";
import { IStokKod } from "../../types/stok/IStokKod";

const controller="stokGrupKodus";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IStokKod>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokKod>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IStokKod>){
        return $axios.post<IBaseResponseValue<IStokKod>>(`/${controller}`, params);
    },
    update(params: Partial<IStokKod>){
        return $axios.put<IBaseResponseValue<IStokKod>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IStokKod>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokKod>>(`/${controller}/${id}`);
    }
});






