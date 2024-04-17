import { AxiosInstance } from "axios";
import { IBaseResponseValue } from "..";
import { Ulke } from "../../../models/ulke";


interface UlkeListResponse {
    items: Ulke[];
    index: number;
    size: number;
    count: number;
    pages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  }

interface SuccessResponse {
  success: boolean;
}

export default ($axios: AxiosInstance) => ({
  createUlke(ulke: Ulke) {
    return $axios.post<IBaseResponseValue<SuccessResponse>>(`/Ulkes`, ulke);
  },
  updateUlke(ulke: Ulke) {
    return $axios.put<IBaseResponseValue<SuccessResponse>>(`/Ulkes`, ulke);
  },
  getUlkeById(id: number) {
    return $axios.get<IBaseResponseValue<Ulke>>(`/Ulkes/${id}`);
  },
    getAllUlkeler(pageIndex: number, pageSize: number) {
    return $axios.get<IBaseResponseValue<UlkeListResponse>>(`/Ulke/GetAll?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  },
  deleteUlke(id: number) {
    return $axios.delete<IBaseResponseValue<SuccessResponse>>(`/Ulkes/${id}`);
  },
});