import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../types";
import { IIhtiyacPlanlamaRapor } from "../types/planlama/IIhtiyacPlanlamaRapor";



export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIhtiyacPlanlamaRapor>>>(`/IhtiyacPlanlamas/GetListIhtiyacPlanlamaRaporQuery`, 
        {
            params: {
                pageIndex: page,
                pageSize: take,
            }
            ,timeout: 60000,
        },
    );
    },
    create(params: Partial<IIhtiyacPlanlamaRapor>){
        return $axios.post<IBaseResponseValue<IIhtiyacPlanlamaRapor>>(`/IhtiyacPlanlamas`, params);
    },
    update(params: Partial<IIhtiyacPlanlamaRapor>){
        return $axios.put<IBaseResponseValue<IIhtiyacPlanlamaRapor>>(`/IhtiyacPlanlamas`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IIhtiyacPlanlamaRapor>>(`/IhtiyacPlanlamas/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IIhtiyacPlanlamaRapor>>(`/IhtiyacPlanlamas/${id}`);
    }
});