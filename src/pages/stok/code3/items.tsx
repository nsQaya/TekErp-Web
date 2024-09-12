import { createRef, useCallback, useState, useRef, useEffect } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes, IFormItem } from "../../../modals/DynamicModal";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { IStokKod } from "../../../utils/types/stok/IStokKod";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";

export default () => {
  const myTable = createRef<ITableRef<IStokKod>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IStokKod | undefined>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IStokKod | null>(null);

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
        await api.stokKod3.delete(itemToDelete.id as number);
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

  const deleteItem = (item: IStokKod) => {
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
      filter: true
    },
    {
      header: "Adı",
      field: "adi",
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
      title: "Adı",
      name: "adi",
      type: FormItemTypes.input
    },
    {
      title: "Kodu",
      name: "kodu",
      type: FormItemTypes.input
    }
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
        api={api.stokKod3}
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
                  baseApi={api.stokKod3}
                  columns={columns}
                  key={"Stok Kod 3'ler"}
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
