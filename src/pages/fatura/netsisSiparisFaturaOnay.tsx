import { createRef, useCallback, useState, useRef, useEffect } from "react";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppTable, { ITableRef } from "../../components/AppTable";

import api from "../../utils/api";
import DynamicModal, { FormItemTypes,  IFormItem } from "../../modals/DynamicModal";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import { INetsisSiparisFaturaOnay } from "../../utils/types/fatura/INetsisSiparisFaturaOnay";
import { dateFilterTemplate } from "../../utils/helpers/CalendarHelper";

export default () => {
  const myTable = createRef<ITableRef<INetsisSiparisFaturaOnay>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<INetsisSiparisFaturaOnay | undefined>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<INetsisSiparisFaturaOnay | null>(null);

  const onSuccess = () => {
    if (selectedItem) {
      toast.current?.show({ severity: "success", summary: "Başarılı", detail: "Başarıyla güncellendi !" });
    } else {
      toast.current?.show({ severity: "success", summary: "Başarılı", detail: "Başarıyla eklendi !" });
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };

  const confirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        await api.netsisSiparisFaturaOnay.delete(itemToDelete.id as number);
        myTable.current?.refresh();
        toast.current?.show({ severity: "success", summary: "Başarılı", detail: "Başarıyla silindi !" });
      } catch (error) {
        console.error("Silme işleminde hata:", error);
        toast.current?.show({ severity: "error", summary: "Hata", detail: "Silme işleminde hata oluştu !" });
      } finally {
        setItemToDelete(null);
        setConfirmVisible(false);
      }
    }
  }, [itemToDelete]);

  const deleteItem = (item: INetsisSiparisFaturaOnay) => {
    setItemToDelete(item);
    setConfirmVisible(true);
  };

  useEffect(() => {
    if (!confirmVisible && !itemToDelete) {
      myTable.current?.refresh();
    }
  }, [confirmVisible, itemToDelete]);

  const columns: ColumnProps[] = [
    { header: "Sipariş Tarih", field: "siparisTarih", dataType: "date", sortable: true, filter: true, filterElement:dateFilterTemplate,
      body: (row: INetsisSiparisFaturaOnay) =>
        row.siparisTarih
          ? new Date(row.siparisTarih).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
    }, 
    { header: "Sipariş Belge No", field: "siparisBelgeNo", sortable: true, filter: true },
    { header: "Sipariş Cari Kodu", field: "siparisCariKodu", sortable: true, filter: true },
    { header: "Sipariş Cari İsim", field: "siparisCariIsim", sortable: true, filter: true },
    { header: "Stok Kodu", field: "stokKodu", sortable: true, filter: true },
    { header: "Stok Adı", field: "stokAdi", sortable: true, filter: true },
    { header: "Sipariş Miktarı", field: "siparisMiktari", sortable: true, filter: true },
    { header: "Sipariş Ölçü Birim", field: "siparisOlcuBirim", sortable: true, filter: true },
    { header: "Sipariş Net Fiyat", field: "siparisNetFiyat", sortable: true, filter: true },
    { header: "Sipariş Brüt Fiyat", field: "siparisBrutFiyat", sortable: true, filter: true },
    { header: "Sipariş İskonto", field: "siparisIskonto", sortable: true, filter: true },
    { header: "Sipariş Kur", field: "siparisKur", sortable: true, filter: true },
    { header: "Sipariş Döviz Tip", field: "siparisDovizTip", sortable: true, filter: true },
    { header: "Fatura Tarih", field: "faturaTarih", dataType: "date", sortable: true, filter: true, filterElement:dateFilterTemplate,
      body: (row: INetsisSiparisFaturaOnay) =>
        row.siparisTarih
          ? new Date(row.siparisTarih).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
    }, 
    { header: "Fatura Fiş No", field: "faturaFisno", sortable: true, filter: true },
    { header: "Fatura Miktar", field: "faturaMiktar", sortable: true, filter: true },
    { header: "Fatura Ölçü Birim", field: "faturaOlcuBirim", sortable: true, filter: true },
    { header: "Fatura Net Fiyat", field: "faturaNetFiyat", sortable: true, filter: true },
    { header: "Fatura Brüt Fiyat", field: "faturaBrutFiyat", sortable: true, filter: true },
    { header: "Fatura Kur", field: "faturaKur", sortable: true, filter: true },
    { header: "Fatura Döviz Tip", field: "faturaDovizTip", sortable: true, filter: true },
    { header: "Fatura Net Fiyat TL", field: "faturaNetFiyatTL", sortable: true, filter: true },
    { header: "Fatura Brüt Fiyat TL", field: "faturaBrutFiyatTL", sortable: true, filter: true },
    { header: "Fatura Döviz Tip TL", field: "faturaDovizTipTL", sortable: true, filter: true },
    { header: "Fatura Tutar", field: "faturaTutar", sortable: true, filter: true },
    {
      header: "İşlemler",
      body: (row) => {
        return (
          <>
          {/* {JSON.stringify(row.ilId)} */}
            <button className="btn btn-info ms-1" onClick={(e) => {
              e.preventDefault();
              setSelectedItem(row);
              setModalShowing(true);
            }}>
              <i className="ti-pencil"></i>
            </button>
            <button className="btn btn-danger ms-1"  onClick={(e) => {
              e.preventDefault();
              deleteItem(row);
            }}>
              <i className="ti-trash"></i>
            </button>
          </>
        );
      }
    },
  ];

  const modalItems = [
      {
        title: "Sipariş Tarih",
        name: "siparisTarih",
        type: FormItemTypes.date,
        columnSize: 4,
        readonly: true,

      },
      {
        title: "Sipariş Belge No",
        name: "siparisBelgeNo",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Sipariş Cari Kodu",
        name: "siparisCariKodu",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Sipariş Cari İsim",
        name: "siparisCariIsim",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Stok Kodu",
        name: "stokKodu",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Stok Adı",
        name: "stokAdi",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Sipariş Miktarı",
        name: "siparisMiktari",
        type: FormItemTypes.inputNumber,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Sipariş Ölçü Birim",
        name: "siparisOlcuBirim",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Sipariş Net Fiyat",
        name: "siparisNetFiyat",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Sipariş Brüt Fiyat",
        name: "siparisBrutFiyat",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Sipariş İskonto",
        name: "siparisIskonto",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Sipariş Kur",
        name: "siparisKur",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Sipariş Döviz Tip",
        name: "siparisDovizTip",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Fatura Tarih",
        name: "faturaTarih",
        type: FormItemTypes.date,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Fatura Fiş No",
        name: "faturaFisno",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Fatura Miktar",
        name: "faturaMiktar",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Fatura Ölçü Birim",
        name: "faturaOlcuBirim",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Fatura Net Fiyat",
        name: "faturaNetFiyat",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Fatura Brüt Fiyat",
        name: "faturaBrutFiyat",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Fatura Kur",
        name: "faturaKur",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Fatura Döviz Tip",
        name: "faturaDovizTip",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Fatura Net Fiyat TL",
        name: "faturaNetFiyatTL",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Fatura Brüt Fiyat TL",
        name: "faturaBrutFiyatTL",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Fatura Döviz Tip TL",
        name: "faturaDovizTipTL",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Fatura Tutar",
        name: "faturaTutar",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Kayıt Yapan Kullanıcı",
        name: "kayitYapanKullanici",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Oran",
        name: "oran",
        type: FormItemTypes.input,
        columnSize: 4,
        readonly: true,
      },
      {
        title: "Onay",
        name: "onay",
        type: FormItemTypes.boolean,
        columnSize: 4,
        readonly: false,
      },
      {
        title: "Açıklama",
        name: "aciklama",
        type: FormItemTypes.input,
        columnSize: 8,
        readonly: false,
      }
    
  ] as IFormItem[];

  const rowStyles = (data: INetsisSiparisFaturaOnay) => {
    //koyu yeşil
    //sarı
    //kırmızı
    //mavi
    //açık yeşil
    debugger;
    if (data.oran! <= data.faturaTutar!) {
      return "row-koyu-yesil";
    } else if (
      data.faturaTutar! > 0
    ) {
      return "row-sari";
    }
    
  };
  return (
    <div className="container-fluid">
      <Toast ref={toast} />
      <ConfirmDialog
        visible={confirmVisible}
        onHide={() => setConfirmVisible(false)}
        message="Silmek istediğinizden emin misiniz?"
        header="Onay"
        icon="pi pi-exclamation-triangle"
        accept={confirmDelete}
        reject={() => setConfirmVisible(false)}
        acceptLabel="Evet"
        rejectLabel="Hayır"
      />
      <DynamicModal
        isShownig={isModalShowing}
        title=""
        api={api.netsisSiparisFaturaOnay}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
        classEki="4"
      />
      <AppBreadcrumb title="" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-4">
                <AppTable
                scrollHeight="40rem"
                  baseApi={api.netsisSiparisFaturaOnay}
                  columns={columns}
                  key={"NetsisSiparisFaturaOnay"}
                  ref={myTable}
                  rowStyles={rowStyles}
                  rowSelectable={false}
                  appendHeader={() => {
                    return (
                      <Button className="p-button-secondary" visible={false} onClick={(e) => {
                        e.preventDefault();
                        setSelectedItem(undefined);
                        setModalShowing(true);
                      }}>
                        Yeni
                      </Button>
                    )
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


