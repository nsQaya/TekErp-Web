import { createRef, useCallback, useState, useRef, useEffect } from "react";
import { ColumnProps } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppTable, { ITableRef } from "../../components/AppTable";
import api from "../../utils/api";
import DynamicModal, { FormItemTypes, IFormItem } from "../../modals/DynamicModal";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import { ISiparis } from "../../utils/types/fatura/ISiparis";
import { dateFilterTemplate } from "../../utils/helpers/CalendarHelper";




export default () => {
  const myTable = createRef<ITableRef<ISiparis>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ISiparis | undefined>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ISiparis | null>(null);
  

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
        await api.siparis.delete(itemToDelete.id as number);
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

  const deleteItem = (item: ISiparis) => {
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
    {
      header: "Cari Kodu",
      field: "cari.kodu",
      sortable: true,
      filter: true
    },
    {
      header: "Cari İsim",
      field: "cari.adi",
      sortable: true,
      filter: true
    },
    { header: "Tarih", field: "siparis.belge.tarih", dataType: "date", sortable: true, filter: true, filterElement:dateFilterTemplate,
      body: (row: ISiparis) =>
        row.belge?.tarih
          ? new Date(row.belge?.tarih).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
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
      name: "cariId",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "tip",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "ihracatIthalatTip",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "dovizAraToplam",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "araToplamTL",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "dovizIskonto",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "belgeId",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "dovizKDV",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "dovizNetToplam",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "iskontoTL",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "kdvtl",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "netToplamTL",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      name: "cikisEvrakTarihi",
      type: FormItemTypes.date,
      title: "Çıkış Evrak Tarihi",
      
    },
    {
      name: "gumrukVarisTarihi",
      type: FormItemTypes.date,
      title: "Gümrük Varış Tarihi",
      
    },
    {
      name: "varisEvraklariTarihi",
      type: FormItemTypes.date,
      title: "Varış Evrakları Tarihi",
      
    },
    {
      name: "tasiyiciFirma",
      type: FormItemTypes.input,
      title: "Taşıyıcı Firma",
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
        api={api.siparis}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
        
      />
      <AppBreadcrumb title="İthalat Ek Bilgiler" />
<div className="row">
  <div className="col-12">
    <div className="card">
      <div className="card-body">
        <div className="table-responsive m-t-40">
          <AppTable
            baseApi={api.siparis}
            columns={columns}
            key={"İthalatEkBilgiler"}
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
