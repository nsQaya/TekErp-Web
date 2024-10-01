import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { ITalepTeklif } from "../../types/fatura/ITalepTeklif";
import { ITalepTeklifSaveData } from "../../types/fatura/ITalepTeklifSaveData";

const controller="TalepTeklifs";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<ITalepTeklif>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<ITalepTeklif>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<ITalepTeklif>){
        return $axios.post<IBaseResponseValue<ITalepTeklif>>(`/${controller}`, params);
    },
    update(params: Partial<ITalepTeklif>){
        return $axios.put<IBaseResponseValue<ITalepTeklif>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<ITalepTeklif>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<ITalepTeklif>>(`/${controller}/${id}`);
    },
    getByBelgeId(id: number){
        return $axios.get<IBaseResponseValue<ITalepTeklif>>(`/${controller}/GetByBelgeId?BelgeId=${id}`);
    },
    save(params: Partial<ITalepTeklifSaveData>){
        return $axios.post<IBaseResponseValue<ITalepTeklifSaveData>>(`/${controller}/save`, params);
    },
});