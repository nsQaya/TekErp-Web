import { AxiosInstance } from "axios";
import { IBaseResponseValue } from ".";

interface TokenResponse{
    token: string;
    expirationDate: string;
}

interface SuccessRespose{
    accessToken: TokenResponse;
}

export default ($axios: AxiosInstance) => ({
    login(email: string, password: string){
        return $axios.post<IBaseResponseValue<SuccessRespose>>(`/Auth/Login`, {
            email,
            password,
        });
    },
    register(email: string, password: string){
        return $axios.post(`/Auth/Register`,{
            email,
            password
        })
    },
    forget(email: string){
        return $axios.post(`/Auth/Forget`,{
            email,
        })
    },
    reset(email: string, code: string, password: string){
        return $axios.post(`/Auth/Reset`,{
            email,
            code,
            password
        })
    },
});