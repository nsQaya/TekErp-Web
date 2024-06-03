import { createRef, useCallback,   useEffect,   useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import { TableColumn } from "react-data-table-component";
import api from "../../../utils/api";


import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes, FormSelectItem, IFormItem } from "../../../modals/DynamicModal";
import { IIlce } from "../../../utils/types/tanimlamalar/IIlce";



export default () => {
  const myTable = createRef<ITableRef<IIlce>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem]= useState<IIlce>();

  const [iller, setiller] = useState<FormSelectItem[]>();


  const fetchCountries= useCallback(async()=>{
    const { data: {value: {items}} } = await api.il.getAll(0,1000);
    setiller(items.map(x=>({label: x.adi, value: String(x.id)})))
  },[])

  useEffect(()=>{
    fetchCountries();
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

  const deleteItem= useCallback(async (item: IIlce)=>{
    if(!window.confirm("Emin misin ?")) return;
    await api.ilce.delete(item.id);
    myTable.current?.refresh();
  },[])


  const columns: TableColumn<IIlce>[] = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "İl",
      selector: (row) => row.il.adi,
      sortable: true,
    },
    {
      name: "Plaka Kodu",
      selector: (row) => row.il.plakaKodu,
      sortable: true,
    },
    {
      name: "İlçe Kodu",
      selector: (row) => row.ilceKodu,
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
      title: "il",
      name: "ilId",
      type: FormItemTypes.select,
      options: iller
    },
    {
      title: "Adı",
      name: "adi",
      type: FormItemTypes.input
    },
    {
      title: "İlçe Kodu",
      name: "ilceKodu",
      type: FormItemTypes.input
    }
  ] as IFormItem[];


  return (
    <div className="container-fluid">
      
      <DynamicModal 
        isShownig={isModalShowing} 
        title="ilçe Ekle" 
        api={api.ilce} 
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
                  baseApi={api.ilce}
                  columns={columns}
                  key={"İlçeler"}
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
