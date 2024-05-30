import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../types";
import { IIl } from "../types/tanimlamalar/IIl";
import { SortOrder } from "react-data-table-component";



export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIl>>>(`/ils/GetListForGrid`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
            }
        });
    },
    create(params: Partial<IIl>){
        return $axios.post<IBaseResponseValue<IIl>>(`/ils`, params);
    },
    update(params: Partial<IIl>){
        return $axios.put<IBaseResponseValue<IIl>>(`/ils`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IIl>>(`/ils/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IIl>>(`/ils/${id}`);
    }
});