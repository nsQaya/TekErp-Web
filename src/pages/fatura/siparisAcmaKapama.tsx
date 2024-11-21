import { createRef, useCallback, useState, useRef, useEffect } from "react";
import { ColumnProps } from "primereact/column";
//import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppTable, { ITableRef } from "../../components/AppTable";
import api from "../../utils/api";
import DynamicModal, { FormItemTypes, IFormItem } from "../../modals/DynamicModal";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import { ISiparis } from "../../utils/types/fatura/ISiparis";
import { IBelge } from "../../utils/types/fatura/IBelge";
import { dateFilterTemplate } from "../../utils/helpers/CalendarHelper";
import siparis from "../../utils/api/fatura/siparis";

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
      header: "Tarih",
      field: "belge.tarih",
      dataType: "date",
      sortable: true,
      filter: true,
      filterElement:dateFilterTemplate,
      body: (row: ISiparis) =>
        row.belge!.tarih
          ? new Date(row.belge!.tarih).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
    },
    {
      header: "Sipariş Numarası",
      field: "belgeId",
      sortable: true,
      filter: true
    },
    {
      header: "Durum",
      field: "faturaTip",
      sortable: true,
      filter: true
    },
    {
      header: "Stok Kodu",
      field: "",
      sortable: true,
      filter: true
    },
    {
      header: "Stok Adı",
      field: "",
      sortable: true,
      filter: true
    },
    {
      header: "Teslim Tarihi",
      field: "faturaTip",
      sortable: true,
      filter: true
    },
    {
      header: "Cari İsim",
      field: "cari",
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
      title: "Sipariş Açma/Kapama",
      name: "faturatip",
      type: FormItemTypes.select
    },
    {
      title: "Revize Teslim Tarihi",
      name: "tarih",
      type: FormItemTypes.input
    }
    //{
     // title: "",
     // name: "",
     // type: FormItemTypes.select,   ----- bu select ile sipariş açm kapama seçilecek
     // options: siparis
    //},
    

  ] as IFormItem[];

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
      <AppBreadcrumb title="" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.siparis}
                  columns={columns}
                  key={"SiparisAcmaKapama"}
                  ref={myTable}
                  rowSelectable={false}
                  //appendHeader={() => {
                   // return (
                      //<Button className="p-button-secondary" onClick={(e) => {
                     //   e.preventDefault();
                     //   setSelectedItem(undefined);
                      //  setModalShowing(true);
                     // }}>
                      //</div>  Yeni
                     //</div> </Button>
                   // )
                 // }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
