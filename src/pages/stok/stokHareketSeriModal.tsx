import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import Select from "react-select";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IStokHareketSeri } from "../../utils/types/stok/IStokHareketSeri";
import { IStokSeriBakiye } from "../../utils/types/stok/IStokSeriBakiye";

interface StokHareketSeriTakibiModalProps {
  visible: boolean;
  onHide: () => void;
  seriler: IStokSeriBakiye[];
  seciliSeriler?:IStokHareketSeri[];
  onSeriAdd: (seriler: IStokHareketSeri[]) => void;
  toplamMiktar: number;
}

const SeriTakibiModal: React.FC<StokHareketSeriTakibiModalProps> = ({
  visible,
  onHide,
  seriler,
  onSeriAdd,
  toplamMiktar,
  seciliSeriler=[],
}) => {
  const [selectedSeri, setSelectedSeri] = useState<IStokSeriBakiye | null>(null);
  const [miktar, setMiktar] = useState<number>(0);
  const [seriList, setSeriList] = useState<IStokHareketSeri[]>(seciliSeriler);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    if (seciliSeriler.length > 0) {
      setSeriList(seciliSeriler);
    }
  }, [seciliSeriler]);

  useEffect(() => {
    setMiktar(0);
  }, [selectedSeri]);

  const handleAddSeri = () => {
    if (!selectedSeri || miktar <= 0) return;

    if (editIndex !== null) {
      const updatedList = [...seriList];
      updatedList[editIndex] = {
        ...updatedList[editIndex],
        seriNo1: selectedSeri.seriNo,
        miktar: miktar,
      };
      setSeriList(updatedList);
      setEditIndex(null);
    } else {
      const yeniSeri: IStokHareketSeri = {
        id:0,
        seriNo1: selectedSeri.seriNo,
        seriNo2: "",
        seriTarih1: new Date(),
        seriTarih2: new Date(),
        miktar: miktar,
        sira: seriList.length + 1,
        stokHareketId:0
      };
      setSeriList((prevList) => [...prevList, yeniSeri]);
    }

    setSelectedSeri(null);
    setMiktar(0);
  };

  const handleEditSeri = (rowData: IStokHareketSeri, index: number) => {
    const selected = seriler.find((seri) => seri.seriNo === rowData.seriNo1);
    if (selected) {
      setSelectedSeri(selected);
      setMiktar(rowData.miktar);
      setEditIndex(index);
    }
  };

  const handleDeleteSeri = (index: number):void => {
    setSeriList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    onSeriAdd(seriList);
    setSeriList([]);
    onHide();
  };

  const seriOptions = seriler.map((seri) => ({
    label: seri.seriNo,
    value: seri,
  }));

  const toplamSeriMiktar = seriList.reduce((acc, seri) => acc + seri.miktar, 0);

  return (
    <Dialog visible={visible} onHide={onHide} header="Seri Takibi">
      <div className="p-fluid">
        <div className="row" style={{ minWidth: "500px" }}>
          <div className="p-inputgroup">
            <div className="field" style={{ flex: 1, marginRight: "1rem", minWidth: "350px" }}>
              <label htmlFor="seri">Seri No</label>
              <Select
                id="seri"
                value={selectedSeri ? { label: selectedSeri.seriNo, value: selectedSeri } : null}
                onChange={(option) => setSelectedSeri(option ? option.value : null)}
                options={seriOptions}
                isClearable
                isSearchable
                placeholder="Seri No Girin veya Seçin"
                getOptionLabel={(option) => option.value.seriNo}
                getOptionValue={(option) => option.value.seriNo}
                styles={{ container: (base) => ({ ...base, width: "100%" }) }}
              />
            </div>
            <div className="field" style={{ flex: 1,minWidth: "150px",maxWidth:"150px" }}>
              <label htmlFor="miktar">Miktar</label>
              <input
                type="number"
                id="miktar"
                min={0}
                max={selectedSeri?.miktar}
                value={miktar}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0 && value<=selectedSeri?.miktar! ) setMiktar(value);
                }}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
        <div className="p-d-flex p-jc-end mt-3">
          <Button label={editIndex !== null ? "Güncelle" : "Ekle"} onClick={handleAddSeri} />
        </div>
        <DataTable value={seriList} className="mt-4">
          <Column field="seriNo1" header="Seri No" />
          <Column field="miktar" header="Miktar" />
          <Column
            body={(rowData, { rowIndex }) => (
              <>
                <button
                  className="btn btn-info ms-1"
                  onClick={() => handleEditSeri(rowData, rowIndex)}
                >
                  <i className="ti-pencil"></i>
                  </button>
                <button
                  className="btn btn-danger ms-1"
                  onClick={() => handleDeleteSeri(rowIndex)}
                  >
                <i className="ti-trash"></i>
                </button>
                
              </>
            )}
            header="İşlemler"
          />
        </DataTable>
        <div className="mt-4">
          <h5>Toplam Miktar: {toplamMiktar}</h5>
          <h5>Serilerden Seçilen Miktar: {toplamSeriMiktar}</h5>
          <h5>Kalan Miktar: {toplamMiktar - toplamSeriMiktar}</h5>
        </div>
        <div className="p-d-flex p-jc-end mt-4">
          <Button label="Tamam" onClick={handleComplete} />
        </div>
      </div>
    </Dialog>
  );
};

export default SeriTakibiModal;
