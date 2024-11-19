import { createRef, useCallback, useState, useRef, useEffect } from "react";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppTable, { ITableRef } from "../../components/AppTable";
import { INetsisDepoIzin } from "../../utils/types/uretim/INetsisDepoIzin";
import api from "../../utils/api";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import DynamicModal, { FormItemTypes, IFormItem } from "../../modals/DynamicModal";
import UniteRehberDialog from "../../components/Rehber/UniteRehberDialog";
import ProjeRehberDialog from "../../components/Rehber/ProjeRehberDialog";
import IsEmriRehberDialog from "../../components/Rehber/IsEmriRehberDialog";
import { kilitliMiDDFilterTemplate } from "../../utils/helpers/dtMultiSelectHelper";

export default () => {
  const myTable = createRef<ITableRef<INetsisDepoIzin>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<INetsisDepoIzin | undefined>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<INetsisDepoIzin | null>(null);

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
        await api.netsisDepoIzin.delete(itemToDelete.id as number);
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

  const deleteItem = (item: INetsisDepoIzin) => {
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
      header: "İş Emri Numarası",
      field: "isEmriNo",
      sortable: true,
      filter: true
    },
    {
      header: "Proje Kodu",
      field: "projeKodu",
      sortable: true,
      filter: true
    },
    {
      header: "Ünite Kodu",
      field: "plasiyerKodu",
      sortable: true,
      filter: true
    },
    {
      header: "KilitliMi",
      field: "kilitliMi",
      sortable: true,
      dataType:"numeric",
      filter: true,
      filterElement:kilitliMiDDFilterTemplate,
      body: (rowData : INetsisDepoIzin) => (rowData.kilitliMi === 1 ? "Evet" : "Hayır")

    },
    {
      header: "İşlemler",
      body: (row) => {
        return (
          <>
            {/* <button className="btn btn-info ms-1" onClick={(e) => {
              e.preventDefault();
              setSelectedItem(row);
              setModalShowing(true);
            }}>
              <i className="ti-pencil"></i>
            </button> */}
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
      title: "İş Emri Numarası",
      name: "isEmriNo",
      type: FormItemTypes.input,
      hidden:true
    },
    {
      title: "isEmri",
      name: "isEmri",
      type: FormItemTypes.rehber,
      rehberComponent:IsEmriRehberDialog,
      returnField:"isEmriNo",
      returnItemName:"isEmriNo",
      labelField:"isEmriNo"
    },
    {
      title: "Proje Kodu",
      name: "projeKodu",
      type: FormItemTypes.input,
      hidden:true
    },
    {
      title: "Proje",
      name: "proje",
      type: FormItemTypes.rehber,
      rehberComponent:ProjeRehberDialog,
      returnField:"kodu",
      returnItemName:"projeKodu",
      labelField:"aciklama"
    },
    {
      title: "Ünite Kodu",
      name: "plasiyerKodu",
      type: FormItemTypes.input,
      hidden:true
    },
    {
      title: "Ünite",
      name: "plasiyer",
      type: FormItemTypes.rehber,
      rehberComponent:UniteRehberDialog,
      returnField:"kodu",
      returnItemName:"plasiyerKodu",
      labelField:"aciklama"
    },
    {
      title: "Kilitli Mi",
      name: "kilitliMi",
      type: FormItemTypes.boolean,
      value: 0
    }
  ] as IFormItem[];

  const validateIsEmriOrProje = (formItems: IFormItem[] | undefined) => {
    if (!formItems) {
      return "Form verileri yüklenemedi."; // Eğer formItems undefined ise hata mesajı döner
    }
    const isEmriSelected = formItems.find(item => item.name === "isEmriNo")?.value;
    const projeSelected = formItems.find(item => item.name === "projeKodu")?.value;
    const plasiyerSelected = formItems.find(item => item.name === "plasiyerKodu")?.value;
  
    if (!isEmriSelected && (!projeSelected || !plasiyerSelected) ) {
      return "'İş Emri' veya 'Proje' ve 'Ünite' seçiniz.";
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
        title="Netsis Depo İzin"
        api={api.netsisDepoIzin}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
        validator={validateIsEmriOrProje} 
      />
      <AppBreadcrumb title="" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.netsisDepoIzin}
                  columns={columns}
                  key={"NetsisDepoIzin"}
                  ref={myTable}
                  rowSelectable={false}
                  appendHeader={() => {
                    return (
                      <Button className="p-button-secondary" onClick={(e) => {
                        e.preventDefault();
                        setSelectedItem(undefined);
                        setModalShowing(true);
                      }}>
                        Yeni
                      </Button>
                    )
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
