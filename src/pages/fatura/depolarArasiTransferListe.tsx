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
      filter: true,
    },
    {
      header: "Tarih",
      field: "belge.tarih",
      dataType: "date",
      sortable: true,
      filter: true,
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
      filter: true,
    },
    {
      header: "Çıkış Yeri",
      field: "cikisYeri",
      sortable: false,
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