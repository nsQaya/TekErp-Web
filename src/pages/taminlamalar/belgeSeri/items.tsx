import { createRef, useCallback, useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, {
  FormItemTypes,
  IFormItem,
} from "../../../modals/DynamicModal";
import { ColumnProps } from "primereact/column";
import { IBelgeSeri } from "../../../utils/types/tanimlamalar/IBelgeSeri";
import { EBelgeTip } from "../../../utils/types/enums/EBelgeTip";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";

export default () => {
  const myTable = createRef<ITableRef<IBelgeSeri>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IBelgeSeri>();
  const [belges, setBelges] = useState<any[]>([]);

  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IBelgeSeri | null>(null);

  // Enum değerlerini alıp 900 ile başlayanları filtreleyen fonksiyon
  const getFilteredEnumValues = () => {
    return Object.values(EBelgeTip)
      .filter((value) => typeof value === "number" && value >= 900)
      .map((value) => ({ label: EBelgeTip[value as keyof typeof EBelgeTip], value: Number(value) }));
  };

  useEffect(() => {
    const filteredItems = getFilteredEnumValues();
    setBelges(filteredItems);
  }, []);

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
        await api.belgeSeri.delete(itemToDelete.id as number);
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

  const deleteItem = (item: IBelgeSeri) => {
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
      header: "Belge Tipi",
      field: "belgeTip",
      sortable: true,
      filter: true,
    },
    {
      header: "Seri",
      field: "seri",
      sortable: true,
      filter: true,
    },
    // {
    //   header: "No",
    //   field: "no",
    //   sortable: true,
    // },
    // {
    //   header: "BelgeNo",
    //   field: "belgeNo",
    //   sortable: true,
    //   filter: true,
    // },
    {
      header: "işlemler",
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
      hidden: true,
    },
    {
      title: "Belge Tip",
      name: "belgeTip",
      type: FormItemTypes.select,
      options: belges
    },
    {
      title: "Seri",
      name: "seri",
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
        api={api.belgeSeri}
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
                  baseApi={api.belgeSeri}
                  columns={columns}
                  key={"BelgeSeriler"}
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
