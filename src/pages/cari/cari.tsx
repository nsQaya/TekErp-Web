import { createRef, useCallback, useState, useRef, useEffect } from "react";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppTable, { ITableRef } from "../../components/AppTable";

import api from "../../utils/api";
import DynamicModal, { FormItemTypes,  IFormItem } from "../../modals/DynamicModal";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import { ICari } from "../../utils/types/cari/ICari";

export default () => {
  const myTable = createRef<ITableRef<ICari>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ICari | undefined>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ICari | null>(null);

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
        await api.cari.delete(itemToDelete.id as number);
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

  const deleteItem = (item: ICari) => {
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
      header: "",
      field: "id",
      sortable: true,
    },
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
      header: "Ülke",
      field: "ilce.ilId",
      sortable: true,
      filter: true
    },
    {
      header: "Ülke",
      field: "ilce.il.ulkeId",
      sortable: true,
      filter: true
    },
    {
      header: "İşlemler",
      body: (row) => {
        return (
          <>
          {/* {JSON.stringify(row.ilId)} */}
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
      title: "Kodu",
      name: "kodu",
      type: FormItemTypes.input,
      columnSize:4
    },
    {
      title: "Tip",
      name: "tip",
      type: FormItemTypes.input,
      columnSize:2
    },
    {
      title: "Posta Kodu",
      name: "postaKodu",
      type: FormItemTypes.input,
      columnSize:2
    },
    {
      title: "Telefon",
      name: "telefon",
      type: FormItemTypes.input,
      columnSize:4
    },
    {
      title: "Adı",
      name: "adi",
      type: FormItemTypes.input,
      columnSize:12
    },
    {
      title: "Adres",
      name: "adres",
      type: FormItemTypes.input
    },
    {
      type: FormItemTypes.genericDropdown,
      title: "Ülke Kodu",
      name: "ulkeId",
      baseApi: api.ulke,
      returnField: "id",
      labelField: "adi",
      columnSize:4
    },
    {
      type: FormItemTypes.genericDropdown,
      title: "İl",
      name: "ilId",
      baseApi: api.il,
      returnField: "id",
      labelField: "adi",
      additionalFilters: [
        {
          item: "ulkeId",
          matchMode: "equals"
        }
      ],
      columnSize:4,
    },
    {
      type: FormItemTypes.genericDropdown,
      title: "İlçe",
      name: "ilceId",
      baseApi: api.ilce,
      returnField: "id",
      labelField: "adi",
      additionalFilters: [
        {
          item: "ilId",
          matchMode: "equals"
        }
      ],
      columnSize:4
    },
    {
      type: FormItemTypes.genericDropdown,
      title: "Grup Kodu",
      name: "cariGrupKoduId",
      baseApi: api.cariGrupKodu,
      returnField: "id",
      labelField: "adi",
      columnSize:4,
    },
    {
      type: FormItemTypes.genericDropdown,
      title: "Kod 1",
      name: "cariKod1Id",
      baseApi: api.cariKod1,
      returnField: "id",
      labelField: "adi",
      columnSize:4,
    },
    {
      type: FormItemTypes.genericDropdown,
      title: "Kod 2",
      name: "cariKod2Id",
      baseApi: api.cariKod2,
      returnField: "id",
      labelField: "adi",
      columnSize:4,
    },
    {
      type: FormItemTypes.genericDropdown,
      title: "Kod 3",
      name: "cariKod3Id",
      baseApi: api.cariKod3,
      returnField: "id",
      labelField: "adi",
      columnSize:4,
    },
    {
      type: FormItemTypes.genericDropdown,
      title: "Kod 4",
      name: "cariKod4Id",
      baseApi: api.cariKod4,
      returnField: "id",
      labelField: "adi",
      columnSize:4,
    },
    {
      type: FormItemTypes.genericDropdown,
      title: "Kod 5",
      name: "cariKod5Id",
      baseApi: api.cariKod5,
      returnField: "id",
      labelField: "adi",
      columnSize:4,
    },
    {
      title: "Vergi Dairesi",
      name: "vergiDairesi",
      type: FormItemTypes.input,
      columnSize:4
    },
    {
      title: "Vergi Numarası",
      name: "vergiNumarasi",
      type: FormItemTypes.input,
      columnSize:4
    },
    {
      title: "TC Kimlik No",
      name: "tcKimlikNo",
      type: FormItemTypes.input,
      columnSize:4
    },

    {
      title: "Açıklama 1",
      name: "aciklama1",
      type: FormItemTypes.input
    },
    {
      title: "Açıklama 2",
      name: "aciklama2",
      type: FormItemTypes.input
    },
    {
      title: "Açıklama 3",
      name: "aciklama3",
      type: FormItemTypes.input
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
        title=""
        api={api.cari}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
        classEki="4"
      />
      <AppBreadcrumb title="" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.cari}
                  columns={columns}
                  key={"Caris"}
                  ref={myTable}
                  rowSelectable={true}
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


