import { createRef,  useState, useRef } from "react";
import { ColumnProps } from "primereact/column";
import { Toast } from "primereact/toast";
import AppTable, { ITableRef } from "../../components/AppTable";
import api from "../../utils/api";
import DynamicModal, { FormItemTypes, IFormItem } from "../../modals/DynamicModal";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import { ISiparis } from "../../utils/types/fatura/ISiparis";
import { dateFilterTemplate } from "../../utils/helpers/CalendarHelper";
import { ISiparisIthalatEkBilgiler } from "../../utils/types/fatura/ISiparisIthalatEkBilgiler";




export default () => {
  const myTable = createRef<ITableRef<ISiparis>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ISiparisIthalatEkBilgiler | undefined>();
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
    {
      header: "Cari Kodu",
      field: "cari.kodu",
      sortable: true,
      filter: true
    },
    {
      header: "Cari İsim",
      field: "cari.adi",
      sortable: true,
      filter: true
    },
    { header: "Tarih", field: "siparis.belge.tarih", dataType: "date", sortable: true, filter: true, filterElement:dateFilterTemplate,
      body: (row: ISiparis) =>
        row.belge?.tarih
          ? new Date(row.belge?.tarih).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
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
      name: "cikisEvrakTarihi",
      type: FormItemTypes.date,
      title: "Çıkış Evrak Tarihi",
      
    },
    {
      name: "gumrukVarisTarihi",
      type: FormItemTypes.date,
      title: "Gümrük Varış Tarihi",
      
    },
    {
      name: "varisEvraklariTarihi",
      type: FormItemTypes.date,
      title: "Varış Evrakları Tarihi",
      
    },
    {
      name: "tasiyiciFirma",
      type: FormItemTypes.input,
      title: "Taşıyıcı Firma",
    },
    
  ] as IFormItem[]

  return (
    <div className="container-fluid">
      <Toast ref={toast} />
      <DynamicModal
        isShownig={isModalShowing}
        title="Ekle"
        api={api.siparisIthalatEkBilgiler}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
        
      />
      <AppBreadcrumb title="İthalat Ek Bilgiler" />
<div className="row">
  <div className="col-12">
    <div className="card">
      <div className="card-body">
        <div className="table-responsive m-t-40">
          <AppTable
            baseApi={api.siparis}
            columns={columns}
            key={"İthalatEkBilgiler"}
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
