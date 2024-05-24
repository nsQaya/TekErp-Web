import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../types";
import { IDovizTipi } from "../types/tanimlamalar/IDovizTipi";



export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IDovizTipi>>>(`/DovizTipis`, {
            params: {
                pageIndex: page,
                pageSize: take,
            }
        });
    },
    create(params: Partial<IDovizTipi>){
        return $axios.post<IBaseResponseValue<IDovizTipi>>(`/DovizTipis`, params);
    },
    update(params: Partial<IDovizTipi>){
        return $axios.put<IBaseResponseValue<IDovizTipi>>(`/DovizTipis`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IDovizTipi>>(`/DovizTipis/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IDovizTipi>>(`/DovizTipis/${id}`);
    }
});