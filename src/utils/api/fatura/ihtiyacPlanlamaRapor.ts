import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IIhtiyacPlanlamaRapor, IIhtiyacPlanlamaRaporForTalep } from "../../types/planlama/IIhtiyacPlanlamaRapor";
import { DynamicQuery } from "../../transformFilter";

const controller="ihtiyacPlanlamas";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IIhtiyacPlanlamaRapor>>>(`/${controller}/GetListIhtiyacPlanlamaRaporQuery?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getListForAmbarCikisFisi(dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IIhtiyacPlanlamaRapor>>>(`/${controller}/GetListIhtiyacPlanlamaRaporForAmbarCikisFisi`, dynamicQuery );
    },
    getListForDepolarArasiTransferFisi(dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IIhtiyacPlanlamaRapor>>>(`/${controller}/GetListIhtiyacPlanlamaRaporForDepolarArasiTransferFisi`, dynamicQuery );
    },
    getByKod(stokKodu: string){
        return $axios.get<IBaseResponseValue<IIhtiyacPlanlamaRaporForTalep>>(`/${controller}/GetStokIhtiyacPlanlamaForTalep?stokKodu=${stokKodu}`);
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIhtiyacPlanlamaRapor>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
            ,timeout: 60000,
        });
    },
    create(params: Partial<IIhtiyacPlanlamaRapor>){
        return $axios.post<IBaseResponseValue<IIhtiyacPlanlamaRapor>>(`/${controller}`, params);
    },
    update(params: Partial<IIhtiyacPlanlamaRapor>){
        return $axios.put<IBaseResponseValue<IIhtiyacPlanlamaRapor>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IIhtiyacPlanlamaRapor>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IIhtiyacPlanlamaRapor>>(`/${controller}/${id}`);
    }
});