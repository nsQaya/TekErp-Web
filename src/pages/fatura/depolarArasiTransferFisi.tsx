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
import { InputNumber } from "primereact/inputnumber";
import { transformFilter } from "../../utils/transformFilter";
import api from "../../utils/api";
import { Checkbox } from "primereact/checkbox";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { EAmbarHareketTur } from "../../utils/types/enums/EAmbarHareketTur";
import { EBelgeTip } from "../../utils/types/enums/EBelgeTip";
import { IStokHareket } from "../../utils/types/fatura/IStokHareket";
import { IBelgeSeri } from "../../utils/types/tanimlamalar/IBelgeSeri";
import { IHucreOzet } from "../../utils/types/tanimlamalar/IHucreOzet";
import { EAktarimDurumu } from "../../utils/types/enums/EAktarimDurumu";
import { IStokHareketSeri } from "../../utils/types/stok/IStokHareketSeri";
import SeriTakibiModal from "../stok/stokHareketSeriModal";
import { IStokSeriBakiye } from "../../utils/types/stok/IStokSeriBakiye";
import CariRehberDialog from "../../components/Rehber/CariRehberDialog";
import IsEmriRehberDialog from "../../components/Rehber/IsEmriRehberDialog";
import { ITransferDataDepolarArasiTransfer } from "../../utils/types/fatura/ITransferDataDepolarArasiTransfer";
import HucreRehberDialog from "../../components/Rehber/HucreRehberDialog";
import UniteRehberDialog from "../../components/Rehber/UniteRehberDialog";



type FormDataBaslik = {
  isEmriNo: string;
  isEmriStokAdi: string;
  belgeSeri: string;
  belgeNumara: string;
  tarih: Date;
  hareketTuru: EAmbarHareketTur;
  cariId: number; //bu artık cari kodu olacak
  cariKodu: string;
  //cikisYeriKodu?: string; //bu artık carikartid olacak.
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
  seriler?: IStokHareketSeri[];
  istenilenMiktar?: number;
  fiyat?: number;
  cikisHucreId?: number;
  cikisHucreKodu?: string;
  girisHucreId?: number;
  girisHucreKodu?: string;
  bakiye?: number;
  olcuBrId: number;
  olcuBr: string;
};

type GridData = {
  id: number;
  projeKoduId: number;
  projeKodu?: string;
  uniteKoduId: number;
  uniteKodu?: string;
  stokKartiId: number;
  stokKodu: string;
  stokAdi?: string;
  miktar: number;
  istenilenMiktar: number;
  fiyat: number;
  cikisHucreId?: number;
  cikisHucreKodu?: string;
  girisHucreId?: number;
  girisHucreKodu?: string;
  bakiye?: number;
  olcuBirimId: number;
  olcuBr?: string;
  seriler?: IStokHareketSeri[];
};

