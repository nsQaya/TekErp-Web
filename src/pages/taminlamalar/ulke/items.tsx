import { createRef, useCallback,   useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import { TableColumn } from "react-data-table-component";
import api from "../../../utils/api";
import { IUlke } from "../../../utils/types";
import CreateOrEditModal from "../../../modals/tanimlamalar/ulke/createOrEdit";
import AppTable, { ITableRef } from "../../../components/AppTable";

export default () => {
  const myTable = createRef<ITableRef>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem]= useState<IUlke>();

  const onSuccess = () => {
    if(selectedItem){
      alert("Başarıyla güncellendi !");
    }else{
      alert("Başarıyla eklendi !");
    }
    myTable.current?.refresh();
  };

  const deleteItem= useCallback(async (item: IUlke)=>{
    if(!window.confirm("Emin misin ?")) return;
    await api.stokKod1.delete(item.id);
    myTable.current?.refresh();
  },[])


  const columns: TableColumn<IUlke>[] = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
    }
    ,
    {
      name: "Kodu",
      selector: (row) => row.kodu,
      sortable: true,
    },
    {
      name: "Adı",
      selector: (row) => row.adi,
      sortable: true,
    },
    {
      name: "Aktarım Durumu",
      selector: (row) => row.aktarimDurumu,
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

      <AppBreadcrumb title="Ülkeler" />
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
                Ülke Ekle
              </button>
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.ulke}
                  columns={columns}
                  key={"Ülkeler"}
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