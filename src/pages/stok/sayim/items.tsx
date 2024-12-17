import { createRef, useCallback, useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, {
  FormItemTypes,
  IFormItem,
} from "../../../modals/DynamicModal";

import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { IStokSayim } from "../../../utils/types/stok/IStokSayim";
import { onayliMiDDFilterTemplate } from "../../../utils/helpers/dtMultiSelectHelper";
import { dateFilterTemplate } from "../../../utils/helpers/CalendarHelper";


export default () => {
  const myTable = createRef<ITableRef<IStokSayim>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IStokSayim | undefined>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IStokSayim | null>(null);

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
        await api.sayim.delete(itemToDelete.id as number);
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

  const deleteItem = (item: IStokSayim) => {
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
      header: "No",
      field: "no",
      sortable: true,
      filter: true,
    },
     { header: "Tarih", field: "tarih", dataType: "date", sortable: true, filter: true, filterElement:dateFilterTemplate,
          body: (row: IStokSayim) =>
            row.tarih
              ? new Date(row.tarih).toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "",
        },
    {
      header: "Kilit",
      field: "kilit",
      sortable: true,
            dataType:"numeric", 
            filter: true , filterElement:onayliMiDDFilterTemplate,
            body: (rowData : IStokSayim) => (rowData.kilit === 1 ? "Evet" : "Hayır")
    },
    {
      header: "Açıklama",
      field: "aciklama",
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
      title: "No",
      name: "no",
      type: FormItemTypes.input,
      
    },
    {
      title: "Tarih",
      name: "tarih",
      type: FormItemTypes.date,
      
    },
    {
      title: "Kilit",
      name: "kilit",
      type: FormItemTypes.boolean,
    },
    {
      title: "Açıklama",
      name: "aciklama",
      type: FormItemTypes.input,
    },
    

  ] as IFormItem[];

  
  return (
    <div className="grid"style={{ marginTop: 1, paddingTop: 1 }}>
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
        title="Sayim"
        api={api.sayim}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
       
      />
      <AppBreadcrumb title="" />
        <div className="col-12" >
          <div className="p-card"  >
                <AppTable
                  baseApi={api.sayim}
                  columns={columns}
                  key={"Sayim"}
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
  );
};
