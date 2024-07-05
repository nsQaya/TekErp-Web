import { createRef, useCallback,      useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes,  IFormItem } from "../../../modals/DynamicModal";
import { IProje } from "../../../utils/types/tanimlamalar/IProje";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";

export default () => {
  const myTable = createRef<ITableRef<IProje>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem]= useState<IProje>();
  


  const onSuccess = () => {
    if(selectedItem){
      alert("Başarıyla güncellendi !");
    }else{
      alert("Başarıyla eklendi !");
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };

  const deleteItem= useCallback(async (item: IProje)=>{
    if(!window.confirm("Emin misin ?")) return;
    await api.proje.delete(item.id as number);
    myTable.current?.refresh();
  },[])

  const columns: ColumnProps[] = [
   
    {
      header: " Proje Kodu",
      field: "kodu",
      sortable: true,
      filter: true
    },
    {
      header: "Açıklama",
      field: "aciklama",
      sortable: true,
      filter: true
    },
    {
      header: "İşlemler",
      body: (row) => {
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
      title: "Kodu",
      name: "kodu",
      type: FormItemTypes.input
    },
    {
      title: "Açıklama",
      name: "aciklama",
      type: FormItemTypes.input
    }
  ] as IFormItem[];


  
  return (
    <div className="container-fluid">

      <DynamicModal
        isShownig={isModalShowing}
        title="Proje Ekle"
        api={api.proje}
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
                  baseApi={api.proje}
                  columns={columns}
                  key={"Projeler"}
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
