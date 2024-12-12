import { createRef, useCallback, useState, useRef, useEffect } from "react";
import { ColumnProps } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppTable, { ITableRef } from "../../components/AppTable";
import api from "../../utils/api";
import DynamicModal, { FormItemTypes, IFormItem } from "../../modals/DynamicModal";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import { ISiparisAcmaKapama } from "../../utils/types/fatura/ISiparisAcmaKapama";
import { dateFilterTemplate } from "../../utils/helpers/CalendarHelper";
import { onayliMiDDFilterTemplate } from "../../utils/helpers/dtMultiSelectHelper";

export default () => {
  const myTable = createRef<ITableRef<ISiparisAcmaKapama>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ISiparisAcmaKapama | undefined>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ISiparisAcmaKapama | null>(null)

  
  const onSuccess = () => {
 
  
    if (selectedItem) {
      toast.current?.show({ severity: "success", summary: "Başarılı", detail: "Başarıyla güncellendi !" });
    } else {
      toast.current?.show({ severity: "success", summary: "Başarılı", detail: "Başarıyla eklendi !" });
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };
  

  const confirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        await api.siparisSave.delete(itemToDelete.siparis.id as number);
        myTable.current?.refresh();
        toast.current?.show({ severity: "success", summary: "Başarılı", detail: "Başarıyla silindi !" });
      } catch (error) {
        console.error("Silme işleminde hata:", error);
        toast.current?.show({ severity: "error", summary: "Hata", detail: "Silme işleminde hata oluştu !" });
      } finally {
        setItemToDelete(null);
        setConfirmVisible(false);
      }
    }
  }, [itemToDelete]);

  
  const deleteItem = (item: ISiparisAcmaKapama) => {
    setItemToDelete(item);
    setConfirmVisible(true);
  };

  useEffect(() => {
    if (!confirmVisible && !itemToDelete) {
      myTable.current?.refresh();
    }
  }, [confirmVisible, itemToDelete]);

  

  

  const columns: ColumnProps[] = [
    
    {
      header: "Sipariş Numarası",
      field: "belge.no",
      sortable: true,
      filter: true
    },
   
    { header: "Durum", 
      field: "durum", 
      sortable: true,
      dataType:"numeric", 
      filter: true , filterElement:onayliMiDDFilterTemplate,
      body: (rowData : ISiparisAcmaKapama) => (rowData.durum === 1 ? "Evet" : "Hayır")
     },
    {
      header: "Miktar", 
      field: "miktar", 
      sortable: true,
      filter: true,
    },
    {
      header: "Kalan Miktar", 
      field: "kalanMiktar", 
      sortable: true,
      filter: true,
     
    },
    {
      header: "Stok Kodu",
      field: "stokKarti.kodu",
      sortable: true,
      filter: true,
    },
    {
      header: "Stok Adı",
      field: "stokKarti.adi",
      sortable: true,
      filter: true
    },
    { header: "Teslim Tarihi", field: "istenilenTeslimTarihi", dataType: "date", sortable: true, filter: true, filterElement:dateFilterTemplate,
      body: (row: ISiparisAcmaKapama) =>
        row.istenilenTeslimTarihi
          ? new Date(row.istenilenTeslimTarihi).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
    },
    {
      header: "Cari İsim",
      field: "siparis.cari.adi",
      sortable: true,
      filter: true
    },
    {
      header: "İşlemler",
      body: (row) => {
        return (
          <>
            <button className="btn btn-info ms-1" onClick={(e) => {
              e.preventDefault();
              setSelectedItem(row);
              setModalShowing(true);
            }}>
              <i className="ti-pencil"></i>
            </button>
            <button className="btn btn-danger ms-1" onClick={(e) => {
              e.preventDefault();
              deleteItem(row);
            }}>
              <i className="ti-trash"></i>
            </button>
          </>
        );
      }
    },
  ];

  const modalItems = [
    {
      name: "id",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "stokKartiId",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "talepTeklifStokHareketId",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "sira",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "belgeId",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "olcuBirimId",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "miktar",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "fiyatOlcuBirimId",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "girisCikis",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "fiyatDovizTipiId",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "fiyatDoviz",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "fiyatTL",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "fiyatNet",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "iskontoTL",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "teslimTarihi",
      type: FormItemTypes.date,
      hidden: true
    },
    {
      name: "tutar",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "projeId",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "uniteId",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      title: "Revize Teslim Tarihi",
      name: "istenilenTeslimTarihi",
      type: FormItemTypes.date,
    },
    {
      title: "Sipariş Durumu", // Başlık
      name: "durum", // Alan adı
      type: FormItemTypes.boolean, // Select tipi
    },
    //{
     // title: "Sipariş Durumu", // Başlık
     // name: "miktar", // Alan adı
      //type: FormItemTypes.input, // Select tipi
     // readonly:true
    //},
    
    
  ] as IFormItem[]

  const validateItems = (formItems: IFormItem[] | undefined) => {
    if (!formItems) {
      return "Form verileri yüklenemedi."; 
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bugünün sıfır saatine odaklan.
  
    const istenilenTeslimTarihi = formItems.find(item => item.name === "istenilenTeslimTarihi")?.value;
  
    // İstenilen Teslim Tarihi Kontrolü
    if (!istenilenTeslimTarihi) {
      return "İstenilen teslim tarihini girin.";
    }
  
    const istenilenTeslimTarihiDate = new Date(istenilenTeslimTarihi);
    if (isNaN(istenilenTeslimTarihiDate.getTime())) {
      return "Geçersiz tarih formatı.";
    }
  
    if (istenilenTeslimTarihiDate < today) {
      return "Geçmiş tarihler kaydedilemez.";
    }
  
    return null;
  };
  

  return (
    <div className="container-fluid">
      <Toast ref={toast} />
      <ConfirmDialog
        visible={confirmVisible}
        onHide={() => setConfirmVisible(false)}
        message="Silmek istediğinizden emin misiniz?"
        header="Onay"
        icon="pi pi-exclamation-triangle"
        accept={confirmDelete}
        reject={() => setConfirmVisible(false)}
        acceptLabel="Evet"
        rejectLabel="Hayır"
      />
      <DynamicModal
        isShownig={isModalShowing}
        title="Ekle"
        api={api.siparisStokHareket}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
        validator={validateItems}
      />
      <AppBreadcrumb title="Sipariş Açma Kapama" />
<div className="row">
  <div className="col-12">
    <div className="card">
      <div className="card-body">
        <div className="table-responsive m-t-40">
          <AppTable
            baseApi={api.siparisStokHareket}
            columns={columns}
            key={"SiparisAcmaKapama"}
            ref={myTable}
            rowSelectable={false}
          />
        </div>
      </div>
    </div>
  </div>
  </div>
</div>
  );
};
