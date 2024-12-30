import { AxiosInstance } from "axios";
import { IBaseResponseValue } from "../../types";
import { ISiparisAcmaKapama } from "../../types/fatura/ISiparisAcmaKapama";



const controller="SiparisStokHarekets";

export default ($axios: AxiosInstance) => ({
    
    // getAllForGrid(page: number, take: number,dynamicQuery:DynamicQuery  ){
    //     return $axios.post<IBaseResponseValue<IPagedResponse<ISiparisAcmaKapama>>>(`/${controller}/GetListSiparisStokHareketForAcmaKapama?PageIndex=${page}&PageSize=${take}`, dynamicQuery );
    // },
    // getAll(page: number, take: number){
    //     return $axios.get<IBaseResponseValue<IPagedResponse<ISiparisStokHareket>>>(`/${controller}`, {
    //         params: {
    //             pageIndex: page,
    //             pageSize: take
    //         }
    //     });
    // },
    
    update(params: Partial<ISiparisAcmaKapama>){
        return $axios.put<IBaseResponseValue<ISiparisAcmaKapama>>(`/${controller}/AcKapa`, params);
    },
    // delete(id: number){
    //     return $axios.delete<IBaseResponseValue<ISiparisStokHareket>>(`/${controller}/${id}`);
    // },

});