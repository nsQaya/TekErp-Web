import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FloatLabel } from "primereact/floatlabel";
import StokRehberDialog from "../../components/Rehber/StokRehberDialog";
import { Dropdown } from "primereact/dropdown";
import ProjeRehberDialog from "../../components/Rehber/ProjeRehberDialog";
import UniteRehberDialog from "../../components/Rehber/UniteRehberDialog";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { transformFilter } from "../../utils/transformFilter";
import api from "../../utils/api";
import { Checkbox } from "primereact/checkbox";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useSearchParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { EAmbarHareketTur } from "../../utils/types/enums/EAmbarHareketTur";
import { IAmbarFisi } from "../../utils/types/fatura/IAmbarFisi";
import { EBelgeTip } from "../../utils/types/enums/eBelgeTip";
import { EAmbarFisiCikisYeri } from "../../utils/types/enums/EAmbarFisiCikisYeri";
import { IStokHareket } from "../../utils/types/fatura/IStokHareket";

type FormData = {
  seri?: string;
  numara?: string;
  tarih: Date;
  hareketTuruId: EAmbarHareketTur;
  hareketTuru?: string;
  cikisYeriId: number;
  cikisYeri: EAmbarFisiCikisYeri;
  cikisKodId?: number;
  cikisKod?: string;
  aciklama1?: string;
  aciklama2?: string;
  aciklama3?: string;
  projeKoduId?: number;
  projeKodu?: string;
  uniteKoduId?: number;
  uniteKodu?: string;
  ozelKod1Id?: number;
  ozelKod1?: string;
  eIrsaliye?: boolean;
  stokKoduId: number;
  stokKodu: string;
  stokAdi?: string;
  miktar: number;
  istenilenMiktar?: number;
  fiyat?: number;
  hucreKoduId?: number;
  hucreKodu?: string;
  bakiye?: number;
};

type GridData = {
  id: number;
  stokKoduId: number;
  stokKodu: string;
  stokAdi?: string;
  miktar: number;
  istenilenMiktar?: number;
  fiyat?: number;
  hucreKoduId?: number;
  hucreKodu?: string;
  bakiye?: number;
};

