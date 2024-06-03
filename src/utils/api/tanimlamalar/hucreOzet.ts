import { AxiosInstance } from "axios";
import { SortOrder } from "react-data-table-component";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IHucreOzet } from "../../types/tanimlamalar/IHucreOzet";



const controller="hucreOzets";

export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IHucreOzet>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
            }
        });
    },
    create(params: Partial<IHucreOzet>){
        return $axios.post<IBaseResponseValue<IHucreOzet>>(`/${controller}`, params);
    },
    update(params: Partial<IHucreOzet>){
        return $axios.put<IBaseResponseValue<IHucreOzet>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IHucreOzet>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IHucreOzet>>(`/${controller}/${id}`);
    }
});