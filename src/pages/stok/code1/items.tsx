import { createRef, useCallback,   useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import { TableColumn } from "react-data-table-component";
import api from "../../../utils/api";
import { IStokKod } from "../../../utils/types/stok/IStokKod";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes, IFormItem } from "../../../modals/DynamicModal";

export default () => {
  const myTable = createRef<ITableRef<IStokKod>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem]= useState<IStokKod>();

  const items= [
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

  const onSuccess = () => {
    if(selectedItem){
      alert("Başarıyla güncellendi !");
    }else{
      alert("Başarıyla eklendi !");
    }
    setModalShowing(false);
    myTable.current?.refresh();
  };

  const deleteItem= useCallback(async (item: IStokKod)=>{
    if(!window.confirm("Emin misin ?")) return;
    await api.stokKod1.delete(item.id);
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

      <DynamicModal 
        isShownig={isModalShowing} 
        title="Stok Ekle" 
        api={api.stokKod1} 
        items={items}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={()=>setModalShowing(false)}
      />

      <AppBreadcrumb title="Kod 1'ler" />
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
                Yeni Kod-1 Ekle
              </button>
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.stokKod1}
                  columns={columns}
                  key={"Stoklar 1 Kodlar"}
                  ref={myTable}
                  rowSelectable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
