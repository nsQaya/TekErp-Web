import { AxiosInstance } from "axios";
import { SortOrder } from "react-data-table-component";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IIlce } from "../../types/tanimlamalar/IIlce";

const controller="ilces";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIlce>>>(`/${controller}/GetListForGrid`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
            }
        });
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIlce>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IIlce>){
        return $axios.post<IBaseResponseValue<IIlce>>(`/${controller}`, params);
    },
    update(params: Partial<IIlce>){
        return $axios.put<IBaseResponseValue<IIlce>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IIlce>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IIlce>>(`/${controller}/${id}`);
    }
});