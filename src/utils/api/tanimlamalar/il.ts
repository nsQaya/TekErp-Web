import { AxiosInstance } from "axios";
import { IIl } from "../../types/tanimlamalar/IIl";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";

const controller="ils";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IIl>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIl>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IIl>){
        return $axios.post<IBaseResponseValue<IIl>>(`/${controller}`, params);
    },
    update(params: Partial<IIl>){
        return $axios.put<IBaseResponseValue<IIl>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IIl>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IIl>>(`/${controller}/${id}`);
    }
});