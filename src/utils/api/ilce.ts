import { AxiosInstance } from "axios";
import { IBaseResponseValue, IIlce, IPagedResponse } from "../types";



export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIlce>>>(`/Ilces`, {
            params: {
                pageIndex: page,
                pageSize: take,
            }
        });
    },
    create(params: Partial<IIlce>){
        return $axios.post<IBaseResponseValue<IIlce>>(`/Ilces`, params);
    },
    update(params: Partial<IIlce>){
        return $axios.put<IBaseResponseValue<IIlce>>(`/Ilces`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IIlce>>(`/Ilces/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IIlce>>(`/Ilces/${id}`);
    }
});