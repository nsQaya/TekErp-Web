import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { IKullanici } from "../../types/kullanici/IKullanici";

const controller="users";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IKullanici>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IKullanici>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IKullanici>){
        return $axios.post<IBaseResponseValue<IKullanici>>(`/${controller}`, params);
    },
    update(params: Partial<IKullanici>){
        return $axios.put<IBaseResponseValue<IKullanici>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IKullanici>>(`/${controller}/${id}`);
    },
    deleteByString(id: string){
        return $axios.delete<IBaseResponseValue<IKullanici>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IKullanici>>(`/${controller}/${id}`);
    },
    getByKod(id: string){
        return $axios.get<IBaseResponseValue<IKullanici>>(`/${controller}/${id}`);
    }
});