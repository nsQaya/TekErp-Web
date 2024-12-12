import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { ISiparisStokHareket } from "../../types/fatura/ISiparisStokHareket";


const controller="SiparisStokHarekets";

export default ($axios: AxiosInstance) => ({
    
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<ISiparisStokHareket>>>(`/${controller}/GetListSiparisStokHareketForAcmaKapama?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<ISiparisStokHareket>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<ISiparisStokHareket>){
        return $axios.post<IBaseResponseValue<ISiparisStokHareket>>(`/${controller}`, params);
    },
    update(params: Partial<ISiparisStokHareket>){
        return $axios.put<IBaseResponseValue<ISiparisStokHareket>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<ISiparisStokHareket>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<ISiparisStokHareket>>(`/${controller}/${id}`);
    },
    getListByBelgeId(id: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<ISiparisStokHareket>>>(`/${controller}/GetListByBelgeId?BelgeId=${id}`);
    }
});