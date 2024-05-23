import { createRef, useCallback, useEffect, useState } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import DataTable, { TableColumn } from "react-data-table-component";
import api from "../../utils/api";
import { IStok } from "../../utils/types";
import CreateOrEditModal from "../../modals/stok/createOrEdit";
import AppTable, { ITableRef } from "../../components/AppTable";

const columns: TableColumn<IStok>[] = [
  {
    name: "#",
    selector: (row: IStok) => row.id,
    sortable: true,
  },
  {
    name: "Adı",
    selector: (row: IStok) => row.adi,
    sortable: true,
  },
  {
    name: "işlemler",
    cell: (row: IStok) => {
      return (
        <>
          <button className="btn btn-primary">
            <i className="ti-eye"></i>
          </button>
          <button className="btn btn-info ms-1">
            <i className="ti-pencil"></i>
          </button>
          <button className="btn btn-danger ms-1">
            <i className="ti-trash"></i>
          </button>
        </>
      );
    },
  },
];

export default () => {
  const myTable = createRef<ITableRef>();
  const [isModalShowing, setModalShowing] = useState(false);

  const onDone= useCallback(()=>{
    
    myTable?.current?.refresh();
    setModalShowing(false);
  },[]);

  return (
    <div className="container-fluid">
      
      <CreateOrEditModal
        show={isModalShowing}
        onDone= {onDone}
        onHide={() => setModalShowing(false)}
      />

      <AppBreadcrumb title="Stoklar" />
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
                Yeni Stok Ekle
              </button>
              <div className="table-responsive m-t-40">
                <AppTable
                    baseApi={api.stok}
                    columns={columns}
                    key={'Stoklar'}
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
