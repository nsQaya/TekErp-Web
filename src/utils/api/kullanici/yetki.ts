import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { IYetki } from "../../types/kullanici/IYetki";


const controller="OperationClaims";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IYetki>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IYetki>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IYetki>){
        return $axios.post<IBaseResponseValue<IYetki>>(`/${controller}`, params);
    },
    update(params: Partial<IYetki>){
        return $axios.put<IBaseResponseValue<IYetki>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IYetki>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IYetki>>(`/${controller}/${id}`);
    }
});