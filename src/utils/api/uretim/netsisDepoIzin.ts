import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { INetsisDepoIzin } from "../../types/uretim/INetsisDepoIzin";


const controller="NetsisDepoIzins";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<INetsisDepoIzin>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<INetsisDepoIzin>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<INetsisDepoIzin>){
        return $axios.post<IBaseResponseValue<INetsisDepoIzin>>(`/${controller}`, params);
    },
    update(params: Partial<INetsisDepoIzin>){
        return $axios.put<IBaseResponseValue<INetsisDepoIzin>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<INetsisDepoIzin>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<INetsisDepoIzin>>(`/${controller}/${id}`);
    },
    getListByBelgeId(id: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<INetsisDepoIzin>>>(`/${controller}/GetListByBelgeId?BelgeId=${id}`);
    }
});