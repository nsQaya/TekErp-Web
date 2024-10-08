import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IAmbarFisi } from "../../types/fatura/IAmbarFisi";
import { DynamicQuery } from "../../transformFilter";
import { ITransferDataAmbarFisi } from "../../types/fatura/ITransferDataAmbarFisi";



const controller="AmbarFisis";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IAmbarFisi>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IAmbarFisi>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IAmbarFisi>){
        return $axios.post<IBaseResponseValue<IAmbarFisi>>(`/${controller}`, params);
    },
    update(params: Partial<IAmbarFisi>){
        return $axios.put<IBaseResponseValue<IAmbarFisi>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IAmbarFisi>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IAmbarFisi>>(`/${controller}/${id}`);
    },
    getByBelgeId(id: number){
        return $axios.get<IBaseResponseValue<IAmbarFisi>>(`/${controller}/GetByBelgeId?BelgeId=${id}`);
    },
    save(params: Partial<ITransferDataAmbarFisi>){
        return $axios.post<IBaseResponseValue<ITransferDataAmbarFisi>>(`/${controller}/save`, params);
    },
});