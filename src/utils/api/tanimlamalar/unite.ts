import { AxiosInstance } from "axios";
import { SortOrder } from "react-data-table-component";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IUnite } from "../../types/tanimlamalar/IUnite";



const controller="unites";

export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IUnite>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
            }
        });
    },
    create(params: Partial<IUnite>){
        return $axios.post<IBaseResponseValue<IUnite>>(`/${controller}`, params);
    },
    update(params: Partial<IUnite>){
        return $axios.put<IBaseResponseValue<IUnite>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IUnite>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IUnite>>(`/${controller}/${id}`);
    }
});