import { AxiosInstance } from "axios";

import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { IBelgeSeri } from "../../types/tanimlamalar/IBelgeSeri";

const controller="belgeSeris";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IBelgeSeri>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IBelgeSeri>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IBelgeSeri>){
        return $axios.post<IBaseResponseValue<IBelgeSeri>>(`/${controller}`, params);
    },
    update(params: Partial<IBelgeSeri>){
        return $axios.put<IBaseResponseValue<IBelgeSeri>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IBelgeSeri>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IBelgeSeri>>(`/${controller}/${id}`);
    }
});