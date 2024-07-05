import { createRef, useCallback, useEffect, useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes, FormSelectItem, IFormItem } from "../../../modals/DynamicModal";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { IIlce } from "../../../utils/types/tanimlamalar/IIlce";


export default () => {
  const myTable = createRef<ITableRef<IIlce>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IIlce>();
  const [provinces, setProvinces] = useState<FormSelectItem[]>();

  const fetchProvinces = useCallback(async () => {
    const { data: { value: { items } } } = await api.il.getAll(0, 1000);
    setProvinces(items.map(x => ({ label: x.adi, value: String(x.id) })));
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  const onSuccess = () => {
    if (selectedItem) {
      alert("Başarıyla güncellendi !");
    } else {
      alert("Başarıyla eklendi !");
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };

  const deleteItem = useCallback(async (item: IIlce) => {
    if (!window.confirm("Emin misin ?")) return;
    await api.ilce.delete(item.id as number);
    myTable.current?.refresh();
  }, []);

  const columns: ColumnProps[] = [
   
   
    {
      header: "İl",
      field: "il.adi", 
      sortable: true,
      filter: true
    },
    {
      header: " İlçe ",
      field: "adi",
      sortable: true,
      filter: true
    },
    {
      header: "İşlemler",
      body: (row: IIlce) => {
        return (
          <>
            <button className="btn btn-info ms-1" onClick={(e) => [e.preventDefault(), setSelectedItem(row), setModalShowing(true)]}>
              <i className="ti-pencil"></i>
            </button>
            <button className="btn btn-danger ms-1" onClick={(e) => [e.preventDefault(), deleteItem(row)]}>
              <i className="ti-trash"></i>
            </button>
          </>
        );
      }
    },
  ];

  const modalItems = [
  
    {
      title: "İlçe Kodu",
      name: "ilceKodu",
      type: FormItemTypes.input
    },
    {
      title: "İl",
      name: "ilId",
      type: FormItemTypes.select,
      options: provinces,
    },
    {
      title: "Adı",
      name: "adi",
      type: FormItemTypes.input
    }
  ] as IFormItem[];

  return (
    <div className="container-fluid">
      <DynamicModal
        isShownig={isModalShowing}
        title="İlçe Ekle"
        api={api.ilce}
        items={modalItems}
        onDone={onSuccess}
        selectedItem={selectedItem}
        onHide={() => setModalShowing(false)}
      />
      <AppBreadcrumb title="" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive m-t-40">
                <AppTable
                  baseApi={api.ilce}
                  columns={columns}
                  key={"İlçeler"}
                  ref={myTable}
                  rowSelectable={false}
                  appendHeader={() => {
                    return (
                      <Button className="p-button-secondary" onClick={(e) => [e.preventDefault(), setModalShowing(true)]}>
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
