import { AxiosInstance } from "axios";

import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { IBelge, IBelgeNo } from "../../types/fatura/IBelge";
import { EBelgeTip } from "../../types/enums/EBelgeTip";




const controller="belges";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IBelge>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IBelge>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IBelge>){
        return $axios.post<IBaseResponseValue<IBelge>>(`/${controller}`, params);
    },
    update(params: Partial<IBelge>){
        return $axios.put<IBaseResponseValue<IBelge>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IBelge>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IBelge>>(`/${controller}/${id}`);
    },
    getBySeri(seri: string,belgeTip: EBelgeTip){
        return $axios.get<IBaseResponseValue<IBelgeNo>>(`/${controller}/GetBySeri?Seri=${seri}&BelgeTip=${belgeTip}`);
    }
});