import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { DynamicQuery } from "../../transformFilter";
import { INetsisCariOdemeKodu } from "../../types/cari/INetsisCariOdemeKodu";

const controller="caris";

export default ($axios: AxiosInstance) => ({
    getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
        return $axios.post<IBaseResponseValue<IPagedResponse<INetsisCariOdemeKodu>>>(`/${controller}/GetAllNetsisCariOdemeKodu?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    }
});
