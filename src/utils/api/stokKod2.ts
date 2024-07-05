import { AxiosInstance } from "axios";

import { IBaseResponseValue, IPagedResponse } from "../types";
import { DynamicQuery } from "../transformFilter";
import { IStokKod2 } from "../types/Stok/IStokKod2";

const controller="Stokkod2s";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IStokKod2>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokKod2>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IStokKod2>){
        return $axios.post<IBaseResponseValue<IStokKod2>>(`/${controller}`, params);
    },
    update(params: Partial<IStokKod2>){
        return $axios.put<IBaseResponseValue<IStokKod2>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IStokKod2>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokKod2>>(`/${controller}/${id}`);
    }
});