import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { IIlce } from "../../types/tanimlamalar/IIlce";
import { DynamicQuery } from "../../transformFilter";

const controller="ilces";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<IIlce>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IIlce>>>(`/${controller}`, {
            params: {
                pageIndex: page,
                pageSize: take
            }
        });
    },
    create(params: Partial<IIlce>){
        return $axios.post<IBaseResponseValue<IIlce>>(`/${controller}`, params);
    },
    update(params: Partial<IIlce>){
        return $axios.put<IBaseResponseValue<IIlce>>(`/${controller}`, params);
    },
    delete(id: number){
        return $axios.delete<IBaseResponseValue<IIlce>>(`/${controller}/${id}`);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IIlce>>(`/${controller}/${id}`);
    }
});