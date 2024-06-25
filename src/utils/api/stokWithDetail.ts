import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../types";
import { IStokKartiWithDetail } from "../types/stok/IStokKartiWithDetail";
import { DynamicQuery } from "../transformFilter";

const controller="StokKartis";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IStokKartiWithDetail>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.post<IBaseResponseValue<IPagedResponse<IStokKartiWithDetail>>>(`/${controller}/GetListWithDetails?PageIndex=${page}&PageSize=${take}`, {
            params: {
                pageIndex: page,
                pageSize: take,
            }
        });
    },
    create(params: Partial<IStokKartiWithDetail>){
        return $axios.post<IBaseResponseValue<IStokKartiWithDetail>>(`/${controller}/CreateStokKartiWithDetails`, params);
    },
    update(params: Partial<IStokKartiWithDetail>){
        return $axios.put<IBaseResponseValue<IStokKartiWithDetail>>(`/${controller}/CreateStokKartiWithDetails`, params);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokKartiWithDetail>>(`/${controller}/GetByIdWithDetails?id=${id}`);
    }
});