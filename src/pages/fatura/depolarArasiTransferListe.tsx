import { createRef, useCallback, useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import api from "../../utils/api";
import AppTable, { ITableRef } from "../../components/AppTable";
import { useNavigate } from "react-router-dom";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { IDepolarArasiTransfer } from "../../utils/types/fatura/IDepolarArasiTransfer";
import { EAmbarHareketTur } from "../../utils/types/enums/EAmbarHareketTur";
import { EAktarimDurumu } from "../../utils/types/enums/EAktarimDurumu";
import { aktarimDurumuDDFilterTemplate, ambarHareketTurDDFilterTemplate } from "../../utils/helpers/dtMultiSelectHelper";
import { dateFilterTemplate } from "../../utils/helpers/CalendarHelper";

export default () => {
  const myTable = createRef<ITableRef<IDepolarArasiTransfer>>();

  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] =
    useState<IDepolarArasiTransfer | null>(null);

  const navigate = useNavigate();

  const confirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        //TODO: buraya stokhareket seri silme konulacak.
        // const stokHareketResponse = await api.stokHareket.getListByBelgeId(
        //   itemToDelete.belgeId
        // );
        // stokHareketResponse.data.value.items.forEach(async (element) => {
        //   const stokHareketSeriResponse =
        //     await api.stokHareketSeri.getListByBelgeId(itemToDelete.belgeId);
        //   stokHareketSeriResponse.data.value.items.forEach(
        //     async (elementSeri) => {
        //       await api.stokHareketSeri.delete(elementSeri.id as number);
        //     }
        //   );
        //   await api.stokHareket.delete(element.id as number);
        // });
        const belgeResponse= await api.belge.get(itemToDelete.belgeId as number);
        if (belgeResponse.status && belgeResponse.data.value ) {
          if (belgeResponse.data.value.aktarimDurumu === EAktarimDurumu.AktarimTamamlandi) {
            toast.current?.show({
              severity: "error",
              summary: "Hata",
              detail: "Netsis aktarımı tamamlanmış belgede değişiklik yapılamaz. Listeye yönlendiriliyorsunuz...",
              life: 3000,
            });
    
            // 2 saniye sonra başka bir sayfaya yönlendirme
            setTimeout(() => {
              navigate("/fatura/depolararasitransferliste"); // Kullanıcıyı başka bir adrese yönlendir
            }, 2000);
    
            return; // Bu işlemi tamamladığı için geri kalanı çalıştırmasın
          }
        }

        await api.belge.delete(itemToDelete.belgeId as number);//transaction yapısı bacend e yüklendi.
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

  const deleteItem = (item: IDepolarArasiTransfer) => {
    setItemToDelete(item);
    setConfirmVisible(true);
  };

  useEffect(() => {
    if (!confirmVisible && !itemToDelete) {
      myTable.current?.refresh();
    }
  }, [confirmVisible, itemToDelete]);

  const getEnumNameHareketTur = (value: number) => {
    return EAmbarHareketTur[value];
  };
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
    {
      header: "Tarih",
      field: "belge.tarih",
      dataType: "date",
      sortable: true,
      filter: true,
      filterElement:dateFilterTemplate,
      body: (row: IDepolarArasiTransfer) =>
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
      dataType:"numeric",
      filter:true,
      filterElement:ambarHareketTurDDFilterTemplate,
      body: (row)=> {
        return getEnumNameHareketTur(row.ambarHareketTur);
      }
    },
    {
      header: "Aktarım Durumu",
      field: "belge.aktarimDurumu",
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
      body: (row: IDepolarArasiTransfer) => (
        <>
          <button
            className="btn btn-info ms-1"
            onClick={(e) => {
              e.preventDefault();
              navigate(
                `/fatura/depolararasitransferfisi?belgeId=${row.belgeId}`
              );
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
      <AppBreadcrumb title="Depolar Arası Transfer Listesi" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.depolarArasiTransfer}
                  columns={columns}
                  key={"DepolarArasiTransfer"}
                  ref={myTable}
                  rowSelectable={false}
                  appendHeader={() => {
                    return (
                      <Button
                        type="button"
                        severity="help"
                        onClick={(e) => [
                          e.preventDefault(),
                          navigate(`/fatura/depolararasitransferfisi`),
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
