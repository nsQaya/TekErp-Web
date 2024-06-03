import { AxiosInstance } from "axios";
import { SortOrder } from "react-data-table-component";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IAmbarFisi } from "../../types/fatura/IAmbarFisi";



export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IAmbarFisi>>>(`/AmbarFisis`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
            }
        });
    },
    create(params: Partial<IAmbarFisi>){
        return $axios.post<IBaseResponseValue<IAmbarFisi>>(`/AmbarFisis`, params);
    },
    update(params: Partial<IAmbarFisi>){
        return $axios.put<IBaseResponseValue<IAmbarFisi>>(`/AmbarFisis`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IAmbarFisi>>(`/AmbarFisis/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IAmbarFisi>>(`/AmbarFisis/${id}`);
    }
});