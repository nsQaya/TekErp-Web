import { AxiosInstance } from "axios";
import { IBaseResponseValue } from "../../types";
import { ISiparis } from "../../types/fatura/ISiparis";


const controller="Siparises";

export default ($axios: AxiosInstance) => ({

    update(params: Partial<ISiparis>){
        return $axios.put<IBaseResponseValue<ISiparis>>(`/${controller}/IthalatEkBilgiler`, params);
    }
});