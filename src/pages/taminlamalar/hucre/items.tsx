import { createRef, useCallback,   useEffect,   useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes, FormSelectItem, IFormItem } from "../../../modals/DynamicModal";
import { IHucre } from "../../../utils/types/tanimlamalar/IHucre";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";




export default () => {
  const myTable = createRef<ITableRef<IHucre>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem]= useState<IHucre>();

  const [depolar, setdepolar] = useState<FormSelectItem[]>();


  const fetchDepos= useCallback(async()=>{
    const { data: {value: {items}} } = await api.depo.getAll(0,1000);
    setdepolar(items.map(x=>({label: x.kodu, value: String(x.id)})))
  },[])

  useEffect(()=>{
    fetchDepos();
  },[]);

  const onSuccess = () => {
    if(selectedItem){
      alert("Başarıyla güncellendi !");
    }else{
      alert("Başarıyla eklendi !");
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };

  const deleteItem= useCallback(async (item: IHucre)=>{
    if(!window.confirm("Emin misin ?")) return;
    await api.hucre.delete(item.id as number);
    myTable.current?.refresh();
  },[])


  const columns: ColumnProps[] = [
   
    {
      header: "Hücre Kodu",
      field: "kodu",
      sortable: true,
      filter: true
    },
    {
      header: "Depo Kodu",
      field: "depo.kodu",
      sortable: true,
      filter: true
    },
    {
      header: "işlemler",
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
      name: "id",
      type: FormItemTypes.input,
      hidden:true,
    },
    {
      title: "Depo Kodu",
      name: "depoId",
      type: FormItemTypes.select,
      options: depolar
    },
    {
      title: "Hücre Kodu",
      name: "kodu",
      type: FormItemTypes.input
    }
  ] as IFormItem[];

  return (
    <div className="container-fluid">
        <DynamicModal 
        isShownig={isModalShowing} 
        title="Hücre Ekle" 
        api={api.hucre} 
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
              <div className="row">
              <div className="col-md-3">
            </div>
            </div>
              <div className="table-responsive m-t-40">
           
                <AppTable
                  baseApi={api.hucre}
                  columns={columns}
                  key={"Hücreler"}
                  ref={myTable}
                  rowSelectable={false}
                  rowPerPageOptions={[10,25,50,100]}
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
