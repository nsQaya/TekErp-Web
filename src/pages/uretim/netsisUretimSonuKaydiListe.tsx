import { createRef, useCallback, useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import AppTable, { ITableRef } from "../../components/AppTable";
import { useNavigate } from "react-router-dom";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { EAktarimDurumu } from "../../utils/types/enums/EAktarimDurumu";
import api from "../../utils/api";
import { aktarimDurumuDDFilterTemplate } from "../../utils/helpers/dtMultiSelectHelper";
import { INetsisUretimSonuKaydi } from "../../utils/types/uretim/INetsisUretimSonuKaydi";

interface INetsisUretimSonuKaydiListeProps {
  baseApi: any; // baseApi'yi dinamik hale getiriyoruz
  navigatePath: string; // navigate için adresi dinamik yapıyoruz

}


const  NetsisUretimSonuKaydiListe =   ({ baseApi, navigatePath }: INetsisUretimSonuKaydiListeProps) => {
  const myTable = createRef<ITableRef<INetsisUretimSonuKaydi>>();

  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] =useState<INetsisUretimSonuKaydi | null>(null);

  const navigate = useNavigate();

  const confirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        const belgeResponse= await api.belge.get(itemToDelete.id as number);
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

        await api.talepTeklif.delete(itemToDelete.id as number);//transaction yapısı bacend e yüklendi.
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

  const deleteItem = (item: INetsisUretimSonuKaydi) => {
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
      field: "isEmriNo",
      header: "İş Emri No",
      sortable: true,
      filter: true,
    },
    {
      field: "mamulKodu",
      header: "Mamül Kodu",
      sortable: true,
      filter: true,
    },
    {
      field: "mamulKodu",
      header: "Mamül Kodu",
      sortable: true,
      filter: true,
    },
    {
      field: "miktar",
      header: "Miktar",
      sortable: true,
      filter: true,
    },
    {
      field: "proje.kodu",
      header: "Proje Kodu",
      sortable: true,
      filter: true,
    },
    {
      field: "aciklama",
      header: "Açıklama",
      sortable: true,
      filter: true,
    },
    {
      field: "girisDepo",
      header: "Giriş Depo",
      sortable: true,
      filter: true,
    },
    {
      field: "cikisDepo",
      header: "Çıkış Depo",
      sortable: true,
      filter: true,
    },

    // {
    //   field: "belge.belgetip",
    //   header: "Belge Tip",
    //   //sortable: true,
    //   //filter: true,
    // },
    // {
    //   header: "Tarih",
    //   field: "belge.tarih",
    //   dataType: "date",
    //   sortable: true,
    //   filter: true,
    //   filterElement:dateFilterTemplate,
    //   body: (row: INetsisUretimSonuKaydi) =>
    //     row.belge!.tarih
    //       ? new Date(row.belge!.tarih).toLocaleDateString("tr-TR", {
    //           day: "2-digit",
    //           month: "2-digit",
    //           year: "numeric",
    //         })
    //       : "",
    // },
    {
      header: "Aktarım Durumu",
      field: "aktarimDurumu",
      dataType:"numeric",
      sortable: false,
      filter: true,
      filterElement:aktarimDurumuDDFilterTemplate,
      body: (row)=> {
        return getEnumNameAktarimDurumu(row.belge.aktarimDurumu);
      }
    },
    {
      header: "İşlemler",
      body: (row: INetsisUretimSonuKaydi) => (
        <>
          <button
            className="btn btn-info ms-1"
            onClick={(e) => {
              e.preventDefault();
              navigate(`${navigatePath}?belgeId=${row.id}`);
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
export default NetsisUretimSonuKaydiListe;