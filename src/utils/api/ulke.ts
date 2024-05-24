import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../types";
import { IUlke } from "../types/tanimlamalar/IUlke";



export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IUlke>>>(`/Ulkes`, {
            params: {
                pageIndex: page,
                pageSize: take,
            }
        });
    },
    create(params: Partial<IUlke>){
        return $axios.post<IBaseResponseValue<IUlke>>(`/Ulkes`, params);
    },
    update(params: Partial<IUlke>){
        return $axios.put<IBaseResponseValue<IUlke>>(`/Ulkes`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IUlke>>(`/Ulkes/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IUlke>>(`/Ulkes/${id}`);
    }
});