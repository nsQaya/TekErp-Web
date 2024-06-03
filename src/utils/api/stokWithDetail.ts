import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../types";
import { IStokKartiWithDetail } from "../types/stok/IStokKartiWithDetail";



export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number){
        return $axios.post<IBaseResponseValue<IPagedResponse<IStokKartiWithDetail>>>(`/StokKartis/GetListWithDetails?PageIndex=${page}&PageSize=${take}`, {
            params: {
                pageIndex: page,
                pageSize: take,
            }
        });
    },
    create(params: Partial<IStokKartiWithDetail>){
        return $axios.post<IBaseResponseValue<IStokKartiWithDetail>>(`/StokKartis/CreateStokKartiWithDetails`, params);
    },
    update(params: Partial<IStokKartiWithDetail>){
        return $axios.put<IBaseResponseValue<IStokKartiWithDetail>>(`/StokKartis/CreateStokKartiWithDetails`, params);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokKartiWithDetail>>(`/StokKartis/GetByIdWithDetails?id=${id}`);
    }
});