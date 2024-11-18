import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import IsEmriRehberDialog from "../../components/Rehber/IsEmriRehberDialog";
import { Button } from "primereact/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { INetsisUretimSonuKaydi } from "../../utils/types/uretim/INetsisUretimSonuKaydi";
import api from "../../utils/api";
import { Toast } from "primereact/toast";
import DepoRehberDialog from "../../components/Rehber/DepoRehberDialog";
import StokRehberDialog from "../../components/Rehber/StokRehberDialog";
import { InputNumber } from "primereact/inputnumber";
import ProjeRehberDialog from "../../components/Rehber/ProjeRehberDialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import StokHareketGirisSeriModal from "../stok/stokHareketGirisSeriModal";
import { IStokHareketSeri } from "../../utils/types/stok/IStokHareketSeri";
import { IStokSeriBakiye } from "../../utils/types/stok/IStokSeriBakiye";
import { useNavigate } from "react-router-dom";
import { INetsisUretimSonuKaydiIsEmriRecete } from "../../utils/types/uretim/INetsisUretimSonuKaydiIsEmriRecete";

// // Grid verileri için bir tip tanımı
// type GridData = {
//   id:number,
//   mamulKodu:string,
//   hammaddeKodu:string,
//   hammaddeAdi:string,
//   miktar:number,
//   //depoBakiye:number, sonradan bundan vazgeçti
// };

