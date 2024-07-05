import { createRef, useCallback, useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes, IFormItem } from "../../../modals/DynamicModal";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { IStokKod2 } from "../../../utils/types/Stok/IStokKod2";

export default () => {
  const myTable = createRef<ITableRef<IStokKod2>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IStokKod2>();



  const onSuccess = () => {
    if (selectedItem) {
      alert("Başarıyla güncellendi !");
    } else {
      alert("Başarıyla eklendi !");
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };

  const deleteItem = useCallback(async (item: IStokKod2) => {
    if (!window.confirm("Emin misin ?")) return;
    await api.stokKod2.delete(item.id as number);
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
        title="Stok Kod 2 Ekle"
        api={api.stokKod2}
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
                  baseApi={api.stokKod2}
                  columns={columns}
                  key={"Stok Kod 2'ler"}
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