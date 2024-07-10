import { createRef, useCallback, useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import api from "../../utils/api/index";
import { IIhtiyacPlanlama } from "../../utils/types/planlama/IIhtiyacPlanlama";
import AppTable, { ITableRef } from "../../components/AppTable";
import { ColumnProps } from "primereact/column";
import { Toast } from "primereact/toast";
import DynamicModal, { FormItemTypes, FormSelectItem, IFormItem } from "../../modals/DynamicModal";
import { ConfirmDialog } from "primereact/confirmdialog";
import projeSelect from "../../components/SelectItems/projeSelect";
import uniteSelect from "../../components/SelectItems/uniteSelect";
import stokKartiSelect from "../../components/SelectItems/stokKartiSelect";
import olcuBirimSelect from "../../components/SelectItems/olcuBirimSelect";
import { Button } from "primereact/button";

export default () => {
  const myTable = createRef<ITableRef<IIhtiyacPlanlama>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IIhtiyacPlanlama | undefined>();
  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IIhtiyacPlanlama | null>(null);

  const [projes, setProjes] = useState<FormSelectItem[]>();
  const [unites, setUnites] = useState<FormSelectItem[]>();
  const [stokKartis, setStokKartis] = useState<FormSelectItem[]>();
  const [olcuBirims, setOlcuBirims] = useState<FormSelectItem[]>();

  const fetchProjesData = useCallback(async () => {
    const projeData = await projeSelect();
    setProjes(projeData);
  }, []);

  useEffect(() => {
    fetchProjesData();
  }, [fetchProjesData]);

  const fetchUnitesData = useCallback(async () => {
    const uniteData = await uniteSelect();
    setUnites(uniteData);
  }, []);

  useEffect(() => {
    fetchUnitesData();
  }, [fetchUnitesData]);

  const fetchStokKartiData = useCallback(async () => {
    const stokKartiData = await stokKartiSelect();
    setStokKartis(stokKartiData);
  }, []);

  useEffect(() => {
    fetchStokKartiData();
  }, [fetchStokKartiData]);

  const fetchOlcuBirimData = useCallback(async () => {
    const olcuBirimData = await olcuBirimSelect();
    setOlcuBirims(olcuBirimData);
  }, []);

  useEffect(() => {
    fetchOlcuBirimData();
  }, [fetchOlcuBirimData]);

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
        await api.ihtiyacPlanlama.delete(itemToDelete.id as number);
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

  const deleteItem = (item: IIhtiyacPlanlama) => {
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
      header: "Tarih",
      field: "tarih",
      sortable: true,
      filter: true,
      style: {
        fontSize: "9px",
        width: "80px",
      },
    },
    {
      header: "Proje Kodu",
      field: "proje.kodu",
      sortable: true,
      filter: true,
      style: {
        width: "70px",
        fontSize: "9px",
      },
    },
    {
      header: "Proje Açıklama",
      field: "proje.aciklama",
      sortable: true,
      filter: true,
      style: {
        fontSize: "9px",
        width: "100px",
      },
    },
    {
      header: "Ünite Kodu",
      field: "unite.kodu",
      sortable: true,
      filter: true,
      style: {
        width: "70px",
        fontSize: "9px",
      },
    },
    {
      header: "Ünite Açıklama",
      field: "unite.aciklama",
      sortable: true,
      filter: true,
      style: {
        width: "100px",
        fontSize: "9px",
      },
    },
    {
      header: "Mamül Adı",
      field: "mamulAdi",
      sortable: true,
      filter: true,
      style: {
        width: "100px",
        fontSize: "9px",
      },
    },
    {
      header: "Stok Kodu",
      field: "stokKarti.kodu",
      sortable: true,
      filter: true,
      style: {
        width: "100px",
        fontSize: "9px",
      },
    },
    {
      header: "Stok Adı",
      field: "stokKarti.adi",
      sortable: true,
      filter: true,
      style: {
        width: "250px",
        fontSize: "9px",
      },
    },
    {
      header: "Miktar",
      field: "miktar",
      sortable: true,
      filter: true,
      style: {
        width: "50px",
        fontSize: "9px",
      },
    },
    {
      header: "Ölçü Birimi",
      field: "stokOlcuBirim.simge",
      sortable: true,
      filter: true,
      style: {
        width: "70px",
        fontSize: "9px",
      },
    },
    {
      header: "Ölçü Birimi String",
      field: "stokOlcuBirimString",
      sortable: true,
      filter: true,
      style: {
        width: "70px",
        fontSize: "9px",
      },
    },
    {
      header: "İşlemler",
      body: (row: IIhtiyacPlanlama) => {
        return (
          <>
            <button className="btn btn-info ms-1" onClick={(e) => {
              e.preventDefault();
              setSelectedItem(row);
              setModalShowing(true);
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
        );
      },
    },
  ];

  const modalItems = [
    {
      name: "id",
      type: FormItemTypes.input,
      hidden: true
    },
    {
      title: "Tarih",
      name: "tarih",
      type: FormItemTypes.input
    },
    {
      title: "Proje Kodu",
      name: "projeId",
      type: FormItemTypes.select,
      options:projes,
    },
    {
      title: "Ünite Kodu",
      name: "uniteId",
      type: FormItemTypes.select,
      options:unites,
    },
    {
      title: "Mamül Adı",
      name: "mamulAdi",
      type: FormItemTypes.input
    },
    {
      title: "Stok Kartı",
      name: "stokKartiId",
      type: FormItemTypes.select,
      options:stokKartis,
    },
    {
      title: "Miktar",
      name: "miktar",
      type: FormItemTypes.input
    },
    {
      title: "Ölçü Birimi",
      name: "stokOlcuBirimId",
      type: FormItemTypes.select,
      options:olcuBirims,
    },
    {
      title: "Ölçü Birimi Yazı",
      name: "stokOlcuBirimString",
      type: FormItemTypes.input
    },
  ] as IFormItem[];

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
        title="Ekle" 
        api={api.ihtiyacPlanlama} 
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
      />
      <AppBreadcrumb title="İhtiyaç Planlama" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.ihtiyacPlanlama}
                  columns={columns}
                  key={"ihtiyacPlanlama"}
                  ref={myTable}
                  rowSelectable={false}
                  appendHeader={() => {
                    return (
                      <Button className="p-button-secondary" onClick={(e) => {
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
