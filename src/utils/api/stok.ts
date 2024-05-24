import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../types";
import { IStok } from "../types/Stok/IStok";


export default ($axios: AxiosInstance) => ({
    getAll(page: number, take: number){
        return $axios.get<IBaseResponseValue<IPagedResponse<IStok>>>(`/StokKartis`, {
            params: {
                pageIndex: page,
                pageSize: take,
            }
        });
    },
});