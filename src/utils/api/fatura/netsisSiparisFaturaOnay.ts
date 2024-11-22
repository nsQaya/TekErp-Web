import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { INetsisSiparisFaturaOnay } from "../../types/fatura/INetsisSiparisFaturaOnay";


const controller="NetsisSiparisFaturaOnays";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<INetsisSiparisFaturaOnay>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<INetsisSiparisFaturaOnay>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<INetsisSiparisFaturaOnay>){
        return $axios.post<IBaseResponseValue<INetsisSiparisFaturaOnay>>(`/${controller}`, params);
    },
    update(params: Partial<INetsisSiparisFaturaOnay>){
        return $axios.put<IBaseResponseValue<INetsisSiparisFaturaOnay>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<INetsisSiparisFaturaOnay>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<INetsisSiparisFaturaOnay>>(`/${controller}/${id}`);
    }
});


