import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse, IStok } from "../types";


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