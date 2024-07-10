import { createRef, useCallback,  useState } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import api from "../../utils/api";
import AppTable, { ITableRef } from "../../components/AppTable";
import { IAmbarFisi } from "../../utils/types/fatura/IAmbarFisi";
import { useNavigate } from "react-router-dom";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";


export default () => {
  const myTable = createRef<ITableRef<IAmbarFisi>>();
  const [, setSelectedItem]= useState<IAmbarFisi>();
  const navigate= useNavigate();
  
  const deleteItem= useCallback(async (item: IAmbarFisi)=>{
    if(!window.confirm("Emin misin ?")) return;
    await api.belge.delete(item.belgeId as number);
    await api.ambarFisi.delete(item.id as number);
    myTable.current?.refresh();
  },[])

  const columns: ColumnProps[] = [
    {
      field: "id",
      header: "#",
      sortable: false,
    },
    {
      field: "belgeId",
      header: "#",
      sortable: false,
    },
    {
      field: "belge.no",
      header: "Belge No",
      sortable: true,
      filter: true
      
    },
    {
      header: "Tarih",
      field: "belge.tarih",
      dataType:"date",
      sortable: true,
      filter: true,
      body: (row: IAmbarFisi) =>
        row.belge!.tarih
          ? new Date(row.belge!.tarih).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
    },
    {
      header: "Hareket Türü",
      field: "ambarHareketTur",
      sortable: false,
      filter: true
    },
    {
      header: "Çıkış Yeri",
      field: "cikisYeri",
      sortable: false,
    },
    {
      header: "İşlemler",
      body: (row: IAmbarFisi) => (
        
        <>
          <button
            className="btn btn-info ms-1"
            onClick={(e) => {
              e.preventDefault();
              setSelectedItem(row);
              navigate(`/fatura/ambarcikisfisi?belgeId=${row.belgeId}`)
              // setModalShowing(true);
            }}
          >
            <i className="ti-pencil"></i>
          </button>
          <button
            className="btn btn-danger ms-1"
            onClick={(e) => {
              e.preventDefault();
              deleteItem(row);
            }}
          >
            <i className="ti-trash"></i>
          </button>
        </>
        
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <AppBreadcrumb title="Ambar Çıkış Fişi Listesi" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-40">
                <AppTable
                    baseApi={api.ambarFisi}
                    columns={columns}
                    key={"AmbarCikisFisi"}
                    ref={myTable}
                    rowSelectable={false}
                    appendHeader={() => {
                      return (
                      <Button type="button" severity="help" onClick={(e)=>[e.preventDefault(), navigate(`/fatura/ambarcikisfisi`)]}>
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
