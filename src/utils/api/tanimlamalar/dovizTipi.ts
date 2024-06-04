import { AxiosInstance } from "axios";
import { SortOrder } from "react-data-table-component";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IDovizTipi } from "../../types/tanimlamalar/IDovizTipi";


const controller="dovizTipis";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IDovizTipi>>>(`/${controller}/GetListForGrid`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
            }
        });
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IDovizTipi>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IDovizTipi>){
        return $axios.post<IBaseResponseValue<IDovizTipi>>(`/${controller}`, params);
    },
    update(params: Partial<IDovizTipi>){
        return $axios.put<IBaseResponseValue<IDovizTipi>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IDovizTipi>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IDovizTipi>>(`/${controller}/${id}`);
    }
});