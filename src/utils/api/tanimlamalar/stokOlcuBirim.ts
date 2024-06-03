import { AxiosInstance } from "axios";
import { SortOrder } from "react-data-table-component";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IStokOlcuBirim } from "../../types/tanimlamalar/IStokOlcuBirim";

const controller="stokOlcuBirims";

export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number,sortColumn?: string, sortDirection?: SortOrder){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokOlcuBirim>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take,
                sortColumn: sortColumn, // Sıralama sütunu
                sortDirection: sortDirection, // Sıralama yönü
            }
        });
    },
    create(params: Partial<IStokOlcuBirim>){
        return $axios.post<IBaseResponseValue<IStokOlcuBirim>>(`/${controller}`, params);
    },
    update(params: Partial<IStokOlcuBirim>){
        return $axios.put<IBaseResponseValue<IStokOlcuBirim>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IStokOlcuBirim>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokOlcuBirim>>(`/${controller}/${id}`);
    }
});