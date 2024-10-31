import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { INetsisUretimSonuKaydi } from "../../types/uretim/INetsisUretimSonuKaydi";

const controller="NetsisUretimSonuKaydis";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<INetsisUretimSonuKaydi>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<INetsisUretimSonuKaydi>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<INetsisUretimSonuKaydi>){
        return $axios.post<IBaseResponseValue<INetsisUretimSonuKaydi>>(`/${controller}`, params);
    },
    update(params: Partial<INetsisUretimSonuKaydi>){
        return $axios.put<IBaseResponseValue<INetsisUretimSonuKaydi>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<INetsisUretimSonuKaydi>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<INetsisUretimSonuKaydi>>(`/${controller}/${id}`);
    },
    getListByBelgeId(id: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<INetsisUretimSonuKaydi>>>(`/${controller}/GetListByBelgeId?BelgeId=${id}`);
    }
});