import { AxiosInstance } from "axios";
import { SortOrder } from "react-data-table-component";
import { IStokHareket } from "../types/stok/IStokHareket";
import { IBaseResponseValue, IPagedResponse } from "../types";



const controller="stokHareket";

export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokHareket>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
            }
        });
    },
    create(params: Partial<IStokHareket>){
        return $axios.post<IBaseResponseValue<IStokHareket>>(`/${controller}`, params);
    },
    update(params: Partial<IStokHareket>){
        return $axios.put<IBaseResponseValue<IStokHareket>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IStokHareket>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokHareket>>(`/${controller}/${id}`);
    }
});