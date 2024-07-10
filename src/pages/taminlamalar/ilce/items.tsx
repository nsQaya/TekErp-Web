import { createRef, useCallback, useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes, FormSelectItem, IFormItem } from "../../../modals/DynamicModal";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { IIlce } from "../../../utils/types/tanimlamalar/IIlce";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";


export default () => {
  const myTable = createRef<ITableRef<IIlce>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IIlce | undefined>();
  const [provinces, setProvinces] = useState<FormSelectItem[]>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IIlce | null>(null);

  const fetchProvinces = useCallback(async () => {
    const { data: { value: { items } } } = await api.il.getAll(0, 1000);
    setProvinces(items.map(x => ({ label: x.adi, value: String(x.id) })));
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

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
        await api.ilce.delete(itemToDelete.id as number);
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

  const deleteItem = (item: IIlce) => {
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
      header: "İl",
      field: "il.adi", 
      sortable: true,
      filter: true
    },
    {
      header: " İlçe ",
      field: "adi",
      sortable: true,
      filter: true
    },
    {
      header: "İşlemler",
      body: (row: IIlce) => {
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
      title: "İlçe Kodu",
      name: "ilceKodu",
      type: FormItemTypes.input
    },
    {
      title: "İl",
      name: "ilId",
      type: FormItemTypes.select,
      options: provinces,
    },
    {
      title: "Adı",
      name: "adi",
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
        api={api.ilce}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
      />
      <AppBreadcrumb title="İlçeler" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body"> 
              <div className="table-responsive m-t-40"> 
              <AppTable
                  baseApi={api.ilce}
                  columns={columns}
                  key={"İlçeler"}
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
