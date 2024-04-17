import { Link } from "react-router-dom";
import { useUserStore } from "../../store/userStore";

import { useCallback, useState } from "react";
import api from "../../utils/api";

import "../../assets/css/pages/login-register-lock.css";

export default () => {
  const userStore = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRecoverShow, setRecoverShow]= useState(false);

  const submit = useCallback(async (e: any) => {
    e.preventDefault();

    var response = await api.auth.login(email, password);
    if (!response.data.status) {
      alert(response.data.detail);
      return;
    }

    userStore.setToken(
      response.data.value.accessToken.token,
      response.data.value.accessToken.expirationDate
    );
  }, [email, password]);

  const submitReset = useCallback(async (e: any) => {
    e.preventDefault();

    var response = await api.auth.forget(email);
    if (!response.data.status) {
      alert(response.data.detail);
      return;
    }

    alert("Mailinize sıfırlama gönderildi !");

  }, [email]);

  return (
    <div className="login-register">
      <div className="login-box card">
        <div className="card-body">
          <form
            className="form-horizontal form-material"
            id="loginform"
            action="#"
            onSubmit={submit}
          >
            <h3 className="text-center m-b-20">Giriş Yap</h3>
            <div className="form-group ">
              <div className="col-xs-12">
                <input
                  className="form-control"
                  type="text"
                  required
                  placeholder="Email Adresi"
                  onChange={(e)=>setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-xs-12">
                <input
                  className="form-control"
                  type="password"
                  required
                  placeholder="Şifreniz"
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-12">
                <div className="d-flex no-block align-items-center">
                  <div className="ms-auto">
                    <a
                      href="javascript:void(0)"
                      id="to-recover"
                      className="text-muted"
                      onClick={()=>setRecoverShow(true)}
                    >
                      <i className="fas fa-lock m-r-5"></i> Şifremi Unuttum
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group text-center">
              <div className="col-xs-12 p-b-20">
                <button
                  className="btn w-100 btn-lg btn-info btn-rounded text-white"
                  type="submit"
                >
                  Giriş Yap
                </button>
              </div>
            </div>
          </form>

          {isRecoverShow && <form
            className="form-horizontal"
            action="#"
            onSubmit={submitReset}
          >
            <div className="form-group ">
              <div className="col-xs-12">
                <h3>Şifremi Sıfırla</h3>
                <p className="text-muted">
                  Kayıt olduğnuuz email adresinizi yazınız.
                </p>
              </div>
            </div>
            <div className="form-group ">
              <div className="col-xs-12">
                <input
                  className="form-control"
                  type="text"
                  required
                  placeholder="Email"
                  onChange={(e)=>setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group text-center m-t-20">
              <div className="col-xs-12">
                <button
                  className="btn btn-primary btn-lg w-100 text-uppercase waves-effect waves-light"
                  type="submit"
                >
                  Şifremi Yenile
                </button>
              </div>
            </div>
          </form>
            }

        </div>
      </div>
    </div>
  );
};
