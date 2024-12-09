import { AxiosInstance } from "axios";
import { IBaseResponseValue, IPagedResponse } from "../../types";
import { INetsisUretimSonuKaydiIsEmriRecete } from "../../types/uretim/INetsisUretimSonuKaydiIsEmriRecete";

const controller="NetsisUretimSonuKaydis";

export default ($axios: AxiosInstance) => ({
    getAll2(isEmriNo: string,depoKodu: string){
        return $axios.get<IBaseResponseValue<IPagedResponse<INetsisUretimSonuKaydiIsEmriRecete>>>(`/${controller}/GetListReceteByIsEmri`, {
            params: {
                isEmriNo: isEmriNo,
                depoKodu:depoKodu
            }
        });
    },
});