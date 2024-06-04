import { createRef, useCallback,      useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import { TableColumn } from "react-data-table-component";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes,  IFormItem } from "../../../modals/DynamicModal";
import { IPlasiyer } from "../../../utils/types/tanimlamalar/IPlasiyer";




export default () => {
  const myTable = createRef<ITableRef<IPlasiyer>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem]= useState<IPlasiyer>();
  


  const onSuccess = () => {
    if(selectedItem){
      alert("Başarıyla güncellendi !");
    }else{
      alert("Başarıyla eklendi !");
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };

  const deleteItem= useCallback(async (item: IPlasiyer)=>{
    if(!window.confirm("Emin misin ?")) return;
    await api.plasiyer.delete(item.id as number);
    myTable.current?.refresh();
  },[])


  const columns: TableColumn<IPlasiyer>[] = [
    {
      name: "#",
      selector: (row) => row.id as number,
      sortable: true,
    },
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

  const modalItems= [
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
        title="Plasiyer Ekle" 
        api={api.plasiyer} 
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={()=>setModalShowing(false)}
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
              <button
                type="button"
                className="btn btn-info btn-rounded m-t-10 float-end text-white"
                onClick={(e) => [e.preventDefault(), setModalShowing(true)]}
              >
                Yeni
              </button>
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.plasiyer}
                  columns={columns}
                  key={"Depolar"}
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
