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
import { IStokSayimYetki } from "../../../utils/types/stok/IStokSayimYetki";
import KullaniciRehberiDialog from "../../../components/Rehber/KullaniciRehberiDialog";
import SayimRehberiDialog from "../../../components/Rehber/SayimRehberiDialog";
import { onayliMiDDFilterTemplate } from "../../../utils/helpers/dtMultiSelectHelper";


export default () => {
  const myTable = createRef<ITableRef<IStokSayimYetki>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IStokSayimYetki | undefined>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IStokSayimYetki | null>(null);

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
        await api.sayimYetki.delete(itemToDelete.id as number);
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

  const deleteItem = (item: IStokSayimYetki) => {
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
      header: "Sayım Numara",
      field: "sayim.no",
      sortable: true,
      filter: true,
    },
    {
      header: "Açıklama",
      field: "sayim.aciklama",
      sortable: true,
      filter: true,
    },

    {
      header: "User Id",
      field: "user.firstName",
      sortable: true,
      filter: true,
    },
    {
      header: "Görme",
      field: "gorme",
      sortable: true,
                  dataType:"numeric", 
                  filter: true , filterElement:onayliMiDDFilterTemplate,
                  body: (rowData : IStokSayimYetki) => (rowData.gorme === 1 ? "Evet" : "Hayır")
    },
    {
      header: "Ekleme",
      field: "ekleme",
      sortable: true,
                  dataType:"numeric", 
                  filter: true , filterElement:onayliMiDDFilterTemplate,
                  body: (rowData : IStokSayimYetki) => (rowData.ekleme === 1 ? "Evet" : "Hayır")
    },
    {
      header: "Değiştirme",
      field: "değistirme",
      
        sortable: true,
                  dataType:"numeric", 
                  filter: true , filterElement:onayliMiDDFilterTemplate,
                  body: (rowData : IStokSayimYetki) => (rowData.degistrime === 1 ? "Evet" : "Hayır")
    },
    {
      header: "Silme",
      field: "silme",
      sortable: true,
                  dataType:"numeric", 
                  filter: true , filterElement:onayliMiDDFilterTemplate,
                  body: (rowData : IStokSayimYetki) => (rowData.silme === 1 ? "Evet" : "Hayır")
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
      name: "sayimId",
      type: FormItemTypes.input,
      hidden: true,
    },
    {
      title: "Sayım",
      name: "sayim",
      type: FormItemTypes.rehber,
      rehberComponent:SayimRehberiDialog,
      returnField:"id",
      returnItemName:"sayimId",
      labelField:"no"
    },
    {
      name: "userId",
      type: FormItemTypes.input,
      hidden: true,
    },
    {
      title: "User",
      name: "user",
      type: FormItemTypes.rehber,
      rehberComponent:KullaniciRehberiDialog,
      returnField:"id",
      returnItemName:"userId",
      labelField:"firstName"
    },
    {
      title: "Görme",
      name: "gorme",
      type: FormItemTypes.boolean,
    },
    {
      title: "Ekleme",
      name: "ekleme",
      type: FormItemTypes.boolean,
    },
    {
      title: "Değiştirme",
      name: "degistirme",
      type: FormItemTypes.boolean,
    },
    {
      title: "Silme",
      name: "silme",
      type: FormItemTypes.boolean,
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
        api={api.sayimYetki}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
       
      />
      <AppBreadcrumb title="" />
        <div className="col-12" >
          <div className="p-card"  >
                <AppTable
                  baseApi={api.sayimYetki}
                  columns={columns}
                  key={"SayimYetki"}
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
