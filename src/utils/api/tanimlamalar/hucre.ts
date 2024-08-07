import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IHucre } from "../../types/tanimlamalar/IHucre";
import { DynamicQuery } from "../../transformFilter";


const controller="hucres";


export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IHucre>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IHucre>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IHucre>){
        return $axios.post<IBaseResponseValue<IHucre>>(`/${controller}`, params);
    },
    update(params: Partial<IHucre>){
        return $axios.put<IBaseResponseValue<IHucre>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IHucre>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IHucre>>(`/${controller}/${id}`);
    }
});