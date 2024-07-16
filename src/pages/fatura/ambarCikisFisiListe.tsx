import { createRef, useCallback,  useEffect,  useRef,  useState } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import api from "../../utils/api";
import AppTable, { ITableRef } from "../../components/AppTable";
import { IAmbarFisi } from "../../utils/types/fatura/IAmbarFisi";
import { useNavigate } from "react-router-dom";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";


export default () => {
  const myTable = createRef<ITableRef<IAmbarFisi>>();
  
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IAmbarFisi | null>(null);

  const navigate= useNavigate();
  

  const confirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        await api.belge.delete(itemToDelete.belgeId as number);
        await api.ambarFisi.delete(itemToDelete.id as number);
        const stokHareketResponse= await api.stokHareket.getListByBelgeId(itemToDelete.belgeId);
        stokHareketResponse.data.value.items.forEach(async element => {
          await api.stokHareket.delete(element.id as number);
        });
        await api.stokHareket.delete(itemToDelete.belgeId as number);
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

  const deleteItem = (item: IAmbarFisi) => {
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
      filter: true
      
    },
    {
      header: "Tarih",
      field: "belge.tarih",
      dataType:"date",
      sortable: true,
      filter: true,
      body: (row: IAmbarFisi) =>
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
      filter: true
    },
    {
      header: "Çıkış Yeri",
      field: "cikisYeri",
      sortable: false,
    },
    {
      header: "İşlemler",
      body: (row: IAmbarFisi) => (
        
        <>
        <button className="btn btn-info ms-1" onClick={(e) => {
          e.preventDefault();
          navigate(`/fatura/ambarcikisfisi?belgeId=${row.belgeId}`)

        }}>
          <i className="ti-pencil"></i>
        </button>
        <button className="btn btn-danger ms-1" onClick={(e) => {
          e.preventDefault();
          deleteItem(row);
        }}>
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
      <AppBreadcrumb title="Ambar Çıkış Fişi Listesi" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-40">
                <AppTable
                    baseApi={api.ambarFisi}
                    columns={columns}
                    key={"AmbarCikisFisi"}
                    ref={myTable}
                    rowSelectable={false}
                    appendHeader={() => {
                      return (
                      <Button type="button" severity="help" onClick={(e)=>[e.preventDefault(), navigate(`/fatura/ambarcikisfisi`)]}>
                        Yeni
                      </Button>)
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
