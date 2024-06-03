import { createRef, useCallback,  useState } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import  { TableColumn } from "react-data-table-component";
import api from "../../utils/api";
import AppTable, { ITableRef } from "../../components/AppTable";
import { IAmbarFisi } from "../../utils/types/fatura/IAmbarFisi";
import { useNavigate } from "react-router-dom";


export default () => {
  const myTable = createRef<ITableRef<IAmbarFisi>>();
  const [, setSelectedItem]= useState<IAmbarFisi>();
  const navigate= useNavigate();
  
  const deleteItem= useCallback(async (item: IAmbarFisi)=>{
    if(!window.confirm("Emin misin ?")) return;
    await api.ambarFisi.delete(item.id as number);
    myTable.current?.refresh();
  },[])

  const columns: TableColumn<IAmbarFisi>[] = [
    {
      name: "Belge No",
      selector: (row: IAmbarFisi) => row.belge.no,
      sortable: true,
    },
    {
      name: "Tarih",
      selector: (row: IAmbarFisi) => row.belge.tarih ? new Date(row.belge.tarih).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }): "",
      sortable: true,
    },
    {
      name: "Hareket Türü",
      selector: (row: IAmbarFisi) => row.ambarHareketTur,
      sortable: true,
    },
    {
      name: "Çıkış Yeri",
      selector: (row: IAmbarFisi) => row.cikisYeri,
      sortable: true,
    },
    {
      name: "işlemler",
      cell: (row: IAmbarFisi) => {
        return (
          <>
            <button className="btn btn-info ms-1" onClick={(e)=>[e.preventDefault(),setSelectedItem(row)]}>
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
      <AppBreadcrumb title="Stoklar" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Data Export</h4>
              <h6 className="card-subtitle">
                Export data to Copy, CSV, Excel, PDF & Print
              </h6>
                 <button className="btn btn-info btn-rounded m-t-10 float-end text-white" onClick={(e)=>[e.preventDefault(), navigate(`/fatura/ambarcikisfisi`)]}>
                Yeni
              </button>
              <div className="table-responsive m-t-40">
                <AppTable
                    baseApi={api.ambarFisi}
                    columns={columns}
                    key={'AmbarCikisFisi'}
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
