import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useCallback, useEffect, useState } from "react";
import StokRehberDialog from "../../components/Rehber/StokRehberDialog";
import { INetsisStokHareket } from "../../utils/types/stok/INetsisStokHareket";
import api from "../../utils/api";
import { Dialog } from "primereact/dialog";

export default () => {
  const [selectedStokKodu, setSelectedStokKodu] = useState("");
  const [selectedStokAdi, setSelectedStokAdi] = useState("");
  const [selectedStokId, setSelectedStokId] = useState(0);
  const [stokSerili, setStokSerili] = useState(false);

  const [seriSeriVisivle, setSeriVisible] = useState(false);
  const [seriStokVisivle, setStokVisible] = useState(false);
  const [netsisStokHareket, setNetsisStokHareket] = useState<
    INetsisStokHareket[]
  >([]);
  const [netsisFilteredStokHareket, setFilteredNetsisStokHareket] = useState<
    INetsisStokHareket[]
  >([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [ ,setSelectedInckeyno] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<any[]>([]);

  const formatDate = (date: Date) => {
    const gun = date.getDate().toString().padStart(2, "0");
    const ay = (date.getMonth() + 1).toString().padStart(2, "0");
    const yil = date.getFullYear();
    return `${gun}.${ay}.${yil}`;
  };

  const NetsisStokHareketGetir = useCallback(async () => {
    if (selectedStokKodu && selectedStokKodu != "") {
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
        setGlobalFilter('');
        setLoading(true);
        const response = await api.netsisStokHareket.getAll(selectedStokKodu);
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
        }
        setLoading(false);
      }
    }
  }, [selectedStokKodu]);

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

  const createMiktarBodyTemplate = (fieldName: keyof INetsisStokHareket)=> {
return( rowData:INetsisStokHareket) => (
    <div style={{textAlign:"right"}}>
        {rowData[fieldName]?.toLocaleString("tr-TR",{
            minimumFractionDigits:2,
            maximumFractionDigits:2,
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

  const renderHeader = () => {
    return (
        <div className="flex justify-content-end">
        <span className="p-input-icon-left p-input-icon-right">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Ara"
          />
          {globalFilter && (
            <i
              className="pi pi-times"
              style={{ cursor: 'pointer' }}
              onClick={() => setGlobalFilter('')}
            />
          )}
        </span>
      </div>
    );
  };

  const header = renderHeader();

  // Calculate totals
  const toplamGirisMiktar = netsisFilteredStokHareket.reduce((acc, item) => acc + item.girisMiktar, 0);
  const toplamCikisMiktar = netsisFilteredStokHareket.reduce((acc, item) => acc + item.cikisMiktar, 0);
  const toplamBakiye = toplamGirisMiktar - toplamCikisMiktar;
  const toplamGirisTutar = netsisFilteredStokHareket.reduce((acc, item) => acc + (item.girisMiktar * item.fiyat), 0);
  const toplamCikisTutar = netsisFilteredStokHareket.reduce((acc, item) => acc + (item.cikisMiktar * item.fiyat), 0);
  //const toplamCikisMaliyetTutar = netsisFilteredStokHareket.reduce((acc, item) => acc + (item.cikisMiktar * item.maliyet), 0);


  return (
    <div className="container-fluid">
      <div className="p-fluid p-formgrid p-grid">
        <div className="row">
          <div className="col-md-3 col-sm-6 mt-4">
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
                  isVisible={seriStokVisivle}
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
          <div className="col-md-7 col-sm-6 mt-4">
            <InputText
              id="selectedStokAdi"
              name="selectedStokAdi"
              value={selectedStokAdi}
              readOnly={true}
              disabled={true}
            />
          </div>

          <div className="col-md-2 col-sm-6 mt-4">
            <Button
              label="Listele"
              icon="pi pi-plus"
              onClick={NetsisStokHareketGetir}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="p-col-12">

          <DataTable
            header={header}
            paginator
            size="small"
            stripedRows
            value={netsisFilteredStokHareket}
            rows={10} // Sayfa başına kaç kayıt gösterileceği
            loading={loading}
            dataKey="inckeyno"
            scrollable
            scrollHeight="550px"
            emptyMessage="Kayıt yok."
            rowsPerPageOptions={[10, 25, 50, 100]}
            virtualScrollerOptions={{ itemSize: 46 }}
            rowClassName={() => ({ height: '20px', padding: '0',margin: '0' })} // Adjust as needed
          >
            {/* <Column field="inckeyno" header="#" /> */}
            <Column field="tarih" header="Tarih" body={tarihBodyTemplate} />
            <Column field="fisno" header="Fiş No" />
            <Column field="tip" header="Tip" />
            <Column field="fiyat" header="Fiyat" body={fiyatBodyTemplate} />
            <Column
              field="girisMiktar"
              header="Giriş Miktar"
              body={createMiktarBodyTemplate('girisMiktar')}
            />
            <Column
              field="cikisMiktar"
              header="Çıkış Miktar"
              body={createMiktarBodyTemplate('cikisMiktar')}
            />
            <Column field="bakiye" header="Bakiye" body={createMiktarBodyTemplate('bakiye')} />
            <Column field="maliyet" header="Maliyet" body={createMiktarBodyTemplate('maliyet')} 
            />
            <Column field="depoKodu" header="Depo Kodu" />
            <Column field="projeKodu" header="Proje Kodu" />
            <Column field="plasiyerKodu" header="Plasiyer Kodu" />

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
          <strong>Toplam Giriş Miktar:</strong> {toplamGirisMiktar.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="col-md-3 col-sm-6">
          <strong>Toplam Çıkış Miktar:</strong> {toplamCikisMiktar.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="col-md-3 col-sm-6">
          <strong>Toplam Bakiye:</strong> {toplamBakiye.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        </div>
        <div className="row mt-3">
        <div className="col-md-3 col-sm-6">
          <strong>Giriş Tutar:</strong> {toplamGirisTutar.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="col-md-3 col-sm-6">
          <strong>Çıkış Tutar:</strong> {toplamCikisTutar.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        {/* <div className="col-md-3 col-sm-6">
          <strong>Çıkış Maliyet Tutar:</strong> {toplamCikisMaliyetTutar.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div> */}
      </div>
      <Dialog
        visible={seriSeriVisivle}
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
