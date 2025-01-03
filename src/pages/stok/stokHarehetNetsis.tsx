import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useCallback, useEffect, useRef, useState } from "react";
import StokRehberDialog from "../../components/Rehber/StokRehberDialog";
import { INetsisStokHareket } from "../../utils/types/stok/INetsisStokHareket";
import api from "../../utils/api";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import DepoRehberDialog from "../../components/Rehber/DepoRehberDialog";
import NetsisSirketRehberDialog from "../../components/Rehber/NetsisSirketRehberDialog";
import { Toast } from "primereact/toast";

export default () => {
  const toast = useRef<Toast>(null);

  const [selectedStokKodu, setSelectedStokKodu] = useState("");
  const [selectedStokAdi, setSelectedStokAdi] = useState("");
  const [selectedStokId, setSelectedStokId] = useState(0);
  const [stokSerili, setStokSerili] = useState(false);

  const [selectedDepoKodu, setSelectedDepoKodu] = useState("");
  const [selectedDepoId, setSelectedDepoId] = useState(0);
  const [depoVisible, setDepoVisible] = useState(false);

  const [selectedNetsisSirketKodu, setSelectedNetsisSirketKodu] =
    useState("TEKNOMAK2025");
  const [selectedNetsisSirketId, setSelectedNetsisSirketId] = useState(1);
  const [netsisSirketVisible, setNetsisSirketVisible] = useState(false);

  const [seriVisible, setSeriVisible] = useState(false);
  const [seriStokVisible, setStokVisible] = useState(false);
  const [netsisStokHareket, setNetsisStokHareket] = useState<
    INetsisStokHareket[]
  >([]);
  const [netsisFilteredStokHareket, setFilteredNetsisStokHareket] = useState<
    INetsisStokHareket[]
  >([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [, setSelectedInckeyno] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<any[]>([]);

  const clearDepoSelection = () => {
    setSelectedDepoKodu(""); // Depo kodunu temizle
    setSelectedDepoId(0); // Depo ID'sini temizle
  };

  const clearNetsisSirketSelection = () => {
    setSelectedNetsisSirketKodu(""); // Depo kodunu temizle
    setSelectedNetsisSirketId(0); // Depo ID'sini temizle
  };

  const formatDate = (date: Date) => {
    const gun = date.getDate().toString().padStart(2, "0");
    const ay = (date.getMonth() + 1).toString().padStart(2, "0");
    const yil = date.getFullYear();
    return `${gun}.${ay}.${yil}`;
  };

  const NetsisStokHareketGetir = useCallback(async () => {
    if (!validateInputs()) {
      return; // Validasyon başarısızsa işlemi durdur
    }

    const stokResponse = await api.stok.getByKod(selectedStokKodu);
    if (
      stokResponse &&
      stokResponse.status &&
      stokResponse.data &&
      stokResponse.data.value
    ) {
      setSelectedStokAdi(stokResponse.data.value.adi);
      setSelectedStokId(stokResponse.data.value.id!);
      setStokSerili(stokResponse.data.value.seriTakibiVarMi);
      setGlobalFilter("");
      setLoading(true);
      const response = await api.netsisStokHareket.getAllNetsisStokHareket(
        selectedStokKodu,
        selectedDepoKodu,
        selectedNetsisSirketKodu
      );
      if (response.status && response.data.status && response.data.value) {
        let currentBalance = 0;
        const hesaplanmisVeri = response.data.value.items.map((item) => {
          currentBalance += item.girisMiktar - item.cikisMiktar;
          return {
            ...item,
            bakiye: currentBalance,
            formattedTarih: formatDate(new Date(item.tarih)),
          };
        });
        setNetsisStokHareket(hesaplanmisVeri);
        setFilteredNetsisStokHareket(hesaplanmisVeri);
      }else
      {
        // Stok bulunamazsa gridi temizle ve uyarı ver
      setNetsisStokHareket([]);
      setFilteredNetsisStokHareket([]);
      toast.current?.show({
        severity: "warn",
        summary: "Uyarı",
        detail: "Stok hareketleri bulunamadı.",
        life: 3000,
      });
      }
      setLoading(false);
    }
  }, [selectedStokKodu, selectedDepoKodu,selectedNetsisSirketKodu]);

  useEffect(() => {
    if (selectedStokKodu) {
      NetsisStokHareketGetir();
    }
  }, [selectedStokKodu, NetsisStokHareketGetir]);

  useEffect(() => {
    if (globalFilter) {
      const lowerCaseFilter = globalFilter.toLowerCase();
      const filteredData = netsisStokHareket.filter(
        (item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().includes(lowerCaseFilter)
          ) || item.formattedTarih.includes(lowerCaseFilter)
      );
      setFilteredNetsisStokHareket(filteredData);
    } else {
      setFilteredNetsisStokHareket(netsisStokHareket);
    }
  }, [globalFilter, netsisStokHareket]);

  const tarihBodyTemplate = (rowData: INetsisStokHareket) => {
    return rowData.formattedTarih;
  };

  const fiyatBodyTemplate = (rowData: INetsisStokHareket) => {
    return (
      <div style={{ textAlign: "right" }}>
        {rowData.fiyat.toLocaleString("tr-TR", {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })}
      </div>
    );
  };

  const createMiktarBodyTemplate = (fieldName: keyof INetsisStokHareket) => {
    return (rowData: INetsisStokHareket) => (
      <div style={{ textAlign: "right" }}>
        {rowData[fieldName]?.toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    );
  };

  const fetchDetailData = async (inckeyno: string) => {
    const response = await api.netsisStokHareketSeri.getAll(inckeyno);
    if (response.status && response.data.status && response.data.value) {
      setDetailData(response.data.value.items);
    }

    setSeriVisible(true);
  };

  const validateInputs = () => {
    // Validasyon adımları
    if (!selectedStokKodu || selectedStokKodu=="") {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Stok Kodu boş olamaz!",
        life: 3000,
      });
      return false;
    }

    if (!selectedNetsisSirketKodu || selectedNetsisSirketKodu=="") {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Netsis Şirket Kodu boş olamaz!",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={() => setGlobalFilter("")}
        />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Ara"
          />
        </IconField>
      </div>
    );
  };

  const header = renderHeader();

  // Calculate totals
  const toplamGirisMiktar = netsisStokHareket.reduce(
    (acc, item) => acc + item.girisMiktar,
    0
  );
  const toplamCikisMiktar = netsisStokHareket.reduce(
    (acc, item) => acc + item.cikisMiktar,
    0
  );
  const toplamBakiye = toplamGirisMiktar - toplamCikisMiktar;
  const toplamGirisTutar = netsisStokHareket.reduce(
    (acc, item) => acc + item.girisMiktar * item.fiyat,
    0
  );
  const toplamCikisTutar = netsisStokHareket.reduce(
    (acc, item) => acc + item.cikisMiktar * item.fiyat,
    0
  );
  //const toplamCikisMaliyetTutar = netsisFilteredStokHareket.reduce((acc, item) => acc + (item.cikisMiktar * item.maliyet), 0);
  // const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />; excel aktarma butonu ve sayfa yenileme butonu
  // const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  return (
    <div className="container-fluid">
      <Toast ref={toast} />
      <div className="p-fluid p-formgrid p-grid">
        <div className="row">
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="stokKodu">Stok Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  id="stokKodu"
                  name="stokKodu"
                  //readOnly={true}
                  value={selectedStokKodu}
                  onChange={(e) => setSelectedStokKodu(e.target.value)}
                />
                <Button label="..." onClick={() => setStokVisible(true)} />
                <StokRehberDialog
                  isVisible={seriStokVisible}
                  onHide={() => setStokVisible(false)}
                  onSelect={(selectedValue) => {
                    setSelectedStokId(selectedValue.id!);
                    setSelectedStokKodu(selectedValue.kodu);
                    setSelectedStokAdi(selectedValue.adi);
                    setStokSerili(selectedValue.seriTakibiVarMi);
                  }}
                />
              </div>
              <InputText
                id="selectedStokId"
                name="selectedStokId"
                value={selectedStokId?.toString()}
                type="hidden"
              />
            </FloatLabel>
          </div>
          <div className="col-md-4 col-sm-6 mt-4">
            <InputText
              id="selectedStokAdi"
              name="selectedStokAdi"
              value={selectedStokAdi}
              readOnly={true}
              disabled={true}
            />
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="depoKodu">Depo Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  id="depoKodu"
                  name="depoKodu"
                  readOnly={true}
                  value={selectedDepoKodu}
                  onChange={(e) => setSelectedDepoKodu(e.target.value)}
                />
                {selectedDepoKodu && (
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label=""
                    outlined
                    onClick={() => clearDepoSelection()}
                  />
                )}
                <Button label="..." onClick={() => setDepoVisible(true)} />
                <DepoRehberDialog
                  isVisible={depoVisible}
                  onHide={() => setDepoVisible(false)}
                  onSelect={(selectedValue) => {
                    setSelectedDepoId(selectedValue.id!);
                    setSelectedDepoKodu(selectedValue.kodu);
                    //setSelectedStokAdi(selectedValue.adi);
                    //setStokSerili(selectedValue.seriTakibiVarMi);
                  }}
                />
              </div>
              <InputText
                id="selectedDepoId"
                name="selectedDepoId"
                value={selectedDepoId?.toString()}
                type="hidden"
              />
            </FloatLabel>
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <FloatLabel>
              <label htmlFor="netsisSirketKodu">Netsis Şirket Kodu</label>
              <div className="p-inputgroup">
                <InputText
                  id="netsisSirketKodu"
                  name="netsisSirketKodu"
                  readOnly={true}
                  value={selectedNetsisSirketKodu}
                  onChange={(e) => setSelectedNetsisSirketKodu(e.target.value)}
                />
                {selectedNetsisSirketKodu && (
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label=""
                    outlined
                    onClick={() => clearNetsisSirketSelection()}
                  />
                )}
                <Button
                  label="..."
                  onClick={() => setNetsisSirketVisible(true)}
                />
                <NetsisSirketRehberDialog
                  isVisible={netsisSirketVisible}
                  onHide={() => setNetsisSirketVisible(false)}
                  onSelect={(selectedValue) => {
                    setSelectedNetsisSirketId(selectedValue.id!);
                    setSelectedNetsisSirketKodu(selectedValue.sirketAdi);
                    //setSelectedStokAdi(selectedValue.adi);
                    //setStokSerili(selectedValue.seriTakibiVarMi);
                  }}
                />
              </div>
              <InputText
                id="selectedNetsisSirketId"
                name="selectedNetsisSirketId"
                value={selectedNetsisSirketId?.toString()}
                type="hidden"
              />
            </FloatLabel>
          </div>
          <div className="col-md-2 col-sm-6 mt-4">
            <Button
              label="Listele"
              icon="pi pi-check"
              onClick={NetsisStokHareketGetir}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="p-col-12">
          <DataTable
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            //paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} excel aktarma butonu ve sayfa yenileme butonu
            totalRecords={netsisStokHareket.length}
            header={header}
            paginator
            size="small"
            stripedRows
            value={netsisFilteredStokHareket}
            rows={100} // Sayfa başına kaç kayıt gösterileceği
            loading={loading}
            dataKey="inckeyno"
            scrollable
            scrollHeight="570px"
            emptyMessage="Kayıt yok."
            rowsPerPageOptions={[10, 25, 50, 100]}
            //virtualScrollerOptions={{ itemSize: 1 }}
            rowClassName={() => ({ height: "40px", padding: "0", margin: "0" })}
            //tableLayout="fixed"
          >
            {/* <Column field="inckeyno" header="#" /> */}
            <Column
              field="tarih"
              header="Tarih"
              body={tarihBodyTemplate}
              //headerStyle={{ width: '150px', display: 'flex', justifyContent: 'flex-end' }}
            />
            <Column
              field="fisno"
              header="Fiş No"
              //headerStyle={{ width: '150px', display: 'flex', justifyContent: 'flex-end' }}
            />
            <Column
              field="tip"
              header="Tip"
              //headerStyle={{ width: '150px', display: 'flex', justifyContent: 'flex-end' }}
            />
            <Column
              field="fiyat"
              header="Fiyat"
              body={fiyatBodyTemplate}
              headerStyle={{ width: "150px" }}
              alignHeader="right"
            />
            <Column
              field="girisMiktar"
              header="Giriş Miktar"
              body={createMiktarBodyTemplate("girisMiktar")}
              headerStyle={{ width: "150px" }}
              alignHeader="right"
            />
            <Column
              field="cikisMiktar"
              header="Çıkış Miktar"
              body={createMiktarBodyTemplate("cikisMiktar")}
              headerStyle={{ width: "150px" }}
              alignHeader="right"
            />
            <Column
              field="bakiye"
              header="Bakiye"
              body={createMiktarBodyTemplate("bakiye")}
              headerStyle={{ width: "150px" }}
              alignHeader="right"
            />
            <Column
              field="maliyet"
              header="Maliyet"
              body={createMiktarBodyTemplate("maliyet")}
              headerStyle={{ width: "150px" }}
              alignHeader="right"
            />
            <Column
              field="depoKodu"
              header="Depo Kodu"
              headerStyle={{ width: "150px" }}
              alignHeader="right"
              style={{ textAlign: "right" }}
            />
            <Column
              field="projeKodu"
              header="Proje Kodu"
              headerStyle={{ width: "150px" }}
              alignHeader="right"
              style={{ textAlign: "right" }}
            />
            <Column
              field="plasiyerKodu"
              header="Plasiyer Kodu"
              headerStyle={{ width: "150px" }}
              alignHeader="right"
              style={{ textAlign: "right" }}
            />

            {stokSerili && (
              <Column
                body={(rowData) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => {
                        setSelectedInckeyno(rowData.inckeyno);
                        fetchDetailData(rowData.inckeyno);
                      }}
                    >
                      <i className="ti-eye"></i>
                    </button>
                  </div>
                )}
                header="İşlemler"
              />
            )}
          </DataTable>
        </div>
      </div>
      {/* Display totals */}
      <div className="row mt-3">
        <div className="col-md-3 col-sm-6">
          <strong>Toplam Giriş Miktar:</strong>{" "}
          {toplamGirisMiktar.toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="col-md-3 col-sm-6">
          <strong>Toplam Çıkış Miktar:</strong>{" "}
          {toplamCikisMiktar.toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="col-md-3 col-sm-6">
          <strong>Toplam Bakiye:</strong>{" "}
          {toplamBakiye.toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-3 col-sm-6">
          <strong>Giriş Tutar:</strong>{" "}
          {toplamGirisTutar.toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="col-md-3 col-sm-6">
          <strong>Çıkış Tutar:</strong>{" "}
          {toplamCikisTutar.toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        {/* <div className="col-md-3 col-sm-6">
          <strong>Çıkış Maliyet Tutar:</strong> {toplamCikisMaliyetTutar.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div> */}
      </div>
      <Dialog
        visible={seriVisible}
        style={{ width: "50vw" }}
        header="Detay Bilgileri"
        modal
        onHide={() => setSeriVisible(false)}
      >
        <DataTable value={detailData} loading={loading} paginator rows={10}>
          <Column field="seriNo1" header="Seri No" />
          <Column field="miktar" header="Miktar" />
        </DataTable>
      </Dialog>
    </div>
  );
};
