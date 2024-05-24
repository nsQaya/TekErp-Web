import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Select, { Options } from "react-select";
import { FormSelectItem } from "../DynamicModal";
import api from "../../utils/api";
import CreatableSelect from "react-select/creatable";
import { IStok } from "../../utils/types/Stok/IStok";
import { IStokKartiWithDetail } from "../../utils/types";

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

  const [stokBarkods, setStokBarkods] = useState<{label: string, value: string}[]>([]);
  const [sAPKOds, setSAPKods] = useState<{label: string, value: string}[]>([]);
  const [hucres, setHucres] = useState<{label: string, value: string}[]>([]);


  const fetchItem= async(id: number)=>{
    const {data} = await api.stokWithDetail.get(id);
    if(!data.status){
      return alert(data.detail);
    }

    console.log(data);
    const item= data.value;

    setID(item.stokKarti.id as number);
    setAdi(item.stokKarti.adi);
    setKodu(item.stokKarti.kodu);
    setIngilizceIsim(item.stokKarti.ingilizceIsim);
    setStokGrupKoduId(item.stokKarti.stokGrupKoduId);
    setStokKod1Id(item.stokKarti.stokKod1Id);
    setStokKod2Id(item.stokKarti.stokKod2Id);
    setStokKod3Id(item.stokKarti.stokKod3Id);
    setStokKod4Id(item.stokKarti.stokKod4Id);
    setStokKod5Id(item.stokKarti.stokKod5Id);
    setStokOlcuBirim1Id(item.stokKarti.stokOlcuBirim1Id);
    setStokOlcuBirim2Id(item.stokKarti.stokOlcuBirim2Id);
    setOlcuBr2Pay(item.stokKarti.olcuBr2Pay);
    setOlcuBr2Payda(item.stokKarti.olcuBr2Payda);
    setStokOlcuBirim3Id(item.stokKarti.stokOlcuBirim3Id);
    setOlcuBr3Pay(item.stokKarti.olcuBr3Pay);
    setOlcuBr3Payda(item.stokKarti.olcuBr3Payda);
    setAlisDovizTipiId(item.stokKarti.alisDovizTipiId);
    setSatisDovizTipiId(item.stokKarti.satisDovizTipiId);
    setAlisFiyati(item.stokKarti.alisFiyati);
    setSatisFiyati(item.stokKarti.satisFiyati);
    setAlisKDVOrani(item.stokKarti.alisKDVOrani);
    setSatisKDVOrani(item.stokKarti.satisKDVOrani);
    setSeriTakibiVarMi(item.stokKarti.seriTakibiVarMi);
    setEn(item.stokKarti.en);
    setBoy(item.stokKarti.boy);
    setGenislik(item.stokKarti.genislik);
    setAgirlik(item.stokKarti.agirlik);
    setAsgariStokMiktari(item.stokKarti.asgariStokMiktari);
    setAzamiStokMiktari(item.stokKarti.azamiStokMiktari);
    setMinimumSiparisMiktari(item.stokKarti.minimumSiparisMiktari);

    setHucres(item.hucres.map(x=>({label: x.kodu, value: x.kodu })));
    setSAPKods(item.sAPKods.map(x=>({label: x.kod, value: x.kod })));
    setStokBarkods(item.stokBarkods.map(x=>({label: x.barkod, value: x.barkod })));
  }

  useEffect(()=>{
    if(!props.selectedItem) return;
    fetchItem(props.selectedItem.id as number);
  },[props.selectedItem]);

  useEffect(()=>{
    if(props.show) return;

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
    setStokOlcuBirim1Id(1);
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

  },[props.show])

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

  const onSubmit = useCallback(async() => {
    if(adi==""){
      return alert("ADI ZORUNLU");
    }

    const request= {
      stokKarti:{
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
      },
      hucres: hucres.map(x=>({ kodu: x.value })),
      sAPKods: sAPKOds.map(x=>({ kod: x.value })),
      stokBarkods: stokBarkods.map(x=>({ barkod: x.value, stokOlcuBirimId: stokOlcuBirim1Id })),
    } as IStokKartiWithDetail;

    if(ID){
      request.stokKarti.id= ID;
    }

    const { data } = (!ID) ? await api.stokWithDetail.create(request) : await api.stokWithDetail.update(request);

    if(!data.status){
      console.log(data);
      return alert(((data.errors && data.errors[0].Errors ) && data.errors[0].Errors[0]) || "Bir hata oldu");
    }

    if(props.onDone){
      props.onDone();
    }

  }, [ID, adi,agirlik,alisDovizTipiId,alisFiyati,alisKDVOrani,asgariStokMiktari,azamiStokMiktari,boy,en,genislik,ingilizceIsim,kodu,minimumSiparisMiktari,olcuBr2Pay,olcuBr2Payda,olcuBr3Pay,olcuBr3Payda,satisDovizTipiId,satisFiyati,satisKDVOrani,seriTakibiVarMi,stokGrupKoduId,stokKod1Id,stokKod2Id,stokKod3Id,stokKod4Id,stokKod5Id,stokOlcuBirim1Id,stokOlcuBirim2Id,stokOlcuBirim3Id, hucres, sAPKOds,stokBarkods]);

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
              <label className="form-label">Kodu</label>
              <input
                type="text"
                className="form-control"
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
              <div className="form-check mr-sm-2 mb-3">
                  <input type="checkbox" className="form-check-input" id="checkbox0" value="check" checked={seriTakibiVarMi} onChange={(text) => setSeriTakibiVarMi(text.target.checked)}/>
                  <label className="form-check-label">Seri takibi var mı ?</label>
              </div>
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
                  setStokBarkods(items)
                }
              />
            </div>

            <div className="col-md-12 m-b-20">
              <CreatableSelect
                placeholder="SAP Kodları"
                isMulti
                value={sAPKOds}
                onChange={(items: any) =>
                  setSAPKods(items)
                }
              />
            </div>

            <div className="col-md-12 m-b-20">
              <CreatableSelect
                placeholder="Hucreler"
                isMulti
                value={hucres}
                onChange={(items: any) =>
                  setHucres(items)
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
