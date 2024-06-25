import { createRef, useCallback, useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes, IFormItem } from "../../../modals/DynamicModal";
import { IUlke } from "../../../utils/types/tanimlamalar/IUlke";
import { ColumnProps } from "primereact/column";

export default () => {
  const myTable = createRef<ITableRef<IUlke>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IUlke>();



  const onSuccess = () => {
    if (selectedItem) {
      alert("Başarıyla güncellendi !");
    } else {
      alert("Başarıyla eklendi !");
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };

  const deleteItem = useCallback(async (item: IUlke) => {
    if (!window.confirm("Emin misin ?")) return;
    await api.ulke.delete(item.id as number);
    myTable.current?.refresh();
  }, [])


  const columns: ColumnProps[] = [
    {
      field: "id",
      header: "#",
      sortable: true
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
      header: "Aktarım Durumu",
      field: "aktarimDurumu",
      sortable: true,
    },
    {
      header: "işlemler",
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
      type: FormItemTypes.input
    },
    {
      title: "Adı",
      name: "adi",
      type: FormItemTypes.input
    }
  ] as IFormItem[];


  return (
    <div className="container-fluid">

      <DynamicModal
        isShownig={isModalShowing}
        title="Ülke Ekle"
        api={api.ulke}
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
              <h4 className="card-title">Data Export</h4>
              <h6 className="card-subtitle">
                Export data to Copy, CSV, Excel, PDF & Print
              </h6>

              <div className="table-responsive m-t-50">

                <AppTable
                  baseApi={api.ulke}
                  columns={columns}
                  key={"Ülkeler"}
                  ref={myTable}
                  rowSelectable={true}
                  appendHeader={() => {
                    return (
                    <button type="button" className="btn btn-info btn-rounded m-t-10 float-end text-white" onClick={(e) => [e.preventDefault(), setModalShowing(true)]}>
                      Yeni
                    </button>)
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
