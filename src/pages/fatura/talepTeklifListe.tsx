import { createRef, useCallback, useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import AppTable, { ITableRef } from "../../components/AppTable";
import { useNavigate } from "react-router-dom";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { EAktarimDurumu } from "../../utils/types/enums/EAktarimDurumu";
import { ITalepTeklif } from "../../utils/types/fatura/ITalepTeklif";
import api from "../../utils/api";
import { dateFilterTemplate } from "../../utils/helpers/CalendarHelper";
import { aktarimDurumuDDFilterTemplate } from "../../utils/helpers/dtMultiSelectHelper";


interface ITalepTeklifListeProps {
  baseApi: any; // baseApi'yi dinamik hale getiriyoruz
  navigatePath: string; // navigate için adresi dinamik yapıyoruz

}

const  TalepTeklifListe =  ({ baseApi, navigatePath }: ITalepTeklifListeProps) => {
  const myTable = createRef<ITableRef<ITalepTeklif>>();

  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] =useState<ITalepTeklif | null>(null);

  const navigate = useNavigate();

  const confirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        const belgeResponse= await api.belge.get(itemToDelete.belgeId as number);
        if (belgeResponse.status && belgeResponse.data.value ) {
          if (belgeResponse.data.value.aktarimDurumu === EAktarimDurumu.AktarimTamamlandi) {
            toast.current?.show({
              severity: "error",
              summary: "Hata",
              detail: "Netsis aktarımı tamamlanmış belgede değişiklik yapılamaz...",
              life: 3000,
            });
        
            return; // Bu işlemi tamamladığı için geri kalanı çalıştırmasın
          }
        }

        await api.talepTeklif.delete(itemToDelete.belgeId as number);//transaction yapısı bacend e yüklendi.
        myTable.current?.refresh();
        toast.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "Başarıyla silindi !",
        });
      } catch (error) {
        console.error("Silme işleminde hata:", error);
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Silme işleminde hata oluştu !",
        });
      } finally {
        setItemToDelete(null);
        setConfirmVisible(false);
      }
    }
  }, [itemToDelete]);

  const deleteItem = (item: ITalepTeklif) => {
    setItemToDelete(item);
    setConfirmVisible(true);
  };

  useEffect(() => {
    if (!confirmVisible && !itemToDelete) {
      myTable.current?.refresh();
    }
  }, [confirmVisible, itemToDelete]);

  const getEnumNameAktarimDurumu = (value: number) => {
    return EAktarimDurumu[value];
  };

  const columns: ColumnProps[] = [
    {
      field: "belge.no",
      header: "Belge No",
      sortable: true,
      filter: true,
    },
    // {
    //   field: "belge.belgetip",
    //   header: "Belge Tip",
    //   //sortable: true,
    //   //filter: true,
    // },
    {
      header: "Tarih",
      field: "belge.tarih",
      dataType: "date",
      sortable: true,
      filter: true,
      filterElement:dateFilterTemplate,
      body: (row: ITalepTeklif) =>
        row.belge!.tarih
          ? new Date(row.belge!.tarih).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
    },
    {
      header: "Aktarım Durumu",
      field: "belge.aktarimDurumu",
      dataType:"numeric",
      sortable: false,
      filter: true,
      //filterElement: (options) => aktarimDurumuDDFilterTemplate(options, "AktarimHata"), // "AktarimHata" varsayılan olarak seçili olacak
      filterElement:aktarimDurumuDDFilterTemplate,
      body: (row)=> {
        return getEnumNameAktarimDurumu(row.belge.aktarimDurumu);
      }
    },
    {
      header: "İşlemler",
      body: (row: ITalepTeklif) => (
        <>
          <button
            className="btn btn-info ms-1"
            onClick={(e) => {
              e.preventDefault();
              navigate(`${navigatePath}?belgeId=${row.belge?.id}`);
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

  // const defaultFilters = {
  //   "belge.aktarimDurumu": {
  //     value: EAktarimDurumu.AktarimHata, // Varsayılan değer
  //     matchMode: FilterMatchMode.EQUALS,
  //   },
  // };

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
      <AppBreadcrumb title="Talep Teklif Listesi" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={baseApi}
                  columns={columns}
                  key={"TalepTeklif"}
                  ref={myTable}
                  rowSelectable={false}
                  //defaultFilters={defaultFilters} // Varsayılan filtreler burada geçildi
                  appendHeader={() => {
                    return (
                      <Button
                        type="button"
                        severity="help"
                        onClick={(e) => [
                          e.preventDefault(),
                          navigate(`${navigatePath}`),
                          
                        ]}
                      >
                        Yeni
                      </Button>
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
export default TalepTeklifListe;