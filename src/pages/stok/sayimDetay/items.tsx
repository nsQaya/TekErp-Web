
import { useCallback,  useEffect,  useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { IStokSayimDetay } from "../../../utils/types/stok/IStokSayimDetay";
import api from "../../../utils/api";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import StokRehberDialog from "../../../components/Rehber/StokRehberDialog";
import { InputNumber } from "primereact/inputnumber";
import { miktarDecimal } from "../../../utils/config";
import { Dropdown } from "primereact/dropdown";
import HucreRehberDialog from "../../../components/Rehber/HucreRehberDialog";
import { IStokOlcuBirim } from "../../../utils/types/tanimlamalar/IStokOlcuBirim";
import { FilterMeta, transformFilter } from "../../../utils/transformFilter";
import { IStokSayimYetki } from "../../../utils/types/stok/IStokSayimYetki";
import { ConfirmDialog } from "primereact/confirmdialog";
import { formatNumber } from "../../../utils/helpers/formatNumberForGrid";
import { selectAllTextInputNumber, selectAllTextInputText } from "../../../utils/helpers/selectAllText";
import { getUserIdFromToken } from "../../../store/userIdFromToken";
import StokSayimYetkiRehberiDialog from "../../../components/Rehber/StokSayimYetkiRehberiDialog";




const stokSayimDetay = () => {

  //Rehberlerin görünürlük durumu
  const [dialogVisible, setDialogVisible] = useState({
    stokSayim: false,
    no:false,
    stokKarti: false,
    hucre: false,
  });

  const [loading, setLoading] = useState(false);
  const miktarRef = useRef<InputNumber | null>(null);
  const stokKoduInputRef = useRef<any>(null);

  const [gridData, setGridData] = useState<IStokSayimDetay[]>([]);

  const [olcuBirimOptions, setOlcuBirimOptions] = useState<IStokOlcuBirim[]>(
    []
  );

  const [sayimYetki, setSayimYetki] = useState<IStokSayimYetki | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedGridItem, setSelectedGridItem] = useState<IStokSayimDetay | null>(null);

  const [itemDeleteVisible, setItemDeleteVisible] = useState(false);

  const toast = useRef<Toast>(null);

  const [tempStokKodu, setTempStokKodu] = useState("");

  //Netsis üretim sonu kaydı Data işlemleri başlangıç
  const [stokSayimDetayData, setStokSayimDetayData] =
    useState<IStokSayimDetay>({
      id: 0,
      stokSayimId: 0,
      stokKartiId: 0,
      miktar: 0,
      seri: "",
      hucreId: 0,
      olcuBirimId: 0,
      aciklama: "",
      hucre: undefined,
      olcuBirim: undefined,
      stokSayim: undefined,
      stokKarti: undefined
});

  const clearStokSayimData = () => {
    setStokSayimDetayData((prevData) => ({
      ...prevData,
      id: 0,
      stokKartiId: 0,
      stokKarti:undefined,
      miktar: 0,
      seri: "",
      olcuBirimId: 0,
      olcuBirim:undefined,
      aciklama: "",
    }));
    setTempStokKodu("");
  };

  const confirmItemDelete = useCallback(() => {
    if (selectedGridItem) {
      deleteItem(selectedGridItem);
      setItemDeleteVisible(false);
    }
  }, [selectedGridItem]);

  const deleteItem = useCallback(async (item: IStokSayimDetay) => {
    try {

      await api.sayimDetay.delete(item.id!);

      await fetchAndSetGridData(item.stokSayimId, setGridData!);

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


  //stokgetirme mevzusu
  const handleStokGetir = useCallback(async (stokKodu: string | undefined) => {
    if (stokKodu) {
      const response = await api.stok.getByKod(stokKodu);

      if (response?.data?.status && response?.data?.value) {
        const stokKarti = response.data.value;

        //setSelectedOlcuBirim(options[0]); // İlk değeri seçili yapabilirsiniz

        setStokSayimDetayData((prevState) => ({
          ...prevState,
          stokKarti: stokKarti,
          stokKartiId: stokKarti.id!,

        }));
        stokOlcuBirimDoldur(stokKarti);
        if (miktarRef.current) {
          miktarRef.current.focus();
        }

      } else {
          selectAllTextInputText(stokKoduInputRef);
        setStokSayimDetayData((prevState) => ({
          ...prevState,
          stokKarti: undefined,
          stokKartiId: 0,
        }));
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Stok Bulunamadı",
          life: 3000,
        });
      }
    }
  }, [stokSayimDetayData]);

  const clearStokKartiSelection = () => {
    setTempStokKodu("");
    setStokSayimDetayData((prevState) => ({
      ...prevState,
      stokKarti: undefined,
      stokKartiId: 0,
    }));
  };
  const clearHucreSelection = () => {
    //setTempStokKodu("");
    setStokSayimDetayData((prevState) => ({
      ...prevState,
      hucre: undefined,
      hucreId: 0,
    }));
  };



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


  //apiye kaydetme isteği gönderimi
  const handleSave = useCallback(async () => {
    if(!validateAddToGrid())
      return;

    try {
      const saveData: IStokSayimDetay = {
        //SaveTalepTeklifDto
        id: stokSayimDetayData.id,
        stokKartiId: stokSayimDetayData.stokKartiId,
        stokSayimId: stokSayimDetayData.stokSayimId,
        miktar: stokSayimDetayData.miktar,
        hucreId: stokSayimDetayData.hucreId,
        aciklama: stokSayimDetayData.aciklama,
        olcuBirimId: stokSayimDetayData.olcuBirimId,
        seri: stokSayimDetayData.seri
      }

      let response;

      if (isEditing && selectedGridItem && selectedGridItem.id && selectedGridItem.id>0) {
        response = await api.sayimDetay.update(saveData);
      }
      else  
      {
        response = await api.sayimDetay.create(saveData);
      }

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

      await fetchAndSetGridData(stokSayimDetayData.stokSayimId, setGridData!);

      // Başarılı durum mesajı
      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: isEditing ? "Güncelleme işlemi başarılı." : "Kayıt işlemi başarılı.",
        life: 3000,
      });

      clearStokSayimData();

    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: error.message || "Veriler kaydedilemedi",
        life: 3000,
      });
      console.error("Error saving data:", error);
    } finally {
      //setSaveLoading(false);
    }
  }, [stokSayimDetayData]);


  const fetchAndSetGridData = async (
    stokSayimId: number,
    setGridData: (data: IStokSayimDetay[]) => void
  ) => {
    try {
      debugger;

      // if(sayimYetki?.gorme!=1)
      //   setSayimYetki(null);

      setLoading(true);

      const sortColumn = "Id";
      const sortDirection = -1;

      const filters: FilterMeta = {
        StokSayimId: { value: stokSayimId, matchMode: "equals" },
      };

      const dynamicQuery = transformFilter(filters, sortColumn, sortDirection);

      const sayimGridDataResponse = await api.sayimDetay.getAllForGrid(
        0,
        9999,
        dynamicQuery
      );

      if (sayimGridDataResponse?.data?.value?.items) {
        const sayimGridData = sayimGridDataResponse.data.value.items;

        if (sayimGridData) {
          setGridData(
            sayimGridData.map((item: IStokSayimDetay) => ({
              ...item,
            }))
          );
        }
      }
      else {
        setGridData([]);
      }
    } catch (error) {
      console.error("Error fetching grid data:", error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

   const getSayimYetki = async (stokSayimId: number) => {
    try {
      const sortColumn = "Id";
      const sortDirection = 1;
  
      const userId = getUserIdFromToken();
  
      const filters: FilterMeta = {
        SayimId: { value: stokSayimId, matchMode: "equals" },
        UserId: { value: userId, matchMode: "equals" },
      };
  
      const dynamicQuery = transformFilter(filters, sortColumn, sortDirection);
  
      const sayimYetkiResponse = await api.sayimYetki.getAllForGrid(
        0,
        9999,
        dynamicQuery
      );
  
      if (
        sayimYetkiResponse?.data?.value &&
        sayimYetkiResponse?.data?.value?.items
      ) {
        const sayimYetkiData = sayimYetkiResponse.data.value.items[0];
        return sayimYetkiData; 
      }
  
      return null;
    } catch (error) {
      console.error("Error fetching sayim yetki:", error);
      throw error;
    }
  };

  const fetchSayimYetki = async () => {
    const result = await getSayimYetki(stokSayimDetayData.id!);
    setSayimYetki(result);
  };

  useEffect(() => {
    if (!stokSayimDetayData.stokSayimId) return;

    // const fechSayimYetki= async () => {
    //   await fetchAndSetSayimYetki(stokSayimDetayData.stokSayimId);
    // };

    // fechSayimYetki();

    fetchSayimYetki();
  
    const fetchData = async () => {
      try {
        debugger;
        await fetchAndSetGridData(stokSayimDetayData.stokSayimId, setGridData);
      } catch (error) {
        setGridData([]);
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Veriler getirilemedi",
          life: 3000,
        });
      }
    };
  
    fetchData();
  }, [stokSayimDetayData.stokSayimId]);

  const validateAddToGrid = () => {

    if (!stokSayimDetayData.stokSayim && stokSayimDetayData.stokKartiId>0) {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Sayım seçimi yapmadınız...",
          life: 3000,
        });
        return false;
      }
    

    if (
      !stokSayimDetayData?.stokKarti ||
      stokSayimDetayData?.stokKartiId <= 0
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Stok seçimi yapmadınız...",
        life: 3000,
      });
      return false;
    }

    if (
      !stokSayimDetayData?.hucre ||
      stokSayimDetayData?.hucreId <= 0
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Hücre seçimi yapmadınız...",
        life: 3000,
      });
      return false;
    }

    if (
      !stokSayimDetayData?.olcuBirim ||
      stokSayimDetayData?.olcuBirimId <= 0
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Ölçü birimi seçimi yapmadınız...",
        life: 3000,
      });
      return false;
    }

    if (!stokSayimDetayData?.miktar || stokSayimDetayData.miktar <= 0 ) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Miktar sıfırdan büyük olmalı...",
        life: 3000,
      });
      return false;
    }
    return true;
  };


  //gridden düzeltme işlemleri
  const handleEditGridItem = useCallback(async (item: IStokSayimDetay) => {
    debugger;
    setSelectedGridItem(item);
    setIsEditing(true);
    // Seçilen grid item'ını formda göstermek için ilgili state'leri güncelle
    setStokSayimDetayData({
      ...item
    });
    stokOlcuBirimDoldur(item.stokKarti);
  }, []);

  return (
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
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="isEmriNo"> Sayım</label>
              <div className="p-inputgroup">
                <InputText
                  invalid={stokSayimDetayData.stokSayim?.no ? false : true}
                  autoComplete="off"
                  id="sayim"
                  name="sayim"
                  value={
                    stokSayimDetayData.stokSayim?.no
                      ? stokSayimDetayData.stokSayim?.no
                      : ""
                  }
                  //readOnly
                  // onChange={(e) => {
                  //   setTempSayim(e.target.value);
                  //   //handleIsEmriNoGetir();
                  // }}
                />
                {/* {tempIsEmriNo && (
                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  label=""
                  outlined
                  onClick={() => setTempSayim("")}
                />
                )} */}
                <Button
                  icon="pi pi-search"
                  onClick={() =>
                    setDialogVisible({ ...dialogVisible, no: true })
                  }
                />
                <StokSayimYetkiRehberiDialog
                  isVisible={dialogVisible.no}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, no: false })
                  }
                  onSelect={(selectedValue) => {
                    setStokSayimDetayData((prevState) => ({
                      ...prevState,
                      stokSayimId: selectedValue.sayim.id!,
                      stokSayim: selectedValue.sayim,
                    }));
                  }}
                />
              </div>
            </FloatLabel>
          </div>
          <div className="col-lg-9 col-md-6 col-sm-12 mt-4">
            <InputText
              id="aciklama"
              name="aciklama"
              value={
                stokSayimDetayData?.stokSayim?.aciklama
                  ? stokSayimDetayData.stokSayim.aciklama
                  : ""
              }
              readOnly
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="stokKodu">Stok Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  ref={stokKoduInputRef}
                  invalid={stokSayimDetayData.stokKarti?.kodu ? false : true}
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
                {stokSayimDetayData.stokKarti?.kodu && (
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
                    setDialogVisible({ ...dialogVisible, stokKarti: true })
                  }
                />
                <StokRehberDialog
                  isVisible={dialogVisible.stokKarti}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, stokKarti: false })
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
              value={stokSayimDetayData?.stokKarti?.id?.toString()}
              type="hidden"
              autoComplete="off"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="stokAdi">Stok Adı</label>
              <InputText
                id="adi"
                name="adi"
                value={
                  stokSayimDetayData?.stokKarti?.adi
                    ? stokSayimDetayData.stokKarti.adi
                    : ""
                }
                readOnly
                autoComplete="off"
              />
            </FloatLabel>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="hucre">Açıklama</label>
              <InputText id="aciklama" name="aciklama" />
            </FloatLabel>
          </div>

          <div className="col-lg-3 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="stokKodu">Hücre</label>
              <div className="p-inputgroup">
                <InputText
                  //ref={stokKoduInputRef}
                  invalid={stokSayimDetayData.hucre?.kodu ? false : true}
                  autoComplete="off"
                  id="hucre"
                  name="hucre"
                  value={
                    stokSayimDetayData.hucre?.kodu
                      ? stokSayimDetayData.hucre.kodu
                      : ""
                  }
                />
                {stokSayimDetayData.hucre?.kodu && (
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label=""
                    outlined
                    onClick={() => clearHucreSelection()}
                  />
                )}
                <Button
                  icon="pi pi-search"
                  //label="..."
                  onClick={() =>
                    setDialogVisible({ ...dialogVisible, hucre: true })
                  }
                />
                <HucreRehberDialog
                  isVisible={dialogVisible.hucre}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, hucre: false })
                  }
                  onSelect={(selectedValue) => {
                    setStokSayimDetayData((prevState) => ({
                      ...prevState,
                      hucre: selectedValue,
                      hucreId: selectedValue.id!,
                    }));
                  }}
                />
              </div>
            </FloatLabel>
          </div>
          <div className="col-lg-2 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="hucre">Seri</label>
              <InputText
                id="seri"
                name="seri"
                value={stokSayimDetayData.seri}
                onChange={(e) => {
                  setStokSayimDetayData((state) => ({
                    ...state,
                    seri: e.target.value, // Kullanıcının girdiği değer doğrudan alınıyor
                  }));
                }}
              />
            </FloatLabel>
          </div>
          <div className="col-lg-2 col-md-6 col-sm-12 mt-4">
            <Dropdown
              id="olcuBirimi"
              options={olcuBirimOptions} // Liste verileri burada kullanılır
              value={stokSayimDetayData.olcuBirimId}
              onChange={(e) => {
                const selectedBirim = olcuBirimOptions.find(
                  (option) => option.id === e.value
                );

                if (selectedBirim) {
                  setStokSayimDetayData((prevData) => ({
                    ...prevData,
                    olcuBirim: selectedBirim!, // Seçilen olcuBirim nesnesini set et
                    olcuBirimId: selectedBirim.id!, // Id'sini de güncelleyebilirsiniz
                  }));
                }
              }}
              style={{ width: "100%" }}
              placeholder="Ölçü Birimi"
              className="dropdown-custom"
              optionLabel="adi" // Dropdown'da gösterilecek alan
              optionValue="id" // Seçilen değerin ID'sini döndürmek için
            />
          </div>
          <div className="col-lg-2 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="miktar">Miktar</label>
              <InputNumber
                id="miktar"
                name="miktar"
                value={stokSayimDetayData.miktar ?? 0}
                min={0}
                locale="tr-TR"
                invalid={!stokSayimDetayData.miktar ||  isNaN(Number(stokSayimDetayData.miktar))} // Adjust based on validation
                minFractionDigits={1}
                maxFractionDigits={miktarDecimal}
                onChange={(e) =>
                  setStokSayimDetayData((state) => ({
                    ...state,
                    miktar: Number(e.value),
                  }))
                }
                
                onFocus={() => selectAllTextInputNumber(miktarRef)}
                ref={miktarRef}
                inputStyle={{ textAlign: "right" }}
              />
            </FloatLabel>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 mt-4">
            <Button
              label={isEditing ? "Güncelle" : "Ekle"} // Change label dynamically
              icon={isEditing ? "pi pi-refresh" : "pi pi-plus"} // Change icon dynamically
              onClick={handleSave}
              //disabled={belgeReadOnly}
            />
          </div>
        </div>

        <div className="p-col-12">
          <DataTable
            size="small"
            stripedRows
            value={gridData}
            rows={100}
            loading={loading}
            dataKey="id"
            scrollable
            //scrollHeight="480px"
            emptyMessage="Kayıt yok."
            //virtualScrollerOptions={{ itemSize: 46 }}
          >
            <Column field="id" header="#" sortable />
            <Column field="stokKarti.kodu" header="Stok Kodu" filter  />
            <Column field="stokKarti.adi" header="Stok Adı" filter />
            <Column field="seri" header="Seri" filter />
            <Column field="hucre.kodu" header="Hücre" filter />
            <Column
              field="miktar"
              header="Miktar"
              body={(row: IStokSayimDetay) => {
                return (
                  <div style={{ textAlign: "right" }}>
                    {formatNumber(row.miktar, miktarDecimal)}
                  </div>
                );
              }}
            />
            <Column field="olcuBirim.simge" header="Ölçü Birim" filter/>
            <Column field="aciklama" header="Açıklama" filter/>
            <Column
              body={(rowData) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {
                  sayimYetki?.degistirme == 1 && (
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => {
                        setTempStokKodu(rowData.stokKarti.kodu);
                        handleStokGetir(rowData.stokKarti.kodu);
                        handleEditGridItem(rowData);
                      }}
                    >
                      <i className="ti-pencil"></i>
                    </button>
                  )}
                  {sayimYetki?.silme == 1 && (
                    <button
                      className="btn btn-danger ms-1"
                      onClick={() => {
                        setSelectedGridItem(rowData);
                        setItemDeleteVisible(true);
                      }}
                    >
                      <i className="ti-trash"></i>
                    </button>
                  )}
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

export default stokSayimDetay;
