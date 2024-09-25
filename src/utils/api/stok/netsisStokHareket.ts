import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { INetsisStokHareketSeri } from "../../types/stok/INetsisStokHareketSeri";

const controller="stokHarekets";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<INetsisStokHareketSeri>>>(`/${controller}/GetListForGrid?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    },
    getAllNetsisStokHareket(stokKodu: string,depoKodu:string, netsisSirketKodu:string){
        return $axios.get<IBaseResponseValue<IPagedResponse<INetsisStokHareketSeri>>>(`/${controller}/GetListNetsisStokHareketByStokKodu`, {
            params: {
                StokKodu: stokKodu,
                DepoKodu:depoKodu,
                NetsisSirketKodu:netsisSirketKodu
            }
        });
    },

});