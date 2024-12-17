import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IBelge } from "../../utils/types/fatura/IBelge";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { EBelgeTip } from "../../utils/types/enums/EBelgeTip";
import { EAktarimDurumu } from "../../utils/types/enums/EAktarimDurumu";
import api from "../../utils/api";
import { FilterMeta, transformFilter } from "../../utils/transformFilter";
import { IBelgeSeri } from "../../utils/types/tanimlamalar/IBelgeSeri";
import { InputMask } from "primereact/inputmask";
import { IStokOlcuBirim } from "../../utils/types/tanimlamalar/IStokOlcuBirim";
import { InputNumber } from "primereact/inputnumber";
import ProjeRehberDialog from "../../components/Rehber/ProjeRehberDialog";
import UniteRehberDialog from "../../components/Rehber/UniteRehberDialog";
import CariRehberDialog from "../../components/Rehber/CariRehberDialog";
import NetsisCariOdemeTipiRehberDialog from "../../components/Rehber/NetsisCariOdemeTipiRehberDialog";
import { ISiparis } from "../../utils/types/fatura/ISiparis";
import { EFaturaTip } from "../../utils/types/enums/EFaturaTip";
import { ISiparisStokHareket } from "../../utils/types/fatura/ISiparisStokHareket";
import { IDovizTipi } from "../../utils/types/tanimlamalar/IDovizTipi";
import { ISiparisSaveData } from "../../utils/types/fatura/ISiparisSaveData";
import { EIhracatIthalatTip } from "../../utils/types/enums/EIhracatIthalatTip";
import {
  selectAllTextInputNumber,
  selectAllTextInputText,
} from "../../utils/helpers/selectAllText";
import { roundToDecimal } from "../../utils/helpers/yuvarlama";
import {
  fiyatDecimal,
  kurDecimal,
  miktarDecimal,
  oranDecimal,
  tutarDecimal,
} from "../../utils/config";
import TalepStokRehberDialog from "../../components/Rehber/TalepStokRehberDialog";
import { TabPanel, TabView } from "primereact/tabview";
import { formatNumber } from "../../utils/helpers/formatNumberForGrid";

