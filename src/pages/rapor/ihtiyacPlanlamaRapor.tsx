import { createRef } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import { TableColumn } from "react-data-table-component";
import api from "../../utils/api/index";
import { IIhtiyacPlanlamaRapor } from "../../utils/types/planlama/IIhtiyacPlanlamaRapor";
import AppTable, { ITableRef } from "../../components/AppTable";

export default () => {
  const myTable = createRef<ITableRef>();

  const columns: TableColumn<IIhtiyacPlanlamaRapor>[] = [
    // {
    //   name: "#",
    //   selector: (row) => row.id ?? 0,
    //   sortable: false,
    //   width:'50px',
    //   style: {
    //     fontSize: '9px',
    // },
    //},
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
      selector: (row) => row.projeAciklama ?? "",
      sortable: false,
      width: "100px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Plasiyer Kodu",
      selector: (row) => row.plasiyerKodu ?? "",
      sortable: false,
      width: "70px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Plasiyer Açıklama",
      selector: (row) => row.plasiyerAciklama ?? "",
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
      selector: (row) => row.stokKodu ?? "",
      sortable: false,
      width: "100px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Stok Adı",
      selector: (row) => row.stokAdi ?? "",
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
      selector: (row) => row.olcuBirim ?? 0,
      sortable: false,
      width: "70px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Belge No",
      selector: (row) => row.belgeNo ?? "",
      sortable: false,
      width: "120px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Çıkış Miktar",
      selector: (row) => row.cikisMiktar ?? 0,
      sortable: false,
      width: "50px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Toplam İhtiyaç",
      selector: (row) => row.yuruyenIhtiyac ?? 0,
      sortable: false,
      width: "50px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Bakiye",
      selector: (row) => row.bakiye ?? 0,
      sortable: false,
      width: "50px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Toplam Talep Miktarı",
      selector: (row) => row.stokTalepMiktari ?? 0,
      sortable: false,
      width: "50px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Toplam Sipariş Miktarı",
      selector: (row) => row.stokSiparisMiktari ?? 0,
      sortable: false,
      width: "50px",
      style: {
        fontSize: "9px",
      },
    },
    {
      name: "Net Gereksinim",
      selector: (row) => row.yuruyenBakiye ?? 0,
      sortable: false,
      width: "50px",
      style: {
        fontSize: "9px",
      },
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row: IIhtiyacPlanlamaRapor) =>
        row.yuruyenBakiye > 0,
      style: {
        backgroundColor: "#01c0c8", //AcikYesil
        color: "white",
      },
    },
    {
      when: (row: IIhtiyacPlanlamaRapor) =>
         row.bakiye < row.yuruyenIhtiyac && row.bakiye+row.stokSiparisMiktari+row.stokTalepMiktari >= row.yuruyenBakiye,
      style: {
        backgroundColor: "#03a9f3", //Mavi
        color: "white",
      },
    },
    {
      when: (row: IIhtiyacPlanlamaRapor) =>
         row.yuruyenIhtiyac < 0 && row.stokSiparisMiktari+row.stokTalepMiktari< row.yuruyenBakiye,
      style: {
        backgroundColor: "#e46a76", //Kırmızı
        color: "white",
      },
    },
    {
      when: (row: IIhtiyacPlanlamaRapor) =>
         row.cikisMiktar > 0 && row.cikisMiktar <= row.miktar && row.belgeNo != undefined ,
      style: {
        backgroundColor: "#e46a76", //Sarı
        color: "white",
      },
    },
    {
      when: (row: IIhtiyacPlanlamaRapor) =>
         row.miktar <= row.cikisMiktar ,
      style: {
        backgroundColor: "#00c292", // Koyu Yeşil
        color: "white",
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
                  baseApi={api.ihtiyacPlanlamaRapor}
                  columns={columns}
                  key={"ihtiyacPlanlama"}
                  ref={myTable}
                  rowStyles={conditionalRowStyles}
                  rowPerPageOptions={[10, 50, 100,250,500,1000,10000]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
