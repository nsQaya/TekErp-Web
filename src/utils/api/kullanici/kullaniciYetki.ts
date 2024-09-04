import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { IKullaniciYetki } from "../../types/kullanici/IKullaniciYetki";

const controller="UserOperationClaims";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IKullaniciYetki>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IKullaniciYetki>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IKullaniciYetki>){
        return $axios.post<IBaseResponseValue<IKullaniciYetki>>(`/${controller}`, params);
    },
    update(params: Partial<IKullaniciYetki>){
        return $axios.put<IBaseResponseValue<IKullaniciYetki>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IKullaniciYetki>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IKullaniciYetki>>(`/${controller}/${id}`);
    },
    getListByUserId(id: string){
        return $axios.get<IBaseResponseValue<IKullaniciYetki>>(`/${controller}/GetListByUserId?UserId=${id}`);
    }
});