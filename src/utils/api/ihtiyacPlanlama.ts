import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../types";
import { IIhtiyacPlanlama } from "../types/planlama/IIhtiyacPlanlama";




export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIhtiyacPlanlama>>>(`/IhtiyacPlanlamas`, 
        {
            params: {
                pageIndex: page,
                pageSize: take,
            }
            ,timeout: 60000,
        },
    );
    },
    create(params: Partial<IIhtiyacPlanlama>){
        return $axios.post<IBaseResponseValue<IIhtiyacPlanlama>>(`/IhtiyacPlanlamas`, params);
    },
    update(params: Partial<IIhtiyacPlanlama>){
        return $axios.put<IBaseResponseValue<IIhtiyacPlanlama>>(`/IhtiyacPlanlamas`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IIhtiyacPlanlama>>(`/IhtiyacPlanlamas/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IIhtiyacPlanlama>>(`/IhtiyacPlanlamas/${id}`);
    }
});