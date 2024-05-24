import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../types";
import { IStokOlcuBirim } from "../types/tanimlamalar/IStokOlcuBirim";



export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokOlcuBirim>>>(`/StokOlcuBirims`, {
            params: {
                pageIndex: page,
                pageSize: take,
            }
        });
    },
    create(params: Partial<IStokOlcuBirim>){
        return $axios.post<IBaseResponseValue<IStokOlcuBirim>>(`/StokOlcuBirims`, params);
    },
    update(params: Partial<IStokOlcuBirim>){
        return $axios.put<IBaseResponseValue<IStokOlcuBirim>>(`/StokOlcuBirims`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IStokOlcuBirim>>(`/StokOlcuBirims/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokOlcuBirim>>(`/StokOlcuBirims/${id}`);
    }
});