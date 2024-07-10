import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IStokOlcuBirim } from "../../types/tanimlamalar/IStokOlcuBirim";
import { DynamicQuery } from "../../transformFilter";

const controller="stokOlcuBirims";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IStokOlcuBirim>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokOlcuBirim>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IStokOlcuBirim>){
        return $axios.post<IBaseResponseValue<IStokOlcuBirim>>(`/${controller}`, params);
    },
    update(params: Partial<IStokOlcuBirim>){
        return $axios.put<IBaseResponseValue<IStokOlcuBirim>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IStokOlcuBirim>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokOlcuBirim>>(`/${controller}/${id}`);
    }
});