const netsisUretimSonuKaydi = () => {

  //Rehberlerin görünürlük durumu
  const [dialogVisible, setDialogVisible] = useState({
    isEmriNo: false,
    girisDepo: false,
    cikisDepo: false,
    stok: false,
    proje: false,
  });

  const [loadingGetir, setLoadingGetir] = useState(false);
  const navigate = useNavigate();

  const toast = useRef<Toast>(null);

  const [tempStokKodu, setTempStokKodu] = useState<string | undefined>("");
  const [tempIsEmriNo, setTempIsEmriNo] = useState("");

  const [stokHareketGirisSeriModalVisible, setStokHareketGirisSeriModalVisible] = useState<boolean>(false);
  const [seciliSeriler, setSeciliSeriler] = useState<IStokHareketSeri[]>([]);
    // Seri ekleme işlemi
    const handleSeriAdd = (seriler: IStokHareketSeri[]) => {
      setSeciliSeriler(seriler); // Eklenen serileri state'e kaydet
      setNetsisUretimSonuKaydiData((prevState) => ({
        ...prevState,
        Seri:seriler
      }));
    };

  //Netsis üretim sonu kaydı Data işlemleri başlangıç
  const [netsisUretimSonuKaydiData, setNetsisUretimSonuKaydiData] =
    useState<INetsisUretimSonuKaydi>({
      id: 0,
      isEmriNo: "",
      stokKartiId: 0,
      stokKarti: undefined,
      miktar: 0,
      projeId: 0,
      proje: undefined,
      uretimYapanUserId: "",
      aciklama: "",
      girisDepo: undefined,
      cikisDepo: undefined,
      otoYariMamulStokKullan: false,
    });
  // const clearNetsisUretimSonuKaydiData = () => {
  //   setNetsisUretimSonuKaydiData((prevData) => ({
  //     ...prevData,
  //     id: 0,
  //     isEmriNo: "",
  //     stokKartiId: 0,
  //     stokKarti: undefined,
  //     miktar: 0,
  //     projeId: 0,
  //     proje: undefined,
  //     uretimYapanUserId: "",
  //     aciklama: "",
  //     girisDepo: undefined,
  //     cikisDepo: undefined,
  //     otoYariMamulStokKullan: false,
  //     aktarimDurumu: EAktarimDurumu.AktarimSirada,
  //   }));
  //   setTempStokKodu(undefined);
  // };
  //Netsis üretim sonu kaydı Data işlemleri bitiş

  //stokgetirme mevzusu
  const handleStokGetir = useCallback(async (stokKodu: string | undefined) => {
    setSeciliSeriler([]);
    if (stokKodu) {
      const response = await api.stok.getByKod(stokKodu);


      if (response?.data?.status && response?.data?.value) {
        const stokKarti = response.data.value;

        //setSelectedOlcuBirim(options[0]); // İlk değeri seçili yapabilirsiniz

        setNetsisUretimSonuKaydiData((prevState) => ({
          ...prevState,
          stokKarti: stokKarti,
          stokKartiId: stokKarti.id!,
          Seri:undefined
        }));
      } else {
        setNetsisUretimSonuKaydiData((prevState) => ({
          ...prevState,
          stokKarti: undefined,
          stokKartiId: 0,
          Seri:undefined
        }));
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Stok Bulunamadı",
          life: 3000,
        });
      }
    }
  }, []);

  const handleUretimYapanKullaniciGetir = useCallback(
    async (uretimYapanKullaniciId: string | undefined) => {
      if (uretimYapanKullaniciId) {
        const response = await api.kullanici.getByKod(uretimYapanKullaniciId);

        if (response?.data?.status && response?.data?.value) {
          const uretimYapanKullaniciResponse = response.data.value;

          //setSelectedOlcuBirim(options[0]); // İlk değeri seçili yapabilirsiniz

          setNetsisUretimSonuKaydiData((prevState) => ({
            ...prevState,
            uretimYapanUserId: uretimYapanKullaniciResponse.id!,
            uretimYapanUser: uretimYapanKullaniciResponse,
          }));
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Hata",
            detail: "Kullanıcı Bulunamadı",
            life: 3000,
          });
        }
      }
    },
    []
  );

  const clearUretimYapanKullaniciSelection = () => {
    setNetsisUretimSonuKaydiData((prevState) => ({
      ...prevState,
      uretimYapanUser: undefined,
      uretimYapanUserId: "",
    }));
  };

  const handleProjeGetir = useCallback(async (projeKodu: string) => {
    const response = await api.proje.getByKod(projeKodu);

    if (response?.data?.status && response?.data?.value) {
      const projeResponse = response.data.value;
      setNetsisUretimSonuKaydiData((prevState) => ({
        ...prevState,
        proje: projeResponse,
        projeId: projeResponse.id!,
      }));
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Proje Bulunamadı",
        life: 3000,
      });
    }
  }, []);

  const handleStokOtomatikSeriGetir = useCallback(async (stokKodu: string, miktar:number): Promise<IStokSeriBakiye[]> => {
    try {
      debugger;
      if(!netsisUretimSonuKaydiData.stokKarti?.seriGirisOtomatikMi)
        return [];
      if(netsisUretimSonuKaydiData.miktar<=0)
        return [];
      
      const response = await api.stokSeriBakiye.getListOtomatikSeriByStokKodu(stokKodu,miktar);
  
      if (response?.data?.value && response?.data?.value.items) {
        const seriResponse = response.data.value.items;
        return seriResponse; // API'den dönen seri numarası
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Seri Bulunamadı",
          life: 3000,
        });
        return []; // Hata durumunda boş string döndürüyoruz
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Seri alınırken bir hata oluştu",
        life: 3000,
      });
      return []; // Hata durumunda boş string döndürüyoruz
    }
  }, [netsisUretimSonuKaydiData]);
  

  const handleIsEmriNoGetir = useCallback(async () => {
    if (tempIsEmriNo && tempIsEmriNo.length==15) {
      const response = await api.isEmri.getByKod(tempIsEmriNo);

      if (response?.data?.status && response?.data?.value) {
        const isEmriResponse = response.data.value;

        setNetsisUretimSonuKaydiData((prevState) => ({
          ...prevState,
          isEmriNo: isEmriResponse.isEmriNo,
          miktar: isEmriResponse.miktar,
          girisDepo:isEmriResponse.girisDepo,
          cikisDepo:isEmriResponse.cikisDepo
        }));

        handleProjeGetir(response.data.value.projeKodu);
        setTempStokKodu(response.data.value.stokKodu);
        handleStokGetir(response.data.value.stokKodu);
      }
    } else {
      setNetsisUretimSonuKaydiData((prevState) => ({
        ...prevState,
        isEmriNo: "",
        miktar: 0,
        girisDepo:undefined,
        cikisDepo:undefined,
        stokKarti:undefined,
        stokKartiId:0,
        proje:undefined,
        projeId:0

      }));
      setTempStokKodu("");
    }
  }, [tempIsEmriNo]);

  // tempCariKodu değiştiğinde handleCariGetir fonksiyonunu çağır
  useEffect(() => {
    //if (tempIsEmriNo.length===15)
    handleIsEmriNoGetir();
  }, [tempIsEmriNo, handleIsEmriNoGetir]);

  const clearStokKartiSelection = () => {
    setTempStokKodu("");
    setNetsisUretimSonuKaydiData((prevState) => ({
      ...prevState,
      stokKarti: undefined,
      stokKartiId: 0,
    }));
  };

  const [gridData, setGridData] = useState<INetsisUretimSonuKaydiIsEmriRecete[]>([]);

  const validateSave = () => {
    if (!netsisUretimSonuKaydiData?.stokKartiId) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Stok Kartı hatalı...",
        life: 3000,
      });
      return false;
    }
    if (!netsisUretimSonuKaydiData?.girisDepo) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Giriş Depo hatalı...",
        life: 3000,
      });
      return false;
    }
    if (!netsisUretimSonuKaydiData?.cikisDepo) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Çıkış Depo hatalı...",
        life: 3000,
      });
      return false;
    }
    if (!netsisUretimSonuKaydiData?.proje) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Proje hatalı...",
        life: 3000,
      });
      return false;
    }
    if (!netsisUretimSonuKaydiData?.miktar && netsisUretimSonuKaydiData?.miktar<=0) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Miktar hatalı...",
        life: 3000,
      });
      return false;
    }
    if (!netsisUretimSonuKaydiData?.uretimYapanUser) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Üretim yapan kullanıcı hatalı...",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const handleReceteGetir = async () => {
    if (!validateGetir()) {
      return;
    }

    setLoadingGetir(true);

    try {
      const response = await api.netsisUretimSonuKaydiIsEmriRecete.getAll(
        netsisUretimSonuKaydiData.isEmriNo!
      );

      if (response.data.value && response.data.value.count > 0) {

        const data = response.data.value;
    
        const newGridData: INetsisUretimSonuKaydiIsEmriRecete[] = data.items.map((item, index) => ({
          id: index +1 ,
          mamuL_KODU:item.mamuL_KODU,
          haM_KODU:item.haM_KODU,
          bileseN_ISIM:item.bileseN_ISIM,
          miktar:item.miktar
        }));

        setGridData(newGridData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingGetir(false);
    }
  };

  const validateGetir = () => {
    if (!netsisUretimSonuKaydiData.isEmriNo) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "İş Emri hatalı...",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const [miktarInvalid, setMiktarInvalid] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);
  
  useEffect(() => {
    const toplamSeriMiktar = netsisUretimSonuKaydiData.Seri?.reduce(
      (acc, seri) => acc + seri.miktar,
      0
    );

    // Miktar ile seri toplam miktarı aynı değilse invalid durumu true olacak
    setMiktarInvalid(
      toplamSeriMiktar !== undefined && toplamSeriMiktar !== netsisUretimSonuKaydiData.miktar
    );
  }, [netsisUretimSonuKaydiData.miktar, netsisUretimSonuKaydiData.Seri]);

    //apiye kaydetme isteği gönderimi
    const handleSave = useCallback(async () => {
      if (!validateSave()) {
        return;
      }
      setSaveLoading(true);
      try {
        const saveData: INetsisUretimSonuKaydi = {
          //SaveTalepTeklifDto
         isEmriNo:netsisUretimSonuKaydiData.isEmriNo,
         stokKartiId:netsisUretimSonuKaydiData.stokKartiId,
         miktar:netsisUretimSonuKaydiData.miktar,
         projeId:netsisUretimSonuKaydiData.projeId,
         uretimYapanUserId:netsisUretimSonuKaydiData.uretimYapanUserId,
         aciklama:netsisUretimSonuKaydiData.aciklama,
         girisDepo:netsisUretimSonuKaydiData.girisDepo,
         cikisDepo:netsisUretimSonuKaydiData.cikisDepo,
         otoYariMamulStokKullan:netsisUretimSonuKaydiData.otoYariMamulStokKullan,
         Seri:netsisUretimSonuKaydiData.Seri
        }
          // API'ye tek seferde gönderim
        const response = await api.netsisUretimSonuKaydi.create(saveData);
  
        if (!response.data.status) {
          throw new Error(
            (
              Object.entries(response.data.errors || {})
              .map(([key, messages]) => `${key}: ${messages.join(", ")}`)
              .join("\n")
             ) ||
             response.data.detail ||
              "Veriler kaydedilirken bir hata oluştu."
          );
        }
        navigate(`/uretim/netsisUretimSonuKaydiListe`);
  
        // Başarılı durum mesajı
        toast.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "Veriler başarıyla kaydedildi",
          life: 3000,
        });

      } catch (error: any) {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: error.message || "Veriler kaydedilemedi",
          life: 3000,
        });
        console.error("Error saving data:", error);
      } finally {
        setSaveLoading(false);
      }
    }, [netsisUretimSonuKaydiData]);


  return (
    <div className="container-fluid">
      <Toast ref={toast} />
      <div className="p-fluid p-formgrid p-grid">
        {/* {JSON.stringify(seciliSeriler)} */}
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="isEmriNo">İş Emri No</label>
              <div className="p-inputgroup">
                <InputText
                  autoComplete="off"
                  id="isEmriNo"
                  name="isEmriNo"
                  value={tempIsEmriNo}
                  //readOnly
                  onChange={(e) => {
                    setTempIsEmriNo(e.target.value);
                    //handleIsEmriNoGetir();
                  }}
                />
                {tempIsEmriNo && (
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label=""
                    outlined
                    onClick={() => setTempIsEmriNo("")}
                  />
                )}
                <Button
                  icon="pi pi-search"
                  onClick={() =>
                    setDialogVisible({ ...dialogVisible, isEmriNo: true })
                  }
                />
                <IsEmriRehberDialog
                  isVisible={dialogVisible.isEmriNo}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, isEmriNo: false })
                  }
                  onSelect={(selectedValue) => {
                    setTempIsEmriNo(selectedValue.isEmriNo);
                    setTempStokKodu(selectedValue.stokKodu);
                    handleStokGetir(selectedValue.stokKodu);
                  }}
                />
              </div>
            </FloatLabel>
          </div>

          <div className="col-lg-2 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="girisDepo">Giriş Depo</label>
              <div className="p-inputgroup">
                <InputText
                  autoComplete="off"
                  id="girisDepo"
                  name="girisDepo"
                  value={
                    netsisUretimSonuKaydiData.girisDepo
                      ? netsisUretimSonuKaydiData.girisDepo.toString()
                      : ""
                  }
                  readOnly
                  onChange={(e) => {
                    setNetsisUretimSonuKaydiData((prevState) => ({
                      ...prevState,
                      girisDepo: Number(e.target.value),
                    }));
                  }}
                />
                {netsisUretimSonuKaydiData.girisDepo && (
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label=""
                    outlined
                    onClick={() =>
                      setNetsisUretimSonuKaydiData((prevState) => ({
                        ...prevState,
                        girisDepo: undefined,
                      }))
                    }
                  />
                )}
                <Button
                  icon="pi pi-search"
                  onClick={() =>
                    setDialogVisible({ ...dialogVisible, girisDepo: true })
                  }
                />
                <DepoRehberDialog
                  isVisible={dialogVisible.girisDepo}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, girisDepo: false })
                  }
                  onSelect={(selectedValue) => {
                    setNetsisUretimSonuKaydiData((prevState) => ({
                      ...prevState,
                      girisDepo: Number(selectedValue.kodu),
                    }));
                  }}
                />
              </div>
            </FloatLabel>
          </div>
          <div className="col-lg-2 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="cikisDepo">Çıkış Depo</label>
              <div className="p-inputgroup">
                <InputText
                  autoComplete="off"
                  id="cikisDepo"
                  name="cikisDepo"
                  value={
                    netsisUretimSonuKaydiData.cikisDepo
                      ? netsisUretimSonuKaydiData.cikisDepo.toString()
                      : ""
                  }
                  readOnly
                  onChange={(e) => {
                    setNetsisUretimSonuKaydiData((prevState) => ({
                      ...prevState,
                      cikisDepo: Number(e.target.value),
                    }));
                  }}
                />
                {netsisUretimSonuKaydiData.cikisDepo && (
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label=""
                    outlined
                    onClick={() =>
                      setNetsisUretimSonuKaydiData((prevState) => ({
                        ...prevState,
                        cikisDepo: undefined,
                      }))
                    }
                  />
                )}
                <Button
                  icon="pi pi-search"
                  onClick={() =>
                    setDialogVisible({ ...dialogVisible, cikisDepo: true })
                  }
                />
                <DepoRehberDialog
                  isVisible={dialogVisible.cikisDepo}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, cikisDepo: false })
                  }
                  onSelect={(selectedValue) => {
                    setNetsisUretimSonuKaydiData((prevState) => ({
                      ...prevState,
                      cikisDepo: Number(selectedValue.kodu),
                    }));
                  }}
                />
              </div>
            </FloatLabel>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="projeId">Proje Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  autoComplete="off"
                  id="projeId"
                  name="projeId"
                  value={
                    netsisUretimSonuKaydiData.proje
                      ? netsisUretimSonuKaydiData.proje.kodu
                      : ""
                  }
                  readOnly
                  onChange={(e) => {
                    handleProjeGetir(e.target.value);
                  }}
                />
                {netsisUretimSonuKaydiData.proje && (
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label=""
                    outlined
                    onClick={() =>
                      setNetsisUretimSonuKaydiData((prevState) => ({
                        ...prevState,
                        proje: undefined,
                        projeId: 0,
                      }))
                    }
                  />
                )}
                <Button
                  icon="pi pi-search"
                  onClick={() =>
                    setDialogVisible({ ...dialogVisible, proje: true })
                  }
                />
                <ProjeRehberDialog
                  isVisible={dialogVisible.proje}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, proje: false })
                  }
                  onSelect={(selectedValue) => {
                    handleProjeGetir(selectedValue.kodu);
                  }}
                />
              </div>
            </FloatLabel>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="stokKodu">Stok Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  //ref={stokKoduInputRef}
                  invalid={netsisUretimSonuKaydiData.stokKarti?false:true}
                  autoComplete="off"
                  id="stokKodu"
                  name="stokKodu"
                  value={tempStokKodu}
                  onChange={(e) => setTempStokKodu(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Tab") {
                      handleStokGetir(tempStokKodu);
                    }
                  }}
                />
                {netsisUretimSonuKaydiData.stokKarti && (
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label=""
                    outlined
                    onClick={() => clearStokKartiSelection()}
                  />
                )}
                <Button
                  icon="pi pi-search"
                  //label="..."
                  onClick={() =>
                    setDialogVisible({ ...dialogVisible, stok: true })
                  }
                />
                <StokRehberDialog
                  isVisible={dialogVisible.stok}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, stok: false })
                  }
                  onSelect={(selectedValue) => {
                    setTempStokKodu(selectedValue.kodu);
                    handleStokGetir(selectedValue.kodu);
                  }}
                />
              </div>
            </FloatLabel>
            <InputText
              id="stokKartiId"
              name="stokKartiId"
              value={netsisUretimSonuKaydiData?.stokKartiId?.toString()}
              type="hidden"
              autoComplete="off"
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <InputText
              id="stokAdi"
              name="stokAdi"
              value={
                netsisUretimSonuKaydiData.stokKarti
                  ? netsisUretimSonuKaydiData.stokKarti.adi
                  : ""
              }
              readOnly
              autoComplete="off"
            />
          </div>
          <div className="col-lg-2 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="miktar">Miktar</label>
              <InputNumber
                id="miktar"
                name="miktar"
                value={netsisUretimSonuKaydiData.miktar}
                min={0}
                invalid={miktarInvalid} 
                minFractionDigits={0}
                maxFractionDigits={4}
                onChange={(e) =>
                  setNetsisUretimSonuKaydiData((state) => ({
                    ...state,
                    miktar: Number(e.value),
                  }))
                }
                onBlur={(e) => 

                  {
                    if(Number(e.target.value)>0 && netsisUretimSonuKaydiData.stokKarti?.seriTakibiVarMi)
                    {
                    setStokHareketGirisSeriModalVisible(true)
                    }

                  }
                }
                inputStyle={{ textAlign: "right" }}
              />
            </FloatLabel>
            <StokHareketGirisSeriModal
              visible={stokHareketGirisSeriModalVisible}
              onHide={() => setStokHareketGirisSeriModalVisible(false)}
              onSeriAdd={handleSeriAdd}
              toplamMiktar={netsisUretimSonuKaydiData.miktar}
              SeriGirisOtomatikMi={netsisUretimSonuKaydiData.stokKarti ? netsisUretimSonuKaydiData.stokKarti.seriGirisOtomatikMi : false}
              SeriMiktarKadarMi={netsisUretimSonuKaydiData.stokKarti ? netsisUretimSonuKaydiData.stokKarti.seriMiktarKadarMi : false}
              fetchSeriFromAPI={
                ()=> handleStokOtomatikSeriGetir(
                  netsisUretimSonuKaydiData.stokKarti ? netsisUretimSonuKaydiData.stokKarti.kodu : "",
                  netsisUretimSonuKaydiData.miktar
                )
              }
              seciliSeriler={seciliSeriler} 
            />
          </div>
          <div className="col-lg-2 col-md-6 col-sm-12 mt-4">
          <Button
            label="Getir"
            icon="pi pi-refresh"
            onClick={handleReceteGetir}
          />
        </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="uretimYapanUserId">Üretim Yapan Kullanıcı</label>
              <div className="p-inputgroup">
                <InputText
                  //ref={stokKoduInputRef}
                  autoComplete="off"
                  id="uretimYapanUserId"
                  name="uretimYapanUserId"
                  value={netsisUretimSonuKaydiData.uretimYapanUserId}
                  onChange={(e) =>
                    setNetsisUretimSonuKaydiData((state) => ({
                      ...state,
                      uretimYapanUserId: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Tab") {
                      handleUretimYapanKullaniciGetir(
                        netsisUretimSonuKaydiData.uretimYapanUserId
                      );
                    }
                  }}
                />
                {netsisUretimSonuKaydiData.uretimYapanUserId && (
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label=""
                    outlined
                    onClick={() => clearUretimYapanKullaniciSelection()}
                  />
                )}
              </div>
            </FloatLabel>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <InputText
              id="uretimYapanUserName"
              name="uretimYapanUserIdName"
              value={
                netsisUretimSonuKaydiData.uretimYapanUser
                  ? netsisUretimSonuKaydiData.uretimYapanUser?.firstName +
                    " " +
                    netsisUretimSonuKaydiData.uretimYapanUser?.lastName
                  : ""
              }
              readOnly
              autoComplete="off"
              style={{ width: "100%" }}
            />
          </div>

          {/* <div className="col-lg-4 col-md-12 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="aciklama">Açıklama</label>
              <div className="p-inputgroup">
                <InputText
                  //ref={stokKoduInputRef}
                  autoComplete="off"
                  id="aciklama"
                  name="aciklama"
                  value={netsisUretimSonuKaydiData.aciklama}
                  onChange={(e) =>
                    setNetsisUretimSonuKaydiData((state) => ({
                      ...state,
                      aciklama: e.target.value,
                    }))
                  }
                />
              </div>
            </FloatLabel>
          </div> */}
        </div>
        <div className="p-col-12  mt-3">
          <Button
            label="Kaydet"
            icon="pi pi-plus"
             onClick={handleSave}
             loading={saveLoading}
             
          />
        </div>
        <div className="p-col-12">
          <DataTable
            size="small"
            stripedRows
            value={gridData}
            rows={100}
            loading={loadingGetir}
            dataKey="id"
            scrollable
            scrollHeight="480px"
            emptyMessage="Kayıt yok."
            // rowClassName={(rowData) => {
            //   if (rowData.miktar === rowData.istenilenMiktar) {
            //     return "green-row";
            //   } else if (rowData.miktar > 0 && rowData.miktar < rowData.istenilenMiktar) {
            //     return "yellow-row";
            //   } else {
            //     return "";
            //   }
            // }}
            virtualScrollerOptions={{ itemSize: 46 }}
          >
            <Column field="id" header="#" />
            <Column field="mamuL_KODU" header="Mamul Kodu"/>
            <Column field="haM_KODU" header="Hammadde Kodu" />
            <Column field="bileseN_ISIM" header="Hammadde Adı" />
            <Column field="miktar" header="Miktar" />
            {/* <Column field="depoBakiye" header="Depo Bakiye" /> */}
            
          </DataTable>
        </div>
      </div>
    </div>
  );
};
export default netsisUretimSonuKaydi;
