import { createRef,  useState, useRef } from "react";
import { ColumnProps } from "primereact/column";
import { Toast } from "primereact/toast";
import AppTable, { ITableRef } from "../../components/AppTable";
import api from "../../utils/api";
import DynamicModal, { FormItemTypes, IFormItem } from "../../modals/DynamicModal";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import { ISiparisAcmaKapama } from "../../utils/types/fatura/ISiparisAcmaKapama";
import { dateFilterTemplate } from "../../utils/helpers/CalendarHelper";
import { onayliMiDDFilterTemplate } from "../../utils/helpers/dtMultiSelectHelper";

export default () => {
  const myTable = createRef<ITableRef<ISiparisAcmaKapama>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ISiparisAcmaKapama | undefined>();
  const toast = useRef<Toast>(null);

  
  const onSuccess = () => {
 
  
    if (selectedItem) {
      toast.current?.show({ severity: "success", summary: "Başarılı", detail: "Başarıyla güncellendi !" });
    } else {
      toast.current?.show({ severity: "success", summary: "Başarılı", detail: "Başarıyla eklendi !" });
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };
  

  const columns: ColumnProps[] = [
    
    {
      header: "Sipariş Numarası",
      field: "belge.no",
      sortable: true,
      filter: true
    },
   
    { header: "Durum", 
      field: "durum", 
      sortable: true,
      dataType:"numeric", 
      filter: true , filterElement:onayliMiDDFilterTemplate,
      body: (rowData : ISiparisAcmaKapama) => (rowData.durum === 1 ? "Evet" : "Hayır")
     },
    {
      header: "Miktar", 
      field: "miktar", 
      sortable: true,
      filter: true,
    },
    {
      header: "Kalan Miktar", 
      field: "kalanMiktar", 
      sortable: true,
      filter: true,
     
    },
    {
      header: "Stok Kodu",
      field: "stokKarti.kodu",
      sortable: true,
      filter: true,
    },
    {
      header: "Stok Adı",
      field: "stokKarti.adi",
      sortable: true,
      filter: true
    },
    { header: "Teslim Tarihi", field: "istenilenTeslimTarihi", dataType: "date", sortable: true, filter: true, filterElement:dateFilterTemplate,
      body: (row: ISiparisAcmaKapama) =>
        row.istenilenTeslimTarihi
          ? new Date(row.istenilenTeslimTarihi).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
    },
    {
      header: "Cari İsim",
      field: "siparis.cari.adi",
      sortable: true,
      filter: true
    },
    {
      header: "İşlemler",
      body: (row) => {
        return (
          <>
            <button className="btn btn-info ms-1" onClick={(e) => {
              e.preventDefault();
              setSelectedItem(row);
              setModalShowing(true);
            }}>
              <i className="ti-pencil"></i>
            </button>
          </>
        );
      }
    },
  ];

  const modalItems = [
    {
      name: "id",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      title: "Revize Teslim Tarihi",
      name: "teslimTarihi",
      type: FormItemTypes.date,
    },
    {
      title: "Sipariş Durumu", // Başlık
      name: "durum", // Alan adı
      type: FormItemTypes.boolean, // Select tipi
    },
    //{
     // title: "Sipariş Durumu", // Başlık
     // name: "miktar", // Alan adı
      //type: FormItemTypes.input, // Select tipi
     // readonly:true
    //},
    
    
  ] as IFormItem[]

  const validateItems = (formItems: IFormItem[] | undefined) => {
    if (!formItems) {
      return "Form verileri yüklenemedi."; 
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bugünün sıfır saatine odaklan.
  
    const teslimTarihi = formItems.find(item => item.name === "teslimTarihi")?.value;
  
    // İstenilen Teslim Tarihi Kontrolü
    if (!teslimTarihi) {
      return "Revize teslim tarihini girin.";
    }
  
    const teslimTarihiDate = new Date(teslimTarihi);
    if (isNaN(teslimTarihiDate.getTime())) {
      return "Geçersiz tarih formatı.";
    }
  
    return null;
  };
  

  return (
    <div className="container-fluid">
      <Toast ref={toast} />
      <DynamicModal
        isShownig={isModalShowing}
        title="Ekle"
        api={api.siparisStokHareketAcKapa}
        //apiMethodName="ackapa"
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
        validator={validateItems}
      />
      <AppBreadcrumb title="Sipariş Açma Kapama" />
<div className="row">
  <div className="col-12">
    <div className="card">
      <div className="card-body">
        <div className="table-responsive m-t-40">
          <AppTable
            baseApi={api.siparisStokHareket}
            columns={columns}
            key={"SiparisAcmaKapama"}
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
