import { AxiosInstance } from "axios";
import { SortOrder } from "react-data-table-component";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IHucre } from "../../types/tanimlamalar/IHucre";


const controller="hucres";

export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IHucre>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
            }
        });
    },
    create(params: Partial<IHucre>){
        return $axios.post<IBaseResponseValue<IHucre>>(`/${controller}`, params);
    },
    update(params: Partial<IHucre>){
        return $axios.put<IBaseResponseValue<IHucre>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IHucre>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IHucre>>(`/${controller}/${id}`);
    }
});