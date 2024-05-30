import { createRef, useCallback,  useState } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import  { TableColumn } from "react-data-table-component";
import api from "../../utils/api";
import { IStok } from "../../utils/types/Stok/IStok";
import CreateOrEditModal from "../../modals/stok/createOrEdit";
import AppTable, { ITableRef } from "../../components/AppTable";
import { IStokKartiWithDetail } from "../../utils/types/Stok/IStokKartiWithDetail";


export default () => {
  const myTable = createRef<ITableRef>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem]= useState<IStok>();

  const onDone= useCallback(()=>{
    myTable?.current?.refresh();
    setModalShowing(false);
  },[]);
  
  const deleteItem= useCallback(async (item: IStok)=>{
    if(!window.confirm("Emin misin ?")) return;
    await api.stok.delete(item.id as number);
    myTable.current?.refresh();
  },[])

  const columns: TableColumn<IStokKartiWithDetail>[] = [
    {
      name: "#",
      selector: (row: IStokKartiWithDetail) => row.stokKarti.id as number,
      sortable: true,
    },
    {
      name: "Kodu",
      selector: (row: IStokKartiWithDetail) => row.stokKarti.kodu,
      sortable: true,
    },
    {
      name: "Adı",
      selector: (row: IStokKartiWithDetail) => row.stokKarti.adi,
      sortable: true,
    },
    {
      name: "İngilizce Adı",
      selector: (row: IStokKartiWithDetail) => row.stokKarti.ingilizceIsim,
      sortable: true,
    },
    {
      name: "Adı",
      selector: (row: IStokKartiWithDetail) => row.stokKarti.adi,
      sortable: true,
    },
    {
      name: "işlemler",
      cell: (row: IStokKartiWithDetail) => {
        return (
          <>
            <button className="btn btn-info ms-1" onClick={(e)=>[e.preventDefault(),setSelectedItem(row.stokKarti), setModalShowing(true)]}>
              <i className="ti-pencil"></i>
            </button>
            <button className="btn btn-danger ms-1" onClick={(e)=>[e.preventDefault(), deleteItem(row.stokKarti)]}>
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
        onDone= {onDone}
        onHide={() => setModalShowing(false)}
        selectedItem={selectedItem}
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
                    baseApi={api.stokWithDetail}
                    columns={columns}
                    key={'Stoklar'}
                    ref={myTable}
                    rowSelectable={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
