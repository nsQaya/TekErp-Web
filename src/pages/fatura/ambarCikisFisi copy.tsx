import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FloatLabel } from "primereact/floatlabel";
import StokRehberDialog from "../../components/Rehber/StokRehberDialog";
import { Dropdown } from "primereact/dropdown";
import ProjeRehberDialog from "../../components/Rehber/ProjeRehberDialog";
import UniteRehberDialog from "../../components/Rehber/UniteRehberDialog";

import { InputNumber } from "primereact/inputnumber";
import { transformFilter } from "../../utils/transformFilter";
import api from "../../utils/api";
import { Checkbox } from "primereact/checkbox";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useSearchParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { EAmbarHareketTur } from "../../utils/types/enums/EAmbarHareketTur";
import { EAmbarFisiCikisYeri } from "../../utils/types/enums/EAmbarFisiCikisYeri";
import { EBelgeTip } from "../../utils/types/enums/EBelgeTip";
import { IAmbarFisi } from "../../utils/types/fatura/IAmbarFisi";
import { IStokHareket } from "../../utils/types/fatura/IStokHareket";
import { IBelgeSeri } from "../../utils/types/tanimlamalar/IBelgeSeri";

// Form verileri için bir tip tanımı
type FormDataBaslik = {
  seri: string;
  numara: string;
  tarih: Date;
  hareketTuru: EAmbarHareketTur;
  cikisYeri: number;
  cikisYeriKoduId: number;
  cikisYeriKodu?: string;
  aciklama1?: string;
  aciklama2?: string;
  aciklama3?: string;
  eIrsaliye?: boolean;
};

type FormDataDetay = {
  projeKoduId: number;
  projeKodu?: string;
  uniteKoduId: number;
  uniteKodu?: string;
  ozelKod1Id?: number;
  ozelKod1?: string;
  stokKartiId: number;
  stokKodu: string;
  stokAdi?: string;
  miktar: number;
  istenilenMiktar?: number;
  fiyat?: number;
  hucreKoduId: number;
  hucreKodu: string;
  bakiye?: number;
  olcuBrId: number;
  olcuBr: string;
};

// Grid verileri için bir tip tanımı
type GridData = {
  id?: number;
  stokKartiId: number;
  stokKodu: string;
  stokAdi?: string;
  miktar: number;
  istenilenMiktar: number;
  fiyat: number;
  hucreKoduId?: number;
  hucreKodu?: string;
  bakiye?: number;
  olcuBirimId: number;
  olcuBr?: string;
};

