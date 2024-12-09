import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { IDovizKur } from "../../types/tanimlamalar/IDovizKur";


const controller="dovizTipis";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IDovizKur>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IDovizKur>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IDovizKur>){
        return $axios.post<IBaseResponseValue<IDovizKur>>(`/${controller}`, params);
    },
    update(params: Partial<IDovizKur>){
        return $axios.put<IBaseResponseValue<IDovizKur>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IDovizKur>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IDovizKur>>(`/${controller}/GetNetsisDovizKurByTarih?NetsisSira=${id}`);
    }
});