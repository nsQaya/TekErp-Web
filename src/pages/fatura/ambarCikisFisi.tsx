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
import { useNavigate, useSearchParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { EAmbarHareketTur } from "../../utils/types/enums/EAmbarHareketTur";
import { EAmbarFisiCikisYeri } from "../../utils/types/enums/EAmbarFisiCikisYeri";
import { EBelgeTip } from "../../utils/types/enums/EBelgeTip";
import { IStokHareket } from "../../utils/types/fatura/IStokHareket";
import { IBelgeSeri } from "../../utils/types/tanimlamalar/IBelgeSeri";
import { IHucreOzet } from "../../utils/types/tanimlamalar/IHucreOzet";
import { EAktarimDurumu } from "../../utils/types/enums/EAktarimDurumu";
import { ITransferDataAmbarFisi } from "../../utils/types/fatura/ITransferDataAmbarFisi";
import {
  selectAllTextInputNumber,
  selectAllTextInputText,
} from "../../utils/helpers/selectAllText";

// Form verileri için bir tip tanımı
type FormDataBaslik = {
  belgeSeri: string;
  belgeNumara: string;
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
  //stokKodu: string;
  stokAdi?: string;
  miktar: number;
  istenilenMiktar?: number;
  fiyat?: number;
  cikisHucreId?: number;
  cikishucreKodu?: string;
  bakiye?: number;
  olcuBrId: number;
  olcuBr: string;
};

// Grid verileri için bir tip tanımı
type GridData = {
  id: number;
  stokKartiId: number;
  stokKodu: string;
  stokAdi?: string;
  miktar: number;
  istenilenMiktar: number;
  fiyat: number;
  cikisHucreId?: number;
  cikishucreKodu?: string;
  bakiye?: number;
  olcuBirimId: number;
  olcuBr?: string;
};

const App = () => {
  const currentDate = new Date();
  currentDate.setHours(3, 0, 0, 0);

  const navigate = useNavigate();

  const [formDataBaslik, setFormDataBaslik] = useState<FormDataBaslik>({
    belgeSeri: "",
    belgeNumara: "",
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
    stokAdi: "",
    istenilenMiktar: 0,
    miktar: 0,
    fiyat: 0,
    cikisHucreId: 0,
    cikishucreKodu: "",
    olcuBrId: 0,
    olcuBr: "",
  });

  const [dialogVisible, setDialogVisible] = useState({
    proje: false,
    unite: false,
    stok: false,
    cikisKoduDialog: false,
  });

  const [belgeReadOnly, setBelgeReadOnly] = useState<boolean>(false);

  const [gridData, setGridData] = useState<GridData[]>([]);
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GridData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingGetir, setLoadingGetir] = useState(false);
  const [seriOptions, setSeriOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [hucreOptions, setHucreOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const [selectedHucre, setSelectedHucre] = useState<number | null>(null);
  const [selectedStokKodu, setSelectedStokKodu] = useState("");
  const [tempStokKodu, setTempStokKodu] = useState(selectedStokKodu);
  const [selectedId, setSelectedId] = useState(0);

  const handleHucreChange = useCallback(
    (e: any) => {
      const selectedOption = hucreOptions.find(
        (option) => option.value === e.value
      );
      setFormDataDetay((prevFormData) => ({
        ...prevFormData,
        cikishucreKodu: selectedOption ? selectedOption.label : "",
        cikisHucreId: e.value,
        belgeNumara: "",
      }));
      setSelectedHucre(e.value);
    },
    [hucreOptions]
  );

  // useEffect(() => {
  //   setTempStokKodu(selectedStokKodu);
  // }, [selectedStokKodu]);

  useEffect(() => {
    if (hucreOptions.length > 0 && !selectedHucre) {
      setSelectedHucre(hucreOptions[0].value);
      setFormDataDetay((prevFormData) => ({
        ...prevFormData,
        cikishucreKodu: hucreOptions[0].label,
        cikisHucreId: hucreOptions[0].value,
      }));
    }
  }, [hucreOptions, selectedHucre]);

  useEffect(() => {
    const fetchSeriOptions = async () => {
      try {
        const sortColumn = "Id";
        const sortDirection = 1;

        const filters = {
          BelgeTip: { value: EBelgeTip.AmbarCikisFisi, matchMode: "equals" },
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
          setSeriOptions(options);
        }
      } catch (error) {
        console.error("Error fetching belgeSeri options:", error);
      }
    };

    fetchSeriOptions();
  }, []);

  const handleSeriChange = useCallback(async (e: { value: any }) => {
    const selectedSeri = e.value;
    setFormDataBaslik((prevFormDataBaslik) => ({
      ...prevFormDataBaslik,
      belgeSeri: selectedSeri,
      belgeNumara: "",
    }));

    if (selectedSeri) {
      try {
        const response = await api.belgeNo.getBySeri(
          selectedSeri,
          EBelgeTip.AmbarCikisFisi
        );
        if (response.data.status) {
          setFormDataBaslik((prevFormDataBaslik) => ({
            ...prevFormDataBaslik,
            belgeNumara: response.data.value.belgeNo,
          }));
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, []);

  const [searchParams] = useSearchParams();
  //belge düzenleme için, belge id sini alma
  const updateBelgeId = useMemo(
    () => Number(searchParams.get("belgeId")),
    [searchParams]
  );

  useEffect(() => {
    const validateFormDataBaslik = () => {
      Object.keys(formDataBaslik).forEach((key) => {
        if (
          formDataBaslik[key as keyof FormDataBaslik] === undefined ||
          formDataBaslik[key as keyof FormDataBaslik] === null
        ) {
          toast.current?.show({
            severity: "warn",
            summary: "Uyarı",
            detail: `${key} değeri hatalı!`,
            life: 3000,
          });
        }
      });
    };

    validateFormDataBaslik();
  }, [formDataDetay, formDataBaslik]);

  const fetchCikisYeriKoduFromAnaMamulGrubu = async (id: number) => {
    try {
      const response = await api.stok.get(id);
      return response.data.value.kodu;
    } catch (error) {
      console.error("Error fetching stok kodu:", error);
      return "";
    }
  };
  const fetchCikisYeriKoduFromMaliyetGrubu = async (id: number) => {
    try {
      const response = await api.stok.get(id);
      return response.data.value.kodu;
    } catch (error) {
      console.error("Error fetching stok kodu:", error);
      return "";
    }
  };
  const fetchCikisYeriKoduFromMasrafMerkezi = async (id: number) => {
    try {
      const response = await api.stok.get(id);
      return response.data.value.kodu;
    } catch (error) {
      console.error("Error fetching stok kodu:", error);
      return "";
    }
  };
  const fetchCikisYeriKoduFromSerbest = async (id: number) => {
    try {
      const response = await api.stok.get(id);
      return response.data.value.kodu;
    } catch (error) {
      console.error("Error fetching stok kodu:", error);
      return "";
    }
  };
  const fetchCikisYeriKoduFromStokKodu = async (id: number) => {
    try {
      const response = await api.stok.get(id);
      return response.data.value.kodu;
    } catch (error) {
      console.error("Error fetching stok kodu:", error);
      return "";
    }
  };



  const fetchData = async () => {
    try {
      const response = await api.ambarFisi.getByBelgeId(updateBelgeId);
      if (response.data.status && response.data.value) {
        const ambarFisi = response.data.value;
        const belge = ambarFisi.belge!;
        if (belge.aktarimDurumu === EAktarimDurumu.AktarimTamamlandi) {
          toast.current?.show({
            severity: "error",
            summary: "Hata",
            detail:
              "Netsis aktarımı tamamlanmış belgede değişiklik yapılamaz...",
            life: 3000,
          });
          setBelgeReadOnly(true);

          // // 2 saniye sonra başka bir sayfaya yönlendirme
          // setTimeout(() => {
          //   navigate("/fatura/depolararasitransferliste"); // Kullanıcıyı başka bir adrese yönlendir
          // }, 2000);

          // return; // Bu işlemi tamamladığı için geri kalanı çalıştırmasın
        }

        const belgeSeri = belge.no.substring(0, 3);
        const belgeNumara = belge.no.substring(3);
        let cikisYeriKodu = "";

        switch (ambarFisi.cikisYeri) {
          case EAmbarFisiCikisYeri.AnaMamulGrubu:
            cikisYeriKodu = await fetchCikisYeriKoduFromAnaMamulGrubu(
              ambarFisi.cikisYeriId
            );
            break;
          case EAmbarFisiCikisYeri.MaliyetGrubu:
            cikisYeriKodu = await fetchCikisYeriKoduFromMaliyetGrubu(
              ambarFisi.cikisYeriId
            );
            break;
          case EAmbarFisiCikisYeri.MasrafMerkezi:
            cikisYeriKodu = await fetchCikisYeriKoduFromMasrafMerkezi(
              ambarFisi.cikisYeriId
            );
            break;
          case EAmbarFisiCikisYeri.Serbest:
            cikisYeriKodu = await fetchCikisYeriKoduFromSerbest(
              ambarFisi.cikisYeriId
            );
            break;
          case EAmbarFisiCikisYeri.StokKodu:
            cikisYeriKodu = await fetchCikisYeriKoduFromStokKodu(
              ambarFisi.cikisYeriId
            );
            break;

          default:
            break;
        }

        setFormDataBaslik({
          belgeSeri: belgeSeri,
          belgeNumara: belgeNumara,
          tarih: currentDate,
          hareketTuru: ambarFisi.ambarHareketTur,
          cikisYeri: ambarFisi.cikisYeri,
          cikisYeriKodu: cikisYeriKodu,
          cikisYeriKoduId: ambarFisi.cikisYeriId,
          aciklama1: belge.aciklama1,
          aciklama2: belge.aciklama2,
          aciklama3: belge.aciklama3,
        });

        const gridResponse = await api.stokHareket.getListByBelgeId(
          updateBelgeId
        );
        if (gridResponse.data.value) {
          setGridData(
            gridResponse.data.value.items.map((item: IStokHareket) => ({
              id: item.sira,
              stokKartiId: item.stokKartiId,
              stokKodu: item.stokKarti!.kodu,
              stokAdi: item.stokKarti!.adi,
              miktar: item.miktar,
              istenilenMiktar: item.istenilenMiktar,
              fiyat: item.fiyatTL,
              cikisHucreId: item.cikisHucreId,
              cikishucreKodu: item.cikisHucre?.kodu,
              bakiye: item.bakiye,
              olcuBirimId: item.olcuBirimId,
              olcuBr: item.olcuBirim?.simge,
            }))
          );

          setFormDataDetay({
            projeKoduId: gridResponse.data.value.items[0].projeId,
            projeKodu: gridResponse.data.value.items[0].proje?.kodu,
            uniteKoduId: gridResponse.data.value.items[0].uniteId,
            uniteKodu: gridResponse.data.value.items[0].unite?.kodu,
            stokKartiId: 0,
            cikisHucreId: 0,
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

  useEffect(() => {
    if (updateBelgeId) {
      fetchData();
    }
  }, [updateBelgeId]);

  const handleInputChangeBaslik = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataBaslik((prevFormDataBaslik) => ({
      ...prevFormDataBaslik,
      [name]: value,
    }));
  };

  const miktarRef = useRef<InputNumber | null>(null);
  const stokKoduInputRef = useRef<any>(null);

  //stok getirme, gridden stok düzeltme, stok kodu okutunca bilgilerini getirme işlemleri
  const handleKeyPress = useCallback(async () => {
    setFormDataDetay((prevFormData) => ({
      ...prevFormData,
      stokAdi: "",
      cikishucreKodu: "",
      cikisHucreId: 0,
    }));
    setSelectedHucre(null);
    setHucreOptions([]);
    try {
      const response = await api.stok.getByKod(selectedStokKodu);
      if (response?.status) {
        if (response.data.status) {
          setSelectedStokKodu(response.data.value.kodu);
          const alreadyHas = gridData.find(
            (x) =>
              x.stokKodu === response.data.value.kodu &&
              (selectedId ? x.id === selectedId : true)
          );
          const alreadyHasgMiktar = alreadyHas ? alreadyHas.miktar : 0;
          const alreadyHasgBakiyeMiktar = alreadyHas ? alreadyHas.bakiye : 0;
          const alreadyHasgIstenilenMiktar = alreadyHas
            ? alreadyHas.istenilenMiktar
            : 0;
          const alreadyHasHucreId = alreadyHas ? alreadyHas.cikisHucreId : 0;
          const alreadyHasHucreKodu = alreadyHas
            ? alreadyHas.cikishucreKodu
            : "";

          setFormDataDetay((prevFormData) => ({
            ...prevFormData,
            stokKartiId: response.data.value.id!,
            stokAdi: response.data.value.adi!,
            olcuBrId: response.data.value.stokOlcuBirim1Id,
            olcuBr: response.data.value.stokOlcuBirim1.simge,
            miktar: alreadyHasgMiktar - alreadyHasgBakiyeMiktar!,
            istenilenMiktar: alreadyHasgIstenilenMiktar!,
            cikisHucreId: alreadyHasHucreId
              ? alreadyHasHucreId
              : response.data.value.hucreOzets.length > 0
              ? response.data.value.hucreOzets[0].hucre.id
              : 0,
            cikishucreKodu: alreadyHasHucreKodu
              ? alreadyHasHucreKodu
              : response.data.value.hucreOzets[0].hucre.kodu,
            bakiye: response.data.value.bakiye,
          }));

          if (
            response.data.value.hucreOzets &&
            response.data.value.hucreOzets.length > 0
          ) {
            const options = response.data.value.hucreOzets.map(
              (item: IHucreOzet) => ({
                label: item.hucre.kodu,
                value: item.hucre.id!,
              })
            );
            setHucreOptions(options);
          }

          if (alreadyHasHucreId) {
            setSelectedHucre(alreadyHasHucreId);
          } else if (alreadyHasHucreKodu) {
            const selectedOption = hucreOptions.find(
              (option) => option.label === alreadyHasHucreKodu
            );
            if (selectedOption) {
              setSelectedHucre(selectedOption.value);
            }
          }

          if (miktarRef.current) {
            miktarRef.current.focus();
          }
        } else {
          selectAllTextInputText(stokKoduInputRef);
        }
      } else {
        selectAllTextInputText(stokKoduInputRef);
      }
    } catch (error) {
      selectAllTextInputText(stokKoduInputRef);
      console.error("Error fetching data:", error);
    }
  }, [gridData, selectedStokKodu, selectedId]);

  useEffect(() => {
    if (selectedStokKodu) {
      handleKeyPress();
    }
  }, [selectedStokKodu, handleKeyPress]);

  const handleDialogSelect = useCallback(
    //TODU: bunu T type a geçirince kaldırmak gerekiyor ama güncellemeler için ne yapacağımı daha bilmediğimden bir süre durabilir
    (
      fieldName: string,
      dialogFieldName: string,
      selectedValue: { Id: any; [key: string]: any }
    ) => {
      setFormDataBaslik((prevFormDataBaslik) => {
        const newFormData = {
          ...prevFormDataBaslik,
          [fieldName]: selectedValue[dialogFieldName],
          [`${fieldName}Id`]: selectedValue.Id,
        };
        if (fieldName === "stokKodu") {
          setSelectedStokKodu(selectedValue[dialogFieldName]);
        }
        return newFormData;
      });
      setFormDataDetay((prevFormData) => {
        const newFormData = {
          ...prevFormData,
          [fieldName]: selectedValue[dialogFieldName],
          [`${fieldName}Id`]: selectedValue.Id,
        };
        setSelectedId(0);
        return newFormData;
      });
    },
    []
  );

  const handleGetir = async () => {
    if (!validateGetir()) {
      return;
    }

    setLoadingGetir(true);
    const sortColumn = "cikisHucre.kodu";
    const sortDirection = 1;

    const filters = {
      ProjeKodu: { value: formDataDetay.projeKodu, matchMode: "equals" },
      PlasiyerKodu: { value: formDataDetay.uniteKodu, matchMode: "equals" },
      istenilenMiktar: { value: "0", matchMode: "gt" },
    };
    const dynamicQuery = transformFilter(filters, sortColumn, sortDirection);

    try {
      const response = await api.ihtiyacPlanlamaRapor.getListForAmbarCikisFisi(
        dynamicQuery
      );

      if (response.data.value && response.data.value.count > 0) {
        document.getElementById("getirButton")!.hidden = true;

        let tempCikisYeri: { Id: any; kodu: string };
        tempCikisYeri = {
          Id: 77118,
          kodu: "X150-99-0001",
        };
        handleDialogSelect("cikisYeriKodu", "kodu", tempCikisYeri);

        const data = response.data.value;
        const maxId =
          gridData.length > 0
            ? Math.max(...gridData.map((item) => item.id!))
            : 0;
        const newGridData: GridData[] = data.items.map((item, index) => ({
          id: maxId + index + 1,
          projeKodu: item.projeKodu,
          uniteKodu: item.plasiyerKodu,
          cikishucreKodu: item.cikisHucre
            ? item.cikisHucre.map((h) => h.kodu).join(" | ")
            : "",
          belgeNumara: item.belgeNo,
          stokKartiId: item.stokKartiId,
          stokKodu: item.stokKodu,
          stokAdi: item.stokAdi,
          miktar: 0,
          fiyat: 0,
          istenilenMiktar: item.istenilenMiktar,
          bakiye: item.bakiye,
          cikisHucreId: item.cikisHucreId,
          olcuBirimId: item.olcuBirimId,
          olcuBr: item.olcuBr,
        }));

        setGridData(newGridData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingGetir(false);
    }
  };

  //gride doldurma işlemleri
  const handleAddToGrid = useCallback(() => {
    const nStoK = selectedStokKodu;

    if (!nStoK || formDataDetay.miktar === 0 || formDataDetay.miktar <= 0) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Stok Kodu ve Miktar alanlarını doldurmalısınız.",
        life: 3000,
      });
      return;
    }
    if (
      formDataDetay.cikisHucreId === 0 ||
      !formDataDetay.cikisHucreId ||
      formDataDetay.cikisHucreId == undefined
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Hatalı çıkış hücresi seçimi",
        life: 3000,
      });
      return;
    }

    if (
      formDataDetay.projeKoduId === 0 ||
      !formDataDetay.projeKoduId ||
      formDataDetay.projeKoduId == undefined
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Hatalı proje",
        life: 3000,
      });
      return;
    }

    if (
      formDataDetay.uniteKoduId === 0 ||
      !formDataDetay.uniteKoduId ||
      formDataDetay.uniteKoduId == undefined
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Hatalı Unite",
        life: 3000,
      });
      return;
    }

    const alreadyHas = gridData.find((x) => x.stokKodu === nStoK);
    const alreadyHasWithHucre = gridData.find(
      (x) =>
        (x.stokKodu === nStoK && x.miktar === 0) ||
        (x.stokKodu === nStoK && x.cikisHucreId === formDataDetay.cikisHucreId)
    );

    if (alreadyHas) {
      const toplamIstenilenMiktar = gridData
        .filter((item) => item.stokKodu === nStoK)
        .reduce((acc, curr) => acc + (curr.istenilenMiktar || 0), 0);

      const toplamMiktar = gridData
        .filter((item) => item.stokKodu === nStoK)
        .reduce((acc, curr) => acc + (curr.miktar || 0), 0);

      if (
        Number(toplamMiktar - alreadyHas.miktar + formDataDetay.miktar) >
          Number(toplamIstenilenMiktar) &&
        Number(toplamIstenilenMiktar) > 0
      ) {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Var olan miktardan fazla çıkış ekleyemezsin.",
          life: 3000,
        });
        return;
      }
      if (
        Number(toplamMiktar - alreadyHas.miktar + formDataDetay.miktar) >
        Number(alreadyHas.bakiye)
      ) {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Depo bakiyesinden fazla çıkış ekleyemezsin.",
          life: 3000,
        });
        return;
      }
    }
    if (alreadyHasWithHucre) {
      setGridData((prevGridData) =>
        prevGridData.map((item) =>
          item.stokKodu === nStoK && item.id === alreadyHasWithHucre.id
            ? {
                ...item,
                miktar: formDataDetay.miktar!,
                cikishucreKodu: hucreOptions.find(
                  (o) => o.value === selectedHucre
                )?.label,
                cikisHucreId: formDataDetay.cikisHucreId,
              }
            : item
        )
      );
    } else {
      const maxId =
        gridData.length > 0 ? Math.max(...gridData.map((item) => item.id!)) : 0;

      const newGridData: GridData = {
        id: maxId + 1,
        stokKartiId: formDataDetay.stokKartiId,
        stokKodu: selectedStokKodu,
        stokAdi: formDataDetay.stokAdi,
        miktar: formDataDetay.miktar,
        cikishucreKodu: formDataDetay.cikishucreKodu,
        cikisHucreId: formDataDetay.cikisHucreId,
        istenilenMiktar: 0,
        fiyat: 0,
        bakiye: formDataDetay.bakiye,
        olcuBirimId: formDataDetay.olcuBrId,
        olcuBr: formDataDetay.olcuBr,
      };
      setGridData((prevGridData) => [...prevGridData, newGridData]);
    }

    document.getElementById("getirButton")!.hidden = true;
    setTempStokKodu("");
    setSelectedStokKodu("");
    setFormDataDetay((formData) => ({
      ...formData,
      stokKartiId: 0,
      stokAdi: "",
      miktar: 0,
      istenilenMiktar: 0,
      bakiye: 0,
    }));
    setSelectedId(0);
    setHucreOptions([]);

    if (stokKoduInputRef.current) {
      stokKoduInputRef.current.focus();
    }
  }, [formDataDetay, gridData, hucreOptions, selectedStokKodu, selectedHucre]);

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
      setGridData((prevGridData) => {
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
    if (!formDataBaslik.belgeNumara) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Numara alanı boş olamaz",
        life: 3000,
      });
      return false;
    }

    if (!formDataBaslik.hareketTuru) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Hareket Türü seçilmelidir",
        life: 3000,
      });
      return false;
    }

    if (gridData.filter((item) => item.miktar > 0).length <= 0) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Çıkış yapılacak stok seçilmelidir",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const validateGetir = () => {
    if (!formDataDetay.projeKodu) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Proje kodu boş olamaz",
        life: 3000,
      });
      return false;
    }

    if (!formDataDetay.uniteKodu) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Ünite kodu boş olamaz",
        life: 3000,
      });
      return false;
    }
    return true;
  };
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const transferData: ITransferDataAmbarFisi = {
        belgeDto: {
          id: updateBelgeId !== 0 ? updateBelgeId : 0,
          belgeTip: EBelgeTip.AmbarCikisFisi,
          no: formDataBaslik.belgeSeri + formDataBaslik.belgeNumara,
          tarih: formDataBaslik.tarih,
          aciklama1: formDataBaslik.aciklama1,
          aciklama2: formDataBaslik.aciklama2,
          aciklama3: formDataBaslik.aciklama3,
          tamamlandi: true,
          aktarimDurumu: EAktarimDurumu.AktarimSirada,
        },
        ambarFisiDto: {
          id: 0, //updateBelgeId !== 0 ? await getAmbarFisiId(updateBelgeId) : 0,
          belgeId: updateBelgeId !== 0 ? updateBelgeId : 0,
          ambarHareketTur: formDataBaslik.hareketTuru,
          cikisYeri: formDataBaslik.cikisYeri,
          cikisYeriId: formDataBaslik.cikisYeriKoduId,
        },
        stokHareketDto: gridData
          .filter((item) => item.miktar > 0)
          .map((item, index) => ({
            id: 0, // item.id,
            belgeId: updateBelgeId !== 0 ? updateBelgeId : 0,
            stokKartiId: item.stokKartiId ?? 0,
            masrafStokKartiId: item.stokKartiId ?? 0,
            miktar: item.miktar ?? 0,
            istenilenMiktar: item.istenilenMiktar,
            fiyatTL: item.fiyat ?? 0,
            fiyatDoviz: 0,
            fiyatDovizTipiId: 1,
            cikisHucreId: item.cikisHucreId ?? 0,
            //girisHucreId: 0,
            aciklama1: formDataBaslik.aciklama1 ?? "",
            aciklama2: formDataBaslik.aciklama2 ?? "",
            aciklama3: formDataBaslik.aciklama3 ?? "",
            projeId: formDataDetay.projeKoduId ?? 0,
            uniteId: formDataDetay.uniteKoduId ?? 0,
            sira: index + 1,
            girisCikis: "C",
            olcuBirimId: item.olcuBirimId ?? 0,
            seriKodu: "",
            //stokHareketSeries: item.seriler || []
          })),
      };

      // API'ye tek seferde gönderim
      const response = await api.ambarFisiSave.save(transferData);

      if (!response.data.status) {
        throw new Error(
          Object.entries(response.data.errors || {})
            .map(([key, messages]) => `${key}: ${messages.join(", ")}`)
            .join("\n") ||
            response.data.detail ||
            "Veriler kaydedilirken bir hata oluştu."
        );
      }
      navigate(`/fatura/ambarcikisfisiliste`);

      // Başarılı durum mesajı
      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Veriler başarıyla kaydedildi",
        life: 3000,
      });

      resetForm();
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
  }, [formDataBaslik, gridData, formDataDetay, updateBelgeId]);

  const resetForm = () => {
    setFormDataBaslik({
      belgeSeri: "",
      belgeNumara: "",
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

    setFormDataDetay({
      projeKoduId: 0,
      projeKodu: "",
      uniteKoduId: 0,
      uniteKodu: "",
      ozelKod1Id: 0,
      ozelKod1: "",
      stokKartiId: 0,
      stokAdi: "",
      istenilenMiktar: 0,
      miktar: 0,
      fiyat: 0,
      cikisHucreId: 0,
      cikishucreKodu: "",
      olcuBrId: 0,
      olcuBr: "",
    });

    setDialogVisible({
      proje: false,
      unite: false,
      stok: false,
      cikisKoduDialog: false,
    });

    setGridData([]);
    setSelectedItem(null);
    setSelectedStokKodu("");
    setSelectedHucre(null);
    setHucreOptions([]);
  };

  //html içeriği
  return (
    <div className="container-fluid">
      {/* {JSON.stringify(formDataBaslik)}
      {JSON.stringify(formDataDetay)} <br></br>
      {JSON.stringify(selectedStokKodu)} */}
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
                    setFormDataDetay((prevFormDataBaslik) => ({
                      ...prevFormDataBaslik,
                      projeKodu: selectedValue.kodu,
                      projeKoduId: selectedValue.id!,
                    }))
                  }
                />
              </div>
              <InputText
                id="projeKoduId"
                name="projeKoduId"
                value={formDataDetay.projeKoduId?.toString()}
                type="hidden"
                autoComplete="off"
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
                    setFormDataDetay((prevFormDataBaslik) => ({
                      ...prevFormDataBaslik,
                      uniteKodu: selectedValue.kodu,
                      uniteKoduId: selectedValue.id!,
                    }))
                  }
                />
              </div>
              <InputText
                id="uniteKoduId"
                name="uniteKoduId"
                value={formDataDetay.uniteKoduId?.toString()}
                type="hidden"
                autoComplete="off"
              />
            </FloatLabel>
          </div>
          <div className="col-md-3 col-sm-6 mt-4">
            <div className="p-inputgroup">
              <Button
                id="getirButton"
                label="Getir"
                onClick={handleGetir}
                hidden={updateBelgeId > 0}
              />
            </div>
          </div>
          {/* <div className="col-md-3 col-sm-6 mt-4">
            <div className="p-inputgroup">
              <Button id="barkodButton" label="Barkod" onClick={handleGetir} 
              hidden={updateBelgeId>0 }
              />
            </div>
          </div> */}
          <div className="col-md-3 col-sm-6 mt-4">
            <Button
              label="Kaydet"
              icon="pi pi-check"
              loading={loading}
              onClick={handleSave}
              disabled={gridData.filter((item) => item.miktar > 0).length <= 0}
              visible={!belgeReadOnly}
            />
          </div>
        </div>

        <Accordion activeIndex={1}>
          <AccordionTab header="Üst Bilgiler">
            <div className="row">
              <div className="col-md-3 col-sm-6 mt-4">
                <div className="p-inputgroup flex-1">
                  <FloatLabel>
                    <Dropdown
                      className="w-full md:w-5rem"
                      showClear
                      placeholder="Seri"
                      value={formDataBaslik.belgeSeri}
                      options={seriOptions}
                      onChange={handleSeriChange}
                      style={{ width: "100%" }}
                    />
                    <label htmlFor="belgeSeri">Seri</label>
                  </FloatLabel>

                  <FloatLabel>
                    <InputText
                      id="belgeNumara"
                      name="belgeNumara"
                      value={formDataBaslik.belgeNumara}
                      onChange={handleInputChangeBaslik}
                      style={{ width: "100%", minWidth: "250px" }}
                      readOnly
                      autoComplete="off"
                    />
                    <label htmlFor="belgeNumara">Numara</label>
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
                              value as unknown as keyof typeof EAmbarHareketTur
                            ],
                          value: value,
                        }))}
                      onChange={(e) =>
                        setFormDataBaslik({
                          ...formDataBaslik,
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
                              value as unknown as keyof typeof EAmbarFisiCikisYeri
                            ],
                          value: value,
                        }))}
                      onChange={(e) =>
                        setFormDataBaslik({
                          ...formDataBaslik,
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
                      disabled
                      autoComplete="off"
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
                      onHide={() => {
                        setDialogVisible({
                          ...dialogVisible,
                          cikisKoduDialog: false,
                        });
                      }}
                      onSelect={(selectedValue) =>
                        setFormDataBaslik((prevFormDataBaslik) => ({
                          ...prevFormDataBaslik,
                          cikisYeriKodu: selectedValue.kodu,
                          cikisYeriKoduId: selectedValue.id!,
                        }))
                      }
                    />
                  </div>
                  <InputText
                    id="cikisYeriKoduId"
                    name="cikisYeriKoduId"
                    value={formDataBaslik.cikisYeriKoduId?.toString()}
                    type="hidden"
                    autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      value={formDataDetay.ozelKod1}
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
                    checked={formDataBaslik.eIrsaliye || false}
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
                  ref={stokKoduInputRef}
                  autoComplete="off"
                  id="stokKodu"
                  name="stokKodu"
                  value={tempStokKodu}
                  onChange={(e) => setTempStokKodu(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSelectedStokKodu(tempStokKodu);
                      handleKeyPress();
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
                    setFormDataDetay((prevFormDataBaslik) => ({
                      ...prevFormDataBaslik,
                      stokKodu: selectedValue.kodu,
                      stokAdi: selectedValue.adi,
                      stokKartiId: selectedValue.id!,
                    }));
                    setTempStokKodu(selectedValue.kodu);
                  }}
                  // onSelect={(selectedValue) => {
                  //   handleDialogSelect("stokKodu", "kodu", selectedValue);
                  // }}
                />
              </div>
              <InputText
                id="stokKartiId"
                name="stokKartiId"
                value={formDataDetay.stokKartiId?.toString()}
                type="hidden"
                autoComplete="off"
              />
            </FloatLabel>
          </div>
          <div className="col-md-4 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="stokAdi">Stok Adı</label>
              <InputText
                id="stokAdi"
                name="stokAdi"
                value={formDataDetay.stokAdi}
                disabled
                autoComplete="off"
              />
            </FloatLabel>
          </div>
          <div className="col-md-1 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="miktar">İstenilen Miktar</label>
              <InputNumber
                id="istenilenMiktar"
                name="istenilenMiktar"
                value={formDataDetay.istenilenMiktar}
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
                value={formDataDetay.miktar}
                min={0}
                minFractionDigits={0}
                maxFractionDigits={2}
                onChange={(e) =>
                  setFormDataDetay((state) => ({
                    ...state,
                    miktar: Number(e.value),
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddToGrid();
                  }
                }}
                onFocus={() => selectAllTextInputNumber(miktarRef)}
                ref={miktarRef}
                inputStyle={{ textAlign: "right" }}
              />
            </FloatLabel>
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="hucre">Hucre</label>
              <Dropdown
                id="hucre"
                name="hucre"
                value={selectedHucre}
                options={hucreOptions}
                onChange={handleHucreChange}
                className="w-full md:w-14rem"
              />
            </FloatLabel>
          </div>
        </div>
        <div className="p-col-12  mt-3">
          <Button
            label="Ekle"
            icon="pi pi-plus"
            onClick={handleAddToGrid}
            disabled={belgeReadOnly}
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
            scrollHeight="400px"
            emptyMessage="Kayıt yok."
            rowClassName={(rowData) => {
              if (rowData.miktar === rowData.istenilenMiktar) {
                return "green-row";
              } else if (
                rowData.miktar > 0 &&
                rowData.miktar < rowData.istenilenMiktar
              ) {
                return "yellow-row";
              } else {
                return "";
              }
            }}
            virtualScrollerOptions={{ itemSize: 46 }}
          >
            <Column field="id" header="#" />
            {/* <Column field="stokKartiId" header="Stok Kartı Id" /> */}
            <Column field="stokKodu" header="Stok Kodu" />
            <Column field="stokAdi" header="Stok Adı" />
            <Column field="miktar" header="Miktar" />
            {/* <Column field="olcuBirimId" header="Miktar" /> */}
            <Column field="istenilenMiktar" header="İstenilen Miktar" />
            <Column field="cikishucreKodu" header="Hücre" />
            <Column field="bakiye" header="Depo Bakiye" />
            <Column
              body={(rowData) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => {
                      setSelectedStokKodu(rowData.stokKodu);
                      setTempStokKodu(rowData.stokKodu);
                      setSelectedId(rowData.id);
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
