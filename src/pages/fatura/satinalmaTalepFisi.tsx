import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IBelge } from "../../utils/types/fatura/IBelge";
import { ITalepTeklif } from "../../utils/types/fatura/ITalepTeklif";
import { ITalepTeklifStokHareket } from "../../utils/types/fatura/ITalepTeklifStokHareket";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { EBelgeTip } from "../../utils/types/enums/EBelgeTip";
import { EAktarimDurumu } from "../../utils/types/enums/EAktarimDurumu";
import api from "../../utils/api";
import { FilterMeta, transformFilter } from "../../utils/transformFilter";
import { IBelgeSeri } from "../../utils/types/tanimlamalar/IBelgeSeri";
import StokRehberDialog from "../../components/Rehber/StokRehberDialog";
import { InputMask } from "primereact/inputmask";
import { IStokOlcuBirim } from "../../utils/types/tanimlamalar/IStokOlcuBirim";
import { InputNumber } from "primereact/inputnumber";
import ProjeRehberDialog from "../../components/Rehber/ProjeRehberDialog";
import UniteRehberDialog from "../../components/Rehber/UniteRehberDialog";
import CariRehberDialog from "../../components/Rehber/CariRehberDialog";
import { ITalepTeklifSaveData } from "../../utils/types/fatura/ITalepTeklifSaveData";
import { miktarDecimal } from "../../utils/config";

