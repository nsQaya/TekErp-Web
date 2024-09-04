import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { INetsisStokHareketSeri } from "../../types/stok/INetsisStokHareketSeri";

const controller="StokHareketSeris";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<INetsisStokHareketSeri>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAll(inckeyno: string){
        return $axios.get<IBaseResponseValue<IPagedResponse<INetsisStokHareketSeri>>>(`/${controller}/GetListNetsisStokSeriHareketByInckeyno`, {
            params: {
                IncKeyNo: inckeyno
            }
        });
    },

});