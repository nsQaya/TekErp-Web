import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { IStokSayimYetki } from "../../types/stok/IStokSayimYetki";





const controller="StokSayimYetkis";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IStokSayimYetki>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokSayimYetki>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IStokSayimYetki>){
        return $axios.post<IBaseResponseValue<IStokSayimYetki>>(`/${controller}`, params);
    },
    update(params: Partial<IStokSayimYetki>){
        return $axios.put<IBaseResponseValue<IStokSayimYetki>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IStokSayimYetki>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokSayimYetki>>(`/${controller}/${id}`);
    }
});