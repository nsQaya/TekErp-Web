import { createRef, useCallback,  useState } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import api from "../../utils/api";
import { IStok } from "../../utils/types/stok/IStok";
import CreateOrEditModal from "../../modals/stok/createOrEdit";
import AppTable, { ITableRef } from "../../components/AppTable";
import { IStokKartiWithDetail } from "../../utils/types/stok/IStokKartiWithDetail";
import { baseURL } from "../../utils/config";
import { convertArrayOfObjectsToExcel } from "../../utils/excel";
import { saveAs } from 'file-saver';
import { ColumnProps } from "primereact/column";


export default () => {
  const myTable = createRef<ITableRef<IStokKartiWithDetail>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem]= useState<IStok>();
  const [selectedStokIDS, setSelectedStokIDS]= useState<number[]>([]);


  const onDone= useCallback(()=>{
    myTable?.current?.refresh();
    setModalShowing(false);
  },[]);
  
  const deleteItem= useCallback(async (item: IStok)=>{
    if(!window.confirm("Emin misin ?")) return;
    await api.stok.delete(item.id as number);
    myTable.current?.refresh();
  },[])

  const writeBarkods= useCallback(async()=>{
    const {data} = await api.stok.getBarkod(selectedStokIDS);

    if(!data.status){
      return alert("Barkod oluşturulamadı")
    }

    location.href=baseURL+"/assets/"+data.value.url+".prf";

  },[selectedStokIDS])

  
  const columns:  ColumnProps[] = [
    {
      field: "id",
      header: "#",
      sortable: true
    },
    {
      field: "kodu",
      header:"Kodu",
      filter:true,
      sortable: true,
    },
    {
      field: "adi",
      header:"Adı",
      filter:true,
      sortable: true,
    },
    {
      field: "ingilizceIsim",
      header:"İngilizce Adı",
      filter:true,
      sortable: true,
    },
    {
      field: "stokGrupKodu.adi",
      header:"Grup Kodu",
      filter:true,
      sortable: true,
    },
    {
      field: "stokKod1.adi",
      header:"Kod 1",
      filter:true,
      sortable: true,
    },
    {
      header: "işlemler",
      style: {minWidth:"150px"},
      body: (row) => {
        return (
          <>
            <button className="btn btn-info ms-1" onClick={(e)=>[e.preventDefault(),setSelectedItem(row), setModalShowing(true)]}>
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

  const onExport= useCallback(()=>{
    if(!myTable.current?.data) return;

    const myColumns= columns.filter(x=>x.header!="işlemler");
    let blob = convertArrayOfObjectsToExcel<IStokKartiWithDetail>(myColumns, myTable.current.data);
    saveAs(blob, 'data.xlsx');
  },[myTable])

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
              <button
                type="button"
                className="btn btn-info btn-rounded m-t-10 float-end text-white ms-3"
                onClick={(e) => [e.preventDefault(), onExport()]}
              >
                Çıktı Al
              </button>

              <button
                type="button"
                className="btn btn-info btn-rounded m-t-10 float-end text-white ms-3"
                onClick={(e) => [e.preventDefault(), setModalShowing(true)]}
              >
                Yeni Stok Ekle
              </button>

              <button 
                type="button" 
                className="btn btn-info btn-rounded m-t-10 float-end text-white" 
                onClick={(e) => [e.preventDefault(), writeBarkods()]}
                disabled={selectedStokIDS.length <= 0}
              >
                Barkod Yazdır
              </button>

              <div className="table-responsive m-t-40">
                <AppTable
                    baseApi={api.stokWithDetail}
                    columns={columns}

                    key={'Stoklar'}
                    ref={myTable}
                    rowSelectable={true}
                    onChangeSelected={(selected)=>setSelectedStokIDS(selected.selectedRows.map(x=>Number(x.stokKarti.id)))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
