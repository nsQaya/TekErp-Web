import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse, IStokKod } from "../types";



export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokKod>>>(`/StokGrupKodus`, {
            params: {
                pageIndex: page,
                pageSize: take,
            }
        });
    },
    create(params: Partial<IStokKod>){
        return $axios.post<IBaseResponseValue<IStokKod>>(`/StokGrupKodus`, params);
    },
    update(params: Partial<IStokKod>){
        return $axios.put<IBaseResponseValue<IStokKod>>(`/StokGrupKodus`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IStokKod>>(`/StokGrupKodus/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokKod>>(`/StokGrupKodus/${id}`);
    }
});