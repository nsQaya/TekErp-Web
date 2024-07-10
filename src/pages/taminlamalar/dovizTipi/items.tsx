import { createRef, useCallback, useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, {
  FormItemTypes,
  IFormItem,
} from "../../../modals/DynamicModal";
import { IDovizTipi } from "../../../utils/types/tanimlamalar/IDovizTipi";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";

export default () => {
  const myTable = createRef<ITableRef<IDovizTipi>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IDovizTipi>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IDovizTipi | null>(null);

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
        await api.dovizTipi.delete(itemToDelete.id as number);
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

  const deleteItem = (item: IDovizTipi) => {
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
      header: " Döviz Tipi",
      field: "kodu",
      sortable: true,
      filter: true,
    },
    {
      header: " Döviz Adı",
      field: "adi",
      sortable: true,
      filter: true,
    },
    {
      header: "Simge",
      field: "simge",
      sortable: true,
    },
    {
      header: "Netsis Kodu",
      field: "tcmbId",
      sortable: true,
    },
    {
      header: "işlemler",
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
      hidden: true
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
    {
      title: "Simge",
      name: "simge",
      type: FormItemTypes.input,
    },
    {
      title: "Netsis Kodu",
      name: "tcmbId",
      type: FormItemTypes.input,
    },
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
        api={api.dovizTipi}
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
                  baseApi={api.dovizTipi}
                  columns={columns}
                  key={"Döviz Tipleri"}
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
