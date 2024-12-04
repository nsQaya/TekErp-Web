import { createRef, useCallback, useState, useRef, useEffect } from "react";
import { ColumnProps } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppTable, { ITableRef } from "../../components/AppTable";
import api from "../../utils/api";
import DynamicModal, { FormItemTypes, IFormItem } from "../../modals/DynamicModal";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import { Button } from "primereact/button";
import { ISiparisSaveData } from "../../utils/types/fatura/ISiparisSaveData";



export default () => {
  const myTable = createRef<ITableRef<ISiparisSaveData>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ISiparisSaveData | undefined>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ISiparisSaveData | null>(null);
  

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

  const deleteItem = (item: ISiparisSaveData) => {
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
      field: "siparis.belge.no",
      sortable: true,
      filter: true
    },
    {
      header: "Durum", 
      field: "siparisStokHarekets.durum", 
      sortable: true,
      filter: true,
     
    },
    {
      header: "Miktar", 
      field: "siparisStokHarekets.miktar", 
      sortable: true,
      filter: true,
    },
    {
      header: "Kalan Miktar", 
      field: "siparisStokHarekets.kalanMiktar", 
      sortable: true,
      filter: true,
     
    },
    {
      header: "Stok Kodu",
      field: "siparisStokHarekets.stokKarti.kodu",
      sortable: true,
      filter: true,
    },
    {
      header: "Stok Adı",
      field: "siparisStokHarekets.stokKarti.adi",
      sortable: true,
      filter: true
    },
    {
      header: "Teslim Tarihi",
      field: "siparisStokHarekets.istenilenTeslimTarihi",
      sortable: true,
      filter: true
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
      name: "siparis.id",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      title: "Sipariş Durumu", // Başlık
      name: "siparisStokHarekets.sipDurum", // Alan adı
      type: FormItemTypes.select, // Select tipi
    },
    {
      title: "Revize Teslim Tarihi",
      name: "siparisStokHarekets.istenilenTeslimTarihi",
      type: FormItemTypes.date,  
    
    },
    
  ] as IFormItem[]

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
        api={api.siparisSave}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
      />
      <AppBreadcrumb title="" />
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
            appendHeader={() => {
              return (
                <Button
                  className="p-button-secondary"
                  onClick={(e) => {
                     e.preventDefault();
                    setSelectedItem(undefined);
                     setModalShowing(true);
                  }}
                >
                  Yeni
                </Button>
              );
            }}
          />
        </div>
      </div>
    </div>
  </div>
  </div>
</div>
  );
};
