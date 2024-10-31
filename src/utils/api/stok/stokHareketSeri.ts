import { AxiosInstance } from "axios";
import { IStokHareketSeri } from "../../types/stok/IStokHareketSeri";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { IStokSeriBakiye } from "../../types/stok/IStokSeriBakiye";

const controller="stokHareketSeris";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IStokHareketSeri>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokHareketSeri>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IStokHareketSeri>){
        return $axios.post<IBaseResponseValue<IStokHareketSeri>>(`/${controller}`, params);
    },
    update(params: Partial<IStokHareketSeri>){
        return $axios.put<IBaseResponseValue<IStokHareketSeri>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IStokHareketSeri>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokHareketSeri>>(`/${controller}/${id}`);
    },
    getListByBelgeId(id: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokHareketSeri>>>(`/${controller}/GetListByBelgeId?BelgeId=${id}`);
    },
    getListBakiyeByStokKodu(stokKodu: string){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokSeriBakiye>>>(`/${controller}/GetListStokSeriBakiyeByStok?StokKodu=${stokKodu}`);
    },
    getListOtomatikSeriByStokKodu(stokKodu: string,miktar :number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStokSeriBakiye>>>(`/${controller}/GetListOtomatikSeriByStokKodu?StokKodu=${stokKodu}&Miktar=${miktar}`);
    }
});