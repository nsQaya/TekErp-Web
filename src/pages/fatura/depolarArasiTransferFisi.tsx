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
import { IStokHareket } from "../../utils/types/fatura/IStokHareket";
import { IBelgeSeri } from "../../utils/types/tanimlamalar/IBelgeSeri";
import { IHucreOzet } from "../../utils/types/tanimlamalar/IHucreOzet";
import { EAktarimDurumu } from "../../utils/types/enums/EAktarimDurumu";
import { IStokHareketSeri } from "../../utils/types/stok/IStokHareketSeri";
import SeriTakibiModal from "../stok/stokHareketSeriModal";
import { IStokSeriBakiye } from "../../utils/types/stok/IStokSeriBakiye";

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
  stokAdi?: string;
  miktar: number;
  seri?: IStokHareketSeri[];
  istenilenMiktar?: number;
  fiyat?: number;
  hucreId: number;
  hucreKodu?: string;
  bakiye?: number;
  olcuBrId: number;
  olcuBr: string;
};

type GridData = {
  id: number;
  stokKartiId: number;
  stokKodu: string;
  stokAdi?: string;
  miktar: number;
  istenilenMiktar: number;
  fiyat: number;
  hucreId: number;
  hucreKodu?: string;
  bakiye?: number;
  olcuBirimId: number;
  olcuBr?: string;
  seriler?: IStokHareketSeri[];
};

