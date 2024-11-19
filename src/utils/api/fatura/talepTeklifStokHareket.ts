import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { ITalepTeklifStokHareket } from "../../types/fatura/ITalepTeklifStokHareket";

const controller="TalepTeklifStokHarekets";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<ITalepTeklifStokHareket>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<ITalepTeklifStokHareket>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<ITalepTeklifStokHareket>){
        return $axios.post<IBaseResponseValue<ITalepTeklifStokHareket>>(`/${controller}`, params);
    },
    update(params: Partial<ITalepTeklifStokHareket>){
        return $axios.put<IBaseResponseValue<ITalepTeklifStokHareket>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<ITalepTeklifStokHareket>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<ITalepTeklifStokHareket>>(`/${controller}/${id}`);
    },
    getListByBelgeId(id: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<ITalepTeklifStokHareket>>>(`/${controller}/GetListByBelgeId?BelgeId=${id}`);
    }
});