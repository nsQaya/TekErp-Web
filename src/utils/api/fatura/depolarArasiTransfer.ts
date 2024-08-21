import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { IDepolarArasiTransfer } from "../../types/fatura/IDepolarArasiTransfer";
import { ITransferDataDepolarArasiTransfer } from "../../types/fatura/ITransferDataDepolarArasiTransfer";



const controller="DepolarArasiTransfers";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IDepolarArasiTransfer>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IDepolarArasiTransfer>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IDepolarArasiTransfer>){
        return $axios.post<IBaseResponseValue<IDepolarArasiTransfer>>(`/${controller}`, params);
    },
    update(params: Partial<IDepolarArasiTransfer>){
        return $axios.put<IBaseResponseValue<IDepolarArasiTransfer>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IDepolarArasiTransfer>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IDepolarArasiTransfer>>(`/${controller}/${id}`);
    },
    getByBelgeId(id: number){
        return $axios.get<IBaseResponseValue<IDepolarArasiTransfer>>(`/${controller}/GetByBelgeId?BelgeId=${id}`);
    },
    save(params: Partial<ITransferDataDepolarArasiTransfer>){
        return $axios.post<IBaseResponseValue<ITransferDataDepolarArasiTransfer>>(`/${controller}/save`, params);
    },
});