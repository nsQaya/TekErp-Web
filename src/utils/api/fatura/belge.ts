import { AxiosInstance } from "axios";
import { SortOrder } from "react-data-table-component";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IBelge } from "../../types/fatura/IBelge";



export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IBelge>>>(`/Belges/GetListForGrid`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
            }
        });
    },
    create(params: Partial<IBelge>){
        return $axios.post<IBaseResponseValue<IBelge>>(`/Belges`, params);
    },
    update(params: Partial<IBelge>){
        return $axios.put<IBaseResponseValue<IBelge>>(`/Belges`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IBelge>>(`/Belges/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IBelge>>(`/Belges/${id}`);
    }
});