import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { IStokSayimDetay } from "../../types/stok/IStokSayimDetay";





const controller="StokSayimDetays";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IStokSayimDetay>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokSayimDetay>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IStokSayimDetay>){
        return $axios.post<IBaseResponseValue<IStokSayimDetay>>(`/${controller}`, params);
    },
    update(params: Partial<IStokSayimDetay>){
        return $axios.put<IBaseResponseValue<IStokSayimDetay>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IStokSayimDetay>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokSayimDetay>>(`/${controller}/${id}`);
    }
});