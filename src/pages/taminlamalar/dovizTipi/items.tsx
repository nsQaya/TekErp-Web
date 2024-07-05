import { createRef, useCallback,      useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes,  IFormItem } from "../../../modals/DynamicModal";
import { IDovizTipi } from "../../../utils/types/tanimlamalar/IDovizTipi";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";




export default () => {
  const myTable = createRef<ITableRef<IDovizTipi>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem]= useState<IDovizTipi>();
  


  const onSuccess = () => {
    if(selectedItem){
      alert("Başarıyla güncellendi !");
    }else{
      alert("Başarıyla eklendi !");
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };

  const deleteItem= useCallback(async (item: IDovizTipi)=>{
    if(!window.confirm("Emin misin ?")) return;
    await api.dovizTipi.delete(item.id as number);
    myTable.current?.refresh();
  },[])


  const columns: ColumnProps[] = [
   
    {
      header: " Döviz Tipi",
      field: "kodu",
      sortable: true,
      filter: true
    },
    {
      header: " Döviz Adı",
      field: "adi",
      sortable: true,
      filter: true
    },
    {
      header: "Simge",
      field: "simge",
      sortable: true,
    },
    {
      header: "Netsis Kodu",
      field: "tcmbId",
      sortable: true,
    },
    {
      header: "işlemler",
      body: (row) => {
        return (
          <>
            <button className="btn btn-info ms-1"  onClick={(e)=>[e.preventDefault(),setSelectedItem(row), setModalShowing(true)]}
              >
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
      title: "Kodu",
      name: "kodu",
      type: FormItemTypes.input
    },
    {
      title: "Adı",
      name: "adi",
      type: FormItemTypes.input
    },
    {
      title: "Simge",
      name: "simge",
      type: FormItemTypes.input
    },
    {
      title: "Netsis Kodu",
      name: "tcmbId",
      type: FormItemTypes.input
    }
  ] as IFormItem[];


  return (
    <div className="container-fluid">

      <DynamicModal
        isShownig={isModalShowing}
        title="Döviz Tipi Ekle"
        api={api.dovizTipi}
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
                  baseApi={api.dovizTipi}
                  columns={columns}
                  key={"Döviz Tipleri"}
                  ref={myTable}
                  rowSelectable={false}
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
