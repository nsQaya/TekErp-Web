import { AxiosInstance } from "axios";
import { IBaseResponseValue, IIl, IPagedResponse } from "../types";



export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIl>>>(`/ils/GetListForGrid`, {
            params: {
                pageIndex: page,
                pageSize: take,
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