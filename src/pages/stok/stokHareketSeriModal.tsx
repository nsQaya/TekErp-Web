import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import Select from "react-select";
import { InputNumber } from "primereact/inputnumber";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IStokHareketSeri } from "../../utils/types/stok/IStokHareketSeri";
import { IStokSeriBakiye } from "../../utils/types/stok/IStokSeriBakiye";

interface StokHareketSeriTakibiModalProps {
  visible: boolean;
  onHide: () => void;
  seriler: IStokSeriBakiye[];
  onSeriAdd: (seriler: IStokHareketSeri[]) => void;
}

const SeriTakibiModal: React.FC<StokHareketSeriTakibiModalProps> = ({
  visible,
  onHide,
  seriler,
  onSeriAdd,
}) => {
  const [selectedSeri, setSelectedSeri] = useState<IStokSeriBakiye | null>(null);
  const [miktar, setMiktar] = useState<number>(0);
  const [seriList, setSeriList] = useState<IStokHareketSeri[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedSeri) {
      setMiktar(selectedSeri.miktar);
    } else {
      setMiktar(0);
    }
  }, [selectedSeri]);

  const handleAddSeri = () => {
    if (!selectedSeri) return;

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
        seriNo1: selectedSeri.seriNo,
        seriNo2: "",
        seriTarih1: new Date(),
        seriTarih2: new Date(),
        miktar: miktar,
        sira: seriList.length + 1,
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

  const handleDeleteSeri = (index: number) => {
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

  return (
    <Dialog visible={visible} onHide={onHide} header="Seri Takibi">
      <div className="p-fluid">
        <div className="p-inputgroup">
          <div className="field" style={{ flex: 1, marginRight: '1rem' }}>
            <label htmlFor="seri">Seri No</label>
           {JSON.stringify(seriler)}
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
              styles={{ container: (base) => ({ ...base, width: '100%' }) }}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="miktar">Miktar</label>
            <InputNumber
              id="miktar"
              min={0}
              max={selectedSeri?.miktar}
              value={miktar}
              onChange={(e) => setMiktar(e.value ? e.value : 0)}
              style={{ width: '100%' }}
            />
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
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-success mr-2"
                  onClick={() => handleEditSeri(rowData, rowIndex)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger"
                  onClick={() => handleDeleteSeri(rowIndex)}
                />
              </>
            )}
            header="İşlemler"
          />
        </DataTable>
        <div className="p-d-flex p-jc-end mt-4">
          <Button label="Tamam" onClick={handleComplete} />
        </div>
      </div>
    </Dialog>
  );
};

export default SeriTakibiModal;
