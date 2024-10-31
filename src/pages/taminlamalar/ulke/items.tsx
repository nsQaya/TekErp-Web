import { createRef, useCallback, useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, {
  FormItemTypes,
  IFormItem,
} from "../../../modals/DynamicModal";
import { IUlke } from "../../../utils/types/tanimlamalar/IUlke";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";

export default () => {
  const myTable = createRef<ITableRef<IUlke>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IUlke | undefined>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IUlke | null>(null);

  const onSuccess = () => {
    if (selectedItem) {
      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Başarıyla güncellendi !",
      });
    } else {
      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Başarıyla eklendi !",
      });
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };

  const confirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        await api.ulke.delete(itemToDelete.id as number);
        myTable.current?.refresh();
        toast.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "Başarıyla silindi !",
        });
      } catch (error) {
        console.error("Silme işleminde hata:", error);
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Silme işleminde hata oluştu !",
        });
      } finally {
        setItemToDelete(null);
        setConfirmVisible(false);
      }
    }
  }, [itemToDelete]);

  const deleteItem = (item: IUlke) => {
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
      header: "Kodu",
      field: "kodu",
      sortable: true,
      filter: true,
    },
    {
      header: "Ülke",
      field: "adi",
      sortable: true,
      filter: true,
    },

    {
      header: "İşlemler",
      body: (row) => {
        return (
          <>
            <button
              className="btn btn-info ms-1"
              onClick={(e) => {
                e.preventDefault();
                setSelectedItem(row);
                setModalShowing(true);
              }}
            >
              <i className="ti-pencil"></i>
            </button>
            <button
              className="btn btn-danger ms-1"
              onClick={(e) => {
                e.preventDefault();
                deleteItem(row);
              }}
            >
              <i className="ti-trash"></i>
            </button>
          </>
        );
      },
    },
  ];

  const modalItems = [
    {
      name: "id",
      type: FormItemTypes.input,
      hidden: true,
    },
    {
      title: "Kodu",
      name: "kodu",
      type: FormItemTypes.input,
      
    },
    {
      title: "Adı",
      name: "adi",
      type: FormItemTypes.input,
    },
  ] as IFormItem[];

  const validateItems = (formItems: IFormItem[] | undefined) => {
    if (!formItems) {
      return "Form verileri yüklenemedi."; // Eğer formItems undefined ise hata mesajı döner
    }
    const koduSelected = formItems.find(item => item.name === "kodu")?.value;
    const adiSelected = formItems.find(item => item.name === "adi")?.value;
  
    if (!koduSelected ) {
      return "Ülke kodunu girin.";
    }
    if (!adiSelected ) {
      return "Ülke adını  girin.";
    }
  
    return null; 
  };

  return (
    <div className="container-fluid"style={{ marginTop: 1, paddingTop: 1 }}>
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
        title="Ülke Ekle"
        api={api.ulke}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
        validator={validateItems}
      />
      <AppBreadcrumb title="" />
      <div className="row" style={{ marginTop: 1, paddingTop: 1 }}>
        <div className="col-12" style={{ marginTop: 1, paddingTop: 1 }}>
          <div className="card" style={{ marginTop: 1, paddingTop: 1 }} >
            <div className="card-body" style={{ marginTop: 1, paddingTop: 1 }}>
              <div className="table-responsive m-t-40" style={{ marginTop: 1, paddingTop: 1 }}>
                <AppTable
                  baseApi={api.ulke}
                  columns={columns}
                  key={"Ülkeler"}
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
