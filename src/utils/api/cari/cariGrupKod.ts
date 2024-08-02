import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";

import { DynamicQuery } from "../../transformFilter";
import { ICariKod } from "../../types/cari/ICariKod";

const controller="cariGrupKodus";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<ICariKod>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<ICariKod>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<ICariKod>){
        return $axios.post<IBaseResponseValue<ICariKod>>(`/${controller}`, params);
    },
    update(params: Partial<ICariKod>){
        return $axios.put<IBaseResponseValue<ICariKod>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<ICariKod>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<ICariKod>>(`/${controller}/${id}`);
    }
});





