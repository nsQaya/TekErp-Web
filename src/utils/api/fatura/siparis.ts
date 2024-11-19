import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { ISiparis } from "../../types/fatura/ISiparis";
import { ISiparisSaveData } from "../../types/fatura/ISiparisSaveData";


const controller="Siparises";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<ISiparis>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<ISiparis>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<ISiparis>){
        return $axios.post<IBaseResponseValue<ISiparis>>(`/${controller}`, params);
    },
    update(params: Partial<ISiparis>){
        return $axios.put<IBaseResponseValue<ISiparis>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<ISiparis>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<ISiparis>>(`/${controller}/${id}`);
    },
    getByBelgeId(id: number){
        return $axios.get<IBaseResponseValue<ISiparis>>(`/${controller}/GetByBelgeId?BelgeId=${id}`);
    },
    save(saveData: Partial<ISiparisSaveData>){
        return $axios.put<IBaseResponseValue<ISiparisSaveData>>(`/${controller}/save`, 
           { 
            SaveSiparisDto: saveData
           
        });
    },
});