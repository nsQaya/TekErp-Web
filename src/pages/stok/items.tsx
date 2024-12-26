import { createRef, useCallback, useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import api from "../../utils/api";
import { IStok } from "../../utils/types/stok/IStok";
import CreateOrEditModal from "../../modals/stok/createOrEdit";
import AppTable, { ITableRef } from "../../components/AppTable";
import { IStokKartiWithDetail } from "../../utils/types/stok/IStokKartiWithDetail";
import { stokbarkodURL } from "../../utils/config";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { ISapKod } from "../../utils/types/stok/ISapKod";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { IHucre } from "../../utils/types/tanimlamalar/IHucre";
import { aktarimDurumuDDFilterTemplate } from "../../utils/helpers/dtMultiSelectHelper";
import { EAktarimDurumu } from "../../utils/types/enums/EAktarimDurumu";

export default () => {
  const myTable = createRef<ITableRef<IStokKartiWithDetail>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IStok>();
  const [selectedStokIDS, setSelectedStokIDS] = useState<number[]>([]);

  const toast = useRef<Toast>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IStokKartiWithDetail | null>(
    null
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState(""); 


  const onSuccess = () => {
    if (selectedItem) {
      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Başarıyla güncellendi !",
      });
    } else {
      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Başarıyla eklendi !",
      });
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };

  const confirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        await api.stok.delete(itemToDelete.id as number);
        myTable.current?.refresh();
        toast.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "Başarıyla silindi !",
        });
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: error + "Silme işleminde hata oluştu !",
        });
      } finally {
        setItemToDelete(null);
        setConfirmVisible(false);
      }
    }
  }, [itemToDelete]);

  const deleteItem = (item: IStokKartiWithDetail) => {
    setItemToDelete(item);
    setConfirmVisible(true);
  };

  useEffect(() => {
    if (!confirmVisible && !itemToDelete) {
      myTable.current?.refresh();
    }
  }, [confirmVisible, itemToDelete]);

  const writeBarkods = useCallback(async () => {
    const { data } = await api.stok.getBarkod(selectedStokIDS);

    if (!data.status) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Barkod oluşturulamadı !",
      });
    }
    //window.open(stokbarkodURL+data.value.url+".pdf", '_blank');

    const newWindow = window.open(
      stokbarkodURL + data.value.url + ".pdf",
      "_blank"
    );
    if (newWindow) {
      newWindow.onload = () => {
        newWindow.print();
      };
    } else {
      console.error("Yeni sekme açılırken bir hata oluştu.");
    }
  }, [selectedStokIDS]);

   const getEnumNameAktarimDurumu = (value: number) => {
      return EAktarimDurumu[value];
    };
  

  const columns: ColumnProps[] = [
     {
      field: "kodu",
      header: "Kodu",
      //filter: true,
      //sortable: true,
      style:{maxWidth:"90px"}
    },
    {
      field: "adi",
      header: "Adı",
      //filter: true,
      //sortable: true,
      style:{maxWidth:"350px"}
    },
    {
      field: "sapKods",
      header: "SAP Kod",
      //filter: true,
      //sortable: true,
      body: (rowData) =>
        rowData.sapKods.map((item: ISapKod) => item.kod).join("-"),
      style:{maxWidth:"100px"}
    },
    {
      field: "hucres",
      header: "Hücreler",
      //filter: true,
      //sortable: true,
      body: (rowData) =>
        rowData.hucres.map((item: IHucre) => item.kodu).join(" | "),
      style:{maxWidth:"100px"}
    },
    {
      field: "stokGrupKodu.adi",
      header: "Grup Kodu",
      //filter: true,
      //sortable: true,
      style:{maxWidth:"100px"}
    },
    {
      field: "stokKod1.adi",
      header: "Kod 1",
      //filter: true,
      //sortable: true,
      style:{maxWidth:"100px"}
    },
     {
          header: "Aktarım Durumu",
          field: "aktarimDurumu",
          dataType:"numeric",
          sortable: false,
          //filterElement: (options) => aktarimDurumuDDFilterTemplate(options, "AktarimHata"), // "AktarimHata" varsayılan olarak seçili olacak
          filterElement:aktarimDurumuDDFilterTemplate,
          body: (row)=> {
            return getEnumNameAktarimDurumu(row.aktarimDurumu);
          }
        },
    {
      header: "işlemler",
      style: { minWidth: "150px" },
      body: (row) => {
        return (
          <>
            {/* {JSON.stringify(row.sapKods.map((item: { kod: any; })=>item.kod).join())} */}
            <button
              className="btn btn-info ms-1"
              onClick={(e) => [
                e.preventDefault(),
                setSelectedItem(row),
                setModalShowing(true),
              ]}
            >
              <i className="ti-pencil"></i>
            </button>
            <button
              className="btn btn-danger ms-1"
              onClick={(e) => [e.preventDefault(), deleteItem(row)]}
            >
              <i className="ti-trash"></i>
            </button>
          </>
        );
      },
    },
  ];

  //Stokğa özel excel listesi alma muhtemelen gündeme gelecek, o zaman bunu kullanacakğız
  // const onExport= useCallback(()=>{
  //   if(!myTable.current?.data) return;

  //   const myColumns= columns.filter(x=>x.header!="işlemler");
  //   let blob = convertArrayOfObjectsToExcel<IStokKartiWithDetail>(myColumns, myTable.current.data);
  //   saveAs(blob, 'data.xlsx');
  // },[myTable])

    // Debounce the global filter input
    const handleGlobalFilterChange = useCallback(
      (e: { target: HTMLInputElement; }) => {
        const value = (e.target as HTMLInputElement).value;
        setGlobalFilter(value);
  
        // Clear the previous timer and set a new one
        const timer = setTimeout(() => {
          setDebouncedFilter(value); // Apply the filter after a delay
        }, 500); // 500ms delay
  
        return () => clearTimeout(timer); // Clear the timer if the input changes again
      },
      [setGlobalFilter]
    );

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
      <CreateOrEditModal
        show={isModalShowing}
        onDone={onSuccess}
        onHide={() => setModalShowing(false)}
        selectedItem={selectedItem}
      />

      <AppBreadcrumb title="" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.stokWithDetail}
                  columns={columns}
                  key={"Stoklar"}
                  ref={myTable}
                  globalFilter={debouncedFilter}
                  rowSelectable={true}
                  onChangeSelected={(selected) =>
                    setSelectedStokIDS(selected.map((x) => Number(x.id)))
                  }
                  appendHeader={() => {
                    return (
                      <>
                        <IconField iconPosition="left">
                          <div className="flex justify-content-between align-items-center gap-2">
                            {/* Butonlar sol tarafa hizalanacak */}
                            <div className="flex gap-2 justify-content-start">
                              <Button
                                type="button"
                                className="p-button-secondary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setModalShowing(true);
                                }}
                              >
                                Yeni
                              </Button>

                              <Button
                                type="button"
                                className="p-button-secondary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  writeBarkods();
                                }}
                                disabled={selectedStokIDS.length <= 0}
                              >
                                Barkod Yazdır
                              </Button>
                            </div>

                            {/* Arama kutusu sağda olacak */}
                            <div className="flex justify-content-end">
                              <IconField iconPosition="left">
                                <InputIcon className="pi pi-search" />
                                <InputText
                                  value={globalFilter}
                                  onChange={handleGlobalFilterChange} // Debounced handler
                                  placeholder="Genel arama"
                                  style={{ width: '500px' }}
                                />
                              </IconField>
                            </div>
                          </div>
                        </IconField>
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
