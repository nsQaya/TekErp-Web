import { createRef } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import { TableColumn } from "react-data-table-component";
import api from "../../utils/api/index";
import { IIhtiyacPlanlama } from "../../utils/types/planlama/IIhtiyacPlanlama";
import AppTable, { ITableRef } from "../../components/AppTable";

export default () => {
  const myTable = createRef<ITableRef>();

  const columns: TableColumn<IIhtiyacPlanlama>[] = [
    {
      name: "Tarih",
      selector: (row) =>
        row.tarih
          ? new Date(row.tarih).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
      sortable: false,
      width: "80px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Proje Kodu",
      selector: (row) => row.projeKodu ?? "",
      sortable: false,
      width: "70px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Proje Açıklama",
      selector: (row) => row.uniteKodu ?? "",
      sortable: false,
      width: "100px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Plasiyer Kodu",
      selector: (row) => row.mamulAdi ?? "",
      sortable: false,
      width: "70px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Plasiyer Açıklama",
      selector: (row) => row.stokKartiId ?? "",
      sortable: false,
      width: "100px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Mamül Adı",
      selector: (row) => row.mamulAdi ?? "",
      sortable: false,
      width: "100px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Stok Kodu",
      selector: (row) => row.stokKartiKodu ?? "",
      sortable: false,
      width: "100px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Stok Adı",
      selector: (row) => row.stokKartiAdi ?? "",
      sortable: false,
      width: "250px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Miktar",
      selector: (row) => row.miktar ?? 0,
      sortable: false,
      width: "50px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Ölçü Birimi",
      selector: (row) => row.stokOlcuBirimString ?? "",
      sortable: false,
      width: "70px",
      style: {
        fontSize: "9px",
      },
    },
  ];

  return (
    <div className="container-fluid">
      <AppBreadcrumb title="İhtiyaç Planlama" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Data Export</h4>
              <h6 className="card-subtitle">
                Export data to Copy, CSV, Excel, PDF & Print
              </h6>
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.ihtiyacPlanlama}
                  columns={columns}
                  key={"ihtiyacPlanlama"}
                  ref={myTable}
                  
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
