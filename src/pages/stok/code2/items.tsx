import { createRef, useCallback, useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import { TableColumn } from "react-data-table-component";
import api from "../../../utils/api";
import { IStokKod } from "../../../utils/types";
import CreateOrEditModal from "../../../modals/stok/code2/createOrEdit";
import AppTable, { ITableRef } from "../../../components/AppTable";

export default () => {
  const myTable = createRef<ITableRef>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem]= useState<IStokKod>();

  const onSuccess = () => {
    if(selectedItem){
      alert("Başarıyla güncellendi !");
    }else{
      alert("Başarıyla eklendi !");
    }
    myTable.current?.refresh();
  };

  const deleteItem= useCallback(async (item: IStokKod)=>{
    if(!window.confirm("Emin misin ?")) return;
    await api.stokKod2.delete(item.id);
    myTable.current?.refresh();
  },[])


  const columns: TableColumn<IStokKod>[] = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Adı",
      selector: (row) => row.adi,
      sortable: true,
    },
    {
      name: "işlemler",
      cell: (row) => {
        return (
          <>
            <button className="btn btn-info ms-1"  onClick={(e)=>[e.preventDefault(),setSelectedItem(row), setModalShowing(true)]}>
              <i className="ti-pencil"></i>
            </button>
            <button className="btn btn-danger ms-1" onClick={(e)=>[e.preventDefault(), deleteItem(row)]}>
              <i className="ti-trash"></i>
            </button>
          </>
        );
      },
    },
  ];

  return (
    <div className="container-fluid">
      
      <CreateOrEditModal
        show={isModalShowing}
        onHide={() => [setSelectedItem(undefined), setModalShowing(false)]}
        onSuccess={onSuccess}
        selected={selectedItem}
      />

      <AppBreadcrumb title="Kod 2'ler" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Data Export</h4>
              <h6 className="card-subtitle">
                Export data to Copy, CSV, Excel, PDF & Print
              </h6>
              <button
                type="button"
                className="btn btn-info btn-rounded m-t-10 float-end text-white"
                onClick={(e) => [e.preventDefault(), setModalShowing(true)]}
              >
                Yeni Kod-2 Ekle
              </button>
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.stokKod2}
                  columns={columns}
                  key={"Stoklar 2 Kodlar"}
                  ref={myTable}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
