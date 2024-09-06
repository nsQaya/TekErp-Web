import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";

import { DynamicQuery } from "../../transformFilter";
import { ICari } from "../../types/cari/ICari";

const controller="caris";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<ICari>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<ICari>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<ICari>){
        return $axios.post<IBaseResponseValue<ICari>>(`/${controller}`, params);
    },
    update(params: Partial<ICari>){
        return $axios.put<IBaseResponseValue<ICari>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<ICari>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<ICari>>(`/${controller}/${id}`);
    },
    getByKod(kod: string){
        return $axios.get<IBaseResponseValue<ICari>>(`/${controller}/GetByKod?CariKod=${kod}`);
    },
});






