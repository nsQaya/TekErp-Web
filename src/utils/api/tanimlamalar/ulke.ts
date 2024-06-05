import { AxiosInstance } from "axios";

import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IUlke } from "../../types/tanimlamalar/IUlke";
import { SortOrder } from "react-data-table-component";

const controller="ulkes";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IUlke>>>(`/${controller}/GetListForGrid`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
            }
        });
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