import { AxiosInstance } from "axios";
import { IStokHareket } from "../types/fatura/IStokHareket";
import { IBaseResponseValue, IPagedResponse } from "../types";
import { DynamicQuery } from "../transformFilter";



const controller="stokHarekets";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IStokHareket>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokHareket>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IStokHareket>){
        return $axios.post<IBaseResponseValue<IStokHareket>>(`/${controller}`, params);
    },
    update(params: Partial<IStokHareket>){
        return $axios.put<IBaseResponseValue<IStokHareket>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IStokHareket>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokHareket>>(`/${controller}/${id}`);
    },
    getListByBelgeId(id: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokHareket>>>(`/${controller}/GetListByBelgeId?BelgeId=${id}`);
    }
});