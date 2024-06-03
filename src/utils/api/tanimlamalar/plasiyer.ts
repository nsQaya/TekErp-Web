import { AxiosInstance } from "axios";
import { SortOrder } from "react-data-table-component";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IPlasiyer } from "../../types/tanimlamalar/IPlasiyer";


const controller="plasiyers";

export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IPlasiyer>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
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