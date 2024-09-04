import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IKullanici } from "../../../utils/types/kullanici/IKullanici";

export const YemekWidget: React.FC = () => {
    const [yemekler, setYemekler] = useState<IKullanici[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchYemekler = async () => {
    try {
      setLoading(true);
      const response = await api.kullanici.getAll(0, 99);
      setYemekler(response.data.value.items);
    } catch (error) {
      console.error("Yemek verileri alınırken bir hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYemekler();
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
    <h3>Yemek Listesi</h3>
    <Button label="Yenile" icon="pi pi-refresh" onClick={fetchYemekler} />
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <DataTable value={yemekler} loading={loading} style={{ width: '100%' }} scrollable scrollHeight="flex" 
        showGridlines
        stripedRows 
        tableStyle={{ minWidth: '50rem' }} >
            <Column field="id" header="ID" sortable />
            <Column field="firstName" header="First Name" sortable />
            <Column field="lastName" header="Last Name" sortable />
            <Column field="email" header="Email" sortable />
        </DataTable>
    </div>
</div>
  );
};

// YemekWidget boyut bilgileri
export const YemekWidgetConfig = {
  w: 10,
  h: 4,
};
