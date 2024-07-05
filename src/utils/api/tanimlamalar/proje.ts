import { AxiosInstance } from "axios";

import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { IProje } from "../../types/tanimlamalar/IProje";
import { DynamicQuery } from "../../transformFilter";



const controller="projes";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IProje>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IProje>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IProje>){
        return $axios.post<IBaseResponseValue<IProje>>(`/${controller}`, params);
    },
    update(params: Partial<IProje>){
        return $axios.put<IBaseResponseValue<IProje>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IProje>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IProje>>(`/${controller}/${id}`);
    }
});