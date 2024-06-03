import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../types";
import { IStokKod } from "../types/stok/IStokKod";



export default ($axios: AxiosInstance, stokKodu: number) => ({
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