const App: React.FC = () => {
  const currentDate = new Date();
  currentDate.setHours(3, 0, 0, 0);
  const navigate= useNavigate();

  const [formDataBaslik, setFormDataBaslik] = useState<FormDataBaslik>({
    isEmriNo: "",
    isEmriStokAdi: "",
    belgeSeri: "",
    belgeNumara: "",
    tarih: currentDate,
    hareketTuru: EAmbarHareketTur.Devir,
    cariId: 0,
    cariKodu: "",
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
    cikisHucreKodu: "",
    girisHucreId: 0,
    girisHucreKodu: "",
    olcuBrId: 0,
    olcuBr: "",
  });

  const [dialogVisible, setDialogVisible] = useState({
    proje: false,
    unite: false,
    stok: false,
    isEmri: false,
    cari: false,
    girisHucre:false
  });

  //const [hataMesaji, setHataMesaji] = useState("");

  const [gridData, setGridData] = useState<GridData[]>([]);
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GridData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingGetir, setLoadingGetir] = useState(false);
  const [seriOptions, setSeriOptions] = useState<{ label: string; value: string }[]>([]);

  const [cikisHucreOptions, setCikisHucreOptions] = useState<{ label: string; value: number }[]>([]);

  const [selectedCikisHucre, setSelectedCikisHucre] = useState<number | null>(null);

  const [selectedStokKodu, setSelectedStokKodu] = useState("");
  const [tempStokKodu, setTempStokKodu] = useState(selectedStokKodu);
  const [selectedId, setSelectedId] = useState(0);

  const [showSeriTakibiModal, setShowSeriTakibiModal] = useState(false);
  const [seriBakiyeler, setSeriBakiyeler] = useState<IStokSeriBakiye[]>([]);
  const [seciliSeriler, setSeciliSeriler] = useState<IStokHareketSeri[]>([]);
  const [selectedStokHareketSeriler, setSelectedStokHareketSeriler] = useState<
    IStokHareketSeri[]
  >([]);

  const handleCikisHucreChange = useCallback(
    (e: any) => {
      const selectedOption = cikisHucreOptions.find(
        (option) => option.value === e.value
      );
      setFormDataDetay((prevFormData) => ({
        ...prevFormData,
        cikisHucreKodu: selectedOption ? selectedOption.label : "",
        cikisHucreId: e.value,
      }));
      setSelectedCikisHucre(e.value);
    },
    [cikisHucreOptions]
  );


  useEffect(() => {
    setTempStokKodu(selectedStokKodu);
  }, [selectedStokKodu]);

  useEffect(() => {
    if (cikisHucreOptions.length > 0 && !selectedCikisHucre) {
      setSelectedCikisHucre(cikisHucreOptions[0].value);
      setFormDataDetay((prevFormData) => ({
        ...prevFormData,
        cikisHucreKodu: cikisHucreOptions[0].label,
        cikisHucreId: cikisHucreOptions[0].value,
      }));
    }
  }, [cikisHucreOptions, selectedCikisHucre]);

  useEffect(() => {
    const fetchSeriOptions = async () => {
      try {
        const sortColumn = "Id";
        const sortDirection = 1;

        const filters = {
          BelgeTip: {
            value: EBelgeTip.DepolarArasiTransfer,
            matchMode: "equals",
          },
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
          EBelgeTip.DepolarArasiTransfer
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

  const fetchCariKodu = async (id: number) => {
    try {
      const response = await api.cari.get(id);
      return response.data.value.kodu;
    } catch (error) {
      console.error("Error fetching cari kodu:", error);
      return "";
    }
  };

  
    const fetchData = async () => {
      try {
        const response = await api.depolarArasiTransfer.getByBelgeId(
          updateBelgeId
        );
        if (response.data.status && response.data.value) {
          const depolarArasiTransfer = response.data.value;
          const belge = depolarArasiTransfer.belge!;
          const belgeSeri = belge.no.substring(0, 3);
          const belgeNumara = belge.no.substring(3);
          const cariKodu = await fetchCariKodu(depolarArasiTransfer.cariId);

          setFormDataBaslik({
            isEmriNo: depolarArasiTransfer.kaynakBelgeNo,
            isEmriStokAdi: "",
            belgeSeri: belgeSeri,
            belgeNumara: belgeNumara,
            tarih: currentDate,
            hareketTuru: depolarArasiTransfer.ambarHareketTur,
            cariId: depolarArasiTransfer.cariId,
            cariKodu: cariKodu,
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
                projeKoduId: item.projeId,
                uniteKoduId: item.uniteId,
                stokKartiId: item.stokKartiId,
                stokKodu: item.stokKarti!.kodu,
                stokAdi: item.stokKarti!.adi,
                miktar: item.miktar,
                istenilenMiktar: item.istenilenMiktar?item.istenilenMiktar:0,
                fiyat: item.fiyatTL,
                cikisHucreId: item.cikisHucreId,
                cikisHucreKodu: item.cikisHucre?.kodu,
                girisHucreId:item.girisHucreId,
                girisHucreKodu:item.girisHucre?.kodu,
                bakiye: item.bakiye,
                olcuBirimId: item.olcuBirimId,
                olcuBr: item.olcuBirim?.simge,
                seriler:item.seriler
              }))
            );
          debugger;
            setFormDataDetay((prevFormDataDetay) => ({
              ...prevFormDataDetay,
              projeKoduId: gridResponse.data.value.items[0].projeId,
              projeKodu: gridResponse.data.value.items[0].proje?.kodu,
              uniteKoduId: gridResponse.data.value.items[0].uniteId,
              uniteKodu: gridResponse.data.value.items[0].unite?.kodu,
              girisHucreId:gridResponse .data.value.items[0].girisHucreId,
              girisHucreKodu:gridResponse .data.value.items[0].girisHucre?.kodu,
              stokKartiId: 0,
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

  const miktarRef = useRef<any>(null);

  const handleKeyPress = useCallback(async () => {
    setFormDataDetay((prevFormData) => ({
      ...prevFormData,
      stokAdi: "",
      hucreKodu: "",
      hucreId: 0,
    }));
    setSelectedCikisHucre(null);
    setCikisHucreOptions([]);
    try {
      const response = await api.stok.getByKod(selectedStokKodu);
      if (response.status) {
        if (response.data.status) {
          //setSelectedStokKodu(response.data.value.kodu);
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
          const alreadyHasHucreKodu = alreadyHas ? alreadyHas.cikisHucreKodu : "";

          setFormDataDetay((prevFormData) => ({
            ...prevFormData,
            stokKartiId: response.data.value.id!,
            stokAdi: response.data.value.adi!,
            olcuBrId: response.data.value.stokOlcuBirim1Id,
            olcuBr: response.data.value.stokOlcuBirim1.simge,
            miktar: alreadyHasgMiktar - alreadyHasgBakiyeMiktar!,
            istenilenMiktar: alreadyHasgIstenilenMiktar!,
            cikisHucreId: alreadyHasHucreId,
            cikisHucreKodu: alreadyHasHucreKodu,
            seriler:alreadyHas?.seriler,
            bakiye:response.data.value.bakiye
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
            setCikisHucreOptions(options);
          }

          if (alreadyHasHucreId) {
            setSelectedCikisHucre(alreadyHasHucreId);
          } else if (alreadyHasHucreKodu) {
            const selectedOption = cikisHucreOptions.find(
              (option) => option.label === alreadyHasHucreKodu
            );
            if (selectedOption) {
              setSelectedCikisHucre(selectedOption.value);
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

  const handleGetir = async () => {
    if (!validateGetir()) {
      return;
    }

    setLoadingGetir(true);
    const sortColumn = "Id";
    const sortDirection = 1;

    const filters = {
      BelgeNo: { value: formDataBaslik.isEmriNo, matchMode: "equals" },
      //PlasiyerKodu: { value: formDataDetay.uniteKodu, matchMode: "equals" },
      miktar: { value: "0", matchMode: "gt" },
    };
    const dynamicQuery = transformFilter(filters, sortColumn, sortDirection);

    try {
      const response =
        await api.ihtiyacPlanlamaRapor.getListForDepolarArasiTransferFisi(
          dynamicQuery
        );

      if (response.data.value && response.data.value.count > 0) {
        document.getElementById("getirButton")!.hidden = true;
        //TODO: Burayı çıkış yeri için koymuşum ama cari için nasıl bir şey olması gerekiyor, update kısmında denemek gerekiyor.
        // let tempCikisYeri: { Id: any; kodu: string };
        // tempCikisYeri = {
        //   Id: 77118,
        //   kodu: "X150-99-0001",
        // };
        // handleDialogSelect("cikisYeriKodu", "kodu", tempCikisYeri);

        const data = response.data.value;
        const maxId =
          gridData.length > 0
            ? Math.max(...gridData.map((item) => item.id!))
            : 0;
        const newGridData: GridData[] = data.items.map((item, index) => ({
          id: maxId + index + 1,
          projeKoduId: item.projeKoduId,
          projeKodu: item.projeKodu,
          stokKartiId: item.stokKartiId,
          uniteKoduId: item.uniteKoduId,
          uniteKodu: item.plasiyerKodu,
          stokKodu: item.stokKodu,
          stokAdi: item.stokAdi,
          miktar: 0,
          fiyat: 0,
          istenilenMiktar: item.miktar,
          bakiye: item.bakiye,
          cikisHucreId: item.hucreId,
          cikisHucreKodu: item.hucre
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
    const response = await api.stok.getByKod(nStoK);
    if (response.status && response.data.status) {
      let formSeriMiktar = formDataDetay.seriler?.reduce(
        (acc, curr) => acc + curr.miktar,
        0
      );
      if (
        response.data.value.seriTakibiVarMi &&
        formDataDetay.miktar != formSeriMiktar
      ) {
        const responseSeriList =
          await api.stokSeriBakiye.getListBakiyeByStokKodu(nStoK);
        setSeriBakiyeler(responseSeriList.data.value.items);
        setSeciliSeriler(formDataDetay.seriler || []);
        setShowSeriTakibiModal(true);
      } else {
        if (alreadyHasWithHucre) {
          setGridData((prevGridData) =>
            prevGridData.map((item) =>
              item.stokKodu === nStoK && item.id === alreadyHasWithHucre.id
                ? {
                    ...item,
                    miktar: formDataDetay.miktar!,
                    cikisHucreKodu: cikisHucreOptions.find(
                      (o) => o.value === selectedCikisHucre
                    )?.label,
                    cikisHucreId: formDataDetay.cikisHucreId,
                    seriler: formDataDetay.seriler, // Seri bilgilerini ekleme
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
            projeKoduId: formDataDetay.projeKoduId,
            uniteKoduId: formDataDetay.uniteKoduId,
            stokKartiId: formDataDetay.stokKartiId,
            stokKodu: selectedStokKodu,
            stokAdi: formDataDetay.stokAdi,
            miktar: formDataDetay.miktar,
            cikisHucreKodu: formDataDetay.cikisHucreKodu,
            cikisHucreId: formDataDetay.cikisHucreId,
            girisHucreKodu: formDataDetay.girisHucreKodu,
            girisHucreId: formDataDetay.girisHucreId,
            istenilenMiktar: 0,
            fiyat: 0,
            bakiye: formDataDetay.bakiye,
            olcuBirimId: formDataDetay.olcuBrId,
            olcuBr: formDataDetay.olcuBr,
            seriler: formDataDetay.seriler, // Seri bilgilerini ekleme
          };
          setGridData((prevGridData) => [...prevGridData, newGridData]);
        }

        document.getElementById("getirButton")!.hidden = true;
        setSelectedStokKodu("");
        setFormDataDetay((formData) => ({
          ...formData,
          stokKartiId: 0,
          stokAdi: "",
          miktar: 0,
          istenilenMiktar: 0,
          bakiye:0,
          seri: [], // Seri bilgilerini temizleme
        }));
        setSelectedId(0);
        setSelectedCikisHucre(null);
        setCikisHucreOptions([]);
      }
    }
    // if (formDataDetay.miktar != formDataDetay.seri?.reduce((acc,curr)=> acc+curr.miktar,0))
    //   setHataMesaji(formDataDetay.miktar.toString() + " " + formDataDetay.seri?.reduce((acc,curr)=> acc+curr.miktar,0) +" hatalı");
    // else
    // setHataMesaji("");
  }, [formDataDetay, gridData, cikisHucreOptions, selectedStokKodu, selectedCikisHucre]);

  const handleSeriAdd = (seriList: IStokHareketSeri[]) => {
    setFormDataDetay((prevFormData) => ({
      ...prevFormData,
      seriler: seriList,
      //seri: [...(prevFormData.seri || []), ...seriList],
    }));
    // if (formDataDetay.miktar != formDataDetay.seri?.reduce((acc,curr)=> acc+curr.miktar,0))
    //   setHataMesaji(formDataDetay.miktar.toString() + " " + formDataDetay.seri?.reduce((acc,curr)=> acc+curr.miktar,0) +" hatalı");
    // else
    //   setHataMesaji("");
  };

  const handleSeriTakibiComplete = () => {
    const nStoK = selectedStokKodu;

    selectedStokHareketSeriler.forEach((selectedStokHareketSeri) => {
      const alreadyHasWithHucre = gridData.find(
        (x) =>
          (x.stokKodu === nStoK && x.miktar === 0) ||
          (x.stokKodu === nStoK && x.cikisHucreId === formDataDetay.cikisHucreId)
      );

      if (alreadyHasWithHucre) {
        setGridData((prevGridData) =>
          prevGridData.map((item) =>
            item.stokKodu === nStoK && item.id === alreadyHasWithHucre.id
              ? {
                  ...item,
                  miktar: formDataDetay.miktar!,
                  cikisHucreKodu: cikisHucreOptions.find((o) => o.value === selectedCikisHucre)
                    ?.label,
                  cikisHucreId: formDataDetay.cikisHucreId,
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
          projeKoduId: formDataDetay.projeKoduId,
          uniteKoduId: formDataDetay.uniteKoduId,
          cikisHucreKodu: formDataDetay.cikisHucreKodu,
          cikisHucreId: formDataDetay.cikisHucreId,
          girisHucreKodu: formDataDetay.girisHucreKodu,
          girisHucreId: formDataDetay.girisHucreId,
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
      stokKartiId: 0,
      stokAdi: "",
      miktar: 0,
      istenilenMiktar: 0,
    }));
    setSelectedId(0);
    setSelectedCikisHucre(null);
    setCikisHucreOptions([]);
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
    if (!formDataBaslik.isEmriNo) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "İş Emri Seçiniz",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  // const handleSave = useCallback(async () => {
  //   if (!validateForm()) {
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     if (updateBelgeId !== 0) {
  //       const updateStokHareketResponse = await api.stokHareket.getListByBelgeId(updateBelgeId);
  //       if (updateStokHareketResponse.data.value) {
  //         await Promise.all(
  //           updateStokHareketResponse.data.value.items.map(async (element) => {
  //             const stokHareketSeriResponse = await api.stokHareketSeri.getListByBelgeId(element.id!);
  //             if (stokHareketSeriResponse.data.value) {
  //               await Promise.all(
  //                 stokHareketSeriResponse.data.value.items.map(async (seriElement) => {
  //                   const silSeriHareket = await api.stokHareketSeri.delete(seriElement.id!);
  //                   if (!silSeriHareket.data.status) {
  //                     throw new Error(
  //                       (silSeriHareket.data.errors &&
  //                         silSeriHareket.data.errors[0].Errors &&
  //                         silSeriHareket.data.errors[0].Errors[0]) ||
  //                         "Stok Hareket Seri Silme İşleminde Hata"
  //                     );
  //                   }
  //                 })
  //               );
  //             }

  //             const silHareket = await api.stokHareket.delete(element.id!);
  //             if (!silHareket.data.status) {
  //               throw new Error(
  //                 (silHareket.data.errors &&
  //                   silHareket.data.errors[0].Errors &&
  //                   silHareket.data.errors[0].Errors[0]) ||
  //                   "Stok Hareket Silme İşleminde Hata"
  //               );
  //             }
  //           })
  //         );
  //       }
  //     }

  //     let belgeResponse;

  //     if (updateBelgeId !== 0) {
  //       belgeResponse = await api.belge.update({
  //         id: updateBelgeId,
  //         belgeTip: EBelgeTip.DepolarArasiTransfer,
  //         no: formDataBaslik.belgeSeri + formDataBaslik.belgeNumara,
  //         tarih: formDataBaslik.tarih,
  //         aciklama1: formDataBaslik.aciklama1,
  //         aciklama2: formDataBaslik.aciklama2,
  //         aciklama3: formDataBaslik.aciklama3,
  //         tamamlandi: false,
  //       });
  //     } else {
  //       belgeResponse = await api.belge.create({
  //         belgeTip: EBelgeTip.DepolarArasiTransfer,
  //         no: formDataBaslik.belgeSeri + formDataBaslik.belgeNumara,
  //         tarih: formDataBaslik.tarih,
  //         aciklama1: formDataBaslik.aciklama1,
  //         aciklama2: formDataBaslik.aciklama2,
  //         aciklama3: formDataBaslik.aciklama3,
  //         tamamlandi: false,
  //       });
  //     }

  //     const belgeId = belgeResponse.data.value.id;

  //     if (!belgeResponse.data.status) {
  //       setLoading(false);
  //       throw new Error(
  //         (belgeResponse.data.errors &&
  //           belgeResponse.data.errors[0].Errors &&
  //           belgeResponse.data.errors[0].Errors[0]) ||
  //           "Belge oluştururken-güncellenirken hata oldu"
  //       );
  //     }

  //     let ambarFisiResponse;

  //     if (updateBelgeId !== 0) {
  //       const updateAmbarFisiResponse =
  //         await api.depolarArasiTransfer.getByBelgeId(updateBelgeId);

  //       if (!updateAmbarFisiResponse.data.status) {
  //         throw new Error(
  //           (updateAmbarFisiResponse.data.errors &&
  //             updateAmbarFisiResponse.data.errors[0].Errors &&
  //             updateAmbarFisiResponse.data.errors[0].Errors[0]) ||
  //             "Ambar fişi bulunamadı"
  //         );
  //       }

  //       ambarFisiResponse = await api.depolarArasiTransfer.update({
  //         id: updateAmbarFisiResponse.data.value.id!,
  //         belgeId: belgeId!,
  //         ambarHareketTur: formDataBaslik.hareketTuru,
  //         cariId: formDataBaslik.cariId,
  //         kaynakBelgeNo: formDataBaslik.isEmriNo,
  //       });
  //     } else {
  //       ambarFisiResponse = await api.depolarArasiTransfer.create({
  //         belgeId: belgeId!,
  //         ambarHareketTur: formDataBaslik.hareketTuru,
  //         cariId: formDataBaslik.cariId,
  //         kaynakBelgeNo: formDataBaslik.isEmriNo,
  //       });
  //     }

  //     if (!ambarFisiResponse.data.status) {
  //       setLoading(false);
  //       throw new Error(
  //         (ambarFisiResponse.data.errors &&
  //           ambarFisiResponse.data.errors[0].Errors &&
  //           ambarFisiResponse.data.errors[0].Errors[0]) ||
  //           "AmbarFişi oluştururken hata oldu"
  //       );
  //     }

  //     const stokHareketData: IStokHareket[] = gridData
  //       .filter((item) => item.miktar > 0)
  //       .map((item, index) => ({
  //         id:0,
  //         belgeId: belgeId!,
  //         stokKartiId: item.stokKartiId,
  //         masrafStokKartiId: item.stokKartiId, // TODO: buraya bi şey düşünmek lazım. iş emri stok kodu mu yazılacak nolacak bak
  //         miktar: item.miktar,
  //         istenilenMiktar: 0,
  //         fiyatTL: item.fiyat,
  //         cikisHucreId: item.cikisHucreId,
  //         girisHucreId:item.girisHucreId,
  //         aciklama1: formDataBaslik.aciklama1,
  //         aciklama2: formDataBaslik.aciklama2,
  //         aciklama3: formDataBaslik.aciklama3,
  //         projeId: formDataDetay.projeKoduId,
  //         uniteId: formDataDetay.uniteKoduId,
  //         sira: index + 1,
  //         girisCikis: "C",
  //         olcuBirimId: item.olcuBirimId,
  //         stokKartiKodu: "",
  //         seriler: item.seriler,
  //       }));

  //     for (const stokHareket of stokHareketData) {
  //       const stokHareketResponse = await api.stokHareket.create(stokHareket);
  //       debugger;

  //       if (!stokHareketResponse.data.status) {
  //         setLoading(false);
  //         throw new Error(
  //           (stokHareketResponse.data.errors &&
  //             stokHareketResponse.data.errors[0].Errors &&
  //             stokHareketResponse.data.errors[0].Errors[0]) ||
  //             "StokHareket oluştururken hata oldu"
  //         );
  //       } else {
  //         if (stokHareket.seriler && stokHareket.seriler?.length>0) {
  //           for (const element of stokHareket.seriler) {
  //             element.stokHareketId=stokHareketResponse.data.value.id;
  //             const stokHareketSeriResponse = await api.stokHareketSeri.create(
  //               element
  //             );
  //             if (!stokHareketSeriResponse.data.status) {
  //               setLoading(false);
  //               throw new Error(
  //                 (stokHareketSeriResponse.data.errors &&
  //                   stokHareketSeriResponse.data.errors[0].Errors &&
  //                   stokHareketSeriResponse.data.errors[0].Errors[0]) ||
  //                   "StokHareketSeri oluştururken hata oldu"
  //               );
  //             }
  //           };
  //         }
  //       }
  //     }

  //     const belgeUpdateResponse = await api.belge.update({
  //       id: belgeId,
  //       tamamlandi: true,
  //       belgeTip: EBelgeTip.DepolarArasiTransfer,
  //       no: formDataBaslik.belgeSeri + formDataBaslik.belgeNumara,
  //       tarih: formDataBaslik.tarih,
  //       aciklama1: formDataBaslik.aciklama1,
  //       aciklama2: formDataBaslik.aciklama2,
  //       aciklama3: formDataBaslik.aciklama3,
  //       aktarimDurumu: EAktarimDurumu.AktarimSirada,
  //     });

  //     if (!belgeUpdateResponse.data.status) {
  //       setLoading(false);
  //       throw new Error(
  //         (belgeUpdateResponse.data.errors &&
  //           belgeUpdateResponse.data.errors[0].Errors &&
  //           belgeUpdateResponse.data.errors[0].Errors[0]) ||
  //           "Belge güncellenirken oluştururken hata oldu"
  //       );
  //     }
      
  //     toast.current?.show({
  //       severity: "success",
  //       summary: "Başarılı",
  //       detail: "Veriler başarıyla kaydedildi",
  //       life: 3000,
  //     });
  //     resetForm();
  //   } catch (error: any) {
  //     toast.current?.show({
  //       severity: "error",
  //       summary: "Hata",
  //       detail: error.message || "Veriler kaydedilemedi",
  //       life: 3000,
  //     });
  //     console.error("Error saving data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [formDataBaslik, gridData, formDataDetay, updateBelgeId]);

  const resetForm = () => {
    setFormDataBaslik({
      isEmriNo: "",
      isEmriStokAdi: "",
      belgeSeri: "",
      belgeNumara: "",
      tarih: currentDate,
      hareketTuru: EAmbarHareketTur.Devir,
      cariId: 0,
      cariKodu: "",
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
      bakiye:0,
      fiyat: 0,
      cikisHucreId: 0,
      cikisHucreKodu: "",
      girisHucreId: 0,
      girisHucreKodu: "",
      olcuBrId: 0,
      olcuBr: "",
    });

    setDialogVisible({
      proje: false,
      unite: false,
      stok: false,
      isEmri: false,
      cari: false,
      girisHucre:false
    });

    setGridData([]);
    setSelectedItem(null);
    setSelectedStokKodu("");
    setSelectedCikisHucre(null);
    setCikisHucreOptions([]);
  };

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      debugger;
      const transferData: ITransferDataDepolarArasiTransfer = {
        belgeDto: {
            id: updateBelgeId !== 0 ? updateBelgeId : 0, 
            belgeTip: EBelgeTip.DepolarArasiTransfer,
            no: formDataBaslik.belgeSeri + formDataBaslik.belgeNumara,
            tarih: formDataBaslik.tarih,
            aciklama1: formDataBaslik.aciklama1,
            aciklama2: formDataBaslik.aciklama2,
            aciklama3: formDataBaslik.aciklama3,
            tamamlandi: true,
            aktarimDurumu: EAktarimDurumu.AktarimSirada  
        },
        depolarArasiTransferDto: {
            id: 0,//updateBelgeId !== 0 ? await getAmbarFisiId(updateBelgeId) : 0,  
            belgeId: updateBelgeId !== 0 ? updateBelgeId : 0,  
            ambarHareketTur: formDataBaslik.hareketTuru,
            cariId: formDataBaslik.cariId,
            kaynakBelgeNo: formDataBaslik.isEmriNo! ,

        },
        stokHareketDto: gridData.filter(item => item.miktar > 0).map((item, index) => ({
          id:0,// item.id,
          belgeId: updateBelgeId !== 0 ? updateBelgeId : 0, 
          stokKartiId: item.stokKartiId ?? 0,
          masrafStokKartiId: item.stokKartiId ?? 0,
          miktar: item.miktar ?? 0,
          istenilenMiktar:item.istenilenMiktar,
          fiyatTL: item.fiyat ?? 0,
          fiyatDoviz: 0,
          fiyatDovizTipiId: 1,
          cikisHucreId: item.cikisHucreId ?? 0,
          girisHucreId: formDataDetay.girisHucreId ?? 0,
          aciklama1: formDataBaslik.aciklama1 ?? "",
          aciklama2: formDataBaslik.aciklama2 ?? "",
          aciklama3: formDataBaslik.aciklama3 ?? "",
          projeId: formDataDetay.projeKoduId ?? 0,
          uniteId: formDataDetay.uniteKoduId ?? 0,
          sira: index + 1,
          girisCikis: "C",
          olcuBirimId: item.olcuBirimId ?? 0,
          seriKodu: "",
          stokHareketSeries: item.seriler || []
      }))
    };
  
      // API'ye tek seferde gönderim
      const response = await api.depolarArasiTransferSave.save(transferData);
  
      if (!response.data.status) {
        throw new Error(
          (response.data.errors && response.data.errors[0].Errors && response.data.errors[0].Errors[0]) ||
          "Veriler kaydedilirken bir hata oluştu."
        );
      }
      navigate(`/fatura/depolararasitransferliste`)
  
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
              <label htmlFor="isEmriNo">İş Emri No</label>
              <div className="p-inputgroup">
                <InputText
                  id="isEmriNo"
                  name="isEmriNo"
                  value={formDataBaslik.isEmriNo}
                  readOnly
                  disabled
                />
                <Button
                  label="..."
                  onClick={() =>
                    setDialogVisible({ ...dialogVisible, isEmri: true })
                  }
                />
                <IsEmriRehberDialog
                  isVisible={dialogVisible.isEmri}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, isEmri: false })
                  }
                  onSelect={(selectedValue) =>
                    setFormDataBaslik((prevFormDataBaslik) => ({
                      ...prevFormDataBaslik,
                      isEmriNo: selectedValue.isEmriNo,
                      isEmriStokAdi: selectedValue.stokAdi,
                    }))
                  }
                />
              </div>
            </FloatLabel>
          </div>
          <div className="col-md-5 col-sm-6 mt-4">
            <InputText
              id="isEmriStokAdi"
              name="isEmriStokAdi"
              value={formDataBaslik.isEmriStokAdi}
              readOnly
              disabled
              //type="hidden"
            />
          </div>

          <div className="col-md-1 col-sm-6 mt-4">
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
                <FloatLabel>
                  <label htmlFor="girisHucreId">Giriş Hücre</label>
                  <div className="p-inputgroup">
                    <InputText
                      id="girisHucreKodu"
                      name="girisHucreKodu"
                      value={formDataDetay.girisHucreKodu?.toString()}
                      readOnly
                      disabled
                    />
                    <Button
                      label="..."
                      onClick={() =>
                        setDialogVisible({
                          ...dialogVisible,
                          girisHucre: true,
                        })
                      }
                    />
                    <HucreRehberDialog
                      isVisible={dialogVisible.girisHucre}
                      onHide={() => {
                        setDialogVisible({
                          ...dialogVisible,
                          girisHucre: false,
                        });
                      }}
                      onSelect={(selectedValue) =>
                        setFormDataDetay((prevFormDataBaslik) => ({
                          ...prevFormDataBaslik,
                          girisHucreKodu: selectedValue.kodu,
                          girisHucreId: selectedValue.id!,
                        }))
                      }
                      // onSelect={(selectedValue) =>
                      //   handleDialogSelect("cariKodu","kodu",selectedValue)
                      // }
                    />
                  </div>
                  <InputText
                    id="girisHucreId"
                    name="girisHucreId"
                    value={formDataDetay.girisHucreId?.toString()}
                    type="hidden"
                  />
                </FloatLabel>
              </div>

              <div className="col-md-3 col-sm-6 mt-4">
                <FloatLabel>
                  <label htmlFor="cariKodu">Cari Kodu</label>
                  <div className="p-inputgroup">
                    <InputText
                      id="cariKodu"
                      name="cariKodu"
                      value={formDataBaslik.cariKodu?.toString()}
                      readOnly
                      disabled
                    />
                    <Button
                      label="..."
                      onClick={() =>
                        setDialogVisible({
                          ...dialogVisible,
                          cari: true,
                        })
                      }
                    />
                    <CariRehberDialog
                      isVisible={dialogVisible.cari}
                      onHide={() => {
                        setDialogVisible({
                          ...dialogVisible,
                          cari: false,
                        });
                      }}
                      onSelect={(selectedValue) =>
                        setFormDataBaslik((prevFormDataBaslik) => ({
                          ...prevFormDataBaslik,
                          cariKodu: selectedValue.kodu,
                          cariId: selectedValue.id!,
                        }))
                      }
                      // onSelect={(selectedValue) =>
                      //   handleDialogSelect("cariKodu","kodu",selectedValue)
                      // }
                    />
                  </div>
                  <InputText
                    id="cariId"
                    name="cariId"
                    value={formDataBaslik.cariId?.toString()}
                    type="hidden"
                  />
                </FloatLabel>
              </div>
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
                        setFormDataDetay((prevFormDataBaslik) => ({
                          ...prevFormDataBaslik,
                          projeKodu: selectedValue.kodu,
                          projeKoduId: selectedValue.id!,
                        }))
                      }
                      // onSelect={(selectedValue) =>
                      //   handleDialogSelect("projeKodu", "kodu", selectedValue)
                      // }
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
                    setFormDataDetay((prevFormDataBaslik) => ({
                      ...prevFormDataBaslik,
                      //stokKodu: selectedValue.kodu,
                      stokAdi: selectedValue.adi,
                      stokKartiId: selectedValue.id!,
                    }));
                    setSelectedStokKodu(selectedValue.kodu);
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
              <label htmlFor="istenilenMiktar">İstenilen Miktar</label>
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
              <label htmlFor="cikisHucre">Çıkış Hücre</label>
              <Dropdown
                id="cikisHucre"
                name="cikisHucre"
                value={selectedCikisHucre}
                options={cikisHucreOptions}
                onChange={handleCikisHucreChange}
                className="w-full md:w-14rem"
              />
            </FloatLabel>
          </div>
        </div>
        {/* { hataMesaji!="" && (
        <div className="p-d-flex p-jc-end mt-3" >
         {hataMesaji}
        </div>)} */}
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
            <Column field="cikisHucreKodu" header="Hücre" />
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
        seciliSeriler={seciliSeriler}
        onSeriAdd={handleSeriAdd}
        toplamMiktar={formDataDetay.miktar}
      />
      <div className="p-col-12 mt-3">
        <Button label="TamamA" onClick={handleSeriTakibiComplete} />
      </div>
    </div>
  );
};
export default App;