const satinalmaSiparisFisi = () => {
  const currentDate = new Date();
  currentDate.setHours(3, 0, 0, 0);
  const navigate = useNavigate();

  const miktarRef = useRef<InputNumber | null>(null);
  const dovizFiyatRef = useRef<InputNumber | null>(null);
  const kurRef = useRef<InputNumber | null>(null);
  const fiyatRef = useRef<InputNumber | null>(null);

  const stokKoduInputRef = useRef<any>(null);
  const [tempStokKodu, setTempStokKodu] = useState("");
  const [tempCariKodu, setTempCariKodu] = useState("");

  //const [bilgiMiktar, setBilgiMiktar] = useState(0);
  const [olcuBirimCarpanMiktar, setOlcuBirimCarpanMiktar] = useState(0);
  const [olcuBirimCarpanFiyat, setOlcuBirimCarpanFiyat] = useState(0);

  const [olcuBirimOptions, setOlcuBirimOptions] = useState<IStokOlcuBirim[]>([]);
  const [dovizTipiOptions, setDovizTipiOptions] = useState<IDovizTipi[]>([]);

  const [saveLoading, setSaveLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  //Belge Data işlemleri başlangıç
  const [belgeData, setBelgeData] = useState<IBelge>({
    no: "",
    belgeTip: EBelgeTip.SatinalmaSiparis,
    aktarimDurumu: EAktarimDurumu.AktarimSirada,
    tarih: currentDate,
  });
  const clearBelgeData = () => {
    setBelgeData({
      id: 0,
      aktarimDurumu: EAktarimDurumu.AktarimSirada,
      belgeTip: EBelgeTip.SatinalmaSiparis,
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
  const [siparisData, setSiparisData] = useState<ISiparis>({
    id: 0,
    belgeId: 0,
    cariId: 0,
    tip: EFaturaTip.Acik,
    ithalatIhracatTip: undefined,
    exportReferansNo: undefined,
    odemeKodu: "",
    cikisEvrakTarihi: undefined,
    gumrukVarisTarihi: undefined,
    tasiyiciFirma: undefined,
    varisEvraklariTarihi: undefined,
    dovizAraToplam: 0,
    dovizIskonto: 0,
    dovizKDV: 0,
    dovizNetToplam: 0,
    araToplamTL: 0,
    iskontoTL: 0,
    kdvTL: 0,
    netToplamTL: 0,
  });
  const clearSiparisData = () => {
    setSiparisData({
      id: 0,
      belgeId: 0,
      cariId: 0,
      tip: EFaturaTip.Acik,
      ithalatIhracatTip: undefined,
      exportReferansNo: undefined,
      odemeKodu: "",
      cikisEvrakTarihi: undefined,
      gumrukVarisTarihi: undefined,
      tasiyiciFirma: undefined,
      varisEvraklariTarihi: undefined,
      dovizAraToplam: 0,
      dovizIskonto: 0,
      dovizKDV: 0,
      dovizNetToplam: 0,
      araToplamTL: 0,
      iskontoTL: 0,
      kdvTL: 0,
      netToplamTL: 0,
    });
  };
  //Talep Data işlemleri bitiş

  const defaultDovizTipi: IDovizTipi = {
    id: 1,
    kodu: "TL",
    adi: "TÜRK LİRASI",
    simge: "₺",
    tcmbId: 0,
  };

  //Talep Stok Hareket Data işlemleri başlangıç
  const [siparisStokHareketData, setSiparisStokHareketData] =
    useState<ISiparisStokHareket>({
      id: 0,
      belgeId: undefined,
      belge: undefined,
      stokKartiId: 0,
      stokKarti: undefined,
      talepTeklifStokHareketId: 0,
      talepTeklifStokHareket: undefined,
      girisCikis: "G",
      seriKodu: undefined,
      olcuBirimId: 0,
      olcuBirim: undefined,
      miktar: 0,
      teslimTarihi: currentDate,
      istenilenTeslimTarihi: currentDate,
      fiyatOlcuBirimId: 0,
      fiyatOlcuBirim: undefined,
      fiyatDovizTipiId: defaultDovizTipi.id,
      fiyatDovizTipi: defaultDovizTipi,
      fiyatDoviz: 0,
      fiyatTL: 0,
      //fiyatNet: 0,
      //iskontoTL: 0,
      tutar: 0,
      projeId: 0,
      proje: undefined,
      uniteId: 0,
      unite: undefined,
    });
  const clearSiparisStokHareketData = () => {
    setSiparisStokHareketData((prevData) => ({
      ...prevData,
      id: 0,
      belgeId: undefined,
      belge: undefined,
      stokKartiId: 0,
      stokKarti: undefined,
      talepTeklifStokHareketId: 0,
      talepTeklifStokHareket: undefined,
      girisCikis: "G",
      seriKodu: undefined,
      olcuBirimId: 0,
      olcuBirim: undefined,
      miktar: 0,
      teslimTarihi: currentDate,
      istenilenTeslimTarihi: currentDate,
      fiyatOlcuBirimId: 0,
      fiyatOlcuBirim: undefined,
      fiyatDovizTipiId: defaultDovizTipi.id,
      fiyatDovizTipi: defaultDovizTipi,
      fiyatDoviz: 0,
      fiyatTL: 0,
      fiyatNet: 0,
      tutar: 0,
      projeId: 0,
      proje: undefined,
      uniteId: 0,
      unite: undefined,
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

        const filters: FilterMeta = {
          BelgeTip: { value: EBelgeTip.SatinalmaSiparis, matchMode: "equals" },
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
          EBelgeTip.SatinalmaSiparis
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
  const [gridData, setGridData] = useState<ISiparisStokHareket[]>([]); //Grid data farklı olmadığından yine stok hareketlerini verdim

  const calculateTotals = useCallback(() => {
    let toplamTL = 0;
    let toplamDoviz = 0;
    const dovizTiplerineGoreGruplama: { [key: number]: number } = {};

    gridData.forEach((item) => {
      toplamTL += item.tutar;

      if (item.fiyatDovizTipi?.id !== defaultDovizTipi.id) {
        const dovizTipiId = item.fiyatDovizTipi.id;
        dovizTiplerineGoreGruplama[dovizTipiId] =
          (dovizTiplerineGoreGruplama[dovizTipiId] || 0) +
          item.fiyatDoviz * item.miktar;
      }
    });

    const dovizTipleri = Object.keys(dovizTiplerineGoreGruplama);

    // Eğer sadece bir döviz tipi varsa toplamDoviz hesaplanır
    if (dovizTipleri.length === 1) {
      toplamDoviz = roundToDecimal(
        Object.values(dovizTiplerineGoreGruplama)[0],
        tutarDecimal
      );
    } else {
      toplamDoviz = 0; // Birden fazla döviz tipi varsa toplamDoviz sıfırlanır
    }

    setSiparisData((prevData) => ({
      ...prevData,
      araToplamTL: roundToDecimal(toplamTL, tutarDecimal),
      kdvTL: roundToDecimal(
        (toplamTL - siparisData.iskontoTL) * 0.2,
        tutarDecimal
      ),
      dovizAraToplam: roundToDecimal(toplamDoviz, tutarDecimal),
      dovizKDV: roundToDecimal(
        (toplamDoviz - siparisData.dovizIskonto) * 0.2,
        tutarDecimal
      ),
      netToplamTL: roundToDecimal(
        toplamTL -
          siparisData.iskontoTL +
          roundToDecimal(
            (toplamTL - siparisData.iskontoTL) * 0.2,
            tutarDecimal
          ),
        tutarDecimal
      ),
      dovizNetToplam: roundToDecimal(
        toplamDoviz -
          siparisData.dovizIskonto +
          roundToDecimal(
            (toplamDoviz - siparisData.dovizIskonto) * 0.2,
            tutarDecimal
          ),
        tutarDecimal
      ),
    }));
  }, [
    gridData,
    defaultDovizTipi.id,
    siparisData.iskontoTL,
    siparisData.dovizIskonto,
  ]);

  const [selectedGridItem, setSelectedGridItem] =
    useState<ISiparisStokHareket | null>(null);

      //Gride ekleme öncesi validasyon kontrolleri
  const validateAddToGrid = async () => {

    if (siparisStokHareketData.teslimTarihi) {
      const teslimTarihi = new Date(siparisStokHareketData.teslimTarihi);

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

    if (
      !siparisStokHareketData?.proje ||
      siparisStokHareketData?.projeId <= 0
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Hatalı Proje",
        life: 3000,
      });
      return false;
    }

    if (
      !siparisStokHareketData?.unite ||
      siparisStokHareketData?.uniteId <= 0
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Hatalı Ünite",
        life: 3000,
      });
      return false;
    }

    if (
      !siparisStokHareketData?.stokKarti ||
      siparisStokHareketData?.stokKartiId <= 0
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Hatalı Stok",
        life: 3000,
      });
      return false;
    }

    if (!siparisStokHareketData?.miktar || siparisStokHareketData.miktar <= 0 ) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Miktar sıfırdan büyük olmalı...",
        life: 3000,
      });
      return false;
    }

    const stokSiparisIcinUygun = await stokSiparisIcinUygunMu();

    
    if (!stokSiparisIcinUygun)
      {
          toast.current?.show({
            severity: "error",
            summary: "Hata",
            detail: "Miktar talepten fazla...",
            life: 3000,
          });
          return false;
        
      }

    return true;
  };

  const stokSiparisIcinUygunMu = useCallback(async () => {
    const stokTalepResponse = await api.talepTeklifStokHareket.get(siparisStokHareketData.talepTeklifStokHareketId);

    if (stokTalepResponse?.data?.status && stokTalepResponse?.data.value) {
      const stokTalepData = stokTalepResponse.data.value;




      if (stokTalepData.miktar < siparisStokHareketData.miktar) {//Girilen, izin verilenden büyük mü?
        return false;
      }

      // Grid'deki aynı stoğa ait toplam miktarı hesapla
      const mevcutToplamMiktar = gridData
        .filter(
          (item) =>
            item.stokKarti?.kodu === siparisStokHareketData.stokKarti?.kodu
        )
        .reduce((acc, curr) => acc + (curr.miktar || 0), 0);
      let toplamMiktar = mevcutToplamMiktar + siparisStokHareketData.miktar;

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
    siparisStokHareketData.talepTeklifStokHareketId,
    siparisStokHareketData.stokKarti?.kodu,
    gridData,
    selectedGridItem,
    siparisStokHareketData.miktar
  ]);

  //gride doldurma işlemleri
  const handleAddOrUpdate  = useCallback(async () => {

    const isValid = await validateAddToGrid();
    if (!isValid) return; 

    //if (!validateAddToGrid()) return;

    if (isEditing && selectedGridItem) {
      setGridData((prevGridData) =>
        prevGridData.map((item) =>
          item.sira === siparisStokHareketData?.sira
            ? {
                ...item,
                stokKartiId: siparisStokHareketData.stokKartiId,
                stokKarti: siparisStokHareketData?.stokKarti,
                //stokAdi: formDataDetay.stokAdi,
                talepTeklifStokHareketId:
                  siparisStokHareketData.talepTeklifStokHareketId,
                talepTeklifStokHareket:
                  siparisStokHareketData.talepTeklifStokHareket,
                //girisCikis: siparisStokHareketData.girisCikis,
                //sira: siparisStokHareketData.sira,
                seriKodu: siparisStokHareketData.seriKodu,
                olcuBirimId:
                  siparisStokHareketData.stokKarti?.stokOlcuBirim1Id!,
                olcuBirim: siparisStokHareketData.stokKarti?.stokOlcuBirim1,
                miktar: roundToDecimal(
                  siparisStokHareketData.miktar / olcuBirimCarpanMiktar,
                  miktarDecimal
                ), //siparisStokHareketData!.miktar,
                teslimTarihi: siparisStokHareketData.teslimTarihi,
                istenilenTeslimTarihi:
                  siparisStokHareketData.istenilenTeslimTarihi,
                fiyatOlcuBirimId:siparisStokHareketData.fiyatOlcuBirimId,
                fiyatOlcuBirim:siparisStokHareketData.fiyatOlcuBirim,
                fiyatDovizTipiId: siparisStokHareketData.fiyatDovizTipiId,
                fiyatDovizTipi: siparisStokHareketData.fiyatDovizTipi,
                fiyatDoviz: siparisStokHareketData.fiyatDoviz,
                fiyatTL: siparisStokHareketData.fiyatTL,
                // fiyatNet: roundToDecimal(
                //    siparisStokHareketData.fiyatTL * olcuBirimCarpanFiyat,
                //    fiyatDecimal
                //  ), //gridi güncellerken net fiyat
                // //iskontoTL: siparisStokHareketData.iskontoTL,
                tutar: siparisStokHareketData.tutar,
                projeId: siparisStokHareketData.projeId,
                proje: siparisStokHareketData.proje,
                uniteId: siparisStokHareketData.uniteId,
                unite: siparisStokHareketData.unite,
              }
            : item
        )
      );
    } else {
      const maxId =
        gridData.length > 0
          ? Math.max(...gridData.map((item) => item.sira!))
          : 0;
      // bunu neden koymuşum hiç anlamadım.
      const newGridData: ISiparisStokHareket = {
        id: 0, //maxId + 1,
        belgeId: siparisStokHareketData.belgeId,
        belge: siparisStokHareketData.belge,
        stokKartiId: siparisStokHareketData.stokKartiId,
        stokKarti: siparisStokHareketData?.stokKarti,
        //stokAdi: formDataDetay.stokAdi,
        talepTeklifStokHareketId:
          siparisStokHareketData.talepTeklifStokHareketId,
        talepTeklifStokHareket: siparisStokHareketData.talepTeklifStokHareket,
        girisCikis: siparisStokHareketData.girisCikis,
        sira: maxId + 1, //siparisStokHareketData.sira,
        seriKodu: siparisStokHareketData.seriKodu,
        olcuBirimId: siparisStokHareketData.stokKarti?.stokOlcuBirim1Id!,
        olcuBirim: siparisStokHareketData.stokKarti?.stokOlcuBirim1, //siparisStokHareketData!.olcuBirim,
        miktar: roundToDecimal(
          siparisStokHareketData.miktar / olcuBirimCarpanMiktar,
          miktarDecimal
        ), //siparisStokHareketData!.miktar,
        teslimTarihi: siparisStokHareketData.teslimTarihi,
        istenilenTeslimTarihi: siparisStokHareketData.istenilenTeslimTarihi,
        fiyatOlcuBirimId: siparisStokHareketData.fiyatOlcuBirimId,
        fiyatOlcuBirim: siparisStokHareketData.fiyatOlcuBirim,
        fiyatDovizTipiId: siparisStokHareketData.fiyatDovizTipiId,
        fiyatDovizTipi: siparisStokHareketData.fiyatDovizTipi,
        fiyatDoviz: siparisStokHareketData.fiyatDoviz,
        fiyatTL: siparisStokHareketData.fiyatTL,
        //fiyatNet: roundToDecimal(siparisStokHareketData.fiyatTL * olcuBirimCarpanFiyat,fiyatDecimal), //gride eklerken net fiyat
        //iskontoTL: siparisStokHareketData.iskontoTL,
        tutar: siparisStokHareketData.tutar,
        projeId: siparisStokHareketData.projeId,
        proje: siparisStokHareketData.proje,
        uniteId: siparisStokHareketData.uniteId,
        unite: siparisStokHareketData.unite,
      };
      setGridData((prevGridData) => [...prevGridData, newGridData]);
    }

    setSelectedGridItem(null);
    // setTalepStokHareket((stokHareket) => ({ ...stokHareket,
    //     stokKartiId:0, stokAdi: "", miktar: 0,istenilenMiktar:0,bakiye:0 }));
    clearSiparisStokHareketData();
    setIsEditing(false);
  }, [isEditing,selectedGridItem,siparisStokHareketData, gridData]);



  //Alt taraf grid işlemleri bitiş

  const [itemDeleteVisible, setItemDeleteVisible] = useState(false);
  const [searchParams] = useSearchParams();

  const [belgeReadOnly, setBelgeReadOnly] = useState<boolean>(false);

  const [isDovizEnabled, setIsDovizEnabled] = useState(false);
  const [dovizKur, setDovizKur] = useState(0);

  const [genelIskontoOran, setGenelIskontoOran] = useState(0)

  //Rehberlerin görünürlük durumu
  const [dialogVisible, setDialogVisible] = useState({
    cari: false,
    odemeKodu: false,
    stok: false,
    proje: false,
    unite: false,
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

      setSiparisData((prevState) =>
        prevState.cariId === cariKarti.id
          ? prevState
          : {
              ...prevState,
              cari: cariKarti,
              cariId: cariKarti.id!,
            }
      );
    }
  }, [tempCariKodu]);
  // tempCariKodu değiştiğinde handleCariGetir fonksiyonunu çağır
  useEffect(() => {
    if (tempCariKodu) {
      handleCariGetir();
    }
  }, [tempCariKodu, handleCariGetir]);

  const handleCariGetirById = useCallback(async () => {
    const response = await api.cari.get(siparisData.cariId);
    if (response?.data?.status && response?.data?.value) {
      const cariKarti = response.data.value;
      setSiparisData((prevState) =>
        prevState.cari?.id === cariKarti.id
          ? prevState
          : { ...prevState, cari: cariKarti }
      );

      if (tempCariKodu !== cariKarti.kodu) {
        setTempCariKodu(cariKarti.kodu);
      }
    }
  }, [siparisData.cariId, tempCariKodu]);

  useEffect(() => {
    if (siparisData.cariId > 0) {
      handleCariGetirById();
    }
  }, [siparisData.cariId, handleCariGetirById]);


  const handleProjeGetirById = useCallback(async()=> {

    const response = await api.proje.get(siparisStokHareketData.projeId);
    if(response?.data?.status && response?.data?.value)
    {
      const projeData=response.data.value;
      setSiparisStokHareketData((prevState)=> ({
        ...prevState,
        proje:projeData
      }));
    }

  },[siparisStokHareketData.projeId]);

  useEffect(()=> {
    if(siparisStokHareketData.projeId>0)
      handleProjeGetirById();
  },[siparisStokHareketData.projeId]);

  const handleUniteGetirById = useCallback(async()=> {

    const response = await api.unite.get(siparisStokHareketData.uniteId);
    if(response?.data?.status && response?.data?.value)
    {
      const uniteData=response.data.value;
      setSiparisStokHareketData((prevState)=> ({
        ...prevState,
        unite:uniteData,
      }));
    }

  },[siparisStokHareketData.uniteId]);

  useEffect(()=> {

    if(siparisStokHareketData.uniteId>0)
      handleUniteGetirById();
  },[siparisStokHareketData.uniteId]);

  //Silme onaylaması yapıldıktan sonra
  const confirmItemDelete = useCallback(() => {
    if (selectedGridItem) {
      deleteItem(selectedGridItem);
      setItemDeleteVisible(false);
    }
  }, [selectedGridItem]);

  useEffect(() => {
    calculateTotals();
  }, [
    gridData,
    defaultDovizTipi.id,
    siparisData.iskontoTL,
    siparisData.dovizIskonto,
  ]);
  //gridden silme işlemi
  const deleteItem = useCallback((item: ISiparisStokHareket) => {
    try {
      setGridData((prevGridData) => {
        const newGridData = prevGridData.filter((i) => i.sira !== item.sira);
        return newGridData;
      });

      setSelectedGridItem(null);

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
  const handleEditGridItem = useCallback(async (item: ISiparisStokHareket) => {
    setSelectedGridItem(item);
    setIsEditing(true);
    // Seçilen grid item'ını formda göstermek için ilgili state'leri güncelle
    setSiparisStokHareketData({
      ...item
    });
    stokOlcuBirimDoldur(item.stokKarti);

    // const response = await api.stok.getByKod(item.stokKarti?.kodu!);
    // if (response?.data?.status && response?.data?.value) {
    //   const stokKarti = response.data.value;
    //   // Ölçü birimi seçeneklerini oluşturma
    //   stokOlcuBirimDoldur(stokKarti);
    // }
  }, []);

  //stokgetirme mevzusu, burada diğer işlerden farklı olarak bazı şeyler talepten gelecek.
  const handleStokGetir = useCallback(async (stokKodu: string) => {
    if (!stokKodu) {
      selectAllTextInputText(stokKoduInputRef);
      return;
    }
    //clearTalepStokHareketData();
    const response = await api.stok.getByKod(stokKodu);

    if (response?.data?.status && response?.data?.value) {
      const stokKarti = response.data.value;

      stokOlcuBirimDoldur(stokKarti);

      //setSelectedOlcuBirim(options[0]); // İlk değeri seçili yapabilirsiniz

      setSiparisStokHareketData((prevState) => ({
        ...prevState,
        stokKarti: stokKarti,
        stokKartiId: stokKarti.id!,
        // fiyatDoviz:0,
        // fiyatTL:0,
        // miktar:0,
        girisCikis: "G",
        fiyatDovizTipiId: stokKarti?.alisDovizTipiId,
        fiyatDovizTipi: stokKarti?.alisDovizTipi!,
        olcuBirimId: stokKarti.stokOlcuBirim1Id,
        olcuBirim: stokKarti.stokOlcuBirim1,
        fiyatDoviz: 0,
        fiyatNet: 0,
        fiyatOlcuBirimId: stokKarti.stokOlcuBirim1Id,
        fiyatTL: stokKarti.alisFiyati,
        iskontoTL: 0,
        teslimTarihi: currentDate,

        miktar: 0, // bu talepten gelecek
        projeId: 0, //talepten
        tutar: 0,
        talepTeklifStokHareketId: 0, //talepten
        talepTeklifStokHareket: undefined,
        istenilenTeslimTarihi: currentDate, //talepten
        uniteId: 0, //talepten
      }));
    } else {
      selectAllTextInputText(stokKoduInputRef);
    }
  }, []);

 

  const dovizTipiDoldur = async () => {
    const dovizTipiResponse = await api.dovizTipi.getAll(0, 99);
    if (dovizTipiResponse?.data?.value?.items) {
      setDovizTipiOptions(dovizTipiResponse.data.value.items);
    }
  };

  useEffect(() => {
    dovizTipiDoldur();
  }, []);

  useEffect(() => {
    if (siparisStokHareketData.fiyatDovizTipiId === defaultDovizTipi.id) {
      // Döviz tipi TL ise döviz fiyatı sıfırla
      setSiparisStokHareketData((prevData) => ({
        ...prevData,
        fiyatDoviz: 0,
      }));
      setIsDovizEnabled(false);
    } else {
      setIsDovizEnabled(true);
    }
  }, [siparisStokHareketData.fiyatDovizTipiId, defaultDovizTipi.id]);

  const stokOlcuBirimDoldur = (stokKarti: any) => {
    const options = [
      stokKarti.stokOlcuBirim1,
      stokKarti.stokOlcuBirim2,
      stokKarti.stokOlcuBirim3,
    ].filter(
      (item): item is IStokOlcuBirim => item !== undefined && item !== null
    );

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
    if (!siparisData?.cariId) {
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
    if (!validateSave()) {
      return;
    }
    setSaveLoading(true);
    try {
      const saveData: ISiparisSaveData = {
        //SaveTalepTeklifDto
        belge: {
          id: updateBelgeId !== 0 ? updateBelgeId : 0,
          belgeTip: EBelgeTip.SatinalmaSiparis,
          no: belgeSeri + belgeData.no,
          tarih: belgeData.tarih,
          aciklama1: belgeData.aciklama1,
          aciklama2: belgeData.aciklama2,
          aciklama3: belgeData.aciklama3,
          tamamlandi: true,
          aktarimDurumu: EAktarimDurumu.AktarimSirada,
        },

        siparis: {
          id: siparisData.id, // !== 0 ? await getAmbarFisiId(updateBelgeId) : 0,
          belgeId: updateBelgeId !== 0 ? updateBelgeId : 0,
          cariId: siparisData.cariId,
          tip: siparisData.tip,
          ithalatIhracatTip: siparisData.ithalatIhracatTip,
          exportReferansNo: siparisData.exportReferansNo,
          odemeKodu: siparisData.odemeKodu,
          cikisEvrakTarihi: siparisData.cikisEvrakTarihi,
          gumrukVarisTarihi: siparisData.gumrukVarisTarihi,
          tasiyiciFirma: siparisData.tasiyiciFirma,
          varisEvraklariTarihi: siparisData.varisEvraklariTarihi,
          dovizAraToplam: siparisData.dovizAraToplam,
          dovizIskonto: siparisData.dovizIskonto,
          dovizKDV: siparisData.dovizKDV,
          dovizNetToplam: siparisData.dovizNetToplam,
          araToplamTL: siparisData.araToplamTL,
          iskontoTL: siparisData.iskontoTL,
          kdvTL: siparisData.kdvTL,
          netToplamTL: siparisData.netToplamTL,
        },

        siparisStokHarekets: gridData
          .filter((item) => item.miktar > 0)
          .map((item, index) => ({
            id: item.id,
            belgeId: updateBelgeId !== 0 ? updateBelgeId : 0,
            stokKartiId: item.stokKartiId ?? 0,
            talepTeklifStokHareketId: item.talepTeklifStokHareketId,
            girisCikis: item.girisCikis,
            sira: index + 1,
            seriKodu: item.seriKodu,
            olcuBirimId: item.olcuBirimId,
            miktar: item.miktar,
            teslimTarihi: item.teslimTarihi,
            istenilenTeslimTarihi: item.istenilenTeslimTarihi,
            fiyatOlcuBirimId: item.fiyatOlcuBirimId,
            fiyatDovizTipiId: item.fiyatDovizTipiId,
            fiyatDovizTipi: defaultDovizTipi, // Bu döviz tipini ? yapmadım ama ilerde tekrar kontrol etmek gerek

            fiyatDoviz: item.fiyatDoviz,
            fiyatTL: item.fiyatTL,
            //fiyatNet: item.fiyatNet, //save için back e gönderirken
            //iskontoTL: item.iskontoTL,
            tutar: item.tutar,
            projeId: item.projeId,
            uniteId: item.uniteId,
          })),
      };

      // API'ye tek seferde gönderim
      const response = await api.siparisSave.save(saveData);

      if (!response.data.status) {
        throw new Error(
          Object.entries(response.data.errors || {})
            .map(([key, messages]) => `${key}: ${messages.join(", ")}`)
            .join("\n") ||
            response.data.detail ||
            "Veriler kaydedilirken bir hata oluştu."
        );
      }
      navigate(`/talepsiparis/satinalmasiparisliste`);

      // Başarılı durum mesajı
      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Veriler başarıyla kaydedildi",
        life: 3000,
      });

      clearBelgeData();
      clearSiparisData();
      clearSiparisStokHareketData();

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
  }, [belgeSeri, belgeData, siparisData, gridData, updateBelgeId]);

  //güncelleme işlemleri başlangıcı

  useEffect(() => {
    if (updateBelgeId) {
      fetchSavedData();
    }
  }, [updateBelgeId]);

  const fetchSavedData = async () => {
    try {
      const belgeResponse = await api.belge.get(updateBelgeId);
      if (!belgeResponse.data || !belgeResponse.data.value) {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Belge bilgileri alınamadı, işlem devam edemiyor...",
          life: 3000,
        });
        return;
      }
      const belge = belgeResponse.data.value;
      if (belge.aktarimDurumu === EAktarimDurumu.AktarimTamamlandi) {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Netsis aktarımı tamamlanmış belgede değişiklik yapılamaz...",
          life: 3000,
        });
        setBelgeReadOnly(true);
      }

      const siparisResponse = await api.siparis.getByBelgeId(updateBelgeId);
      if (!siparisResponse.data.status && !siparisResponse.data.value) {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Sipariş bilgileri alınamadı, işlem devam edemiyor...",
          life: 3000,
        });
        return;
      }
      const siparis = siparisResponse.data.value;

      const siparisStokHareketResponse =
        await api.siparisStokHareket.getListByBelgeId(updateBelgeId);
      if (
        !siparisStokHareketResponse.data ||
        !siparisStokHareketResponse.data.value ||
        siparisStokHareketResponse.data.value.count == 0
      ) {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail:
            "Sipariş stok hareket bilgileri alınamadı, işlem devam edemiyor...",
          life: 3000,
        });
        return;
      }
      const siparisStokHareket = siparisStokHareketResponse.data.value.items;

      setSiparisData({
        id: siparis.id,
        belgeId: siparis.belgeId,
        belge: belge,
        cariId: siparis.cariId,
        cari: siparis.cari,
        tip: siparis.tip,
        ithalatIhracatTip: siparis.ithalatIhracatTip,
        exportReferansNo: siparis.exportReferansNo,
        odemeKodu: siparis.odemeKodu,
        cikisEvrakTarihi: siparis.cikisEvrakTarihi,
        gumrukVarisTarihi: siparis.gumrukVarisTarihi,
        tasiyiciFirma: siparis.tasiyiciFirma,
        varisEvraklariTarihi: siparis.varisEvraklariTarihi,
        dovizAraToplam: siparis.dovizAraToplam,
        dovizIskonto: siparis.dovizIskonto,
        dovizKDV: siparis.dovizKDV,
        dovizNetToplam: siparis.dovizNetToplam,
        araToplamTL: siparis.araToplamTL,
        iskontoTL: siparis.iskontoTL,
        kdvTL: siparis.kdvTL,
        netToplamTL: siparis.netToplamTL,
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

      if (siparisStokHareket) {
        setGridData(
          siparisStokHareket.map((item: ISiparisStokHareket) => ({
            id: item.id,
            belgeId: item.belgeId,
            belge: belge,
            stokKartiId: item.stokKartiId,
            stokKarti: item?.stokKarti,
            //stokAdi: formDataDetay.stokAdi,
            talepTeklifStokHareketId: item.talepTeklifStokHareketId,
            talepTeklifStokHareket: item.talepTeklifStokHareket,
            girisCikis: item.girisCikis,
            sira: item.sira,
            seriKodu: item.seriKodu,
            olcuBirimId: item.olcuBirimId,
            olcuBirim: item.olcuBirim,
            miktar: item.miktar,
            teslimTarihi: item.teslimTarihi,
            istenilenTeslimTarihi: item.istenilenTeslimTarihi,
            fiyatOlcuBirimId: item.fiyatOlcuBirimId,
            fiyatOlcuBirim: item.fiyatOlcuBirim,
            fiyatDovizTipiId: item.fiyatDovizTipiId,
            fiyatDovizTipi: item.fiyatDovizTipi,
            fiyatDoviz: item.fiyatDoviz,
            fiyatTL: item.fiyatTL,
            //fiyatNet: item.fiyatNet, //güncelleme için apiden gelen net
            //iskontoTL: item.iskontoTL,
            tutar: item.tutar,
            projeId: item.projeId,
            proje: item.proje,
            uniteId: item.uniteId,
            unite: item.unite,
          }))
        );
      }
    } catch (error) {
      console.error("Veri alınırken hata oluştu:", error);
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Veri alınırken bir hata oluştu.",
        life: 3000,
      });
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
  const dateBodyTemplate = (rowData: ISiparisStokHareket) => {
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

  useEffect(() => {
    if (siparisStokHareketData.fiyatDovizTipiId !== defaultDovizTipi.id) {
      const yeniFiyatTL = roundToDecimal(
        siparisStokHareketData.fiyatDoviz * dovizKur,
        fiyatDecimal
      );
      setSiparisStokHareketData((prevData) => ({
        ...prevData,
        fiyatTL: yeniFiyatTL,
      }));
    }
  }, [
    siparisStokHareketData.fiyatDoviz,
    siparisStokHareketData.fiyatDovizTipiId,
    dovizKur,
    defaultDovizTipi.id,
  ]);

  useEffect(() => {
    debugger;
    if(siparisStokHareketData.miktar > 0)
    {
    const miktar = roundToDecimal(
      (siparisStokHareketData.miktar ?? 0) / olcuBirimCarpanMiktar,
      miktarDecimal
    );

    // siparisStokHareketData.fiyatNet = roundToDecimal(
    //   siparisStokHareketData.fiyatTL * olcuBirimCarpanFiyat,
    //   miktarDecimal
    // );

    const fiyatTL = roundToDecimal(
      (siparisStokHareketData.fiyatTL ?? 0) * olcuBirimCarpanFiyat,
      fiyatDecimal
    );

    const yeniTutar = roundToDecimal(miktar * fiyatTL, tutarDecimal);

    setSiparisStokHareketData((prevData) => ({
      ...prevData,
      tutar: Math.max(0, yeniTutar),
    }));
  }
  }, [
    olcuBirimCarpanMiktar,
    olcuBirimCarpanFiyat,
    siparisStokHareketData.fiyatTL,
    siparisStokHareketData.miktar,
  ]);

  useEffect(() => {
    calculateOlcuBirimMiktarCarpan();
    calculateOlcuBirimFiyatCarpan();
  }, [
    siparisStokHareketData.olcuBirimId,
    siparisStokHareketData.fiyatOlcuBirimId,
    olcuBirimOptions,
  ]);

  const calculateOlcuBirimMiktarCarpan = useCallback(() => {
    if (siparisStokHareketData.olcuBirimId === olcuBirimOptions[0]?.id) {
      setOlcuBirimCarpanMiktar(1);
    } else if (siparisStokHareketData.olcuBirimId === olcuBirimOptions[1]?.id) {
      setOlcuBirimCarpanMiktar(
        siparisStokHareketData.stokKarti?.olcuBr2Pay! /
          siparisStokHareketData.stokKarti?.olcuBr2Payda!
      ); // 2. birim
    } else if (siparisStokHareketData.olcuBirimId === olcuBirimOptions[2]?.id) {
      setOlcuBirimCarpanMiktar(
        siparisStokHareketData.stokKarti?.olcuBr3Pay! /
          siparisStokHareketData.stokKarti?.olcuBr3Payda!
      ); // 3. birim
    }
  }, [siparisStokHareketData.olcuBirimId, olcuBirimOptions]);

  const calculateOlcuBirimFiyatCarpan = useCallback(() => {
    debugger;
    if (siparisStokHareketData.fiyatOlcuBirimId === olcuBirimOptions[0]?.id) {
      setOlcuBirimCarpanFiyat(1);
    } else if (
      siparisStokHareketData.fiyatOlcuBirimId === olcuBirimOptions[1]?.id
    ) {
      setOlcuBirimCarpanFiyat(
        siparisStokHareketData.stokKarti?.olcuBr2Pay! /
          siparisStokHareketData.stokKarti?.olcuBr2Payda!
      ); // 2. birim
    } else if (
      siparisStokHareketData.fiyatOlcuBirimId === olcuBirimOptions[2]?.id
    ) {
      setOlcuBirimCarpanFiyat(
        siparisStokHareketData.stokKarti?.olcuBr3Pay! /
          siparisStokHareketData.stokKarti?.olcuBr3Payda!
      ); // 3. birim
    }
  }, [
    siparisStokHareketData.fiyatTL,
    siparisStokHareketData.fiyatOlcuBirimId,
    olcuBirimOptions,
  ]);
  const [yurtDisiBelgeMi, setYurtDisiBelgeMi] = useState<boolean>(false);

  useEffect(() => {
    if (siparisData.tip === EFaturaTip.YurtDisi) {
      setYurtDisiBelgeMi(true);
    }
    else setYurtDisiBelgeMi(false);
  }, [siparisData.tip]);

  const dovizKurGetir = useCallback(async () => {
    debugger;
    try {

      if(isEditing && siparisStokHareketData.fiyatDovizTipiId === selectedGridItem?.fiyatDovizTipiId)
      {
        setDovizKur(roundToDecimal( selectedGridItem?.fiyatTL!/ selectedGridItem?.fiyatDoviz!,kurDecimal));
      }
      else
      {


      const dovizKurResponse = await api.netsisDovizKur.get(
        siparisStokHareketData.fiyatDovizTipi.tcmbId
      );

      if (dovizKurResponse.data?.value) {
        const dovizData = dovizKurResponse.data.value;
        setDovizKur(dovizData?.alis!);
      }

    }
    } catch (error) {}
  }, [siparisStokHareketData.fiyatDovizTipi]);

  useEffect(() => {
    if (
      siparisStokHareketData.fiyatDovizTipi != defaultDovizTipi &&
      siparisStokHareketData.fiyatDovizTipi.tcmbId
    ) {
      dovizKurGetir();
    } else {
      setDovizKur(0);
    }
  }, [siparisStokHareketData.fiyatDovizTipi]);

  return (
    <>
      <div className="container-fluid">
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
          <TabView>
            <TabPanel header="Üst Bilgiler" leftIcon="pi pi-calendar mr-2">
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
                        value={tempCariKodu ?? ""}
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
                          setTempCariKodu(selectedValue.kodu);
                          setSiparisData((prevData) => ({
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
                      value={siparisData?.cariId?.toString()}
                      type="hidden"
                      autoComplete="off"
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-7 col-sm-6 mt-4">
                  <InputText
                    id="cariAdi"
                    name="cariAdi"
                    value={siparisData?.cari?.adi ?? ""}
                    readOnly
                    autoComplete="off"
                  />
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <Dropdown
                      id="faturaTip"
                      name="faturaTip"
                      className="w-full"
                      showClear
                      placeholder="Tipi"
                      value={siparisData.tip}
                      options={Object.values(EFaturaTip)
                        .filter((value) => typeof value === "number")
                        .map((value) => ({
                          label:
                            EFaturaTip[
                              value as unknown as keyof typeof EFaturaTip
                            ],
                          value: value,
                        }))}
                      onChange={(e) =>
                        setSiparisData({
                          ...siparisData,
                          tip: e.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                    <label htmlFor="faturaTip">Tip</label>
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <Dropdown
                      id="ithalatIhracatTip"
                      name="ithalatIhracatTip"
                      className="w-full"
                      showClear
                      disabled={!yurtDisiBelgeMi}
                      placeholder="İhr/İth Tipi"
                      value={siparisData.ithalatIhracatTip}
                      options={Object.values(EIhracatIthalatTip)
                        .filter((value) => typeof value === "number")
                        .map((value) => ({
                          label:
                            EIhracatIthalatTip[
                              value as unknown as keyof typeof EIhracatIthalatTip
                            ],
                          value: value,
                        }))}
                      onChange={(e) =>
                        setSiparisData({
                          ...siparisData,
                          ithalatIhracatTip: e.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                    <label htmlFor="ithalatIhracatTip">İhr/İth Tipi</label>
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="exportReferansNo">Export Ref No</label>
                    <InputText
                      id="exportReferansNo"
                      name="exportReferansNo"
                      value={siparisData?.exportReferansNo ?? ""}
                      autoComplete="off"
                      disabled={!yurtDisiBelgeMi}
                      onChange={(e) =>
                        setSiparisData((prevData) => ({
                          ...prevData,
                          exportReferansNo: e.target.value,
                        }))
                      }
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="odemeKodu">Ödeme Kodu</label>
                    <div className="p-inputgroup">
                      <InputText
                        autoComplete="off"
                        id="odemeKodu"
                        name="odemeKodu"
                        value={siparisData.odemeKodu ?? ""}
                        readOnly
                        onChange={(e) => {
                          //Aslında bu elle değiştirilmiyor, change de olmuyor. bunu bi incele
                          setSiparisData((prevData) => ({
                            ...prevData,
                            odemeKodu: e.target.value,
                          }));
                        }}
                      />
                      <Button
                        label="..."
                        onClick={() =>
                          setDialogVisible({
                            ...dialogVisible,
                            odemeKodu: true,
                          })
                        }
                      />
                      <NetsisCariOdemeTipiRehberDialog
                        isVisible={dialogVisible.odemeKodu}
                        onHide={() =>
                          setDialogVisible({
                            ...dialogVisible,
                            odemeKodu: false,
                          })
                        }
                        onSelect={(selectedValue) => {
                          setSiparisData((prevData) => ({
                            ...prevData,
                            odemeKodu: selectedValue.odemeKodu!,
                          }));
                        }}
                      />
                    </div>
                  </FloatLabel>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Kalem Bilgileri" leftIcon="pi pi-calendar mr-2">
              <div className="row">
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="stokKodu">Stok Kodu</label>
                    <div className="p-inputgroup">
                      <InputText
                        ref={stokKoduInputRef}
                        readOnly
                        autoComplete="off"
                        id="stokKodu"
                        name="stokKodu"
                        value={tempStokKodu ?? ""}
                        onChange={(e) => setTempStokKodu(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "Tab") {
                            handleStokGetir(tempStokKodu);
                          }
                        }}
                        //Tekrar tekrar çalışmasın diye kapattım.
                        // onBlur={() => {
                        //   if (tempStokKodu) {
                        //     handleStokGetir(tempStokKodu);
                        //   }
                        // }}
                      />
                      <Button
                        label="..."
                        onClick={() =>
                          setDialogVisible({ ...dialogVisible, stok: true })
                        }
                      />
                      <TalepStokRehberDialog
                        isVisible={dialogVisible.stok}
                        onHide={() =>
                          setDialogVisible({ ...dialogVisible, stok: false })
                        }
                        onSelect={async (selectedValue) => {
                          setTempStokKodu(selectedValue.stokKodu);
                          await handleStokGetir(selectedValue.stokKodu);
                          //stokOlcuBirimDoldur(selectedValue.stokKarti);

                          setSiparisStokHareketData((prevData) => ({
                            ...prevData,
                            //stokKarti: selectedValue.stokKarti,
                            //stokKartiId: selectedValue.stokKartiId,
                            talepTeklifStokHareketId: selectedValue.id!,
                            seriKodu: selectedValue.seriKodu,
                            //olcuBirim: selectedValue.olcuBirim,
                            olcuBirimId: selectedValue.olcuBirimId,
                            miktar: selectedValue.miktar,
                            istenilenTeslimTarihi: selectedValue.teslimTarihi,
                            projeId: selectedValue.projeId,
                            //proje: selectedValue.proje,
                            uniteId: selectedValue.uniteId,
                            //unite: selectedValue.unite,
                          }));
                        }}
                      />
                    </div>
                  </FloatLabel>
                </div>
                <div className="col-md-4 col-sm-6 mt-4">
                  {/* <FloatLabel> */}
                  {/* <label htmlFor="stokAdi">Stok Adı</label> */}
                  <InputText
                    id="stokAdi"
                    name="stokAdi"
                    value={
                      siparisStokHareketData?.stokKarti?.adi
                        ? siparisStokHareketData.stokKarti.adi
                        : ""
                    }
                    readOnly
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
                      value={siparisStokHareketData?.seriKodu ?? ""}
                      autoComplete="off"
                      onChange={(e) =>
                        setSiparisStokHareketData((prevData) => ({
                          ...prevData,
                          seriKodu: e.target.value,
                        }))
                      }
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <Dropdown
                      id="olcuBirim"
                      name="olcuBirim"
                      className="w-full"
                      placeholder="Ölçü Birim"
                      value={siparisStokHareketData.olcuBirimId}
                      options={olcuBirimOptions}
                      onChange={(e) => {
                        const selectedBirim = olcuBirimOptions.find(
                          (option) => option.id === e.value
                        );

                        if (selectedBirim) {
                          setSiparisStokHareketData((prevData) => ({
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
                      value={siparisStokHareketData.miktar ?? 0}
                      min={0}
                      minFractionDigits={miktarDecimal}
                      maxFractionDigits={miktarDecimal}
                      onChange={(e) =>
                        setSiparisStokHareketData((state) => ({
                          ...state,
                          miktar: Number(e.value),
                        }))
                      }
                      // onKeyDown={(e) => {
                      //   if (e.key === "Enter") {
                      //     handleAddToGrid();
                      //   }
                      // }}
                      onFocus={() => selectAllTextInputNumber(miktarRef)}
                      ref={miktarRef}
                      inputStyle={{ textAlign: "right" }}
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="miktar">Miktar</label>

                    <InputNumber
                      id="bilgiMiktar"
                      name="bilgiMiktar"
                      value={olcuBirimCarpanMiktar ?? 0}
                      maxFractionDigits={miktarDecimal}
                      disabled
                      inputStyle={{ textAlign: "right" }}
                    />
                  </FloatLabel>
                </div>

                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="teslimTarihi">Teslim Tarihi</label>
                    <InputMask
                      id="teslimTarihi"
                      name="teslimTarihi"
                      value={formatDate(siparisStokHareketData?.teslimTarihi)}
                      autoComplete="off"
                      mask="99/99/9999"
                      placeholder="dd/mm/yyyy"
                      slotChar="dd/mm/yyyy"
                      onChange={(e) => {
                        const parsedDate = parseDate(e.value!); // Girilen tarihi parse et
                        if (!isNaN(parsedDate.getTime())) {
                          setSiparisStokHareketData((prevData) => ({
                            ...prevData,
                            teslimTarihi: parsedDate, //new Date(e.value!),
                          }));
                        }
                      }}
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="istenilenTeslimTarihi">
                      İstenilen Teslim Tarihi
                    </label>
                    <InputMask
                      id="istenilenTeslimTarihi"
                      name="istenilenTeslimTarihi"
                      value={formatDate(
                        siparisStokHareketData?.istenilenTeslimTarihi
                      )}
                      autoComplete="off"
                      mask="99/99/9999"
                      placeholder="dd/mm/yyyy"
                      slotChar="dd/mm/yyyy"
                      onChange={(e) => {
                        const parsedDate = parseDate(e.value!); // Girilen tarihi parse et
                        if (!isNaN(parsedDate.getTime())) {
                          setSiparisStokHareketData((prevData) => ({
                            ...prevData,
                            istenilenTeslimTarihi: parsedDate, //new Date(e.value!),
                          }));
                        }
                      }}
                    />
                  </FloatLabel>
                </div>

                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <Dropdown
                      id="fiyatOlcuBirimId"
                      name="fiyatOlcuBirimId"
                      className="w-full"
                      placeholder="Fiyat Birim"
                      value={siparisStokHareketData.fiyatOlcuBirimId}
                      options={olcuBirimOptions}
                      onChange={(e) => {
                        const selectedBirim = olcuBirimOptions.find(
                          (option) => option.id === e.value
                        );

                        if (selectedBirim) {
                          setSiparisStokHareketData((prevData) => ({
                            ...prevData,
                            fiyatOlcuBirim: selectedBirim!, // Seçilen olcuBirim nesnesini set et
                            fiyatOlcuBirimId: selectedBirim.id!, // Id'sini de güncelleyebilirsiniz
                          }));
                        }
                      }}
                      style={{ width: "100%" }}
                      optionLabel="adi" // Dropdown'da gösterilecek alan
                      optionValue="id" // Seçilen değerin ID'sini döndürmek için
                    />
                    <label htmlFor="fiyatOlcuBirimId">Fiyat Birim</label>
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <Dropdown
                      id="fiyatDovizTipiId"
                      name="fiyatDovizTipiId"
                      className="w-full"
                      placeholder="Ölçü Birim"
                      value={siparisStokHareketData.fiyatDovizTipiId}
                      options={dovizTipiOptions}
                      onChange={(e) => {
                        const selectedBirim = dovizTipiOptions.find(
                          (option) => option.id === e.value
                        );

                        if (selectedBirim) {
                          setSiparisStokHareketData((prevData) => ({
                            ...prevData,
                            fiyatDovizTipi: selectedBirim!, // Seçilen olcuBirim nesnesini set et
                            fiyatDovizTipiId: selectedBirim.id!, // Id'sini de güncelleyebilirsiniz
                          }));
                        }
                      }}
                      style={{ width: "100%" }}
                      optionLabel="adi" // Dropdown'da gösterilecek alan
                      optionValue="id" // Seçilen değerin ID'sini döndürmek için
                    />
                    <label htmlFor="fiyatDovizTipiId">Döviz Tipi</label>
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="fiyatDoviz">Döviz Fiyat</label>
                    <InputNumber
                      id="fiyatDoviz"
                      name="fiyatDoviz"
                      value={siparisStokHareketData.fiyatDoviz ?? 0}
                      min={0}
                      minFractionDigits={fiyatDecimal}
                      maxFractionDigits={fiyatDecimal}
                      onChange={(e) =>
                        setSiparisStokHareketData((state) => ({
                          ...state,
                          fiyatDoviz: Number(e.value),
                        }))
                      }
                      onFocus={() => selectAllTextInputNumber(dovizFiyatRef)}
                      ref={dovizFiyatRef}
                      inputStyle={{ textAlign: "right" }}
                      readOnly={!isDovizEnabled}
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="miktar">Kur</label>
                    <InputNumber
                      id="miktar"
                      name="miktar"
                      value={dovizKur}
                      min={0}
                      minFractionDigits={kurDecimal}
                      maxFractionDigits={kurDecimal}
                      onChange={(
                        e //Kur değişiminde sadece hesap değişiecek.
                      ) => setDovizKur(Number(e.value))}
                      onFocus={() => selectAllTextInputNumber(kurRef)}
                      ref={kurRef}
                      inputStyle={{ textAlign: "right" }}
                      readOnly={!isDovizEnabled}
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="fiyatTL">Fiyat</label>
                    <InputNumber
                      id="fiyatTL"
                      name="fiyatTL"
                      value={siparisStokHareketData.fiyatTL ?? 0}
                      min={0}
                      minFractionDigits={fiyatDecimal}
                      maxFractionDigits={fiyatDecimal}
                      onChange={(e) =>
                        setSiparisStokHareketData((state) => ({
                          ...state,
                          fiyatTL: Number(e.value),
                        }))
                      }
                      onFocus={() => selectAllTextInputNumber(fiyatRef)}
                      ref={fiyatRef}
                      inputStyle={{ textAlign: "right" }}
                      readOnly={isDovizEnabled}
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="fiyatNet">fiyatNet</label>
                    <InputNumber
                      id="fiyatNet"
                      name="fiyatNet"
                      disabled
                      //value={siparisStokHareketData.fiyatNet ?? 0}
                      min={0}
                      minFractionDigits={fiyatDecimal}
                      maxFractionDigits={fiyatDecimal}
                      inputStyle={{ textAlign: "right" }}
                    />
                  </FloatLabel>
                </div>
                {/* <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="iskontoTL">İskonto Tutar</label>
                    <InputNumber
                      id="iskontoTL"
                      name="iskontoTL"
                      value={siparisStokHareketData.iskontoTL ?? 0}
                      min={0}
                      minFractionDigits={tutarDecimal}
                      maxFractionDigits={tutarDecimal}
                      onChange={(e) =>
                        setSiparisStokHareketData((state) => ({
                          ...state, 
                          iskontoTL: Number(e.value),
                        }))
                      }
                      readOnly={true}
                      inputStyle={{ textAlign: "right" }}
                    />
                  </FloatLabel>
                </div> */}

                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="projeKodu">Proje Kodu</label>
                    <div className="p-inputgroup">
                      <InputText
                        id="projeKodu"
                        name="projeKodu"
                        value={siparisStokHareketData.proje?.kodu ?? ""}
                        readOnly
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
                          setSiparisStokHareketData((prevData) => ({
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
                      value={siparisStokHareketData?.projeId?.toString() ?? ""}
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
                        value={siparisStokHareketData.unite?.kodu ?? ""}
                        readOnly
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
                          setSiparisStokHareketData((prevData) => ({
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
                      value={siparisStokHareketData?.uniteId?.toString() ?? ""}
                      type="hidden"
                      autoComplete="off"
                    />
                  </FloatLabel>
                </div>

                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="tutar">Tutar</label>
                    <InputNumber
                      id="tutar"
                      name="tutar"
                      value={siparisStokHareketData.tutar ?? 0}
                      min={0}
                      minFractionDigits={tutarDecimal}
                      maxFractionDigits={tutarDecimal}
                      onChange={(e) =>
                        setSiparisStokHareketData((state) => ({
                          ...state,
                          tutar: Number(e.value),
                        }))
                      }
                      readOnly={true}
                      inputStyle={{ textAlign: "right" }}
                    />
                  </FloatLabel>
                </div>
                <div className="p-col-12  mt-3">
                  <Button
                      label={isEditing ? "Güncelle" : "Ekle"} // Change label dynamically
                      icon={isEditing ? "pi pi-refresh" : "pi pi-plus"} // Change icon dynamically
                    onClick={handleAddOrUpdate}
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
                  dataKey="sira"
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
                  <Column field="stokKartiId" header="Stok Kartı Id" hidden />
                  <Column field="stokKarti.kodu" header="Stok Kodu" />
                  <Column field="stokKarti.adi" header="Stok Adı" />
                  <Column
                    field="miktar"
                    header="Miktar"
                    body={(row: ISiparisStokHareket) => {
                      return (
                        <div style={{ textAlign: "right" }}>
                          {" "}
                          {formatNumber(row.miktar, miktarDecimal)}{" "}
                        </div>
                      );
                    }}
                  />
                  <Column field="olcuBirim.simge" header="Br" />

                  <Column
                    field="fiyatTL"
                    header="Fiyat"
                    body={(row: ISiparisStokHareket) => {
                      return (
                        <div style={{ textAlign: "right" }}>
                          {" "}
                          {formatNumber(row.fiyatTL, fiyatDecimal)}{" "}
                        </div>
                      );
                    }}
                  />
                  {/* <Column
                    field="fiyatNet"
                    header="FiyatNet"
                    body={(row: ISiparisStokHareket) => {
                      return (
                        <div style={{ textAlign: "right" }}>
                          {" "}
                          {formatNumber(row.fiyatNet, fiyatDecimal)}{" "}
                        </div>
                      );
                    }}
                  /> */}
                  <Column
                    field="fiyatDoviz"
                    header="Döviz Fiyat"
                    body={(row: ISiparisStokHareket) => {
                      return (
                        <div style={{ textAlign: "right" }}>
                          {" "}
                          {formatNumber(row.fiyatDoviz, fiyatDecimal)}{" "}
                        </div>
                      );
                    }}
                  />

                  <Column field="fiyatDovizTipi.simge" header="Döviz Tipi" />
                  <Column
                    field="tutar"
                    header="Tutar"
                    body={(row: ISiparisStokHareket) => {
                      return (
                        <div style={{ textAlign: "right" }}>
                          {" "}
                          {formatNumber(row.tutar, tutarDecimal)}{" "}
                        </div>
                      );
                    }}
                  />
                  <Column field="aciklama1" header="Açıklama 1" hidden />
                  <Column field="aciklama2" header="Açıklama 2" hidden />
                  <Column field="aciklama3" header="Açıklama 3" hidden />
                  <Column field="sira" header="Sıra" />
                  <Column field="seriKodu" header="Seri Kodu" />
                  <Column
                    field="teslimTarihi"
                    header="Teslim Tarihi"
                    dataType="date"
                    body={dateBodyTemplate}
                  />
                  <Column field="projeId" header="ProjeId" hidden />
                  <Column field="proje.kodu" header="Proje Kodu" />
                  <Column field="uniteId" header="Ünite Id" hidden />
                  <Column field="unite.kodu" header="Ünite Kodu" />

                  <Column
                    body={(rowData) => (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <button
                          className="btn btn-info ms-1"
                          onClick={() => {
                            debugger;
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
            </TabPanel>
            <TabPanel header="Toplamlar" leftIcon="pi pi-calendar mr-2">
              <div className="row justify-content-end">
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="dovizAraToplam">Döviz Toplam</label>
                    <InputNumber
                      id="dovizAraToplam"
                      name="dovizAraToplam"
                      readOnly
                      value={siparisData.dovizAraToplam ?? 0}
                      min={0}
                      minFractionDigits={tutarDecimal}
                      maxFractionDigits={tutarDecimal}
                      inputStyle={{ textAlign: "right" }}
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="araToplamTL">Türk Lirası Toplam</label>
                    <InputNumber
                      id="araToplamTL"
                      name="araToplamTL"
                      readOnly
                      value={siparisData.araToplamTL ?? 0}
                      min={0}
                      minFractionDigits={tutarDecimal}
                      maxFractionDigits={tutarDecimal}
                      inputStyle={{ textAlign: "right" }}
                    />
                  </FloatLabel>
                </div>
              </div>
              <div className="row justify-content-end">
              <div className="col-md-1 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="genelIskontoOran">
                      İskonto Oranı (%)
                    </label>
                    <InputNumber
                      id="genelIskontoOran"
                      name="genelIskontoOran"
                      value={genelIskontoOran}
                      min={0}
                      max={100}
                      minFractionDigits={oranDecimal}
                      maxFractionDigits={oranDecimal}
                      inputStyle={{ textAlign: "right" }}
                      onChange={(e) =>
                        {
                          const oran = e.value as number;
                          const yeniIskonto = (siparisData.araToplamTL ?? 0) * (oran / 100);
                          const yeniDovizIskonto = (siparisData.dovizAraToplam ?? 0) * (oran / 100);
                          setGenelIskontoOran(e.value as number);

                          setSiparisData((prevData) => ({
                            ...prevData,
                            iskontoTL: yeniIskonto,
                            dovizIskonto: yeniDovizIskonto,
                          }));

                        }
                      }
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="dovizIskonto">Döviz İskonto Toplam</label>
                    <InputNumber
                      id="dovizIskonto"
                      name="dovizIskonto"
                      value={siparisData.dovizIskonto ?? 0}
                      min={0}
                      max={siparisData.dovizAraToplam}
                      minFractionDigits={tutarDecimal}
                      maxFractionDigits={tutarDecimal}
                      inputStyle={{ textAlign: "right" }}
                      onChange={(e) =>
                        {
                          const yeniIskonto = e.value as number;
                          const oran =((yeniIskonto / (siparisData.dovizAraToplam ?? 1)) * 100) || 0;
                          setGenelIskontoOran(oran);

                          setSiparisData((prevData) => ({
                          ...prevData,
                          dovizIskonto: yeniIskonto,
                          iskontoTL:(prevData.araToplamTL ?? 0) * (oran / 100)
                        }));
                        
                      }
                    }
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="iskontoTL">
                      Türk Lirası İskonto Toplam
                    </label>
                    <InputNumber
                      id="iskontoTL"
                      name="iskontoTL"
                      value={siparisData.iskontoTL ?? 0}
                      min={0}
                      max={siparisData.araToplamTL}
                      minFractionDigits={tutarDecimal}
                      maxFractionDigits={tutarDecimal}
                      inputStyle={{ textAlign: "right" }}
                      onChange={(e) =>
                        {
                          const yeniIskonto = e.value as number;
                          const oran =((yeniIskonto / (siparisData.araToplamTL ?? 1)) * 100) || 0;
                          setGenelIskontoOran(oran);

                          setSiparisData((prevData) => ({
                          ...prevData,
                          iskontoTL: yeniIskonto,
                          dovizIskonto:(prevData.dovizAraToplam ?? 0) * (oran / 100)
                        }));
                        
                      }

                      }
                    />
                  </FloatLabel>
                </div>
              </div>
              <div className="row justify-content-end">
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="dovizKDV">Döviz KDV Toplam</label>
                    <InputNumber
                      id="dovizKDV"
                      name="dovizKDV"
                      value={siparisData.dovizKDV ?? 0}
                      readOnly={siparisData.dovizAraToplam == 0}
                      min={0}
                      minFractionDigits={tutarDecimal}
                      maxFractionDigits={tutarDecimal}
                      inputStyle={{ textAlign: "right" }}
                      onChange={(e) =>
                        setSiparisData((prevData) => ({
                          ...prevData,
                          iskontoTL: e.value as number,
                        }))
                      }
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="kdvTL">Türk Lirası KDV Toplam</label>
                    <InputNumber
                      id="kdvTL"
                      name="kdvTL"
                      readOnly
                      value={siparisData.kdvTL ?? 0}
                      min={0}
                      minFractionDigits={tutarDecimal}
                      maxFractionDigits={tutarDecimal}
                      inputStyle={{ textAlign: "right" }}
                    />
                  </FloatLabel>
                </div>
              </div>
              <div className="row justify-content-end">
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="dovizNetToplam">Döviz Tutar</label>
                    <InputNumber
                      id="dovizNetToplam"
                      name="dovizNetToplam"
                      readOnly
                      value={siparisData.dovizNetToplam ?? 0}
                      min={0}
                      minFractionDigits={tutarDecimal}
                      maxFractionDigits={tutarDecimal}
                      inputStyle={{ textAlign: "right" }}
                    />
                  </FloatLabel>
                </div>
                <div className="col-md-2 col-sm-6 mt-4">
                  <FloatLabel>
                    <label htmlFor="netToplamTL">Türk Lirası Tutar</label>
                    <InputNumber
                      id="netToplamTL"
                      name="netToplamTL"
                      readOnly
                      value={siparisData.netToplamTL || 0}
                      min={0}
                      minFractionDigits={tutarDecimal}
                      maxFractionDigits={tutarDecimal}
                      inputStyle={{ textAlign: "right" }}
                    />
                  </FloatLabel>
                </div>
              </div>
              <div className="p-col-12  mt-3">
                <Button
                  label="Kaydet"
                  icon="pi pi-check"
                  loading={saveLoading}
                  onClick={handleSave}
                  disabled={
                    gridData.filter((item) => item.miktar > 0).length <= 0
                  }
                  visible={!belgeReadOnly}
                />
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </>
  );
};
export default satinalmaSiparisFisi;
