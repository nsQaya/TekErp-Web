import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IUlke } from "../../types/tanimlamalar/IUlke";
import { DynamicQuery } from "../../transformFilter";

const controller="ulkes";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IUlke>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IUlke>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IUlke>){
        return $axios.post<IBaseResponseValue<IUlke>>(`/${controller}`, params);
    },
    update(params: Partial<IUlke>){
        return $axios.put<IBaseResponseValue<IUlke>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IUlke>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IUlke>>(`/${controller}/${id}`);
    }
});






