import { Link } from "react-router-dom";
import { useUserStore } from "../../store/userStore";

import { useCallback } from "react";
import api from '../../utils/api'

export default ()=>{
    const userStore= useUserStore();

    const testLogin= useCallback(async()=>{
        var response= await api.auth.login("eren@k2urt.com","hebeleeeA!1");
        if(!response.data.status){
            alert(response.data.detail);
            return;
        }

        userStore.setToken(response.data.value.accessToken.token, response.data.value.accessToken.expirationDate);
    },[])

    return (
        <>
            <h1>Login Page | {userStore.isLogged() && "Aynen"}</h1>
            <button onClick={()=>testLogin()}>Giriş Yap</button>
            <Link to={'/register'} >Kayıt ol</Link>
        </>
    )
}