const satinalmaTalepFisi = () => {
  const currentDate = new Date();
  currentDate.setHours(3, 0, 0, 0);
  const navigate = useNavigate();

  const miktarRef = useRef<any>(null);
  const stokKoduInputRef = useRef<any>(null);
  const [tempStokKodu, setTempStokKodu] = useState("");
  const [tempCariKodu, setTempCariKodu] = useState("MUHTELIF");

  const[bilgiMiktar,setBilgiMiktar]=useState(0);

  const [olcuBirimOptions, setOlcuBirimOptions] = useState<IStokOlcuBirim[]>(
    []
  );

  const [saveLoading, setSaveLoading] = useState(false);

  //Belge Data işlemleri başlangıç
  const [belgeData, setBelgeData] = useState<IBelge>({
    no: "",
    belgeTip: EBelgeTip.SatinalmaTalep,
    aktarimDurumu: EAktarimDurumu.AktarimSirada,
    tarih: currentDate,
  });
  const clearBelgeData = () => {
    setBelgeData({
      id: 0,
      aktarimDurumu: EAktarimDurumu.AktarimSirada,
      belgeTip: EBelgeTip.SatinalmaTalep,
      no: "",
      tarih: currentDate,
      aciklama1: "",
      aciklama2: "",
      aciklama3: "",
      aciklama4: "",
      aciklama5: "",
      aciklama6: "",
      aciklama7: "",
      aciklama8: "",
      aciklama9: "",
      aciklama10: "",
    });
  };
  //Belge Data işlemleri bitiş

  //Talep Data işlemleri başlangıç
  const [talepData, setTalepData] = useState<ITalepTeklif>({
    id: 0,
    belgeId: 0,
    cariId: 0,
  });
  const clearTalepData = () => {
    setTalepData({
      id: 0,
      belgeId: 0,
      cariId: 0,
      belge: undefined,
      cari: undefined,
    });
  };
  //Talep Data işlemleri bitiş

  //Talep Stok Hareket Data işlemleri başlangıç
  const [talepStokHareketData, setTalepStokHareketData] =
    useState<ITalepTeklifStokHareket>({
      stokKartiId: 0,
      miktar: 0,
      fiyatTL: 0,
      fiyatDoviz: 0,
      fiyatDovizTipiId: 0,
      olcuBirimId: 0,
      girisCikis: "G",
      teslimTarihi: currentDate,
      projeId: 0,
      proje: undefined,
      uniteId: 0,
      unite: undefined,
    });
  const clearTalepStokHareketData = () => {
    setTalepStokHareketData((prevData) => ({
      ...prevData,
      id: 0,
      stokKartiId: 0,
      stokKarti: undefined,
      miktar: 0,
      fiyatTL: 0,
      fiyatDoviz: 0,
      fiyatDovizTipiId: 0,
      fiyatDovizTipi: undefined,
      olcuBirimId: 0,
      olcuBirim: undefined,
      girisCikis: "G",
      //aciklama1: "",
      aciklama2: "",
      aciklama3: "",
      sira: 0,
      seriKodu: "",
      teslimTarihi: currentDate,
      projeId: prevData.projeId,
      proje: prevData.proje,
      uniteId: prevData.uniteId,
      unite: prevData.unite,
    }));
    setTempStokKodu("");
  };
  //Talep Stok Hareket Data işlemleri bitiş

  //Belge seri işlemleri başlangıç
  const [belgeSeri, setBelgeSeri] = useState("");
  const [belgeSeriOptions, setBelgeSeriOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchSeriOptions = async () => {
      try {
        const sortColumn = "Id";
        const sortDirection = 1;

        const filters:FilterMeta = {
          BelgeTip: { value: EBelgeTip.SatinalmaTalep, matchMode: "equals" },
        };

        const dynamicQuery = transformFilter(
          filters,
          sortColumn,
          sortDirection
        );
        const response = await api.belgeSeri.getAllForGrid(
          0,
          1000,
          dynamicQuery
        );
        if (response.data.value) {
          const options = response.data.value.items.map((item: IBelgeSeri) => ({
            label: item.seri,
            value: item.seri,
          }));
          setBelgeSeriOptions(options);
        }
      } catch (error) {
        console.error("Error fetching belgeSeri options:", error);
      }
    };

    fetchSeriOptions();
  }, []);

  const handleBelgeSeriChange = useCallback(async (e: { value: any }) => {
    const selectedSeri = e.value;

    setBelgeSeri(selectedSeri);

    if (selectedSeri) {
      try {
        const response = await api.belgeNo.getBySeri(
          selectedSeri,
          EBelgeTip.SatinalmaTalep
        );
        if (response.data.status) {
          setBelgeData((prevData) => ({
            ...prevData,
            no: response.data.value.belgeNo,
          }));
        } else {
          console.error("Failed to fetch data Belge Seri");
        }
      } catch (error) {
        console.error("Error fetching data Belge Seri:", error);
      }
    } else {
      setBelgeData((prevData) => ({
        ...prevData,
        no: "",
      }));
    }
  }, []);
  //Belge seri işlemleri başlangıç

  //Alt taraf grid işlemleri başlangıç
  const [gridData, setGridData] = useState<ITalepTeklifStokHareket[]>([]); //Grid data farklı olmadığından yine stok hareketlerini verdim

  const [selectedGridItem, setSelectedGridItem] =
    useState<ITalepTeklifStokHareket | null>(null);

  //gride doldurma işlemleri
  const handleAddToGrid = useCallback(async () => {
    const isValid = await validateAddToGrid();
    if (!isValid) return; 

    if (selectedGridItem) {
      setGridData((prevGridData) =>
        prevGridData.map((item) =>
          item.id === talepStokHareketData?.id
            ? {
                ...item,
                stokKartiId: talepStokHareketData!.stokKartiId,
                stokKarti: talepStokHareketData?.stokKarti,
                //stokAdi: formDataDetay.stokAdi,
                miktar: bilgiMiktar,//talepStokHareketData!.miktar,
                fiyatTL: talepStokHareketData!.fiyatTL,
                fiyatDoviz: talepStokHareketData!.fiyatDoviz,
                fiyatDovizTipiId: talepStokHareketData!.fiyatDovizTipiId,
                fiyatDovizTipi: talepStokHareketData!.fiyatDovizTipi,
                olcuBirimId:talepStokHareketData.stokKarti?.stokOlcuBirim1Id!, // talepStokHareketData!.olcuBirimId,
                olcuBirim:talepStokHareketData.stokKarti?.stokOlcuBirim1!, //talepStokHareketData!.olcuBirim,
                girisCikis: talepStokHareketData!.girisCikis,
                aciklama1: talepStokHareketData!.aciklama1,
                aciklama2: talepStokHareketData!.aciklama2,
                aciklama3: talepStokHareketData!.aciklama3,
                sira: talepStokHareketData!.sira,
                seriKodu: talepStokHareketData!.seriKodu,
                teslimTarihi: talepStokHareketData!.teslimTarihi,
                projeId: talepStokHareketData.projeId,
                proje: talepStokHareketData.proje,
                uniteId: talepStokHareketData.uniteId,
                unite: talepStokHareketData.unite,
              }
            : item
        )
      );
    } else {
      const maxId =
        gridData.length > 0 ? Math.max(...gridData.map((item) => item.id!)) : 0;

      const newGridData: ITalepTeklifStokHareket = {
        id: maxId + 1,
        stokKartiId: talepStokHareketData!.stokKartiId,
        stokKarti: talepStokHareketData?.stokKarti,
        //stokAdi: formDataDetay.stokAdi,
        miktar: bilgiMiktar,//talepStokHareketData!.miktar,
        fiyatTL: talepStokHareketData!.fiyatTL,
        fiyatDoviz: talepStokHareketData!.fiyatDoviz,
        fiyatDovizTipiId: talepStokHareketData!.fiyatDovizTipiId,
        fiyatDovizTipi: talepStokHareketData!.fiyatDovizTipi,
        olcuBirimId: talepStokHareketData.stokKarti?.stokOlcuBirim1Id!, //talepStokHareketData!.olcuBirimId,
        olcuBirim:talepStokHareketData.stokKarti?.stokOlcuBirim1, //talepStokHareketData!.olcuBirim,
        girisCikis: talepStokHareketData!.girisCikis,
        aciklama1: talepStokHareketData!.aciklama1,
        aciklama2: talepStokHareketData!.aciklama2,
        aciklama3: talepStokHareketData!.aciklama3,
        sira: talepStokHareketData!.sira,
        seriKodu: talepStokHareketData!.seriKodu,
        teslimTarihi: talepStokHareketData!.teslimTarihi,
        projeId: talepStokHareketData.projeId,
        proje: talepStokHareketData.proje,
        uniteId: talepStokHareketData.uniteId,
        unite: talepStokHareketData.unite,
      };
      setGridData((prevGridData) => [...prevGridData, newGridData]);
    }

    setSelectedGridItem(null);
    setBilgiMiktar(0);
    // setTalepStokHareket((stokHareket) => ({ ...stokHareket,
    //     stokKartiId:0, stokAdi: "", miktar: 0,istenilenMiktar:0,bakiye:0 }));
    clearTalepStokHareketData();

    // if (stokKoduInputRef.current) {
    //   stokKoduInputRef.current.focus();
    // }
  }, [talepStokHareketData, gridData,bilgiMiktar]);

  //Gride ekleme öncesi validasyon kontrolleri
  const validateAddToGrid =async () => {

    if (talepStokHareketData.teslimTarihi) {
      const teslimTarihi = new Date(talepStokHareketData.teslimTarihi);

      if (isNaN(teslimTarihi.getTime())) {
        // gerçekten tarih mi kontrol mevzusu
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Hatalı tarih...",
          life: 3000,
        });
        return false;
      }
    }

    if (!talepStokHareketData?.proje || talepStokHareketData?.projeId <= 0) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Hatalı Proje",
        life: 3000,
      });
      return false;
    }

    if (!talepStokHareketData?.unite || talepStokHareketData?.uniteId <= 0) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Hatalı Ünite",
        life: 3000,
      });
      return false;
    }

    if (
      !talepStokHareketData?.stokKarti ||
      talepStokHareketData?.stokKartiId <= 0
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Hatalı Stok",
        life: 3000,
      });
      return false;
    }

    if (!talepStokHareketData?.miktar || talepStokHareketData.miktar <= 0 || bilgiMiktar<=0) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Miktar sıfırdan büyük olmalı...",
        life: 3000,
      });
      return false;
    }

    const isStokTalepUygun = await stokTalepIcinUygunMu();


    if (!isStokTalepUygun)
    {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Miktar ihtiyaçdan fazla...",
          life: 3000,
        });
        return false;
      
    }

    return true;
  };

  const stokTalepIcinUygunMu = useCallback(async () => {
    const stokTalepResponse = await api.ihtiyacPlanlamaRaporTalep.getByKod(
      talepStokHareketData.stokKarti?.kodu!
    );

    if (stokTalepResponse?.data?.status && stokTalepResponse?.data.value) {
      const stokTalepData = stokTalepResponse.data.value;

      if (!stokTalepData.dahilMi) return false;

      if (stokTalepData.miktar < bilgiMiktar) {//Girilen, izin verilenden büyük mü?
        return false;
      }

      // Grid'deki aynı stoğa ait toplam miktarı hesapla
      const mevcutToplamMiktar = gridData
        .filter(
          (item) =>
            item.stokKarti?.kodu === talepStokHareketData.stokKarti?.kodu
        )
        .reduce((acc, curr) => acc + (curr.miktar || 0), 0);
      let toplamMiktar = mevcutToplamMiktar + bilgiMiktar;

      if (selectedGridItem) {//Eğer bu bir düzenleme ise, onu da düş
        toplamMiktar = toplamMiktar - selectedGridItem.miktar;
      }
      // Toplam miktarı API'deki ihtiyaç miktarıyla karşılaştır
      if (stokTalepData.miktar < toplamMiktar) {
        return false; // İhtiyaç miktarından fazla eklenemez
      }
    }
    return true;
  }, [
    talepStokHareketData.stokKarti?.kodu,
    gridData,
    selectedGridItem,
    bilgiMiktar
  ]);

  //Alt taraf grid işlemleri bitiş

  const [itemDeleteVisible, setItemDeleteVisible] = useState(false);
  const [searchParams] = useSearchParams();

  const [belgeReadOnly, setBelgeReadOnly] = useState<boolean>(false);

  //Rehberlerin görünürlük durumu
  const [dialogVisible, setDialogVisible] = useState({
    proje: false,
    unite: false,
    stok: false,
    cari: false,
    cikisKoduDialog: false,
  });

  const toast = useRef<Toast>(null);
  //belge düzenleme için, belge id sini alma
  const updateBelgeId = useMemo(
    () => Number(searchParams.get("belgeId")),
    [searchParams]
  );

  //talep için cari getiriyorum, bana Id si lazım daha sonra da teklif te kullanılabilir
  const handleCariGetir = useCallback(async () => {
    const response = await api.cari.getByKod(tempCariKodu);

    if (response?.data?.status && response?.data?.value) {
      const cariKarti = response.data.value;

      setTalepData((prevState) => ({
        ...prevState,
        cari: cariKarti,
        cariId: cariKarti.id!,
      }));
    }
  }, [tempCariKodu]);
  // tempCariKodu değiştiğinde handleCariGetir fonksiyonunu çağır
  useEffect(() => {
    if (tempCariKodu) {
      handleCariGetir();
    }
  }, [tempCariKodu, handleCariGetir]);

  //Silme onaylaması yapıldıktan sonra
  const confirmItemDelete = useCallback(() => {
    if (selectedGridItem) {
      deleteItem(selectedGridItem);
      setItemDeleteVisible(false);
    }
  }, [selectedGridItem]);

  //gridden silme işlemi
  const deleteItem = useCallback((item: ITalepTeklifStokHareket) => {
    try {
      setGridData((prevGridData) => {
        const newGridData = prevGridData.filter((i) => i.id !== item.id);
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

  //gridden düzeltme işlemleri
  const handleEditGridItem = useCallback(async (item: ITalepTeklifStokHareket) => {
    setSelectedGridItem(item);

    // Seçilen grid item'ını formda göstermek için ilgili state'leri güncelle
    setTalepStokHareketData({
      id: item.id,
      stokKartiId: item.stokKartiId,
      stokKarti: item.stokKarti,
      miktar: item.miktar,
      fiyatTL: item.fiyatTL,
      fiyatDoviz: item.fiyatDoviz,
      fiyatDovizTipiId: item.fiyatDovizTipiId,
      fiyatDovizTipi: item.fiyatDovizTipi,
      olcuBirimId: item.olcuBirimId,
      olcuBirim: item.olcuBirim,
      girisCikis: item.girisCikis,
      aciklama1: item.aciklama1,
      aciklama2: item.aciklama2,
      aciklama3: item.aciklama3,
      sira: item.sira,
      seriKodu: item.seriKodu,
      teslimTarihi: item.teslimTarihi,
      projeId: item.projeId,
      proje: item.proje,
      uniteId: item.uniteId,
      unite: item.unite,
    });

    const response = await api.stok.getByKod(item.stokKarti?.kodu!);
    if (response?.data?.status && response?.data?.value) {
        const stokKarti = response.data.value;
        // Ölçü birimi seçeneklerini oluşturma
        stokOlcuBirimDoldur(stokKarti);
    }



  }, []);

  //stokgetirme mevzusu
  const handleStokGetir = useCallback(async (stokKodu:string) => {
    //clearTalepStokHareketData();
    const response = await api.stok.getByKod(stokKodu);

    if (response?.data?.status && response?.data?.value) {
      const stokKarti = response.data.value;

      // Ölçü birimi seçeneklerini oluşturma
    //   const options = [
    //     stokKarti.stokOlcuBirim1,
    //     stokKarti.stokOlcuBirim2,
    //     stokKarti.stokOlcuBirim3,
    //   ];
    //   setOlcuBirimOptions(options);
    stokOlcuBirimDoldur(stokKarti);

      //setSelectedOlcuBirim(options[0]); // İlk değeri seçili yapabilirsiniz

      setTalepStokHareketData((prevState) => ({
        ...prevState,
        stokKarti: stokKarti,
        stokKartiId: stokKarti.id!,
        // fiyatDoviz:0,
        // fiyatTL:0,
        // miktar:0,
        girisCikis: "G",
        fiyatDovizTipiId:stokKarti.alisDovizTipiId,
        fiyatDovizTipi:stokKarti.alisDovizTipi,
        olcuBirimId: stokKarti.stokOlcuBirim1Id,
        olcuBirim: stokKarti.stokOlcuBirim1,
        //teslimTarihi:new Date()//currentDate
      }));
    } else {
    }
  }, []);

  const stokOlcuBirimDoldur = (
    stokKarti: any,
  ) => {
    const options = [
      stokKarti.stokOlcuBirim1,
      stokKarti.stokOlcuBirim2,
      stokKarti.stokOlcuBirim3,
    ].filter((item): item is IStokOlcuBirim => item !== undefined && item !== null);
  
    // Ölçü birimi seçeneklerini state'e set etme
    setOlcuBirimOptions(options);
  };

//   useEffect(() => {
//     if (tempStokKodu) {
//       handleStokGetir(tempStokKodu); // tempStokKodu her değiştiğinde bu işlev tetiklenir
//     }
//   }, [tempStokKodu]); // tempStokKodu'nu izler

  //Belgeyi komple kaydetme  öncesi validasyon kontrolleri
  const validateSave = () => {
    if (!belgeData?.no) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Numara alanı hatalı...",
        life: 3000,
      });
      return false;
    }
    if (!talepData?.cariId) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Cari hatalı...",
        life: 3000,
      });
      return false;
    }
    return true;
  };



  //apiye kaydetme isteği gönderimi
  const handleSave = useCallback(async () => {

    // Belge durumu güncelleniyor mu kontrol et
    const isUpdate = updateBelgeId !== 0;
    // Eğer güncelleme değilse (yeni kayıt), güncel tarihi al
    const updatedDate = isUpdate ? belgeData.tarih : new Date();
    if (!isUpdate) {
        updatedDate.setHours(3, 0, 0, 0); // Günlük başlangıç saati olarak ayarla
    }

    // Belge tarihini güncelle
    setBelgeData((prevData) => ({
        ...prevData,
        tarih: updatedDate,
    }));
    if (!validateSave()) {
      return;
    }
    setSaveLoading(true);
    try {
      const saveData: ITalepTeklifSaveData = {
        //SaveTalepTeklifDto
        belge: {
          id: isUpdate ? updateBelgeId : 0,
          belgeTip: EBelgeTip.SatinalmaTalep,
          no: belgeSeri + belgeData.no,
          tarih: updatedDate,//belgeData.tarih,
          aciklama1: belgeData.aciklama1,
          aciklama2: belgeData.aciklama2,
          aciklama3: belgeData.aciklama3,
          tamamlandi: true,
          aktarimDurumu: EAktarimDurumu.AktarimSirada,
        },

        talepTeklif: {
          id: 0, //updateBelgeId !== 0 ? await getAmbarFisiId(updateBelgeId) : 0,
          belgeId: isUpdate ? updateBelgeId : 0,
          cariId: talepData.cariId,
        },

        talepTeklifStokHarekets: gridData
          .filter((item) => item.miktar > 0)
          .map((item, index) => ({
            id: isUpdate? item.id:0,
            belgeId: isUpdate ? updateBelgeId : 0,
            stokKartiId: item.stokKartiId ?? 0,
            miktar: item.miktar,
            fiyatTL: item.fiyatTL,
            fiyatDoviz: item.fiyatDoviz,
            fiyatDovizTipiId: item.fiyatDovizTipiId,
            olcuBirimId: item.olcuBirimId,
            girisCikis: item.girisCikis,
            aciklama1: item.aciklama1,
            aciklama2: item.aciklama2,
            aciklama3: item.aciklama3,
            sira: index +1,
            seriKodu: item.seriKodu,
            teslimTarihi: item.teslimTarihi,
            projeId: item.projeId,
            uniteId: item.uniteId,
          })),
      };

      // API'ye tek seferde gönderim
      const response = await api.talepTeklifSave.save(saveData);

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
      navigate(`/talepsiparis/satinalmatalepliste`);

      // Başarılı durum mesajı
      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Veriler başarıyla kaydedildi",
        life: 3000,
      });

      clearBelgeData();
      clearTalepData();
      clearTalepStokHareketData();

      setGridData([]);
      setTempStokKodu("");
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
  }, [belgeSeri, belgeData, talepData, gridData, updateBelgeId]);

  //güncelleme işlemleri başlangıcı

  useEffect(() => {
    if (updateBelgeId) {
      fetchSavedData();
    }
  }, [updateBelgeId]);

  const fetchSavedData = async () => {
    try {
      const response = await api.talepTeklif.getByBelgeId(updateBelgeId);
      if (response.data.status && response.data.value) {
        const talepTeklifResponse = response.data.value;
        const belge = talepTeklifResponse.belge!;
        if (belge.aktarimDurumu === EAktarimDurumu.AktarimTamamlandi) {
          toast.current?.show({
            severity: "error",
            summary: "Hata",
            detail:
              "Netsis aktarımı tamamlanmış belgede değişiklik yapılamaz...",
            life: 3000,
          });
          setBelgeReadOnly(true);
        }

        setTalepData({
          id: talepTeklifResponse.id,
          belgeId: talepTeklifResponse.belgeId,
          belge: talepTeklifResponse.belge,
          cariId: talepTeklifResponse.cariId,
          cari: talepTeklifResponse.cari,
        });

        const belgeSeri = belge.no.substring(0, 3);
        setBelgeSeri(belgeSeri);
        const belgeNumara = belge.no.substring(3);

        setBelgeData({
          id: belge.id,
          belgeTip: belge.belgeTip,
          no: belgeNumara,
          tarih: currentDate,
          aciklama1: belge.aciklama1,
          aciklama2: belge.aciklama2,
          aciklama3: belge.aciklama3,
          aciklama4: belge.aciklama4,
          aciklama5: belge.aciklama5,
          aciklama6: belge.aciklama6,
          aciklama7: belge.aciklama7,
          aciklama8: belge.aciklama8,
          aciklama9: belge.aciklama9,
          aciklama10: belge.aciklama10,
          tamamlandi: belge.tamamlandi,
          aktarimDurumu: belge.aktarimDurumu,
        });

        const gridResponse = await api.talepTeklifStokHareket.getListByBelgeId(
          updateBelgeId
        );
        if (gridResponse.data.value) {
          setGridData(
            gridResponse.data.value.items.map(
              (item: ITalepTeklifStokHareket) => ({
                id: item.id,
                stokKartiId: item.stokKartiId,
                stokKarti: item.stokKarti,
                miktar: item.miktar,
                fiyatTL: item.fiyatTL,
                fiyatDoviz: item.fiyatDoviz,
                fiyatDovizTipiId: item.fiyatDovizTipiId,
                fiyatDovizTipi: item.fiyatDovizTipi,
                olcuBirimId: item.olcuBirimId,
                olcuBirim: item.olcuBirim,
                girisCikis: item.girisCikis,
                aciklama1: item.aciklama1,
                aciklama2: item.aciklama2,
                aciklama3: item.aciklama3,
                sira: item.sira,
                seriKodu: item.seriKodu,
                teslimTarihi: item.teslimTarihi,
                projeId: item.projeId,
                proje: item.proje,
                uniteId: item.uniteId,
                unite: item.unite,
              })
            )
          );
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //güncelleme işlemleri sonu

  const formatDate = (value: string | Date) => {
    return new Date(value).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const dateBodyTemplate = (rowData: ITalepTeklifStokHareket) => {
    return formatDate(rowData.teslimTarihi);
  };
  const parseDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day); // Aylar 0-11 arasında olduğu için month - 1
    date.setHours(date.getHours() + 3); // +3 saat ekle
     // Saat, dakika, saniye ve milisaniyeyi sıfırla
    //date.setHours(0, 0, 0, 0);
    return date;
  };

    // Dinamik hesaplama fonksiyonu
    const calculateBilgiMiktar = useCallback(() => {
        if (talepStokHareketData.olcuBirimId === olcuBirimOptions[0]?.id) {

          setBilgiMiktar(talepStokHareketData.miktar); 
        } else if (talepStokHareketData.olcuBirimId === olcuBirimOptions[1]?.id) {
            // const bilgMiktar=talepStokHareketData.miktar / (talepStokHareketData.stokKarti?.olcuBr2Pay! / talepStokHareketData.stokKarti?.olcuBr2Payda!)
            // setTalepStokHareketData((state) => ({
            //     ...state,
            //     miktar: Number(bilgMiktar),
            //   }))
          setBilgiMiktar(talepStokHareketData.miktar / (talepStokHareketData.stokKarti?.olcuBr2Pay! / talepStokHareketData.stokKarti?.olcuBr2Payda!)); // 2. birim
        } else if (talepStokHareketData.olcuBirimId === olcuBirimOptions[2]?.id) {
            // const bilgMiktar=talepStokHareketData.miktar / (talepStokHareketData.stokKarti?.olcuBr3Pay! / talepStokHareketData.stokKarti?.olcuBr3Payda!)
            // setTalepStokHareketData((state) => ({
            //     ...state,
            //     miktar: Number(bilgMiktar),
            //   }))
            setBilgiMiktar(talepStokHareketData.miktar / (talepStokHareketData.stokKarti?.olcuBr3Pay! / talepStokHareketData.stokKarti?.olcuBr3Payda!)); // 2. birim
        }
      }, [talepStokHareketData.miktar, talepStokHareketData.olcuBirimId, olcuBirimOptions]);
    
      useEffect(() => {
        if (talepStokHareketData.miktar>0) {
            calculateBilgiMiktar();
        }
      }, [talepStokHareketData.miktar, talepStokHareketData.olcuBirimId, olcuBirimOptions]);

  return (
    <div className="container-fluid">
        {JSON.stringify(talepStokHareketData.miktar)}
        - {JSON.stringify(bilgiMiktar)}
      <Toast ref={toast} />
      <ConfirmDialog
        visible={itemDeleteVisible}
        onHide={() => setItemDeleteVisible(false)}
        message="Silmek istediğinizden emin misiniz?"
        header="Onay"
        icon="pi pi-exclamation-triangle"
        accept={confirmItemDelete}
        reject={() => setItemDeleteVisible(false)}
        acceptLabel="Evet"
        rejectLabel="Hayır"
      />
      <div className="p-fluid p-formgrid p-grid">
        <div className="row">
          <div className="col-md-3 col-sm-6 mt-4">
            <div className="p-inputgroup flex">
              <FloatLabel>
                <Dropdown
                  id="belgeSeri"
                  name="belgeSeri"
                  className="w-full md:w-5rem"
                  showClear
                  placeholder="Seri"
                  value={belgeSeri}
                  options={belgeSeriOptions}
                  onChange={handleBelgeSeriChange}
                  style={{ width: "100%" }}
                />
                <label htmlFor="belgeSeri">Seri</label>
              </FloatLabel>

              <FloatLabel>
                <InputText
                  id="no"
                  name="no"
                  value={belgeData?.no ? belgeData.no : ""}
                  onChange={(e) =>
                    setBelgeData((prevData) => ({
                      ...prevData,
                      seriKodu: e.target.value,
                    }))
                  }
                  style={{ width: "100%", minWidth: "250px" }}
                  readOnly
                  autoComplete="off"
                />
                <label htmlFor="no">Numara</label>
              </FloatLabel>
            </div>
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="cariKodu">Cari Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  autoComplete="off"
                  id="cariKodu"
                  name="cariKodu"
                  value={tempCariKodu??""}
                  readOnly
                  onChange={(e) => {
                    setTempCariKodu(e.target.value);
                    handleCariGetir();
                  }}
                />
                <Button
                  label="..."
                  onClick={() =>
                    setDialogVisible({ ...dialogVisible, cari: true })
                  }
                />
                <CariRehberDialog
                  isVisible={dialogVisible.cari}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, cari: false })
                  }
                  onSelect={(selectedValue) => {
                    setTalepData((prevData) => ({
                      ...prevData,
                      cariId: selectedValue.id!,
                      cari: selectedValue,
                    }));
                  }}
                />
              </div>
              <InputText
                id="cariKartiId"
                name="cariKartiId"
                value={talepData?.cariId?.toString()}
                type="hidden"
                autoComplete="off"
              />
            </FloatLabel>
          </div>
          <div className="col-md-4 col-sm-6 mt-4">
            <InputText
              id="cariAdi"
              name="cariAdi"
              value={talepData?.cari?.adi ?? ""}
              disabled
              autoComplete="off"
            />
          </div>
          <div className="col-md-3 col-sm-6 mt-4">
            <Button
              label="Kaydet"
              icon="pi pi-check"
              loading={saveLoading}
              onClick={handleSave}
              disabled={gridData.filter((item) => item.miktar > 0).length <= 0}
              visible={!belgeReadOnly}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="stokKodu">Stok Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  ref={stokKoduInputRef}
                  autoComplete="off"
                  id="stokKodu"
                  name="stokKodu"
                  value={tempStokKodu ??""}
                  onChange={(e) => setTempStokKodu(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key==="Tab") {
                        handleStokGetir(tempStokKodu);
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
                    setTempStokKodu(selectedValue.kodu);
                    handleStokGetir(selectedValue.kodu);
                  }}
                />
              </div>
              <InputText
                id="stokKartiId"
                name="stokKartiId"
                value={talepStokHareketData?.stokKartiId?.toString() ?? ""}
                type="hidden"
                autoComplete="off"
              />
            </FloatLabel>
          </div>
          <div className="col-md-4 col-sm-6 mt-4">
            {/* <FloatLabel> */}
            {/* <label htmlFor="stokAdi">Stok Adı</label> */}
            <InputText
              id="stokAdi"
              name="stokAdi"
              value={talepStokHareketData?.stokKarti?.adi ? talepStokHareketData.stokKarti.adi:""}
              disabled
              autoComplete="off"
            />
            {/* </FloatLabel> */}
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="seriKodu">Ek Alan / Seri Kodu</label>
              <InputText
                id="seriKodu"
                name="seriKodu"
                value={talepStokHareketData?.seriKodu ?? ""}
                autoComplete="off"
                onChange={(e) =>
                  setTalepStokHareketData((prevData) => ({
                    ...prevData,
                    seriKodu: e.target.value,
                  }))
                }
              />
            </FloatLabel>
          </div>
          <div className="col-md-1 col-sm-6 mt-4">
            <FloatLabel>
              <Dropdown
                id="olcuBirim"
                name="olcuBirim"
                className="w-full md:w-8rem"
                placeholder="Ölçü Birim"
                value={talepStokHareketData.olcuBirimId}
                options={olcuBirimOptions}
                onChange={(e) => {
                    const selectedBirim = olcuBirimOptions.find(
                      (option) => option.id === e.value
                    );
                
                    if (selectedBirim) {
                      setTalepStokHareketData((prevData) => ({
                        ...prevData,
                        olcuBirim: selectedBirim!, // Seçilen olcuBirim nesnesini set et
                        olcuBirimId: selectedBirim.id!, // Id'sini de güncelleyebilirsiniz
                      }));
                    }
                  }}
                style={{ width: "100%" }}
                optionLabel="adi" // Dropdown'da gösterilecek alan
                optionValue="id" // Seçilen değerin ID'sini döndürmek için
              />
              <label htmlFor="belgeSeri">Ölçü Birim</label>
            </FloatLabel>
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="miktar">Miktar</label>
              <InputNumber
                id="miktar"
                name="miktar"
                value={talepStokHareketData.miktar ?? 0}
                min={0}
                minFractionDigits={0}
                maxFractionDigits={miktarDecimal}
                onChange={(e) =>
                  setTalepStokHareketData((state) => ({
                    ...state,
                    miktar: Number(e.value),
                  }))
                }
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") {
                //     handleAddToGrid();
                //   }
                // }}
                ref={miktarRef}
                inputStyle={{ textAlign: "right" }}
              />
            </FloatLabel>
          </div>
          <div className="col-md-1 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="miktar">Miktar</label>

              <InputNumber
                id="bilgiMiktar"
                name="bilgiMiktar"
                value={bilgiMiktar ?? 0}
                maxFractionDigits={miktarDecimal}
                disabled
                inputStyle={{ textAlign: "right" }}
              />
            </FloatLabel>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="teslimTarihi">Teslim Tarihi</label>
              <InputMask
                id="teslimTarihi"
                name="teslimTarihi"
                value={formatDate(talepStokHareketData?.teslimTarihi)}
                autoComplete="off"
                mask="99/99/9999"
                placeholder="dd/mm/yyyy"
                slotChar="dd/mm/yyyy"
                onChange={(e) =>{
                const parsedDate = parseDate(e.value!); // Girilen tarihi parse et
                if (!isNaN(parsedDate.getTime()))
                 { setTalepStokHareketData((prevData) => ({
                    ...prevData,
                    teslimTarihi: parsedDate//new Date(e.value!),
                  }))}
                 
                }}
              />
            </FloatLabel>
          </div>

          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="aciklama1">Açıklama 1</label>
              <InputText
                id="aciklama1"
                name="aciklama1"
                value={talepStokHareketData?.aciklama1 ?? ""}
                autoComplete="off"
                onChange={(e) =>
                  setTalepStokHareketData((prevData) => ({
                    ...prevData,
                    aciklama1: e.target.value,
                  }))
                }
              />
            </FloatLabel>
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="aciklama2">Açıklama 2</label>
              <InputText
                id="aciklama2"
                name="aciklama2"
                value={talepStokHareketData?.aciklama2 ?? ""}
                autoComplete="off"
                onChange={(e) =>
                  setTalepStokHareketData((prevData) => ({
                    ...prevData,
                    aciklama2: e.target.value,
                  }))
                }
              />
            </FloatLabel>
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="aciklama3">Açıklama 3</label>
              <InputText
                id="aciklama3"
                name="aciklama3"
                value={talepStokHareketData?.aciklama3 ?? ""}
                autoComplete="off"
                onChange={(e) =>
                  setTalepStokHareketData((prevData) => ({
                    ...prevData,
                    aciklama3: e.target.value,
                  }))
                }
              />
            </FloatLabel>
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="projeKodu">Proje Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  id="projeKodu"
                  name="projeKodu"
                  value={talepStokHareketData.proje?.kodu ?? ""}
                  readOnly
                  disabled
                  autoComplete="off"
                />
                <Button
                  label="..."
                  //icon="pi pi-search"
                  //className="p-button-warning"
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
                    setTalepStokHareketData((prevData) => ({
                      ...prevData,
                      projeId: selectedValue.id!,
                      proje: selectedValue,
                    }))
                  }
                />
              </div>
              <InputText
                id="projeKoduId"
                name="projeKoduId"
                value={talepStokHareketData?.projeId?.toString() ?? ""}
                type="hidden"
                autoComplete="off"
              />
            </FloatLabel>
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="uniteKodu">Ünite Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  id="uniteKodu"
                  name="uniteKodu"
                  value={talepStokHareketData.unite?.kodu ?? ""}
                  readOnly
                  disabled
                  autoComplete="off"
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
                    setTalepStokHareketData((prevData) => ({
                      ...prevData,
                      uniteId: selectedValue.id!,
                      unite: selectedValue,
                    }))
                  }
                />
              </div>
              <InputText
                id="uniteId"
                name="uniteId"
                value={talepStokHareketData?.uniteId?.toString() ?? ""}
                type="hidden"
                autoComplete="off"
              />
            </FloatLabel>
          </div>

          <div className="p-col-12  mt-3">
            <Button
              label="Ekle"
              icon="pi pi-plus"
              onClick={handleAddToGrid}
              disabled={belgeReadOnly}
            />
          </div>
        </div>
        <div className="p-col-12">
          <DataTable
            size="small"
            stripedRows
            value={gridData}
            rows={100}
            //loading={loadingGetir}
            dataKey="id"
            scrollable
            scrollHeight="400px"
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
            <Column field="stokKartiId" header="Stok Kartı Id" hidden/>
            <Column field="stokKarti.kodu" header="Stok Kodu" />
            <Column field="stokKarti.adi" header="Stok Adı" />
            <Column field="miktar" header="Miktar" />
            <Column field="olcuBirim.simge" header="Br" />

            <Column field="fiyatTL" header="Fiyat"hidden />
            <Column field="fiyatDoviz" header="Döviz Fiyat" hidden/>
            <Column field="fiyatDovizTipi.simge" header="Döviz Tipi" hidden/>
            <Column field="aciklama1" header="Açıklama 1" />
            <Column field="aciklama2" header="Açıklama 2" />
            <Column field="aciklama3" header="Açıklama 3" />
            <Column field="sira" header="Sıra" hidden />
            <Column field="seriKodu" header="Seri Kodu" />
            <Column
              field="teslimTarihi"
              header="Teslim Tarihi"
              dataType="date"
              body={dateBodyTemplate}
            />
            <Column field="projeId" header="ProjeId" hidden/>
            <Column field="proje.kodu" header="Proje Kodu" />
            <Column field="uniteId" header="Ünite Id" hidden />
            <Column field="unite.kodu" header="Ünite Kodu" />

            <Column
              body={(rowData) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => {
                        setTempStokKodu(rowData.stokKarti.kodu);
                      handleEditGridItem(rowData);
                    }}
                  >
                    <i className="ti-pencil"></i>
                  </button>
                  <button
                    className="btn btn-danger ms-1"
                    onClick={() => {
                      setSelectedGridItem(rowData);
                      setItemDeleteVisible(true);
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
export default satinalmaTalepFisi;
