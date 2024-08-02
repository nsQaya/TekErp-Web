import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";

import { DynamicQuery } from "../../transformFilter";
import { ICariKod } from "../../types/cari/ICariKod";

const controller="cariKod";

export default ($axios: AxiosInstance, stokKodu: number) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<ICariKod>>>(`/${controller}${stokKodu}s/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<ICariKod>>>(`/${controller}${stokKodu}s`, {
            params: {
                pageIndex: page,
                pageSize: take,
            }
        });
    },
    create(params: Partial<ICariKod>){
        return $axios.post<IBaseResponseValue<ICariKod>>(`/${controller}${stokKodu}s`, params);
    },
    update(params: Partial<ICariKod>){
        return $axios.put<IBaseResponseValue<ICariKod>>(`/${controller}${stokKodu}s`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<ICariKod>>(`/${controller}${stokKodu}s/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<ICariKod>>(`/${controller}${stokKodu}s/${id}`);
    }
});






