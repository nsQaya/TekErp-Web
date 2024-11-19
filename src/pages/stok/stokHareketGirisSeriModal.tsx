import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IStokHareketSeri } from "../../utils/types/stok/IStokHareketSeri";
import { IStokSeriBakiye } from "../../utils/types/stok/IStokSeriBakiye";
import { FloatLabel } from "primereact/floatlabel";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";

interface StokHareketGirisSeriTakibiModalProps {
  visible: boolean;
  onHide: () => void;
  seciliSeriler?: IStokHareketSeri[];
  onSeriAdd: (seriler: IStokHareketSeri[]) => void;
  toplamMiktar: number;
  SeriGirisOtomatikMi: boolean;
  SeriMiktarKadarMi: boolean;
  fetchSeriFromAPI?: () => Promise<IStokSeriBakiye[]>; // Liste dönecek
}

const StokHareketGirisSeriModal: React.FC<
  StokHareketGirisSeriTakibiModalProps
> = ({
  visible,
  onHide,
  onSeriAdd,
  toplamMiktar,
  seciliSeriler = [],
  SeriGirisOtomatikMi,
  SeriMiktarKadarMi,
  fetchSeriFromAPI,
}) => {
  const [seriNo, setSeriNo] = useState<string>("");
  const [miktar, setMiktar] = useState<number>(SeriMiktarKadarMi ? 1 : 0);
  const [seriList, setSeriList] = useState<IStokHareketSeri[]>(seciliSeriler);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    if (SeriMiktarKadarMi) {
      setMiktar(1);
    } else {
      setMiktar(0);
    }
  }, [SeriMiktarKadarMi,visible]);

  useEffect(() => {
    if (seciliSeriler.length > 0) {
      setSeriList(seciliSeriler);
    }
  }, [seciliSeriler]);

  useEffect(() => {
    if (SeriGirisOtomatikMi && fetchSeriFromAPI) {
      fetchSeriFromAPI().then((fetchedSeriler) => {
        // API'den dönen seri listesini direkt olarak setSeriList ile ayarlıyoruz
        const yeniSeriler = fetchedSeriler.map((seri, index) => ({
          id: 0,
          seriNo1: seri.seriNo,
          miktar: seri.miktar,
          sira: index + 1,
          stokHareketId: 0,
        }));

        setSeriList(yeniSeriler); // Mevcut listeyi API'den gelen liste ile değiştiriyoruz
      });
    }
    else setSeriList([]);
  }, [SeriGirisOtomatikMi, toplamMiktar,visible]);

  const handleAddSeri = () => {
    if (!seriNo || miktar <= 0) return;

    if (editIndex !== null) {
      const updatedList = [...seriList];
      updatedList[editIndex] = {
        ...updatedList[editIndex],
        seriNo1: seriNo,
        miktar: miktar,
      };
      setSeriList(updatedList);
      setEditIndex(null);
    } else {
      const yeniSeri: IStokHareketSeri = {
        id: 0,
        seriNo1: seriNo,
        seriNo2: "",
        seriTarih1: new Date(),
        seriTarih2: new Date(),
        miktar: miktar,
        sira: seriList.length + 1,
        stokHareketId: 0,
      };
      setSeriList((prevList) => [...prevList, yeniSeri]);
    }

    setSeriNo(SeriGirisOtomatikMi ? seriNo : "");
    setMiktar(SeriMiktarKadarMi ? 1 : 0);
  };

  const handleEditSeri = (rowData: IStokHareketSeri, index: number) => {
    setSeriNo(rowData.seriNo1);
    setMiktar(rowData.miktar);
    setEditIndex(index);
  };

  const handleDeleteSeri = (index: number) => {
    setSeriList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    onSeriAdd(seriList);
    setSeriList([]);
    onHide();
  };

  const toplamSeriMiktar = seriList.reduce((acc, seri) => acc + seri.miktar, 0);

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Seri Takibi"
      style={{ minWidth: "800px" }}
    >
      {/* {JSON.stringify(miktar)} */}
      <div className="container-fluid">
        <div className="p-fluid p-formgrid p-grid">
          <div className="row">
            <div className="col-md-6 col-sm-6 mt-2">
              <div className="p-inputgroup flex">
                <FloatLabel>
                  <label htmlFor="seri">Seri No</label>
                  {SeriGirisOtomatikMi ? (
                    <InputText
                      type="text"
                      id="seri"
                      value={seriNo}
                      readOnly
                      className="p-inputtext p-component"
                    />
                  ) : (
                    <InputText
                      type="text"
                      id="seri"
                      value={seriNo}
                      onChange={(e) => setSeriNo(e.target.value)}
                      className="p-inputtext p-component"
                    />
                  )}
                </FloatLabel>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 mt-2">
              <div className="p-inputgroup flex">
                <FloatLabel>
                  <label htmlFor="miktar">Miktar</label>
                  <InputNumber
                    id="miktar"
                    min={SeriMiktarKadarMi ? 1 : 0}
                    max={SeriMiktarKadarMi ? 1 : toplamMiktar - toplamSeriMiktar}
                    value={miktar}
                    onChange={(e) => {
                      if (!SeriMiktarKadarMi && e.value !== null) {
                        setMiktar(Number(e.value));
                      }
                    }}
                    style={{ width: "100%" }}
                    disabled={SeriMiktarKadarMi}
                  />
                </FloatLabel>
              </div>
            </div>
          </div>
          <div className="p-d-flex p-jc-end mt-2">
            <Button
              label={editIndex !== null ? "Güncelle" : "Ekle"}
              onClick={handleAddSeri}
            />
          </div>
          <DataTable value={seriList} className="mt-1" size="small">
            <Column field="seriNo1" header="Seri No" />
            <Column field="miktar" header="Miktar" />
            {!SeriGirisOtomatikMi && (
              <Column
                body={(rowData, { rowIndex }) => (
                  <>
                    <Button
                     size="small"
                      icon="pi pi-pencil"
                      severity="info"   
                      onClick={() => handleEditSeri(rowData, rowIndex)}
                    ></Button>
                    <Button
                    size="small"
                      icon="pi pi-trash"
                      severity="danger"   
                      onClick={() => handleDeleteSeri(rowIndex)}
                    >
                    </Button>
                  </>
                )}
                header="İşlemler"
              />
            )}
          </DataTable>
          <div className="mt-2">
            <h5>Toplam Miktar: {toplamMiktar}</h5>
            <h5>Serilerden Seçilen Miktar: {toplamSeriMiktar}</h5>
            <h5>Kalan Miktar: {toplamMiktar - toplamSeriMiktar}</h5>
          </div>
          <div className="p-d-flex p-jc-end mt-2">
            <Button
              label="Tamam"
              icon="pi pi-check"
              onClick={handleComplete}
              disabled={toplamMiktar - toplamSeriMiktar == 0 ? false : true}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default StokHareketGirisSeriModal;
