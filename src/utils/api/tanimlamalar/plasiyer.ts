import { AxiosInstance } from "axios";
import { SortOrder } from "react-data-table-component";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IPlasiyer } from "../../types/tanimlamalar/IPlasiyer";
import { DynamicQuery } from "../../transformFilter";


const controller="plasiyers";
export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IPlasiyer>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IPlasiyer>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IPlasiyer>){
        return $axios.post<IBaseResponseValue<IPlasiyer>>(`/${controller}`, params);
    },
    update(params: Partial<IPlasiyer>){
        return $axios.put<IBaseResponseValue<IPlasiyer>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IPlasiyer>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IPlasiyer>>(`/${controller}/${id}`);
    }
});