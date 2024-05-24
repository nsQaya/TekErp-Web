import { AxiosInstance } from "axios";
import { IBaseResponseValue, IStokKartiWithDetail } from "../types";



export default ($axios: AxiosInstance) => ({
    create(params: Partial<IStokKartiWithDetail>){
        return $axios.post<IBaseResponseValue<IStokKartiWithDetail>>(`/StokKartis/CreateStokKartiWithDetails`, params);
    },
    update(params: Partial<IStokKartiWithDetail>){
        return $axios.put<IBaseResponseValue<IStokKartiWithDetail>>(`/StokKartis/CreateStokKartiWithDetails`, params);
    },
    get(id: number){
        return $axios.get<IBaseResponseValue<IStokKartiWithDetail>>(`/StokKartis/GetByIdWithDetails?id=${id}`);
    }
});