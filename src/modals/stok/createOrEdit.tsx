import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Select, { Options } from "react-select";
import { FormSelectItem } from "../DynamicModal";
import api from "../../utils/api";
import CreatableSelect from "react-select/creatable";

interface IStokModalProps {
  show: boolean;
  onDone?: Function;
  onHide?: Function;
}

export default (props: IStokModalProps) => {
  const [isShowing, setShowing] = useState(false);

  useEffect(() => {
    setShowing(props.show);
  }, [props.show]);

  const [ID, setID] = useState<number>();
  const [adi, setAdi] = useState("");
  const [kodu, setKodu] = useState("");
  const [ingilizceIsim, setIngilizceIsim] = useState("");
  const [stokGrupKoduId, setStokGrupKoduId] = useState(null);
  const [stokKod1Id, setStokKod1Id] = useState(null);
  const [stokKod2Id, setStokKod2Id] = useState(null);
  const [stokKod3Id, setStokKod3Id] = useState(null);
  const [stokKod4Id, setStokKod4Id] = useState(null);
  const [stokKod5Id, setStokKod5Id] = useState(null);
  const [stokOlcuBirim1Id, setStokOlcuBirim1Id] = useState(1);
  const [stokOlcuBirim2Id, setStokOlcuBirim2Id] = useState(null);
  const [olcuBr2Pay, setOlcuBr2Pay] = useState(1);
  const [olcuBr2Payda, setOlcuBr2Payda] = useState(1);
  const [stokOlcuBirim3Id, setStokOlcuBirim3Id] = useState(null);
  const [olcuBr3Pay, setOlcuBr3Pay] = useState(1);
  const [olcuBr3Payda, setOlcuBr3Payda] = useState(1);
  const [alisDovizTipiId, setAlisDovizTipiId] = useState(1);
  const [satisDovizTipiId, setSatisDovizTipiId] = useState(1);
  const [alisFiyati, setAlisFiyati] = useState(0);
  const [satisFiyati, setSatisFiyati] = useState(0);
  const [alisKDVOrani, setAlisKDVOrani] = useState(0);
  const [satisKDVOrani, setSatisKDVOrani] = useState(0);
  const [seriTakibiVarMi, setSeriTakibiVarMi] = useState(false);
  const [en, setEn] = useState(0);
  const [boy, setBoy] = useState(0);
  const [genislik, setGenislik] = useState(0);
  const [agirlik, setAgirlik] = useState(0);
  const [asgariStokMiktari, setAsgariStokMiktari] = useState(0);
  const [azamiStokMiktari, setAzamiStokMiktari] = useState(0);
  const [minimumSiparisMiktari, setMinimumSiparisMiktari] = useState(0);
  const [stokBarkods, setStokBarkods] = useState<string[]>([]);
  const [sAPKOds, setSAPKods] = useState<string[]>([]);
  const [hucres, setHucres] = useState<string[]>([]);

  const [stokGrupKodus, setStokGrupKodus] = useState<FormSelectItem[]>([]);
  const [stokKod1s, setStokKod1s] = useState<FormSelectItem[]>([]);
  const [stokKod2s, setStokKod2s] = useState<FormSelectItem[]>([]);
  const [stokKod3s, setStokKod3s] = useState<FormSelectItem[]>([]);
  const [stokKod4s, setStokKod4s] = useState<FormSelectItem[]>([]);
  const [stokKod5s, setStokKod5s] = useState<FormSelectItem[]>([]);
  const [stokOlcuBirims, setStokOlcuBirims] = useState<FormSelectItem[]>([]);
  const [dovizTipis, setDovizTipis] = useState<FormSelectItem[]>([]);

  const fetchInitals = useCallback(async () => {
    const [
      stokGrupKoduItems,
      stokKod1Items,
      stokKod2Items,
      stokKod3Items,
      stokKod4Items,
      stokKod5Items,
      stokOlcuBirimItems,
      dovizTipiItems
    ] = await Promise.all([
      api.stokGrupKodu.getAll(0, 1000),
      api.stokKod1.getAll(0, 1000),
      api.stokKod2.getAll(0, 1000),
      api.stokKod3.getAll(0, 1000),
      api.stokKod4.getAll(0, 1000),
      api.stokKod5.getAll(0, 1000),
      api.stokOlcuBirim.getAll(0, 1000),
      api.dovizTipi.getAll(0, 1000)
    ]);

    setStokGrupKodus(
      stokGrupKoduItems.data.value.items.map((x) => ({ label: x.adi, value: String(x.id) }))
    );

    setStokGrupKodus(stokGrupKoduItems.data.value.items.map((x) => ({ label: x.adi, value: String(x.id) }))
    );
    setStokKod1s(
      stokKod1Items.data.value.items.map((x) => ({ label: x.adi, value: String(x.id) }))
    );
    setStokKod2s(
      stokKod2Items.data.value.items.map((x) => ({ label: x.adi, value: String(x.id) }))
    );
    setStokKod3s(
      stokKod3Items.data.value.items.map((x) => ({ label: x.adi, value: String(x.id) }))
    );
    setStokKod4s(
      stokKod4Items.data.value.items.map((x) => ({ label: x.adi, value: String(x.id) }))
    );
    setStokKod5s(
      stokKod5Items.data.value.items.map((x) => ({ label: x.adi, value: String(x.id) }))
    );
    setStokOlcuBirims(
      stokOlcuBirimItems.data.value.items.map((x) => ({ label: x.adi, value: String(x.id) }))
    );
    setDovizTipis(
      dovizTipiItems.data.value.items.map((x) => ({ label: x.adi, value: String(x.id) }))
    );



  }, []);


  useEffect(() => {
    fetchInitals();
  }, []);

  const onSubmit = useCallback(() => {
    alert("asd");
  }, []);

  return (
    <Modal show={isShowing} onHide={() => props.onHide && props.onHide()}>
      <Modal.Header closeButton>
        <Modal.Title>Stok Ekle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="form-horizontal form-material">
          <div className="form-group">
          <div className="col-md-12 m-b-20">
              <input
                type="text"
                className="form-control"
                placeholder="id"
                value={ID}
                hidden
                onChange={(text) => setID(text.target.valueAsNumber)}
              />
            </div>
            <div className="col-md-12 m-b-20">
              <input
                type="text"
                className="form-control"
                placeholder="Kodu"
                value={kodu}
                onChange={(text) => setKodu(text.target.value)}
              />
            </div>
            <div className="col-md-12 m-b-20">
              <input
                type="text"
                className="form-control"
                placeholder="Adı"
                value={adi}
                onChange={(text) => setAdi(text.target.value)}
              />
            </div>
            <div className="col-md-12 m-b-20">
              <input
                type="text"
                className="form-control"
                placeholder="İngilizce Adı"
                value={ingilizceIsim}
                onChange={(text) => setIngilizceIsim(text.target.value)}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <Select
                defaultValue={stokGrupKodus.find(
                  (x) => x.value == stokGrupKoduId
                )}
                placeholder="Stok Grup Kodu"
                onChange={(selected: any) => setStokGrupKoduId(selected.value)}
                options={stokGrupKodus as Options<any>}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <Select
                defaultValue={stokKod1s.find((x) => x.value == stokKod1Id)}
                placeholder="Stok Kodu 1"
                onChange={(selected: any) => setStokKod1Id(selected.value)}
                options={stokKod1s as Options<any>}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <Select
                defaultValue={stokKod1s.find((x) => x.value == stokKod2Id)}
                placeholder="Stok Kodu 2"
                onChange={(selected: any) => setStokKod2Id(selected.value)}
                options={stokKod2s as Options<any>}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <Select
                defaultValue={stokKod3s.find((x) => x.value == stokKod3Id)}
                placeholder="Stok Kodu 3"
                onChange={(selected: any) => setStokKod3Id(selected.value)}
                options={stokKod3s as Options<any>}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <Select
                defaultValue={stokKod4s.find((x) => x.value == stokKod4Id)}
                placeholder="Stok Kodu 4"
                onChange={(selected: any) => setStokKod4Id(selected.value)}
                options={stokKod4s as Options<any>}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <Select
                defaultValue={stokKod5s.find((x) => x.value == stokKod5Id)}
                placeholder="Stok Kodu 5"
                onChange={(selected: any) => setStokKod5Id(selected.value)}
                options={stokKod5s as Options<any>}
              />
            </div>

            
            <div className="col-md-12 m-b-20">
              <Select
                defaultValue={stokOlcuBirims.find((x) => x.value == stokOlcuBirim1Id.toString())}
                placeholder="Ölçü Birim 1"
                onChange={(selected: any) => setStokOlcuBirim1Id(selected.value)}
                options={stokOlcuBirims as Options<any>}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <Select
                defaultValue={stokOlcuBirims.find((x) => x.value == stokOlcuBirim2Id)}
                placeholder="Ölçü Birim 2"
                onChange={(selected: any) => setStokOlcuBirim2Id(selected.value)}
                options={stokOlcuBirims as Options<any>}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <Select
                defaultValue={stokOlcuBirims.find((x) => x.value == stokOlcuBirim3Id)}
                placeholder="Ölçü Birim 3"
                onChange={(selected: any) => setStokOlcuBirim3Id(selected.value)}
                options={stokOlcuBirims as Options<any>}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Pay 2"
                value={olcuBr2Pay}
                onChange={(text) => setOlcuBr2Pay(text.target.valueAsNumber)}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Payda 2"
                value={olcuBr2Payda}
                onChange={(text) => setOlcuBr2Payda(text.target.valueAsNumber)}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <Select
                defaultValue={stokOlcuBirims.find((x) => x.value == stokOlcuBirim1Id.toString())}
                placeholder="Ölçü Birim 1"
                onChange={(selected: any) => setStokOlcuBirim1Id(selected.value)}
                options={stokOlcuBirims as Options<any>}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Pay 3"
                value={olcuBr3Pay}
                onChange={(text) => setOlcuBr3Pay(text.target.valueAsNumber)}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Payda 3"
                value={olcuBr3Payda}
                onChange={(text) => setOlcuBr3Payda(text.target.valueAsNumber)}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Alış Fiyatı"
                value={alisFiyati}
                onChange={(text) => setAlisFiyati(text.target.valueAsNumber)}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <Select
                defaultValue={dovizTipis.find((x) => x.value == alisDovizTipiId.toString())}
                placeholder="Ölçü Birim 1"
                onChange={(selected: any) => setAlisDovizTipiId(selected.value)}
                options={dovizTipis as Options<any>}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Satış Fiyatı"
                value={satisFiyati}
                onChange={(text) => setSatisFiyati(text.target.valueAsNumber)}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <Select
                defaultValue={dovizTipis.find((x) => x.value == satisDovizTipiId.toString())}
                placeholder="Ölçü Birim 1"
                onChange={(selected: any) => setSatisDovizTipiId(selected.value)}
                options={dovizTipis as Options<any>}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Alış KDV Oranı"
                value={alisKDVOrani}
                onChange={(text) => setAlisKDVOrani(text.target.valueAsNumber)}
              />
            </div>
            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Satış KDV Oranı"
                value={satisKDVOrani}
                onChange={(text) => setSatisKDVOrani(text.target.valueAsNumber)}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <input
                type="checkbox"
                className="form-control"
                placeholder="Seri Takibi"
                checked={seriTakibiVarMi}
                onChange={(text) => setSeriTakibiVarMi(text.target.checked)}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="En"
                value={en}
                onChange={(text) => setEn(text.target.valueAsNumber)}
              />
            </div>            
            
            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Boy"
                value={boy}
                onChange={(text) => setBoy(text.target.valueAsNumber)}
              />
            </div>            
            
            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Genişlik"
                value={genislik}
                onChange={(text) => setGenislik(text.target.valueAsNumber)}
              />
            </div>            
            
            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Ağırlık"
                value={agirlik}
                onChange={(text) => setAgirlik(text.target.valueAsNumber)}
              />
            </div>            
            
            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Asgari Stok Miktarı"
                value={asgariStokMiktari}
                onChange={(text) => setAsgariStokMiktari(text.target.valueAsNumber)}
              />
            </div>            
            
            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Azami Stok Miktarı"
                value={azamiStokMiktari}
                onChange={(text) => setAzamiStokMiktari(text.target.valueAsNumber)}
              />
            </div>            
            
            <div className="col-md-12 m-b-20">
              <input
                type="number"
                className="form-control"
                placeholder="Minimum Sipariş Miktarı"
                value={minimumSiparisMiktari}
                onChange={(text) => setMinimumSiparisMiktari(text.target.valueAsNumber)}
              />
            </div>

            <div className="col-md-12 m-b-20">
              <CreatableSelect
                placeholder="Barkodlar"
                isMulti
                value={stokBarkods}
                onChange={(items: any) =>
                  setStokBarkods(items.map((x: any) => x.value))
                }
              />
            </div>

            <div className="col-md-12 m-b-20">
              <CreatableSelect
                placeholder="SAP Kodları"
                isMulti
                value={sAPKOds}
                onChange={(items: any) =>
                  setSAPKods(items.map((x: any) => x.value))
                }
              />
            </div>
            <div className="col-md-12 m-b-20">
              <CreatableSelect
                placeholder="Hucreler"
                isMulti
                value={hucres}
                onChange={(items: any) =>
                  setHucres(items.map((x: any) => x.value))
                }
              />
            </div>

            
            {/* <div className="col-md-12 m-b-20">
              <div className="fileupload btn btn-primary btn-rounded waves-effect waves-light">
                <span>
                  <i className="ion-upload m-r-5"></i>Upload Contact Image
                </span>
                <input type="file" className="upload" />
              </div>
            </div> */}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => props.onHide && props.onHide()}
        >
          Kapat
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Kaydet
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
