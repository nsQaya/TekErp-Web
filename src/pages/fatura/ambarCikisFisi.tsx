import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default () => {
  let [searchParams, _] = useSearchParams();

  const recordID = useMemo(
    () => String(searchParams.get("Id")),
    [searchParams]
  );

  return (
    <div>
      <h1 hidden>{recordID}</h1>

      <div className="row align-items-center mb-1">
        <div className="col-md-1">
          <label className="form-label mb-0">Proje Kodu :</label>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            //value={kodu}
            //onChange={(e) => setKodu(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <label className="form-label mb-0">Ünite Kodu :</label>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            //value={kodu}
            //onChange={(e) => setKodu(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <button className="btn-warning"> Getir </button>
        </div>
      </div>
      

      <div className="row align-items-center mb-1">
        <div className="col-md-1">
          <label className="form-label mb-0">Numara :</label>
        </div>

        <div className="col-md-2 d-flex">
          <select  name="" id="" className="">
            <option value="A">AAA</option>
            <option value="B">BAA</option>
          </select>
          <input
            type="text"
            className="form-control"
            //value={kodu}
            //onChange={(e) => setKodu(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <label className="form-label mb-0">Hareket Türü :</label>
        </div>
        <div className="col-md-2">
        <select  name="" id="" className="">
            <option value="A">Üretim</option>
            <option value="B">Serbest</option>
          </select>
        </div>
        <div className="col-md-1">
          <label className="form-label mb-0">Çıkış Yeri :</label>
        </div>
        <div className="col-md-2">
        <select  name="" id="" className="">
            <option value="A">Masraf Merkezi</option>
            <option value="B">Stok</option>
          </select>
        </div>
        <div className="col-md-1">
          <label className="form-label mb-0">Kod :</label>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            //value={kodu}
            //onChange={(e) => setKodu(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <label className="form-label mb-0">Tarih :</label>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            //value={kodu}
            //onChange={(e) => setKodu(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <label className="form-label mb-0">Açıklama 1 :</label>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            //value={kodu}
            //onChange={(e) => setKodu(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <label className="form-label mb-0">Açıklama 2 :</label>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            //value={kodu}
            //onChange={(e) => setKodu(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <label className="form-label mb-0">Proje Kodu:</label>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            //value={kodu}
            //onChange={(e) => setKodu(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <label className="form-label mb-0">Ünite Kodu :</label>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            //value={kodu}
            //onChange={(e) => setKodu(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <label className="form-label mb-0">Kod1 :</label>
        </div>
        <div className="col-md-2">
        <select  name="" id="" className="">
            <option value="A">Kod 1</option>
            <option value="B">Kod</option>
          </select>
        </div>
        <div className="col-md-1">
          <label className="form-label mb-0">e-İrsaliye :</label>
        </div>
        <div className="col-md-2">
          <input
            type="checkbox"
            className="form-check-input" 
            //value={kodu}
            //onChange={(e) => setKodu(e.target.value)}
          />
        </div>

      </div>
      

<hr />



    </div>
  );
};
