
import { useCallback, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { IStokSayimDetay } from "../../../utils/types/stok/IStokSayimDetay";
import api from "../../../utils/api";
import { InputText } from "primereact/inputtext";
import SayimRehberDialog from "../../../components/Rehber/SayimRehberiDialog";
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




const stokSayimDetay = () => {

  //Rehberlerin görünürlük durumu
  const [dialogVisible, setDialogVisible] = useState({
    stokSayim: false,
    no:false,
    stokKarti: false,
    hucre: false,
  });

  const [loadingGetir, setLoadingGetir] = useState(false);
  const navigate = useNavigate();

  const toast = useRef<Toast>(null);

  //Netsis üretim sonu kaydı Data işlemleri başlangıç
  const [stokSayimDetayData, setStokSayimDetayData] =
    useState<IStokSayimDetay>({
      id: 0,
      stokSayimId: 0,
      stokKartiId: 0,
      miktar: 0,
      seri: "",
      hucreId: 0,
      olcuBrId: 0,
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
      stokId: 0,
      miktar: 0,
      seri: "",
      olcuBirimiId: 0,
      aciklama: "",
      olcuBirimi: undefined,
      sayim: undefined,
      stok: undefined
    }));
  };


  //stokgetirme mevzusu
  const handleStokGetir = useCallback(async (stokKodu: string | undefined) => {
debugger;
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

      } else {
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

  const handleAciklamaGetir = useCallback(async (aciklama: string | undefined) => {

    if (aciklama) {
      const response = await api.sayim.getByKod(aciklama);


      if (response?.data?.status && response?.data?.value) {
        const sayimAciklama = response.data.value;

        //setSelectedOlcuBirim(options[0]); // İlk değeri seçili yapabilirsiniz

        setStokSayimDetayData((prevState) => ({
          ...prevState,
          aciklama: sayimAciklama.aciklama,
        }));
      } else {
        setStokSayimDetayData((prevState) => ({
          ...prevState,
          aciklama: "",
        
        }));

      }
    }
  }, [stokSayimDetayData]);
  
  const handleHucreGetir = useCallback(async (hucre: string | undefined) => {

    if (hucre) {
      const response = await api.sayimDetay.getByKod(hucre);


      if (response?.data?.status && response?.data?.value) {
        const sayimHucre = response.data.value;

        //setSelectedOlcuBirim(options[0]); // İlk değeri seçili yapabilirsiniz

        setStokSayimDetayData((prevState) => ({
          ...prevState,
          hucre: sayimHucre.hucre,


      }));
      }
    }
  }, []);


  const clearAciklamaSelection = () => {
    //setTempStokKodu("");
    setStokSayimDetayData((prevState) => ({
      ...prevState,
      aciklama: "",
    }));
  };


  const clearStokKartiSelection = () => {
    //setTempStokKodu("");
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

  const [gridData, setGridData] = useState<IStokSayimDetay[]>([]);




  const [miktarInvalid, setMiktarInvalid] = useState(false);
  const [olcuBirimOptions, setOlcuBirimOptions] = useState<IStokOlcuBirim[]>(
    []
  );

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

    //setSaveLoading(true);
    try {
      const saveData: IStokSayimDetay = {
        //SaveTalepTeklifDto
        id: stokSayimDetayData.id,
        stokKartiId: stokSayimDetayData.stokKartiId,
        stokSayimId: stokSayimDetayData.stokSayimId,
        stokSayim: stokSayimDetayData.stokSayim,
        miktar: stokSayimDetayData.miktar,
        hucreId: stokSayimDetayData.hucreId,
        aciklama: stokSayimDetayData.aciklama,
        olcuBrId: stokSayimDetayData.olcuBrId,
        seri: stokSayimDetayData.seri
      }
      // API'ye tek seferde gönderim
      const response = await api.sayimDetay.create(saveData);

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
      //setSaveLoading(false);
    }
  }, [stokSayimDetayData]);

  return (
    <div className="container-fluid">
      {JSON.stringify(stokSayimDetayData)}
      <Toast ref={toast} />
      <div className="p-fluid p-formgrid p-grid">
        {/* {JSON.stringify(seciliSeriler)} */}
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="isEmriNo"> Sayım</label>
              <div className="p-inputgroup">
                <InputText
                  invalid={stokSayimDetayData.stokSayim?.no ? false : true}
                  autoComplete="off"
                  id="sayim"
                  name="sayim"
                value={stokSayimDetayData.stokSayim?.no? stokSayimDetayData.stokSayim?.no : ""}
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
                {stokSayimDetayData.stokSayim && (
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label=""
                    outlined
                    onClick={() => clearAciklamaSelection()}
                  />
                )}
                <Button
                  icon="pi pi-search"
                  onClick={() =>
                    setDialogVisible({ ...dialogVisible, no: true })
                  }
                />
                <SayimRehberDialog
                  isVisible={dialogVisible.no}
                  onHide={() =>
                    setDialogVisible({ ...dialogVisible, no: false })
                  }
                  onSelect={(selectedValue) => {
                    setStokSayimDetayData((prevState) => ({
                      ...prevState,
                     stokSayimId: selectedValue.id!,
                     stokSayim: selectedValue
                    }));
                  }}
                />
              </div>
            </FloatLabel>
            <InputText
              id="stokSayimId"
              name="stokSayimId"
              value={stokSayimDetayData?.stokSayim?.id?.toString()}
              type="hidden"
              autoComplete="off"
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <InputText
              id="aciklama"
              name="aciklama"
              value={stokSayimDetayData?.stokSayim?.aciklama ? stokSayimDetayData.stokSayim.aciklama : ""
              }
              readOnly
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="stokKodu">Stok Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  //ref={stokKoduInputRef}
                  invalid={stokSayimDetayData.stokKarti?.kodu ? false : true}
                  autoComplete="off"
                  id="stokKodu"
                  name="stokKodu"
                 value={stokSayimDetayData.stokKarti?.kodu ? stokSayimDetayData.stokKarti?.kodu : ""}
                // onChange={(e) => setTempStokKodu(e.target.value)}
                // onKeyDown={(e) => {
                //   if (e.key === "Enter" || e.key === "Tab") {
                //     handleStokGetir(tempStokKodu);
                //   }
                // }}
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
                    //setTempStokKodu(selectedValue.kodu);
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
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="stokAdi">Stok Adı</label>
              <InputText
                id="adi"
                name="adi"
                value={stokSayimDetayData?.stokKarti?.adi ? stokSayimDetayData.stokKarti.adi : ""
                }
                readOnly
                autoComplete="off"
              />
            </FloatLabel>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <FloatLabel>
              <label htmlFor="hucre">Açıklama</label>
              <InputText
                id="aciklama"
                name="aciklama"
              />
            </FloatLabel>
          </div>
        </div>

        <div className="row">
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
                 value={stokSayimDetayData.hucre?.kodu ? stokSayimDetayData.hucre.kodu:""}
                // onChange={(e) => setTempStokKodu(e.target.value)}
                // onKeyDown={(e) => {
                //   if (e.key === "Enter" || e.key === "Tab") {
                //     handleStokGetir(tempStokKodu);
                //   }
                // }}
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
                    //setTempStokKodu(selectedValue.kodu);
                    handleHucreGetir(selectedValue.kodu);
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
              // value={stokSayimDetayData.hucre}
              // onChange={(e) => {
              //   setStokSayimDetayData((state) => ({
              //     ...state,
              //     hucreId: e.target.value, // Kullanıcının girdiği değer doğrudan alınıyor
              //   }));
              // }}
              />
            </FloatLabel>
          </div>
          <div className="col-lg-2 col-md-6 col-sm-12 mt-4">
            <Dropdown
              id="olcuBirimi"
              options={olcuBirimOptions} // Liste verileri burada kullanılır
              value={stokSayimDetayData.olcuBrId}
              onChange={(e) => {
                const selectedBirim = olcuBirimOptions.find(
                  (option) => option.id === e.value
                );

                if (selectedBirim) {
                  setStokSayimDetayData((prevData) => ({
                    ...prevData,
                    olcuBirim: selectedBirim!, // Seçilen olcuBirim nesnesini set et
                    olcuBrId: selectedBirim.id!, // Id'sini de güncelleyebilirsiniz
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
                value={stokSayimDetayData.miktar}
                min={0}
                invalid={miktarInvalid}
                minFractionDigits={0}
                maxFractionDigits={miktarDecimal}
                onChange={(e) =>
                  setStokSayimDetayData((state) => ({
                    ...state,
                    miktar: Number(e.value),
                  }))
                }
                inputStyle={{ textAlign: "right" }}
              />
            </FloatLabel>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 mt-4">
            <Button
              label="Ekle"
              icon="pi pi-plus"
              onClick={handleSave}

            />
          </div>

          <div className="col-lg-2 col-md-6 col-sm-12 mt-4">

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
            <Column field="stokKodu" header="Stok Kodu" />
            <Column field="stokAdı" header="Stok Adı" />
            <Column field="seri" header="Seri" />
            <Column field="miktar" header="Miktar" />
            <Column field="bakiye" header="Depo Bakiye" />
            <Column field="olcuBirim" header="Ölçü Birim" />
            <Column field="aciklama" header="Açıklama" />
            {/* <Column field="depoBakiye" header="Depo Bakiye" /> */}

          </DataTable>
        </div>
      </div>
    </div>



  );
};

export default stokSayimDetay;
