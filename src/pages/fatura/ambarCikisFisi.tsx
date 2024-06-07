import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnProps } from 'primereact/column';
import GenericDialog from '../../components/GenericDialog';
import api from '../../utils/api';

// Form verileri için bir tip tanımı
type FormData = {
  numara: string;
  tarih: Date | null;
  projeKodu: string;
  uniteKodu: string;
  baglantiKodu: string;
  baglantiId: string;
  stokKodu: string;
  miktar: string;
  fiyat: string;
};

// Grid verileri için bir tip tanımı
type GridData = FormData & { id: number };

const App = () => {
  const [formData, setFormData] = useState<FormData>({
    numara: '',
    tarih: null,
    projeKodu: '',
    uniteKodu: '',
    baglantiKodu: '',
    baglantiId: '',
    stokKodu: '',
    miktar: '',
    fiyat: ''
  });
  const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string>('');

  const columns: ColumnProps[] = [
    {
      header: "Kodu",
      field: "kodu",
      // sortable: true,
      filter: true
    },
    {
      header: "Adı",
      field: "adi",
      // sortable: true,
      filter: true
    },
];

const handleDialogSelect = (selectedValue: string) => {
    setSelectedItem(selectedValue);
};

  

  const [gridData, setGridData] = useState<GridData[]>([]);
  const [baglantiList, setBaglantiList] = useState([
    { kod: 'BK001', adi: 'Baglanti 1' },
    { kod: 'BK002', adi: 'Baglanti 2' },
    { kod: 'BK003', adi: 'Baglanti 3' }
  ]);
  const [popupVisible, setPopupVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCalendarChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddToGrid = () => {
    setGridData([...gridData, { ...formData, id: gridData.length + 1 }]);
    // Formu temizleyelim
    setFormData({
      numara: '',
      tarih: null,
      projeKodu: '',
      uniteKodu: '',
      baglantiKodu: '',
      baglantiId: '',
      stokKodu: '',
      miktar: '',
      fiyat: ''
    });
  };

  const handleBaglantiSelect = (baglanti: { kod: string; adi: string }) => {
    setFormData({ ...formData, baglantiKodu: baglanti.kod, baglantiId: baglanti.kod });
    setPopupVisible(false);
  };

  return (
    <div className="p-fluid p-formgrid p-grid">
      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="numara">Numara</label>
        <InputText id="numara" name="numara" value={formData.numara} onChange={handleInputChange} />
      </div>
      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="tarih">Tarih</label>
        <Calendar id="tarih" name="tarih" value={formData.tarih} onChange={handleCalendarChange} showIcon />
      </div>
      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="projeKodu">Proje Kodu</label>
        <InputText id="projeKodu" name="projeKodu" value={formData.projeKodu} onChange={handleInputChange} />
      </div>
      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="uniteKodu">Ünite Kodu</label>
        <InputText id="uniteKodu" name="uniteKodu" value={formData.uniteKodu} onChange={handleInputChange} />
      </div>
      
      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="baglantiKodu">Bağlantı Kodu</label>
        <div className="p-inputgroup">
          <InputText id="baglantiKodu" name="baglantiKodu" value={formData.baglantiKodu} readOnly />
          {/* <Button label="Seç" icon="pi pi-search" onClick={() => setPopupVisible(true)} /> */}
          <Button label="Open Dialog" onClick={() => setDialogVisible(true)} />
            <GenericDialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                baseApi={api.ulke}
                columns={columns}
                returnField="kodu"
                onSelect={handleDialogSelect}
            />
            <div>
                Selected Item:<br/>
                bu: {selectedItem}
            </div>


        </div>
        <InputText id="baglantiId" name="baglantiId" value={formData.baglantiId} type="hidden" />
      </div>

      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="stokKodu">Stok Kodu</label>
        <InputText id="stokKodu" name="stokKodu" value={formData.stokKodu} onChange={handleInputChange} />
      </div>
      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="miktar">Miktar</label>
        <InputText id="miktar" name="miktar" value={formData.miktar} onChange={handleInputChange} />
      </div>
      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="fiyat">Fiyat</label>
        <InputText id="fiyat" name="fiyat" value={formData.fiyat} onChange={handleInputChange} />
      </div>
      <div className="p-col-12">
        <Button label="Ekle" icon="pi pi-plus" onClick={handleAddToGrid} />
      </div>

      <div className="p-col-12">
        <DataTable value={gridData} paginator rows={10} emptyMessage="Kayıt yok.">
          <Column field="numara" header="Numara" />
          <Column field="tarih" header="Tarih" />
          <Column field="projeKodu" header="Proje Kodu" />
          <Column field="uniteKodu" header="Ünite Kodu" />
          <Column field="baglantiKodu" header="Bağlantı Kodu" />
          <Column field="stokKodu" header="Stok Kodu" />
          <Column field="miktar" header="Miktar" />
          <Column field="fiyat" header="Fiyat" />
        </DataTable>
      </div>

      {/* <Dialog header="Bağlantı Seçimi" visible={popupVisible} style={{ width: '50vw' }} onHide={() => setPopupVisible(false)}>
        <DataTable value={baglantiList} selectionMode="single" onSelectionChange={(e) => handleBaglantiSelect(e.value)}>
          <Column field="kod" header="Bağlantı Kodu" />
          <Column field="adi" header="Bağlantı Adı" />
        </DataTable>
      </Dialog> */}
    </div>
  );
};

export default App;
