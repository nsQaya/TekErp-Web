import { AxiosInstance, AxiosResponse } from "axios";
import { IBaseResponseValue, ICrudBaseAPI, IPagedResponse } from "../../types";

import { DynamicQuery } from "../../transformFilter";
import { IIhtiyacPlanlama } from "../../types/planlama/IIhtiyacPlanlama";


const controller="IhtiyacPlanlamas";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IIhtiyacPlanlama>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIhtiyacPlanlama>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IIhtiyacPlanlama>){
        return $axios.post<IBaseResponseValue<IIhtiyacPlanlama>>(`/${controller}`, params);
    },
    update(params: Partial<IIhtiyacPlanlama>){
        return $axios.put<IBaseResponseValue<IIhtiyacPlanlama>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IIhtiyacPlanlama>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IIhtiyacPlanlama>>(`/${controller}/${id}`);
    }
});
