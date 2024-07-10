import { AxiosInstance } from "axios";
import { IStokKod } from "../../types/stok/IStokKod";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";



export default ($axios: AxiosInstance, stokKodu: number) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IStokKod>>>(`/StokKod${stokKodu}s/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokKod>>>(`/StokKod${stokKodu}s`, {
            params: {
                pageIndex: page,
                pageSize: take,
            }
        });
    },
    create(params: Partial<IStokKod>){
        return $axios.post<IBaseResponseValue<IStokKod>>(`/StokKod${stokKodu}s`, params);
    },
    update(params: Partial<IStokKod>){
        return $axios.put<IBaseResponseValue<IStokKod>>(`/StokKod${stokKodu}s`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IStokKod>>(`/StokKod${stokKodu}s/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokKod>>(`/StokKod${stokKodu}s/${id}`);
    }
});