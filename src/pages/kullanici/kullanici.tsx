import { createRef, useCallback, useState, useRef, useEffect } from "react";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { IKullanici } from "../../utils/types/kullanici/IKullanici";
import AppTable, { ITableRef } from "../../components/AppTable";
import api from "../../utils/api";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import DynamicModal, { FormItemTypes, IFormItem } from "../../modals/DynamicModal";

export default () => {
  const myTable = createRef<ITableRef<IKullanici>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IKullanici | undefined>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IKullanici | null>(null);

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
        await api.kullanici.deleteByString(itemToDelete.id as string);
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

  const deleteItem = (item: IKullanici) => {
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
      header: "Adı",
      field: "firstName",
      sortable: true,
      filter: true
    },
    {
      header: "Soyadı",
      field: "lastName",
      sortable: true,
      filter: true
    },
    {
      header: "E-Mail",
      field: "email",
      sortable: true,
      filter: true
    },
    {
      header:"Özlük Id",
      field:"ozlukId",
      sortable:true,
      filter:true
    },
    {
      header: "Durum",
      field: "status",
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
      },
      style:{
        minWidth:"150px"
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
      name: "firstName",
      type: FormItemTypes.input
    },
    {
      title: "Soyadı",
      name: "lastName",
      type: FormItemTypes.input
    },
    {
      title: "eMail",
      name: "email",
      type: FormItemTypes.input
    },
    {
      title: "Şifre",
      name: "password",
      type: FormItemTypes.input
    },
    {
      title: "Şifre Tekrar",
      name: "passwordT",
      type: FormItemTypes.input
    },
    {
      title: "Netsis Özlük Id",
      name: "ozlukId",
      type: FormItemTypes.input
    },
    {
      title: "Netsis Kullanıcı Adı",
      name: "NetsisUserName",
      type: FormItemTypes.input
    },
    {
      title: "Netsis Şifre",
      name: "NetsisPassword",
      type: FormItemTypes.input
    },
    {
      title: "Durum",
      name: "status",
      type: FormItemTypes.boolean //TODO: Buraya bool alan eklenecek. sonrasında api ye de eklenecek orada da görünmüyor. 
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
        api={api.kullanici}
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
                  baseApi={api.kullanici}
                  columns={columns}
                  key={"Projeler"}
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
