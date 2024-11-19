import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Select, { Options } from "react-select";
import { FormSelectItem } from "../DynamicModal";
import api from "../../utils/api";
import CreatableSelect from "react-select/creatable";
import { IStok } from "../../utils/types/stok/IStok";
import { IStokKartiWithDetail } from "../../utils/types/stok/IStokKartiWithDetail";
import { IHucre } from "../../utils/types/tanimlamalar/IHucre";


interface IStokModalProps {
  show: boolean;
  selectedItem?: IStok;
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
  const [stokKod1Id, setStokKod1Id] = useState<string | null>(null);
  const [stokKod2Id, setStokKod2Id] = useState<string | null>(null);
  const [stokKod3Id, setStokKod3Id] = useState<string | null>(null);
  const [stokKod4Id, setStokKod4Id] = useState<string | null>(null);
  const [stokKod5Id, setStokKod5Id] = useState<string | null>(null);
  const [stokOlcuBirim1Id, setStokOlcuBirim1Id] = useState<string | null>(null);
  const [stokOlcuBirim2Id, setStokOlcuBirim2Id] = useState<string | null>(null);
  const [olcuBr2Pay, setOlcuBr2Pay] = useState(1);
  const [olcuBr2Payda, setOlcuBr2Payda] = useState(1);
  const [stokOlcuBirim3Id, setStokOlcuBirim3Id] = useState<string | null>(null);
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hucres, setHucres] = useState<IHucre[]>([]);


  const [stokBarkods, setStokBarkods] = useState<{ label: string; value: string }[]>([]);
  const [sapKods, setSAPKods] = useState<{ label: string; value: string }[]>([]);


  const fetchItem = async (id: number) => {
    const { data } = await api.stokWithDetail.get(id);
    if (!data.status) {
      return alert(data.detail);
    }

    console.log(data);
    const item = data.value;

    setID(item.id as number);
    setAdi(item.adi);
    setKodu(item.kodu);
    setIngilizceIsim(item.ingilizceIsim);
    setStokGrupKoduId(item.stokGrupKoduId);
    setStokKod1Id(item.stokKod1Id);
    setStokKod2Id(item.stokKod2Id);
    setStokKod3Id(item.stokKod3Id);
    setStokKod4Id(item.stokKod4Id);
    setStokKod5Id(item.stokKod5Id);
    setStokOlcuBirim1Id(item.stokOlcuBirim1Id);
    setStokOlcuBirim2Id(item.stokOlcuBirim2Id);
    setOlcuBr2Pay(item.olcuBr2Pay);
    setOlcuBr2Payda(item.olcuBr2Payda);
    setStokOlcuBirim3Id(item.stokOlcuBirim3Id);
    setOlcuBr3Pay(item.olcuBr3Pay);
    setOlcuBr3Payda(item.olcuBr3Payda);
    setAlisDovizTipiId(item.alisDovizTipiId);
    setSatisDovizTipiId(item.satisDovizTipiId);
    setAlisFiyati(item.alisFiyati);
    setSatisFiyati(item.satisFiyati);
    setAlisKDVOrani(item.alisKDVOrani);
    setSatisKDVOrani(item.satisKDVOrani);
    setSeriTakibiVarMi(item.seriTakibiVarMi);
    setEn(item.en);
    setBoy(item.boy);
    setGenislik(item.genislik);
    setAgirlik(item.agirlik);
    setAsgariStokMiktari(item.asgariStokMiktari);
    setAzamiStokMiktari(item.azamiStokMiktari);
    setMinimumSiparisMiktari(item.minimumSiparisMiktari);
    setHucres(item.hucres.map((x) => ({ kodu: x.kodu, id: Number(x.kodu) })));


    setSAPKods(item.sapKods.map((x) => ({ label: x.kod, value: x.kod })));
    setStokBarkods(item.stokBarkods.map((x) => ({ label: x.barkod, value: x.barkod })));
  };

  useEffect(() => {
    if (props.show && props.selectedItem) {
      fetchItem(props.selectedItem.id as number);
    }
  }, [props.show, props.selectedItem]);

  useEffect(() => {
    if (!props.show) {
      // Bileşen gizlendiğinde state'i temizle
      setID(undefined);
      setAdi("");
      setKodu("");
      setIngilizceIsim("");
      setStokGrupKoduId(null);
      setStokKod1Id(null);
      setStokKod2Id(null);
      setStokKod3Id(null);
      setStokKod4Id(null);
      setStokKod5Id(null);
      setStokOlcuBirim1Id("");
      setStokOlcuBirim2Id(null);
      setOlcuBr2Pay(1);
      setOlcuBr2Payda(1);
      setStokOlcuBirim3Id(null);
      setOlcuBr3Pay(1);
      setOlcuBr3Payda(1);
      setAlisDovizTipiId(1);
      setSatisDovizTipiId(1);
      setAlisFiyati(0);
      setSatisFiyati(0);
      setAlisKDVOrani(0);
      setSatisKDVOrani(0);
      setSeriTakibiVarMi(false);
      setEn(0);
      setBoy(0);
      setGenislik(0);
      setAgirlik(0);
      setAsgariStokMiktari(0);
      setAzamiStokMiktari(0);
      setMinimumSiparisMiktari(0);
      setHucres([]);
      

      setSAPKods([]);
      setStokBarkods([]);
    }
  }, [props.show]);

  const [stokGrupKodus, setStokGrupKodus] = useState<FormSelectItem[]>([]);
  const [stokKod1s, setStokKod1s] = useState<FormSelectItem[]>([]);
  const [stokKod2s, setStokKod2s] = useState<FormSelectItem[]>([]);
  const [stokKod3s, setStokKod3s] = useState<FormSelectItem[]>([]);
  const [stokKod4s, setStokKod4s] = useState<FormSelectItem[]>([]);
  const [stokKod5s, setStokKod5s] = useState<FormSelectItem[]>([]);
  const [stokOlcuBirims, setStokOlcuBirims] = useState<FormSelectItem[]>([]);
  const [dovizTipis, setDovizTipis] = useState<FormSelectItem[]>([]);
  const [hucreOpts, setHucreOpts] = useState<FormSelectItem[]>([]);

  const fetchInitals = useCallback(async () => {
    const [
      stokGrupKoduItems,
      stokKod1Items,
      stokKod2Items,
      stokKod3Items,
      stokKod4Items,
      stokKod5Items,
      stokOlcuBirimItems,
      dovizTipiItems,
      hucreItems,

    ] = await Promise.all([
      api.stokGrupKodu.getAll(0, 1000),
      api.stokKod1.getAll(0, 1000),
      api.stokKod2.getAll(0, 1000),
      api.stokKod3.getAll(0, 1000),
      api.stokKod4.getAll(0, 1000),
      api.stokKod5.getAll(0, 1000),
      api.stokOlcuBirim.getAll(0, 1000),
      api.dovizTipi.getAll(0, 1000),
      api.hucre.getAll(0, 1000)
    ]);

    setStokGrupKodus(
      stokGrupKoduItems.data.value.items.map((x) => ({ label: x.adi, value: String(x.id) }))
    );
    
    setHucreOpts(
      hucreItems.data.value.items.map((x) => ({ label: x.kodu , value: x.id.toString() }))
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
  }, [fetchInitals]);


  const onSubmit = useCallback(async () => {
    setIsSubmitted(true); // Form gönderildiğini belirle

    if (kodu.trim() === "") {
      return alert("STOK KODU ZORUNLU");
    }

    if (adi.trim() === "") {
      return alert("STOK ADI ZORUNLU");
    }
    if (ingilizceIsim.trim() === "") {
      return alert("İngilizce İsim Zorunlu");
    }
    if (!stokGrupKoduId) {
      return alert("GRUP KODU ZORUNLU"); // Grup Kodu zorunlu kontrolü
    }
    if (!hucres || hucres.length === 0) {
      return alert("Hücre Zorunlu"); // Hücre seçilmemişse hata ver
    }


    const request = {
      adi: adi,
      agirlik: agirlik,
      aktarimDurumu: 1,
      alisDovizTipiId: alisDovizTipiId,
      alisFiyati: alisFiyati,
      alisKDVOrani: alisKDVOrani,
      asgariStokMiktari: asgariStokMiktari,
      azamiStokMiktari: azamiStokMiktari,
      boy: boy,
      en: en,
      genislik: genislik,
      ingilizceIsim: ingilizceIsim,
      kodu: kodu,
      minimumSiparisMiktari: minimumSiparisMiktari,
      olcuBr2Pay: olcuBr2Pay,
      olcuBr2Payda: olcuBr2Payda,
      olcuBr3Pay: olcuBr3Pay,
      olcuBr3Payda: olcuBr3Payda,
      satisDovizTipiId: satisDovizTipiId,
      satisFiyati: satisFiyati,
      satisKDVOrani: satisKDVOrani,
      seriTakibiVarMi: seriTakibiVarMi,
      stokGrupKoduId: stokGrupKoduId,
      stokKod1Id: stokKod1Id,
      stokKod2Id: stokKod2Id,
      stokKod3Id: stokKod3Id,
      stokKod4Id: stokKod4Id,
      stokKod5Id: stokKod5Id,
      stokOlcuBirim1Id: stokOlcuBirim1Id,
      stokOlcuBirim2Id: stokOlcuBirim2Id,
      stokOlcuBirim3Id: stokOlcuBirim3Id,
      hucres: hucres,
      sapKods: sapKods.map((x) => ({ kod: x.value })),
      stokBarkods: stokBarkods.map((x) => ({ barkod: x.value, stokOlcuBirimId: stokOlcuBirim1Id })),
    } as unknown as IStokKartiWithDetail;

    if (ID) {
      request.id = ID;
    }

    const { data } = !ID ? await api.stokWithDetail.create(request) : await api.stokWithDetail.update(request);

    if (!data.status) {
      console.log(data);
      return alert((data.errors && data.errors[0].Errors && data.errors[0].Errors[0]) || "Bir hata oldu");
    }


    if (props.onDone) {
      props.onDone();
    }
  }, [
    ID,
    adi,
    agirlik,
    alisDovizTipiId,
    alisFiyati,
    alisKDVOrani,
    asgariStokMiktari,
    azamiStokMiktari,
    boy,
    en,
    genislik,
    ingilizceIsim,
    kodu,
    minimumSiparisMiktari,
    olcuBr2Pay,
    olcuBr2Payda,
    olcuBr3Pay,
    olcuBr3Payda,
    satisDovizTipiId,
    satisFiyati,
    satisKDVOrani,
    seriTakibiVarMi,
    stokGrupKoduId,
    stokKod1Id,
    stokKod2Id,
    stokKod3Id,
    stokKod4Id,
    stokKod5Id,
    stokOlcuBirim1Id,
    stokOlcuBirim2Id,
    stokOlcuBirim3Id,
    sapKods,
    stokBarkods,
    props,
    hucres,
  ]);

  return (
    <Modal show={isShowing} onHide={() => props.onHide && props.onHide()} className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <span style={{ fontWeight: "bold" }}>EKLE </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="form-horizontal form-material">
          <div className="row">
            <div className="col-lg-6">
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
              <div className="form-group">
                <label className="form-label">Stok Kodu </label>
                <input
                  type="text"
                  className={`form-control ${isSubmitted && !kodu.trim() ? 'is-invalid' : ''}`} // Kırmızı kenarlık
                  placeholder=""
                  value={kodu}
                  onChange={(text) => setKodu(text.target.value)}
                />
                {isSubmitted && !kodu.trim() && (
                  <div className="invalid-feedback">Stok kodu zorunlu.</div> // Hata mesajı
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Stok Adı</label>
                <input
                  type="text"
                  className={`form-control ${isSubmitted && !adi.trim() ? 'is-invalid' : ''}`} // Kırmızı kenarlık
                  placeholder=""
                  value={adi}
                  onChange={(text) => setAdi(text.target.value)}
                />
                {isSubmitted && !adi.trim() && (
                  <div className="invalid-feedback">Stok adı zorunlu.</div> // Hata mesajı
                )}
              </div>

              <div className="form-group">
                <label className="form-label">İngilizce Adı</label>
                <input
                  type="text"
                  className={`form-control ${isSubmitted && !ingilizceIsim.trim() ? 'is-invalid' : ''}`}
                  placeholder=""
                  value={ingilizceIsim}
                  onChange={(text) => setIngilizceIsim(text.target.value)}
                />
                {isSubmitted && !ingilizceIsim.trim() && (
                  <div className="invalid-feedback">İngilizce Adı Zorunlu</div> // Hata mesajı
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Alış KDV Oranı</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder=""
                  value={alisKDVOrani < 0 ? 0 : alisKDVOrani}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setAlisKDVOrani(newValue < 0 ? 0 : newValue);
                  }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Satış KDV Oranı</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder=""
                  value={satisKDVOrani < 0 ? 0 : satisKDVOrani}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setSatisKDVOrani(newValue < 0 ? 0 : newValue);
                  }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
            </div>
            <div className="col-lg-6 m-b-50">
              <div className="col-lg-12 m-b-20">
                <label className="form-label"> </label>
                <Select
                  value={stokOlcuBirims.find((x) => x.value == stokOlcuBirim1Id)}
                  placeholder="Ölçü Birim 1"
                  onChange={(selected) => setStokOlcuBirim1Id(selected ? selected.value : null)}
                  isClearable
                  options={stokOlcuBirims}
                />
              </div>

              <div className="col-lg-12 m-b-20">
                <label className="form-label"> </label>
                <Select
                  value={stokOlcuBirims.find((x) => x.value == stokOlcuBirim2Id)}
                  placeholder="Ölçü Birim 2"
                  onChange={(selected) => setStokOlcuBirim2Id(selected ? selected.value : null)}
                  isClearable
                  options={stokOlcuBirims}
                />
              </div>
              <div className="col-lg-12 m-b-20">
                <label className="form-label"> </label>
                <Select
                  value={stokOlcuBirims.find((x) => x.value == stokOlcuBirim3Id)}
                  placeholder="Ölçü Birim 3"
                  onChange={(selected) => setStokOlcuBirim3Id(selected ? selected.value : null)}
                  isClearable
                  options={stokOlcuBirims}
                />
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-lg-12">
                    <label className="form-label"> </label>
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label"> </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="Pay 2"
                      value={olcuBr2Pay}
                      onChange={(text) => setOlcuBr2Pay(text.target.valueAsNumber)}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    />
                  </div>
                  <div className="col-lg-6">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="Payda 2"
                      value={olcuBr2Payda}
                      onChange={(text) => setOlcuBr2Payda(text.target.valueAsNumber)}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}

                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-lg-12">
                    <label className="form-label"> </label>
                  </div>
                  <div className="col-lg-6">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="Pay 3"
                      value={olcuBr3Pay}
                      onChange={(text) => setOlcuBr3Pay(text.target.valueAsNumber)}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    />
                  </div>
                  <div className="col-lg-6">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="Payda 3"
                      value={olcuBr3Payda}
                      onChange={(text) => setOlcuBr3Payda(text.target.valueAsNumber)}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 m-b-20">
              <label >Grup Kodu </label>
              <Select
                value={stokGrupKodus.find((x) => x.value == stokGrupKoduId) || null}
                placeholder=""
                onChange={(selected: any) => setStokGrupKoduId(selected.value)}
                options={stokGrupKodus as Options<any>}
              />
            </div>
            <div className="col-lg-6 m-b-20">
              <label>Kod 1</label>
              <Select
                value={stokKod1s.find((x) => x.value === stokKod1Id) || null}
                onChange={(selected) => setStokKod1Id(selected ? selected.value : null)}
                options={stokKod1s}
                placeholder=""
                isClearable
              />
            </div>

            <div className="col-lg-6 m-b-20">
              <label>Kod 2</label>
              <Select
                value={stokKod2s.find((x) => x.value === stokKod2Id) || null}
                onChange={(selected) => setStokKod2Id(selected ? selected.value : null)}
                options={stokKod2s}
                placeholder=""
                isClearable
              />
            </div>

            <div className="col-lg-6 m-b-20">
              <label>Kod 3</label>
              <Select
                value={stokKod3s.find((x) => x.value === stokKod3Id) || null}
                onChange={(selected) => setStokKod3Id(selected ? selected.value : null)}
                options={stokKod3s}
                placeholder=""
                isClearable
              />
            </div>

            <div className="col-lg-6 m-b-20">
              <label>Kod 4</label>
              <Select
                value={stokKod4s.find((x) => x.value === stokKod4Id) || null}
                onChange={(selected) => setStokKod4Id(selected ? selected.value : null)}
                options={stokKod4s}
                placeholder=""
                isClearable
              />
            </div>

            <div className="col-lg-6 m-b-20">
              <label>Kod 5</label>
              <Select
                value={stokKod5s.find((x) => x.value === stokKod5Id) || null}
                onChange={(selected) => setStokKod5Id(selected ? selected.value : null)}
                options={stokKod5s}
                placeholder=""
                isClearable
              />
            </div>
            <div className="row">
              <div className="col-lg-6 m-b-20">
                <label className="form-label">Alış Fiyatı</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder=""
                  value={alisFiyati < 0 ? 0 : alisFiyati}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setAlisFiyati(newValue < 0 ? 0 : newValue);
                  }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
              <div className="col-lg-6 m-b-20">
                <div className="col-lg-12">
                  <label className="form-label"> </label>
                </div>
                <Select
                  value={dovizTipis.find((x) => x.value == String(alisDovizTipiId))}
                  placeholder="Alış Döviz"
                  onChange={(selected: any) => setAlisDovizTipiId(selected.value)}
                  options={dovizTipis as Options<any>}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6 m-b-20">
                <label className="form-label">Satış Fiyatı</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder=""
                  value={satisFiyati < 0 ? 0 : satisFiyati}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setSatisFiyati(newValue < 0 ? 0 : newValue);
                  }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
              <div className="col-lg-6 m-b-50">
                <div className="col-lg-12">
                  <label className="form-label"> </label>
                </div>
                <Select
                  value={dovizTipis.find((x) => x.value == String(satisDovizTipiId))}
                  placeholder="Satış Döviz"
                  onChange={(selected: any) => setSatisDovizTipiId(selected.value)}
                  options={dovizTipis as Options<any>}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 m-b-20">
                <label className="form-label">En</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder=""
                  value={en < 0 ? 0 : en}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setEn(newValue < 0 ? 0 : newValue);
                  }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
              <div className="col-lg-6 m-b-20">
                <label className="form-label">Boy</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder=""
                  value={boy < 0 ? 0 : boy}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setBoy(newValue < 0 ? 0 : newValue);
                  }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 m-b-20">
                <label className="form-label">Genişlik</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder=""
                  value={genislik < 0 ? 0 : genislik}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setGenislik(newValue < 0 ? 0 : newValue);
                  }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
              <div className="col-lg-6 m-b-20">
                <label className="form-label">Ağırlık</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder=""
                  value={agirlik < 0 ? 0 : agirlik}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setAgirlik(newValue < 0 ? 0 : newValue);
                  }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 m-b-20">
                <label className="form-label">Asgari Stok Miktarı</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder=""
                  value={asgariStokMiktari < 0 ? 0 : asgariStokMiktari}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setAsgariStokMiktari(newValue < 0 ? 0 : newValue);
                  }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
              <div className="col-lg-6 m-b-20">
                <label className="form-label">Azami Stok Miktarı</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder=""
                  value={azamiStokMiktari < 0 ? 0 : azamiStokMiktari}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setAzamiStokMiktari(newValue < 0 ? 0 : newValue);
                  }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 m-b-20">
                <label className="form-label">Minimum Sipariş Miktarı</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder=""
                  value={minimumSiparisMiktari < 0 ? 0 : minimumSiparisMiktari}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setMinimumSiparisMiktari(newValue < 0 ? 0 : newValue);
                  }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
              <div className="col-lg-6 m-b-20">
                <div className="form-check mr-sm-2 mb-3">
                  <div className="col-lg-12">
                    <label className="form-label"> </label>
                  </div>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="checkbox0"
                    value="check"
                    checked={seriTakibiVarMi}
                    onChange={(text) => setSeriTakibiVarMi(text.target.checked)}
                  />
                  <label className="form-check-label">Seri takibi var mı ?</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 m-b-20">
                <CreatableSelect
                  placeholder="Barkodlar"
                  isMulti
                  value={stokBarkods}
                  onChange={(items: any) => setStokBarkods(items)}
                />
              </div>
              <div className="col-lg-4 m-b-20">
                <CreatableSelect
                  placeholder="SAP Kodları"
                  isMulti
                  value={sapKods}
                  onChange={(items: any) => setSAPKods(items)}
                />
              </div>
              <div className="col-lg-4 m-b-20">
                <Select
                  isMulti
                  value={hucreOpts.filter((x) => hucres.some(h => h.kodu === x.label))}  // Seçili hücreleri filtreliyoruz
                  placeholder="Hücre"
                  onChange={(selected: any) => {
                    const selectedValues = selected ? selected.map((item: any) => ({ kodu: item.label, id: item.value })) : [];
                    setHucres(selectedValues); // Hücreleri seçtiğinizde state güncelleniyor
                  }}
                  options={hucreOpts}  // Tüm seçenekler burada
                />
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.onHide && props.onHide()}>
          Kapat
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Kaydet
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
