import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IDovizTipi } from "../../types/tanimlamalar/IDovizTipi";
import { DynamicQuery } from "../../transformFilter";


const controller="dovizTipis";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IDovizTipi>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IDovizTipi>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IDovizTipi>){
        return $axios.post<IBaseResponseValue<IDovizTipi>>(`/${controller}`, params);
    },
    update(params: Partial<IDovizTipi>){
        return $axios.put<IBaseResponseValue<IDovizTipi>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IDovizTipi>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IDovizTipi>>(`/${controller}/${id}`);
    }
});