const App = () => {
  const currentDate = new Date();

  const [formData, setFormData] = useState<FormData>({
    seri: "",
    numara: "",
    tarih: currentDate,
    hareketTuruId: EAmbarHareketTur.Devir,
    hareketTuru: "",
    cikisYeriId: 0,
    cikisYeri: EAmbarFisiCikisYeri.StokKodu,
    cikisKodId: 0,
    cikisKod: "",
    aciklama1: "",
    aciklama2: "",
    aciklama3: "",
    projeKoduId: 0,
    projeKodu: "",
    uniteKoduId: 0,
    uniteKodu: "",
    ozelKod1Id: 0,
    ozelKod1: "",
    eIrsaliye: false,
    stokKoduId: 0,
    stokKodu: "",
    stokAdi: "",
    istenilenMiktar: 0,
    miktar: 0,
    fiyat: 0,
    hucreKoduId: 0,
    hucreKodu: "",
  });

  const [dialogVisible, setDialogVisible] = useState({
    proje: false,
    unite: false,
    stok: false,
    cikisYeri: false,
  });

  const [gridData, setGridData] = useState<GridData[]>([]);
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GridData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const miktarRef = useRef<any>(null);

  const handleKeyPress = useCallback(
    async (stokKodu: string) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
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
            const alreadyHas = gridData.find((x) => x.stokKodu == stokKodu);
            const alreadyHasgMiktar = alreadyHas ? alreadyHas.miktar : 0;
            const alreadyHasgIstenilenMiktar = alreadyHas
              ? alreadyHas.istenilenMiktar
              : 0;

            setFormData((prevFormData) => ({
              ...prevFormData,
              stokAdi: response.data.value.adi,
              miktar: alreadyHasgMiktar,
              istenilenMiktar: alreadyHasgIstenilenMiktar,
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
    },
    [gridData]
  );

  const handleDialogSelect = useCallback(
    (fieldName: string, selectedValue: any) => {
      setFormData((prevFormData) => {
        const newFormData = { ...prevFormData, [fieldName]: selectedValue };
        if (fieldName === "stokKodu") {
          handleKeyPress(selectedValue);
        }
        return newFormData;
      });
    },
    [handleKeyPress]
  );

  const handleGetir = async () => {
    const sortColumn = "Id";
    const sortDirection = 1;

    const filters = {
      projeKodu: { value: formData.projeKodu, matchMode: "equals" },
      plasiyerKodu: { value: formData.uniteKodu, matchMode: "equals" },
      miktar: { value: "0", matchMode: "gt" },
    };
    const dynamicQuery = transformFilter(filters, sortColumn, sortDirection);

    try {
      const response = await api.ihtiyacPlanlamaRapor.getAllForGrid(
        0,
        9999,
        dynamicQuery
      );
      console.log(response.data);

      const data = response.data.value;
      const maxId =
        gridData.length > 0 ? Math.max(...gridData.map((item) => item.id)) : 0;
      const newGridData: GridData[] = data.items.map((item, index) => ({
        id: maxId + index + 1,
        projeKodu: item.projeKodu,
        uniteKodu: item.plasiyerKodu,
        numara: item.belgeNo,
        stokKoduId:item.stokKoduId,
        stokKodu: item.stokKodu,
        stokAdi: item.stokAdi,
        miktar: 0,
        istenilenMiktar: item.miktar,
        bakiye: item.bakiye,
      }));

      setGridData(newGridData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToGrid = useCallback(async () => {
    var nStoK = formData.stokKodu;

    if (!nStoK || formData.miktar === 0) {
      alert("Stok Kodu ve Miktar alanlarını doldurmalısınız.");
      return;
    }

    var alreadyHas = gridData.find((x) => x.stokKodu == nStoK);
    alert(Number(formData.miktar));
    alert(Number(alreadyHas?.istenilenMiktar));

    if (alreadyHas) {
      if (Number(formData.miktar) > Number(alreadyHas.istenilenMiktar)) {
        return alert("Var olan miktardan fazla çıkış ekleyemezsin.");
      }

      setGridData((prevGridData) =>
        prevGridData.map((item) =>
          item.stokKodu === nStoK
            ? {
                ...item,
                miktar: formData.miktar!,
              }
            : item
        )
      );
    } else {
      const maxId =
        gridData.length > 0 ? Math.max(...gridData.map((item) => item.id)) : 0;

      const newGridData: GridData = {
        id: maxId + 1,
        stokKoduId:formData.stokKoduId,
        stokKodu: formData.stokKodu,
        stokAdi: formData.stokAdi,
        miktar: formData.miktar,
        istenilenMiktar: 0,
        bakiye: 0,
      };
      setGridData((prevGridData) => [...prevGridData, newGridData]);
    }

    setFormData({
      seri: "",
      numara: "",
      tarih: currentDate,
      hareketTuruId: EAmbarHareketTur.Devir,
      hareketTuru: "",
      cikisYeriId: 0,
      cikisYeri: EAmbarFisiCikisYeri.StokKodu,
      cikisKodId: 0,
      cikisKod: "",
      aciklama1: "",
      aciklama2: "",
      aciklama3: "",
      ozelKod1Id: 0,
      ozelKod1: "",
      eIrsaliye: false,
      stokKoduId: 0,
      stokKodu: "",
      stokAdi: "",
      miktar: 0,
      istenilenMiktar: 0,
      fiyat: 0,
      hucreKoduId: 0,
      hucreKodu: "",
    });
  }, [formData, gridData]);

  const confirmDelete = useCallback(() => {
    if (selectedItem) {
      deleteItem(selectedItem);
      setVisible(false);
    }
  }, [selectedItem]);

  const deleteItem = useCallback(async (item: GridData) => {
    try {
      setGridData((prevGridData) =>
        prevGridData.filter((i) => i.id !== item.id)
      );
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

  const handleSave = async () => {
    setLoading(true);
    try {
      const belgeResponse = await api.belge.create({
        belgeTip: EBelgeTip.AmbarCikisFisi,
        no: formData.seri,
        tarih: formData.tarih,
        aciklama1: formData.aciklama1,
        aciklama2: formData.aciklama2,
        aciklama3: formData.aciklama3,
      });

      const belgeId = belgeResponse.data.value.id;

      const ambarFisiData: IAmbarFisi = {
        belgeId: belgeId!,
        ambarHareketTur: formData.hareketTuruId,
        cikisYeriId: formData.cikisYeriId,
        cikisYeri: formData.cikisYeri,
      };
      await api.ambarFisi.create(ambarFisiData);

      const stokHareketData:IStokHareket[] = gridData.map((item, index) => ({
        belgeId: belgeId!,
        stokKartiId: item.stokKoduId,
        miktar: item.miktar,
        fiyatTL: item.fiyat,
        hucreId: item.hucreKoduId,
        aciklama1: formData.aciklama1,
        aciklama2: formData.aciklama2,
        aciklama3: formData.aciklama3,
        projeId: formData.projeKoduId,
        uniteId: formData.uniteKoduId,
        sira: index + 1,
        girisCikis:"C",
        olcuBirimId:1,

      }));
      await api.stokHareket.create(stokHareketData);

      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Veriler başarıyla kaydedildi",
        life: 3000,
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Veriler kaydedilemedi",
        life: 3000,
      });
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  let [searchParams, _] = useSearchParams();
  const belgeId = useMemo(
    () => String(searchParams.get("belgeId")),
    [searchParams]
  );

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
                  value={formData.projeKodu}
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
                    handleDialogSelect("projeKodu", selectedValue)
                  }
                />
              </div>
              <InputText
                id="projeKoduId"
                name="projeKoduId"
                value={formData.projeKoduId?.toString()}
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
                  value={formData.uniteKodu}
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
                    handleDialogSelect("uniteKodu", selectedValue)
                  }
                />
              </div>
              <InputText
                id="uniteKoduId"
                name="uniteKoduId"
                value={formData.uniteKoduId?.toString()}
                type="hidden"
              />
            </FloatLabel>
          </div>
          <div className="col-md-3 col-sm-6 mt-4">
            <div className="p-inputgroup">
              <Button label="Getir" onClick={handleGetir} />
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
                      showClear
                      placeholder="Seri"
                      style={{ width: "100%" }}
                    />
                    <label htmlFor="seri">Seri</label>
                  </FloatLabel>

                  <FloatLabel>
                    <InputText
                      id="numara"
                      name="numara"
                      value={formData.numara}
                      onChange={handleInputChange}
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
                      value={formData.hareketTuruId}
                      options={Object.values(EAmbarHareketTur).map((value) => ({
                        label: EAmbarHareketTur[Number(value)],
                        value: value,
                      }))}
                      onChange={(e) => setFormData({ ...formData, hareketTuruId: e.value })}
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
                      placeholder="Çıkış Yer"
                      style={{ width: "100%" }}
                    />
                    <label htmlFor="cikisYeri">Çıkış Yeri</label>
                  </FloatLabel>
                </div>
              </div>

              <div className="col-md-3 col-sm-6 mt-4">
                <FloatLabel>
                  <label htmlFor="cikisYeri">Çıkış Yeri</label>
                  <div className="p-inputgroup">
                    <InputText
                      id="cikisYeri"
                      name="cikisYeri"
                      value={formData.cikisYeri.toString()}
                      readOnly
                    />
                    <Button
                      label="..."
                      onClick={() =>
                        setDialogVisible({ ...dialogVisible, cikisYeri: true })
                      }
                    />
                    <StokRehberDialog
                      isVisible={dialogVisible.cikisYeri}
                      onHide={() =>
                        setDialogVisible({ ...dialogVisible, cikisYeri: false })
                      }
                      onSelect={(selectedValue) =>
                        handleDialogSelect("cikisYeri", selectedValue)
                      }
                    />
                  </div>
                  <InputText
                    id="cikisYeriId"
                    name="cikisYeriId"
                    value={formData.cikisYeriId?.toString()}
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
                      value={formData.aciklama1}
                      onChange={handleInputChange}
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
                      value={formData.aciklama2}
                      onChange={handleInputChange}
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
                      value={formData.aciklama3}
                      onChange={handleInputChange}
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
                      value={formData.ozelKod1}
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
                    checked={formData.eIrsaliye || false}
                  />
                  <label htmlFor="ingredient1" className="ml-2">
                    eİrsaliye
                  </label>
                </div>
              </div>
            </div>
            <Divider />
          </AccordionTab>
        </Accordion>
        <div className="row">
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="stokKodu">Stok Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  id="stokKodu"
                  name="stokKodu"
                  value={formData.stokKodu}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleKeyPress(formData.stokKodu!);
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
                    handleDialogSelect("stokKodu", selectedValue);
                  }}
                />
              </div>
              <InputText
                id="stokKoduId"
                name="stokKoduId"
                value={formData.stokKoduId?.toString()}
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
                value={formData.stokAdi}
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
                value={formData.istenilenMiktar}
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
                value={formData.miktar}
                min={0}
                minFractionDigits={0}
                maxFractionDigits={2}
                onChange={(e) => {
                  setFormData({ ...formData, miktar: Number(e.value) });
                }}
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
          <div className="col-md-1 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="hucre">Hucre</label>
              <InputText
                id="hucre"
                name="hucre"
                value={formData.hucreKodu}
                onChange={handleInputChange}
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
            dataKey="id"
            scrollable
            scrollHeight="450px"
            emptyMessage="Kayıt yok."
          >
            <Column field="id" header="#" />
            <Column field="stokKodu" header="Stok Kodu" />
            <Column field="stokAdi" header="Stok Adı" />
            <Column field="miktar" header="Miktar" />
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
                      setFormData(rowData);
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

