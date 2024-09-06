import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { IIsEmri } from "../../types/planlama/IIsEmri";



const controller="IsEmris";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IIsEmri>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIsEmri>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IIsEmri>){
        return $axios.post<IBaseResponseValue<IIsEmri>>(`/${controller}`, params);
    },
    update(params: Partial<IIsEmri>){
        return $axios.put<IBaseResponseValue<IIsEmri>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IIsEmri>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IIsEmri>>(`/${controller}/${id}`);
    },
    getByKod(kod: string){
        return $axios.get<IBaseResponseValue<IIsEmri>>(`/${controller}/GetByKod?IsEmriNo=${kod}`);
    },
});