const App = () => {
  const currentDate = new Date();
  currentDate.setHours(3, 0, 0, 0);

  const [formDataBaslik, setFormDataBaslik] = useState<FormDataBaslik>({
    seri: "",
    numara: "",
    tarih: currentDate,
    hareketTuru: EAmbarHareketTur.Devir,
    cikisYeri: EAmbarFisiCikisYeri.StokKodu,
    cikisYeriKodu: "",
    cikisYeriKoduId: 0,
    aciklama1: "",
    aciklama2: "",
    aciklama3: "",
    eIrsaliye: false,
  });

  const [formDataDetay, setFormDataDetay] = useState<FormDataDetay>({
    projeKoduId: 0,
    projeKodu: "",
    uniteKoduId: 0,
    uniteKodu: "",
    ozelKod1Id: 0,
    ozelKod1: "",
    stokKartiId: 0,
    stokKodu: "",
    stokAdi: "",
    istenilenMiktar: 0,
    miktar: 0,
    fiyat: 0,
    hucreKoduId: 0,
    hucreKodu: "",
    olcuBrId: 0,
    olcuBr: "",
  });

  const [dialogVisible, setDialogVisible] = useState({
    proje: false,
    unite: false,
    stok: false,
    cikisKoduDialog: false,
  });

  const [gridData, setGridData] = useState<GridData[]>([]);
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GridData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingGetir, setLoadingGetir] = useState(false);
  const [seriOptions, setSeriOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const formDataBaslikRef = useRef(formDataBaslik);
  const formDataDetayRef = useRef(formDataDetay);
  const gridDataRef = useRef(gridData);

  useEffect(() => {
    formDataBaslikRef.current = formDataBaslik;
  }, [formDataBaslik]);

  useEffect(() => {
    formDataDetayRef.current = formDataDetay;
  }, [formDataDetay]);

  useEffect(() => {
    gridDataRef.current = gridData;
  }, [gridData]);

  useEffect(() => {
    const fetchSeriOptions = async () => {
      try {
        const response = await api.belgeSeri.getAll(0, 1000);
        if (response.data.value) {
          const options = response.data.value.items.map((item: IBelgeSeri) => ({
            label: item.seri,
            value: item.seri,
          }));
          setSeriOptions(options);
        }
      } catch (error) {
        console.error("Error fetching seri options:", error);
      }
    };

    fetchSeriOptions();
  }, []);

  const setFormDataBaslikAndRef = (update:any) => {
    setFormDataBaslik((prev) => {
      const updatedFormData = typeof update === "function" ? update(prev) : update;
      formDataBaslikRef.current = updatedFormData;
      return updatedFormData;
    });
  };

  const setFormDataDetayAndRef = (update:any) => {
    setFormDataDetay((prev) => {
      const updatedFormData = typeof update === "function" ? update(prev) : update;
      formDataDetayRef.current = updatedFormData;
      return updatedFormData;
    });
  };

  const setGridDataAndRef = (update:any) => {
    setGridData((prev) => {
      const updatedGridData = typeof update === "function" ? update(prev) : update;
      gridDataRef.current = updatedGridData;
      return updatedGridData;
    });
  };

  const handleSeriChange = async (e: { value: any; }) => {
    const selectedSeri = e.value;
    setFormDataBaslikAndRef((prevFormDataBaslik: any) => ({
      ...prevFormDataBaslik,
      seri: selectedSeri,
      numara: "",
    }));

    if (selectedSeri) {
      try {
        const response = await api.belgeNo.getBySeri(selectedSeri, EBelgeTip.AmbarCikisFisi);
        if (response.data.status) {
          setFormDataBaslikAndRef((prevFormDataBaslik: any) => ({
            ...prevFormDataBaslik,
            numara: response.data.value.belgeNo,
          }));
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const [searchParams] = useSearchParams();
  //belge düzenleme için, belge id sini alma
  const belgeId = useMemo(() => Number(searchParams.get("belgeId")), [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.ambarFisi.get(belgeId);
        if (response.data.status) {
          const ambarFisi = response.data.value;
          const belge = ambarFisi.belge!;
          setFormDataBaslikAndRef({
            seri: belge.seri,
            numara: belge.no,
            tarih: currentDate,
            hareketTuru: ambarFisi.ambarHareketTur,
            cikisYeri: ambarFisi.cikisYeri,
            cikisYeriKodu: ambarFisi.cikisYeriKodu,
            cikisYeriKoduId: ambarFisi.cikisYeriId,
            aciklama1: belge.aciklama1,
            aciklama2: belge.aciklama2,
            aciklama3: belge.aciklama3,
          });

          const gridResponse = await api.stokHareket.getListByBelgeId(belgeId);
          if (gridResponse.data.value) {
            setGridDataAndRef(
              gridResponse.data.value.items.map((item: IStokHareket, index: number) => ({
                id: item.id,
                stokKartiId: item.stokKartiId,
                stokKodu: item.stokKarti!.kodu,
                stokAdi: item.stokKarti!.adi,
                miktar: item.miktar,
                istenilenMiktar: item.istenilenMiktar,
                fiyat: item.fiyatTL,
                hucreKoduId: item.hucreId,
                hucreKodu: item.hucre?.kodu,
                bakiye: item.bakiye,
                olcuBirimId: item.olcuBirimId,
                olcuBr: item.olcuBirim?.simge,
              }))
            );

            //Herhangi bir stoktan veri almak için
            setFormDataDetayAndRef({
              projeKoduId: gridResponse.data.value.items[0].projeId,
              projeKodu: gridResponse.data.value.items[0].proje?.kodu,
              uniteKoduId: gridResponse.data.value.items[0].uniteId,
              uniteKodu: gridResponse.data.value.items[0].unite?.kodu,
              stokKartiId: 0,
              stokKodu: "",
              miktar: 0,
              istenilenMiktar: 0,
              olcuBrId: 0,
              olcuBr: "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (belgeId) {
      fetchData();
    }
  }, [belgeId]);

  const handleInputChangeBaslik = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataBaslikAndRef({ ...formDataBaslikRef.current, [name]: value });
  };

  const handleInputChangeDetay = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataDetayAndRef({ ...formDataDetayRef.current, [name]: value });
  };
  const miktarRef = useRef<any>(null);

  //stok getirme, gridden stok düzeltme, stok kodu okutunca bilgilerini getirme işlemleri
  const handleKeyPress = useCallback(async (stokKodu: string) => {
    setFormDataDetayAndRef((prevFormData: any) => ({
      ...prevFormData,
      stokKodu: stokKodu,
      stokAdi: "",
    }));

    try {
      const response = await api.stok.getByKod(stokKodu);
      if (response.status) {
        if (
          response.data &&
          response.data.value.adi &&
          response.data.value.kodu === stokKodu
        ) {
          const alreadyHas = gridDataRef.current.find((x) => x.stokKodu == stokKodu);
          const alreadyHasgMiktar = alreadyHas ? alreadyHas.miktar : 0;
          const alreadyHasgIstenilenMiktar = alreadyHas
            ? alreadyHas.istenilenMiktar
            : 0;

          setFormDataDetayAndRef((prevFormData: any) => ({
            ...prevFormData,
            stokAdi: response.data.value.adi!,
            olcuBrId: response.data.value.stokOlcuBirim1Id,
            olcuBr: response.data.value.stokOlcuBirim1.simge,
            miktar: alreadyHasgMiktar!,
            istenilenMiktar: alreadyHasgIstenilenMiktar!,
          }));

          if (miktarRef.current) {
            const inputElement = miktarRef.current.getInput();
            if (inputElement) {
              inputElement.focus();
              inputElement.select();
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  //rehber işlemleri
  const handleDialogSelect = useCallback(
    (
      fieldName: string,
      dialogFieldName: string,
      selectedValue: { Id: any; [key: string]: any }
    ) => {
      setFormDataBaslikAndRef((prevFormData: any) => {
        const newFormData = {
          ...prevFormData,
          [fieldName]: selectedValue[dialogFieldName],
          [`${fieldName}Id`]: selectedValue.Id,
        };
        if (fieldName === "stokKodu") {
          handleKeyPress(selectedValue[fieldName]);
        }
        return newFormData;
      });
      setFormDataDetayAndRef((prevFormData: any) => {
        const newFormData = {
          ...prevFormData,
          [fieldName]: selectedValue[dialogFieldName],
          [`${fieldName}Id`]: selectedValue.Id,
        };
        
        return newFormData;
      });
    },
    [handleKeyPress]
  );

  //ihtiyaç planlama raporundan getirilen bilgiler
  const handleGetir = async () => {
    setLoadingGetir(true);
    const sortColumn = "Id";
    const sortDirection = 1;

    const filters = {
      projeKodu: { value: formDataDetayRef.current.projeKodu, matchMode: "equals" },
      plasiyerKodu: { value: formDataDetayRef.current.uniteKodu, matchMode: "equals" },
      miktar: { value: "0", matchMode: "gt" },
    };
    const dynamicQuery = transformFilter(filters, sortColumn, sortDirection);

    try {
      const response = await api.ihtiyacPlanlamaRapor.getAllForGrid(
        0,
        9999,
        dynamicQuery
      );

      const data = response.data.value;
      const maxId =
        gridDataRef.current.length > 0
          ? Math.max(...gridDataRef.current.map((item) => item.id!))
          : 0;
      const newGridData: GridData[] = data.items.map((item, index) => ({
        id: maxId + index + 1,
        projeKodu: item.projeKodu,
        uniteKodu: item.plasiyerKodu,
        numara: item.belgeNo,
        stokKartiId: item.stokKartiId,
        stokKodu: item.stokKodu,
        stokAdi: item.stokAdi,
        miktar: 0,
        fiyat: 0,
        istenilenMiktar: item.miktar,
        bakiye: item.bakiye,
        olcuBirimId: item.olcuBirimId,
        olcuBr: item.olcuBr,
      }));

      setGridDataAndRef(newGridData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingGetir(false);
    }
  };

  //gride doldurma işlemleri
  const handleAddToGrid = useCallback(() => {
    const nStoK = formDataDetayRef.current.stokKodu;

    if (!nStoK || formDataDetayRef.current.miktar === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Stok Kodu ve Miktar alanlarını doldurmalısınız.",
        life: 3000,
      });
      return;
    }

    const alreadyHas = gridDataRef.current.find((x) => x.stokKodu == nStoK);

    if (alreadyHas) {
      if (Number(formDataDetayRef.current.miktar) > Number(alreadyHas.istenilenMiktar)) {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Var olan miktardan fazla çıkış ekleyemezsin.",
          life: 3000,
        });
        return;
      }

      setGridDataAndRef((prevGridData: any[]) =>
        prevGridData.map((item) =>
          item.stokKodu === nStoK
            ? {
                ...item,
                miktar: formDataDetayRef.current.miktar!,
              }
            : item
        )
      );
    } else {
      const maxId =
        gridDataRef.current.length > 0
          ? Math.max(...gridDataRef.current.map((item) => item.id!))
          : 0;

      const newGridData: GridData = {
        id: maxId + 1,
        stokKartiId: formDataDetayRef.current.stokKartiId,
        stokKodu: formDataDetayRef.current.stokKodu,
        stokAdi: formDataDetayRef.current.stokAdi,
        miktar: formDataDetayRef.current.miktar,
        istenilenMiktar: 0,
        fiyat: 0,
        bakiye: 0,
        olcuBirimId: formDataDetayRef.current.olcuBrId,
        olcuBr: formDataDetayRef.current.olcuBr,
      };
      setGridDataAndRef((prevGridData: any) => [...prevGridData, newGridData]);
    }

    document.getElementById("getirButton")!.hidden = true;

    setFormDataDetayAndRef((prevFormData: any) => ({
      ...prevFormData,
      stokKartiId: 0,
      stokKodu: "",
      stokAdi: "",
      miktar: 0,
      istenilenMiktar: 0,
    }));
  }, []);

  //Silme onaylaması yapıldıktan sonra
  const confirmDelete = useCallback(() => {
    if (selectedItem) {
      deleteItem(selectedItem);
      setVisible(false);
    }
  }, [selectedItem]);

  //gridden silme işlemi
  const deleteItem = useCallback((item: GridData) => {
    try {
      setGridDataAndRef((prevGridData: any[]) => {
        const newGridData = prevGridData.filter((i) => i.id !== item.id);

        if (newGridData.length === 0) {
          document.getElementById("getirButton")!.hidden = false;
        }
        return newGridData;
      });

      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Kayıt silindi",
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Kayıt silinemedi",
        life: 3000,
      });
    }
  }, []);

  //validasyon işlemleri
  const validateForm = () => {
    if (!formDataBaslikRef.current.numara) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Numara alanı boş olamaz",
        life: 3000,
      });
      return false;
    }

    if (!formDataBaslikRef.current.hareketTuru) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Hareket Türü seçilmelidir",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  //bütün belgeyi backende gönderiyor.
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const belgeResponse = await api.belge.create({
        belgeTip: EBelgeTip.AmbarCikisFisi,
        no: formDataBaslikRef.current.seri + formDataBaslikRef.current.numara,
        tarih: formDataBaslikRef.current.tarih,
        aciklama1: formDataBaslikRef.current.aciklama1,
        aciklama2: formDataBaslikRef.current.aciklama2,
        aciklama3: formDataBaslikRef.current.aciklama3,
        tamamlandi: false,
      });

      const belgeId = belgeResponse.data.value.id;
      !belgeResponse.data.status;

      if (!belgeResponse.data.status) {
        setLoading(false);
        throw new Error(
          (belgeResponse.data.errors &&
            belgeResponse.data.errors[0].Errors &&
            belgeResponse.data.errors[0].Errors[0]) ||
            "Belge oluştururken hata oldu"
        );
      }

      const ambarFisiData: IAmbarFisi = {
        belgeId: belgeId!,
        ambarHareketTur: formDataBaslikRef.current.hareketTuru,
        cikisYeri: formDataBaslikRef.current.cikisYeri,
        cikisYeriId: formDataBaslikRef.current.cikisYeriKoduId,
      };
      const ambarFisiResponse = await api.ambarFisi.create(ambarFisiData);

      if (!ambarFisiResponse.data.status) {
        setLoading(false);
        throw new Error(
          (ambarFisiResponse.data.errors &&
            ambarFisiResponse.data.errors[0].Errors &&
            ambarFisiResponse.data.errors[0].Errors[0]) ||
            "AmbarFişi oluştururken hata oldu"
        );
      }

      const stokHareketData: IStokHareket[] = gridDataRef.current
        .filter((item) => item.miktar > 0)
        .map((item, index) => ({
          belgeId: belgeId!,
          stokKartiId: item.stokKartiId,
          masrafStokKartiId: formDataBaslikRef.current.cikisYeriKoduId,
          miktar: item.miktar,
          istenilenMiktar: 0,
          fiyatTL: item.fiyat,
          hucreId: item.hucreKoduId,
          aciklama1: formDataBaslikRef.current.aciklama1,
          aciklama2: formDataBaslikRef.current.aciklama2,
          aciklama3: formDataBaslikRef.current.aciklama3,
          projeId: formDataDetayRef.current.projeKoduId,
          uniteId: formDataDetayRef.current.uniteKoduId,
          sira: index + 1,
          girisCikis: "C",
          olcuBirimId: item.olcuBirimId,
          stokKartiKodu: "", //stok kodunu göndermekeye gerek duymuyoruz
        }));

      for (const stokHareket of stokHareketData) {
        const stokHareketResponse = await api.stokHareket.create(stokHareket);
        if (!stokHareketResponse.data.status) {
          setLoading(false);
          throw new Error(
            (stokHareketResponse.data.errors &&
              stokHareketResponse.data.errors[0].Errors &&
              stokHareketResponse.data.errors[0].Errors[0]) ||
              "StokHareket oluştururken hata oldu"
          );
        }
      }

      const belgeUpdateResponse = await api.belge.update({
        id: belgeId,
        tamamlandi: true,
      });

      if (!belgeUpdateResponse.data.status) {
        setLoading(false);
        throw new Error(
          (belgeUpdateResponse.data.errors &&
            belgeUpdateResponse.data.errors[0].Errors &&
            belgeUpdateResponse.data.errors[0].Errors[0]) ||
            "Belge güncellenirken oluştururken hata oldu"
        );
      }

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
      setLoading(false);
    }
  };

  //html içeriği
  return (
    <div className="container-fluid">
      {JSON.stringify(formDataBaslik)}
      {JSON.stringify(formDataDetay)}
      <Toast ref={toast} />
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        message="Silmek istediğinizden emin misiniz?"
        header="Onay"
        icon="pi pi-exclamation-triangle"
        accept={confirmDelete}
        reject={() => setVisible(false)}
        acceptLabel="Evet"
        rejectLabel="Hayır"
      />

      <h5>{belgeId}</h5>

      <div className="p-fluid p-formgrid p-grid">
        <div className="row">
          <div className="col-md-3 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="projeKodu">Proje Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  id="projeKodu"
                  name="projeKodu"
                  value={formDataDetay.projeKodu}
                  readOnly
                />
                <Button
                  label="..."
                  onClick={() =>
                    setDialogVisible({ ...dialogVisible, proje: true })
                  }
                />
                <ProjeRehberDialog
                  isVisible={dialogVisible.proje}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, proje: false })
                  }
                  onSelect={(selectedValue) =>
                    handleDialogSelect("projeKodu", "kodu", selectedValue)
                  }
                />
              </div>
              <InputText
                id="projeKoduId"
                name="projeKoduId"
                value={formDataDetay.projeKoduId?.toString()}
                type="hidden"
              />
            </FloatLabel>
          </div>
          <div className="col-md-3 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="uniteKodu">Ünite Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  id="uniteKodu"
                  name="uniteKodu"
                  value={formDataDetay.uniteKodu}
                  readOnly
                />
                <Button
                  label="..."
                  onClick={() =>
                    setDialogVisible({ ...dialogVisible, unite: true })
                  }
                />
                <UniteRehberDialog
                  isVisible={dialogVisible.unite}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, unite: false })
                  }
                  onSelect={(selectedValue) =>
                    handleDialogSelect("uniteKodu", "kodu", selectedValue)
                  }
                />
              </div>
              <InputText
                id="uniteKoduId"
                name="uniteKoduId"
                value={formDataDetay.uniteKoduId?.toString()}
                type="hidden"
              />
            </FloatLabel>
          </div>
          <div className="col-md-3 col-sm-6 mt-4">
            <div className="p-inputgroup">
              <Button id="getirButton" label="Getir" onClick={handleGetir} />
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mt-4">
            <Button
              label="Kaydet"
              icon="pi pi-check"
              loading={loading}
              onClick={handleSave}
            />
          </div>
        </div>

        <Accordion activeIndex={1}>
          <AccordionTab header="Üst Bilgiler">
            <div className="row">
              <div className="col-md-3 col-sm-6 mt-4">
                <div className="p-inputgroup flex">
                  <FloatLabel>
                    <Dropdown
                      className="w-full md:w-14rem"
                      showClear
                      placeholder="Seri"
                      value={formDataBaslik.seri}
                      options={seriOptions}
                      onChange={handleSeriChange}
                      style={{ width: "100%" }}
                    />
                    <label htmlFor="seri">Seri</label>
                  </FloatLabel>

                  <FloatLabel>
                    <InputText
                      id="numara"
                      name="numara"
                      value={formDataBaslik.numara}
                      onChange={handleInputChangeBaslik}
                      style={{ width: "100%", minWidth: "250px" }}
                    />
                    <label htmlFor="numara">Numara</label>
                  </FloatLabel>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mt-4">
                <div className="p-inputgroup flex">
                  <FloatLabel>
                    <Dropdown
                      showClear
                      placeholder="Hareket Türü"
                      value={formDataBaslik.hareketTuru}
                      options={Object.values(EAmbarHareketTur)
                        .filter((value) => typeof value === "number")
                        .map((value) => ({
                          label:
                            EAmbarHareketTur[
                              value as keyof typeof EAmbarHareketTur
                            ],
                          value: value,
                        }))}
                      onChange={(e) =>
                        setFormDataBaslikAndRef({
                          ...formDataBaslikRef.current,
                          hareketTuru: e.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                    <label htmlFor="hareketTuru">Hareket Türü</label>
                  </FloatLabel>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mt-4">
                <div className="p-inputgroup flex">
                  <FloatLabel>
                    <Dropdown
                      showClear
                      placeholder="Çıkış Yeri"
                      value={formDataBaslik.cikisYeri}
                      options={Object.values(EAmbarFisiCikisYeri)
                        .filter((value) => typeof value === "number")
                        .map((value) => ({
                          label:
                            EAmbarFisiCikisYeri[
                              value as keyof typeof EAmbarFisiCikisYeri
                            ],
                          value: value,
                        }))}
                      onChange={(e) =>
                        setFormDataBaslikAndRef({
                          ...formDataBaslikRef.current,
                          cikisYeri: e.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                    <label htmlFor="cikisYeri">Çıkış Yeri</label>
                  </FloatLabel>
                </div>
              </div>

              <div className="col-md-3 col-sm-6 mt-4">
                <FloatLabel>
                  <label htmlFor="cikisYeriKodu">Çıkış Yeri Kodu</label>
                  <div className="p-inputgroup">
                    <InputText
                      id="cikisYeriKodu"
                      name="cikisYeriKodu"
                      value={formDataBaslik.cikisYeriKodu?.toString()}
                      readOnly
                    />
                    <Button
                      label="..."
                      onClick={() =>
                        setDialogVisible({
                          ...dialogVisible,
                          cikisKoduDialog: true,
                        })
                      }
                    />
                    <StokRehberDialog
                      isVisible={dialogVisible.cikisKoduDialog}
                      onHide={() =>
                        setDialogVisible({
                          ...dialogVisible,
                          cikisKoduDialog: false,
                        })
                      }
                      onSelect={(selectedValue) =>
                        handleDialogSelect(
                          "cikisYeriKodu",
                          "kodu",
                          selectedValue
                        )
                      }
                    />
                  </div>
                  <InputText
                    id="cikisYeriKoduId"
                    name="cikisYeriKoduId"
                    value={formDataBaslik.cikisYeriKoduId?.toString()}
                    type="hidden"
                  />
                </FloatLabel>
              </div>
            </div>

            <div className="row">
              <div className="col-md-3 col-sm-6 mt-4">
                <div className="p-inputgroup flex">
                  <FloatLabel>
                    <InputText
                      id="aciklama1"
                      name="aciklama1"
                      value={formDataBaslik.aciklama1}
                      onChange={handleInputChangeBaslik}
                      style={{ width: "100%", minWidth: "250px" }}
                    />
                    <label htmlFor="aciklama1">Açıklama 1</label>
                  </FloatLabel>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mt-4">
                <div className="p-inputgroup flex">
                  <FloatLabel>
                    <InputText
                      id="aciklama2"
                      name="aciklama2"
                      value={formDataBaslik.aciklama2}
                      onChange={handleInputChangeBaslik}
                      style={{ width: "100%", minWidth: "250px" }}
                    />
                    <label htmlFor="aciklama2">Açıklama 2</label>
                  </FloatLabel>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mt-4">
                <div className="p-inputgroup flex">
                  <FloatLabel>
                    <InputText
                      id="aciklama3"
                      name="aciklama3"
                      value={formDataBaslik.aciklama3}
                      onChange={handleInputChangeBaslik}
                      style={{ width: "100%", minWidth: "250px" }}
                    />
                    <label htmlFor="aciklama3">Açıklama 3</label>
                  </FloatLabel>
                </div>
              </div>
              <div className="col-md-2 col-sm-6 mt-4">
                <div className="p-inputgroup flex">
                  <FloatLabel>
                    <Dropdown
                      showClear
                      placeholder="Özel Kod 1"
                      value={formDataDetayRef.current.ozelKod1}
                      style={{ width: "100%" }}
                    />
                    <label htmlFor="ozelKod1">Özel Kod 1</label>
                  </FloatLabel>
                </div>
              </div>
              <div className="col-md-1 col-sm-6 mt-4">
                <div className="p-inputgroup flex">
                  <Checkbox
                    inputId="eIrsaliye"
                    name="eIrsaliye"
                    value="eIrsaliye"
                    checked={formDataBaslikRef.current.eIrsaliye || false}
                  />
                  <label htmlFor="ingredient1" className="ml-2">
                    eİrsaliye
                  </label>
                </div>
              </div>
            </div>
          </AccordionTab>
        </Accordion>
        <div className="row">
          <div className="col-md-3 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="stokKodu">Stok Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  id="stokKodu"
                  name="stokKodu"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleKeyPress((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <Button
                  label="..."
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
                    handleDialogSelect("stokKodu", "kodu", selectedValue);
                  }}
                />
              </div>
              <InputText
                id="stokKartiId"
                name="stokKartiId"
                value={formDataDetayRef.current.stokKartiId?.toString()}
                type="hidden"
              />
            </FloatLabel>
          </div>
          <div className="col-md-4 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="stokAdi">Stok Adı</label>
              <InputText
                id="stokAdi"
                name="stokAdi"
                value={formDataDetayRef.current.stokAdi}
                disabled
              />
            </FloatLabel>
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="miktar">İstenilen Miktar</label>
              <InputNumber
                id="istenilenMiktar"
                name="istenilenMiktar"
                value={formDataDetayRef.current.istenilenMiktar}
                min={0}
                minFractionDigits={2}
                maxFractionDigits={5}
                disabled
                inputStyle={{ textAlign: "right" }}
              />
            </FloatLabel>
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="miktar">Miktar</label>
              <InputNumber
                id="miktar"
                name="miktar"
                value={formDataDetayRef.current.miktar}
                min={0}
                minFractionDigits={0}
                maxFractionDigits={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFormDataDetayAndRef((prevState: any) => ({
                      ...prevState,
                      miktar: Number((e.target as HTMLInputElement).value),
                    }));
                    handleAddToGrid();
                  }
                }}
                ref={miktarRef}
                inputStyle={{ textAlign: "right" }}
              />
            </FloatLabel>
          </div>
          <div className="col-md-1 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="hucre">Hucre</label>
              <InputText
                id="hucre"
                name="hucre"
                value={formDataDetayRef.current.hucreKodu}
                onChange={handleInputChangeDetay}
                disabled
              />
            </FloatLabel>
          </div>
        </div>
        <div className="p-col-12  mt-3">
          <Button label="Ekle" icon="pi pi-plus" onClick={handleAddToGrid} />
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
            scrollHeight="450px"
            emptyMessage="Kayıt yok."
          >
            <Column field="id" header="#" />
            {/* <Column field="stokKartiId" header="Stok Kartı Id" /> */}
            <Column field="stokKodu" header="Stok Kodu" />
            <Column field="stokAdi" header="Stok Adı" />
            <Column field="miktar" header="Miktar" />
            {/* <Column field="olcuBirimId" header="Miktar" /> */}
            <Column field="istenilenMiktar" header="İstenilen Miktar" />
            <Column field="refKodu" header="Raf Kodu" />
            <Column field="depoBakiye" header="Depo Bakiye" />
            <Column
              body={(rowData) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => {
                      setSelectedItem(rowData);
                      setFormDataDetayAndRef((prevFormData: any) => ({
                        ...prevFormData,
                        stokKodu: rowData.stokKodu,
                        stokAdi: rowData.stokAdi,
                        miktar: rowData.miktar,
                        istenilenMiktar: rowData.istenilenMiktar,
                      }));
                    }}
                  >
                    <i className="ti-pencil"></i>
                  </button>
                  <button
                    className="btn btn-danger ms-1"
                    onClick={() => {
                      setSelectedItem(rowData);
                      setVisible(true);
                    }}
                  >
                    <i className="ti-trash"></i>
                  </button>
                </div>
              )}
              header="İşlemler"
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default App;
