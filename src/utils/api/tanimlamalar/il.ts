import { AxiosInstance } from "axios";
import { SortOrder } from "react-data-table-component";
import { IIl } from "../../types/tanimlamalar/IIl";
import { IBaseResponseValue, IPagedResponse } from "../../types";

const controller="ils";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIl>>>(`/${controller}/GetListForGrid`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
            }
        });
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIl>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IIl>){
        return $axios.post<IBaseResponseValue<IIl>>(`/${controller}`, params);
    },
    update(params: Partial<IIl>){
        return $axios.put<IBaseResponseValue<IIl>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IIl>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IIl>>(`/${controller}/${id}`);
    }
});