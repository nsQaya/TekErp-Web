import { createRef, useCallback, useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import { IStokKod } from "../../../utils/types/stok/IStokKod";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes, IFormItem } from "../../../modals/DynamicModal";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";

export default () => {
  const myTable = createRef<ITableRef<IStokKod>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IStokKod>();

  

  const onSuccess = () => {
    if (selectedItem) {
      alert("Başarıyla güncellendi !");
    } else {
      alert("Başarıyla eklendi !");
    }
    setModalShowing(false);
    myTable.current?.refresh();
  };

  const deleteItem = useCallback(async (item: IStokKod) => {
    if (!window.confirm("Emin misin ?")) return;
    await api.stokKod5.delete(item.id);
    myTable.current?.refresh();
  }, [])


  const columns: ColumnProps[] = [
    {
      header: "",
      field:"",
      sortable: true,
      
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
            <button className="btn btn-info ms-1" onClick={(e) => [e.preventDefault(), setSelectedItem(row), setModalShowing(true)]}>
              <i className="ti-pencil"></i>
            </button>
            <button className="btn btn-danger ms-1" onClick={(e) => [e.preventDefault(), deleteItem(row)]}>
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

      <DynamicModal
        isShownig={isModalShowing}
        title="Stok Ekle"
        api={api.stokKod5}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
      />

      <AppBreadcrumb title="Kod 5'ler" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">

              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.stokKod5}
                  columns={columns}
                  key={"Stoklar 5 Kodlar"}
                  ref={myTable}
                  rowSelectable={true}
                  appendHeader={() => {
                    return (
                      <Button className="p-button-secondary"
                        onClick={(e) => [e.preventDefault(), setModalShowing(true)]}>
                        Yeni
                      </Button>)
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