const App: React.FC = () => {
  const currentDate = new Date();
  currentDate.setHours(3, 0, 0, 0);

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
    hucreId: 0,
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
  const [hucreOptions, setHucreOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const [selectedHucre, setSelectedHucre] = useState<number | null>(null);
  const [selectedStokKodu, setSelectedStokKodu] = useState("");
  const [tempStokKodu, setTempStokKodu] = useState(selectedStokKodu);
  const [selectedId, setSelectedId] = useState(0);

  const [showSeriTakibiModal, setShowSeriTakibiModal] = useState(false);
  const [seriBakiyeler, setSeriBakiyeler] = useState<IStokSeriBakiye[]>([]);
  const [selectedStokHareketSeriler, setSelectedStokHareketSeriler] = useState<IStokHareketSeri[]>([]);

  const handleHucreChange = useCallback(
    (e: any) => {
      const selectedOption = hucreOptions.find(
        (option) => option.value === e.value
      );
      setFormDataDetay((prevFormData) => ({
        ...prevFormData,
        hucreKodu: selectedOption ? selectedOption.label : "",
        hucreId: e.value,
      }));
      setSelectedHucre(e.value);
    },
    [hucreOptions]
  );

  useEffect(() => {
    setTempStokKodu(selectedStokKodu);
  }, [selectedStokKodu]);

  useEffect(() => {
    if (hucreOptions.length > 0 && !selectedHucre) {
      setSelectedHucre(hucreOptions[0].value);
      setFormDataDetay((prevFormData) => ({
        ...prevFormData,
        hucreKodu: hucreOptions[0].label,
        hucreId: hucreOptions[0].value,
      }));
    }
  }, [hucreOptions, selectedHucre]);

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

  const handleSeriChange = useCallback(async (e: { value: any }) => {
    const selectedBelgeSeri = e.value;
    setFormDataBaslik((prevFormDataBaslik) => ({
      ...prevFormDataBaslik,
      belgeSeri: selectedBelgeSeri,
      belgeNumara: "",
    }));

    if (selectedBelgeSeri) {
      try {
        const response = await api.belgeNo.getBySeri(
          selectedBelgeSeri,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.ambarFisi.getByBelgeId(updateBelgeId);
        if (response.data.status) {
          const ambarFisi = response.data.value;
          const belge = ambarFisi.belge!;
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
                hucreId: item.hucreId,
                hucreKodu: item.hucre?.kodu,
                bakiye: item.bakiye,
                olcuBirimId: item.olcuBirimId,
                olcuBr: item.olcuBirim?.simge,
              }))
            );

            setFormDataDetay((prevFormDataDetay) => ({
              ...prevFormDataDetay,
              projeKoduId: gridResponse.data.value.items[0].projeId,
              projeKodu: gridResponse.data.value.items[0].proje?.kodu,
              uniteKoduId: gridResponse.data.value.items[0].uniteId,
              uniteKodu: gridResponse.data.value.items[0].unite?.kodu,
              stokKartiId: 0,
              hucreId: 0,
              miktar: 0,
              istenilenMiktar: 0,
              olcuBrId: 0,
              olcuBr: "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (updateBelgeId) {
      fetchData();
    }
  }, [updateBelgeId, currentDate]);

  const handleInputChangeBaslik = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataBaslik((prevFormDataBaslik) => ({
      ...prevFormDataBaslik,
      [name]: value,
    }));
  };

  const miktarRef = useRef<any>(null);

  const handleKeyPress = useCallback(async () => {
    setFormDataDetay((prevFormData) => ({
      ...prevFormData,
      stokAdi: "",
      hucreKodu: "",
      hucreId: 0,
    }));
    setHucreOptions([]);
    try {
      const response = await api.stok.getByKod(selectedStokKodu);
      if (response.status) {
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
          const alreadyHasHucreId = alreadyHas ? alreadyHas.hucreId : 0;
          const alreadyHasHucreKodu = alreadyHas ? alreadyHas.hucreKodu : "";

          setFormDataDetay((prevFormData) => ({
            ...prevFormData,
            stokAdi: response.data.value.adi!,
            olcuBrId: response.data.value.stokOlcuBirim1Id,
            olcuBr: response.data.value.stokOlcuBirim1.simge,
            miktar: alreadyHasgMiktar - alreadyHasgBakiyeMiktar!,
            istenilenMiktar: alreadyHasgIstenilenMiktar!,
            hucreId: alreadyHasHucreId,
            hucreKodu: alreadyHasHucreKodu,
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
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [gridData, selectedStokKodu, selectedId]);

  useEffect(() => {
    if (selectedStokKodu) {
      handleKeyPress();
    }
  }, [selectedStokKodu, handleKeyPress]);

  const handleDialogSelect = useCallback(
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
    const sortColumn = "Id";
    const sortDirection = 1;

    const filters = {
      ProjeKodu: { value: formDataDetay.projeKodu, matchMode: "equals" },
      PlasiyerKodu: { value: formDataDetay.uniteKodu, matchMode: "equals" },
      miktar: { value: "0", matchMode: "gt" },
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
          stokKartiId: item.stokKartiId,
          stokKodu: item.stokKodu,
          stokAdi: item.stokAdi,
          miktar: 0,
          fiyat: 0,
          istenilenMiktar: item.miktar,
          bakiye: item.bakiye,
          hucreId: item.hucreId,
          hucreKodu: item.hucre
          ? item.hucre.map((h) => h.kodu).join(" | ")
          : "",
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

  const handleAddToGrid = useCallback(async () => {
    const nStoK = selectedStokKodu;
  
    if (!nStoK || formDataDetay.miktar === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Stok Kodu ve Miktar alanlarını doldurmalısınız.",
        life: 3000,
      });
      return;
    }
  
    const alreadyHas = gridData.find((x) => x.stokKodu === nStoK);
    const alreadyHasWithHucre = gridData.find(
      (x) =>
        (x.stokKodu === nStoK && x.miktar === 0) ||
        (x.stokKodu === nStoK && x.hucreId === formDataDetay.hucreId)
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
  
    const response = await api.stok.getByKod(nStoK);
    if (response.status && response.data.status) {
      if (response.data.value.seriTakibiVarMi) {

        const responseSeriList = await api.stokHareketSeri.getListBakiyeByStokKodu(nStoK);
        const seriBakiyeList: IStokSeriBakiye[] = responseSeriList.data.value.items.map((seriItem: IStokHareketSeri) => ({
          seriNo: seriItem.seriNo1,
          miktar:seriItem.miktar
          // Diğer IStokSeriBakiye özelliklerini de burada doldurabilirsiniz
        }));
        setSeriBakiyeler(seriBakiyeList);
        setShowSeriTakibiModal(true);
      } else {
        if (alreadyHasWithHucre) {
          setGridData((prevGridData) =>
            prevGridData.map((item) =>
              item.stokKodu === nStoK && item.id === alreadyHasWithHucre.id
                ? {
                    ...item,
                    miktar: formDataDetay.miktar!,
                    hucreKodu: hucreOptions.find((o) => o.value === selectedHucre)
                      ?.label,
                    hucreId: formDataDetay.hucreId,
                    seriler: formDataDetay.seri, // Seri bilgilerini ekleme
                  }
                : item
            )
          );
        } else {
          const maxId =
            gridData.length > 0
              ? Math.max(...gridData.map((item) => item.id!))
              : 0;
  
          const newGridData: GridData = {
            id: maxId + 1,
            stokKartiId: formDataDetay.stokKartiId,
            stokKodu: selectedStokKodu,
            stokAdi: formDataDetay.stokAdi,
            miktar: formDataDetay.miktar,
            hucreKodu: formDataDetay.hucreKodu,
            hucreId: formDataDetay.hucreId,
            istenilenMiktar: 0,
            fiyat: 0,
            bakiye: 0,
            olcuBirimId: formDataDetay.olcuBrId,
            olcuBr: formDataDetay.olcuBr,
            seriler: formDataDetay.seri, // Seri bilgilerini ekleme
          };
          setGridData((prevGridData) => [...prevGridData, newGridData]);
        }
  
        document.getElementById("getirButton")!.hidden = true;
        setSelectedStokKodu("");
        setFormDataDetay((formData) => ({
          ...formData,
          stokAdi: "",
          miktar: 0,
          istenilenMiktar: 0,
          seri: [], // Seri bilgilerini temizleme
        }));
        setSelectedId(0);
        setHucreOptions([]);
      }
    }
  }, [formDataDetay, gridData, hucreOptions, selectedStokKodu, selectedHucre]);
  
  const handleSeriAdd = (seriList: IStokHareketSeri[]) => {
    setFormDataDetay((prevFormData) => ({
      ...prevFormData,
      seri: [...(prevFormData.seri || []), ...seriList],
    }));
  };
  

  const handleSeriTakibiComplete = () => {
    const nStoK = selectedStokKodu;

    selectedStokHareketSeriler.forEach((selectedStokHareketSeri) => {
      const alreadyHasWithHucre = gridData.find(
        (x) =>
          (x.stokKodu === nStoK && x.miktar === 0) ||
          (x.stokKodu === nStoK && x.hucreId === formDataDetay.hucreId)
      );

      if (alreadyHasWithHucre) {
        setGridData((prevGridData) =>
          prevGridData.map((item) =>
            item.stokKodu === nStoK && item.id === alreadyHasWithHucre.id
              ? {
                  ...item,
                  miktar: formDataDetay.miktar!,
                  hucreKodu: hucreOptions.find((o) => o.value === selectedHucre)
                    ?.label,
                  hucreId: formDataDetay.hucreId,
                  seriler: [...(item.seriler || []), selectedStokHareketSeri],
                }
              : item
          )
        );
      } else {
        const maxId =
          gridData.length > 0
            ? Math.max(...gridData.map((item) => item.id!))
            : 0;

        const newGridData: GridData = {
          id: maxId + 1,
          stokKartiId: formDataDetay.stokKartiId,
          stokKodu: selectedStokKodu,
          stokAdi: formDataDetay.stokAdi,
          miktar: formDataDetay.miktar,
          hucreKodu: formDataDetay.hucreKodu,
          hucreId: formDataDetay.hucreId,
          istenilenMiktar: 0,
          fiyat: 0,
          bakiye: 0,
          olcuBirimId: formDataDetay.olcuBrId,
          olcuBr: formDataDetay.olcuBr,
          seriler: [selectedStokHareketSeri],
        };
        setGridData((prevGridData) => [...prevGridData, newGridData]);
      }
    });

    document.getElementById("getirButton")!.hidden = true;
    setSelectedStokKodu("");
    setFormDataDetay((formData) => ({
      ...formData,
      stokAdi: "",
      miktar: 0,
      istenilenMiktar: 0,
    }));
    setSelectedId(0);
    setHucreOptions([]);
    setShowSeriTakibiModal(false);
    setSelectedStokHareketSeriler([]);
  };

  const confirmDelete = useCallback(() => {
    if (selectedItem) {
      deleteItem(selectedItem);
      setVisible(false);
    }
  }, [selectedItem]);

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
      if (updateBelgeId !== 0) {
        const updateStokHareketResponse =
          await api.stokHareket.getListByBelgeId(updateBelgeId);

        if (updateStokHareketResponse.data.value) {
          await Promise.all(
            updateStokHareketResponse.data.value.items.map(async (element) => {
              const silHareket = await api.stokHareket.delete(element.id!);
              if (!silHareket.data.status) {
                throw new Error(
                  (silHareket.data.errors &&
                    silHareket.data.errors[0].Errors &&
                    silHareket.data.errors[0].Errors[0]) ||
                    "Stok Hareket Silme İşleminde Hata"
                );
              }
            })
          );
        }
      }

      let belgeResponse;

      if (updateBelgeId !== 0) {
        belgeResponse = await api.belge.update({
          id: updateBelgeId,
          belgeTip: EBelgeTip.AmbarCikisFisi,
          no: formDataBaslik.belgeSeri + formDataBaslik.belgeNumara,
          tarih: formDataBaslik.tarih,
          aciklama1: formDataBaslik.aciklama1,
          aciklama2: formDataBaslik.aciklama2,
          aciklama3: formDataBaslik.aciklama3,
          tamamlandi: false,
        });
      } else {
        belgeResponse = await api.belge.create({
          belgeTip: EBelgeTip.AmbarCikisFisi,
          no: formDataBaslik.belgeSeri + formDataBaslik.belgeNumara,
          tarih: formDataBaslik.tarih,
          aciklama1: formDataBaslik.aciklama1,
          aciklama2: formDataBaslik.aciklama2,
          aciklama3: formDataBaslik.aciklama3,
          tamamlandi: false,
        });
      }

      const belgeId = belgeResponse.data.value.id;

      if (!belgeResponse.data.status) {
        setLoading(false);
        throw new Error(
          (belgeResponse.data.errors &&
            belgeResponse.data.errors[0].Errors &&
            belgeResponse.data.errors[0].Errors[0]) ||
            "Belge oluştururken-güncellenirken hata oldu"
        );
      }

      let ambarFisiResponse;

      if (updateBelgeId !== 0) {
        const updateAmbarFisiResponse = await api.ambarFisi.getByBelgeId(
          updateBelgeId
        );

        if (!updateAmbarFisiResponse.data.status) {
          throw new Error(
            (updateAmbarFisiResponse.data.errors &&
              updateAmbarFisiResponse.data.errors[0].Errors &&
              updateAmbarFisiResponse.data.errors[0].Errors[0]) ||
              "Ambar fişi bulunamadı"
          );
        }

        ambarFisiResponse = await api.ambarFisi.update({
          id: updateAmbarFisiResponse.data.value.id!,
          belgeId: belgeId!,
          ambarHareketTur: formDataBaslik.hareketTuru,
          cikisYeri: formDataBaslik.cikisYeri,
          cikisYeriId: formDataBaslik.cikisYeriKoduId,
        });
      } else {
        ambarFisiResponse = await api.ambarFisi.create({
          belgeId: belgeId!,
          ambarHareketTur: formDataBaslik.hareketTuru,
          cikisYeri: formDataBaslik.cikisYeri,
          cikisYeriId: formDataBaslik.cikisYeriKoduId,
        });
      }

      if (!ambarFisiResponse.data.status) {
        setLoading(false);
        throw new Error(
          (ambarFisiResponse.data.errors &&
            ambarFisiResponse.data.errors[0].Errors &&
            ambarFisiResponse.data.errors[0].Errors[0]) ||
            "AmbarFişi oluştururken hata oldu"
        );
      }

      const stokHareketData: IStokHareket[] = gridData
        .filter((item) => item.miktar > 0)
        .map((item, index) => ({
          belgeId: belgeId!,
          stokKartiId: item.stokKartiId,
          masrafStokKartiId: formDataBaslik.cikisYeriKoduId,
          miktar: item.miktar,
          istenilenMiktar: 0,
          fiyatTL: item.fiyat,
          hucreId: item.hucreId,
          aciklama1: formDataBaslik.aciklama1,
          aciklama2: formDataBaslik.aciklama2,
          aciklama3: formDataBaslik.aciklama3,
          projeId: formDataDetay.projeKoduId,
          uniteId: formDataDetay.uniteKoduId,
          sira: index + 1,
          girisCikis: "C",
          olcuBirimId: item.olcuBirimId,
          stokKartiKodu: "",
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
        belgeTip: EBelgeTip.AmbarCikisFisi,
        no: formDataBaslik.belgeSeri + formDataBaslik.belgeSeri,
        tarih: formDataBaslik.tarih,
        aciklama1: formDataBaslik.aciklama1,
        aciklama2: formDataBaslik.aciklama2,
        aciklama3: formDataBaslik.aciklama3,
        aktarimDurumu: EAktarimDurumu.AktarimSirada,
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
      hucreId: 0,
      hucreKodu: "",
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

  return (
    <div className="container-fluid">
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
                  disabled
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
                      value={formDataBaslik.belgeSeri}
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
                      value={formDataBaslik.belgeNumara}
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
                  id="stokKodu"
                  name="stokKodu"
                  value={tempStokKodu}
                  onChange={(e) => setTempStokKodu(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSelectedStokKodu(tempStokKodu);
                      handleKeyPress();
                      if (miktarRef.current) {
                        miktarRef.current.focus();
                      }
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
                value={formDataDetay.stokKartiId?.toString()}
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
                value={formDataDetay.stokAdi}
                disabled
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
            virtualScrollerOptions={{ itemSize: 46 }}
          >
            <Column field="id" header="#" />
            <Column field="stokKodu" header="Stok Kodu" />
            <Column field="stokAdi" header="Stok Adı" />
            <Column field="miktar" header="Miktar" />
            <Column field="istenilenMiktar" header="İstenilen Miktar" />
            <Column field="hucreKodu" header="Hücre" />
            <Column field="bakiye" header="Depo Bakiye" />
            <Column
              body={(rowData) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => {
                      setSelectedStokKodu(rowData.stokKodu);
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
      <SeriTakibiModal
        visible={showSeriTakibiModal}
        onHide={() => setShowSeriTakibiModal(false)}
        seriler={seriBakiyeler}
        onSeriAdd={handleSeriAdd}
      />
      <div className="p-col-12 mt-3">
        <Button label="Tamam" onClick={handleSeriTakibiComplete} />
      </div>
    </div>
  );
};

export default App;
