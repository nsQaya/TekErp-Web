import { createRef } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import api from "../../utils/api/index";
import { IIhtiyacPlanlamaRapor } from "../../utils/types/planlama/IIhtiyacPlanlamaRapor";
import AppTable, { ITableRef } from "../../components/AppTable";
import { useNavigate } from "react-router-dom";
import { ColumnProps } from "primereact/column";

export default () => {
  const myTable = createRef<ITableRef<IIhtiyacPlanlamaRapor>>();

  const navigate= useNavigate();

  const columns:  ColumnProps[] = [
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
      header: "Tarih",
      field: "tarih",
      body: (row) => row.tarih
        ? new Date(row.tarih).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    
    },
    {
      header: "Proje Kodu",
      field: "projeKodu",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Proje Açıklama",
      field: "projeAciklama",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Plasiyer Kodu",
      field: "plasiyerKodu",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Plasiyer Açıklama",
      field: "plasiyerAciklama",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Mamül Adı",
      field: "mamulAdi",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Stok Kodu",
      field: "stokKodu",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Stok Adı",
      field: "stokAdi",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Miktar",
      field: "miktar",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Ölçü Birimi",
      field: "olcuBirim",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Belge No",
      field: "belgeNo",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Çıkış Miktar",
      field: "cikisMiktar",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Toplam İhtiyaç",
      field: "yuruyenIhtiyac",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Bakiye",
      field: "bakiye",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Toplam Talep Miktarı",
      field: "stokTalepMiktari",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Toplam Sipariş Miktarı",
      field: "stokSiparisMiktari",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    {
      header: "Net Gereksinim",
      field: "yuruyenBakiye",
      sortable: true,
      style: {
        fontSize: "9px",
      },
    },
    // {
    //   name: "işlemler",
    //   cell: (row) => {
    //     return (
    //       <>
    //         <button className="btn btn-warning ms-1" onClick={(e)=>[e.preventDefault(), navigate(`/fatura/ambarfisiekle?proje=${row.projeKodu}&unit=${row.plasiyerKodu}`)]}>
    //           <i className="ti-eye"></i>
    //         </button>
    //       </>
    //     );
    //   },
    // },
  ];

  const rowStyles  = (data: IIhtiyacPlanlamaRapor) => {
    if (data.yuruyenBakiye > 0) {
      return 'row-acik-yesil';
    } else if (data.bakiye < data.yuruyenIhtiyac && data.bakiye + data.stokSiparisMiktari + data.stokTalepMiktari >= data.yuruyenBakiye) {
      return 'row-mavi';
    } else if (data.yuruyenIhtiyac < 0 && data.stokSiparisMiktari + data.stokTalepMiktari < data.yuruyenBakiye) {
      return 'row-kirmizi';
    } else if (data.cikisMiktar > 0 && data.cikisMiktar <= data.miktar && data.belgeNo !== undefined) {
      return 'row-sari';
    } else if (data.miktar <= data.cikisMiktar) {
      return 'row-koyu-yesil';
    } else {
      return '';
    }
  };

  return (
    <div className="container-fluid">
      <AppBreadcrumb title="İhtiyaç Planlama" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-40">
              <AppTable
                  baseApi={api.ihtiyacPlanlamaRapor}
                  columns={columns}
                  key={"ihtiyacPlanlama"}
                  ref={myTable}
                  rowSelectable={false}
                  rowStyles={rowStyles}
                  // rowStyles={conditionalRowStyles}
                  rowPerPageOptions={[10, 50, 100, 250, 500, 1000, 10000]}
                  appendHeader={() => {
                    return (
                      <>
                      <button
                        type="button"
                        className="btn btn-info btn-rounded m-t-10 float-end text-white"
                        onClick={(e)=>[e.preventDefault(), navigate(`/fatura/ambarcikisfisi`)]}
                        >
                      Ambar Çıkış Fişi
                      </button>
                      <button
                      type="button"
                      disabled
                      className="btn btn-info btn-rounded m-t-10 float-end text-white"
                      onClick={(e)=>[e.preventDefault(), navigate(`/fatura/ambarcikisfisi`)]}
                      >
                    Depolar Arası Transfer
                    </button>
                    </>
                    );
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
