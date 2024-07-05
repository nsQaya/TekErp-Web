import { createRef, useCallback, useEffect, useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import { IIl } from "../../../utils/types/tanimlamalar/IIl";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, { FormItemTypes, FormSelectItem, IFormItem } from "../../../modals/DynamicModal";
import { ColumnProps } from "primereact/column";
import { Button } from "primereact/button";

export default () => {
  const myTable = createRef<ITableRef<IIl>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IIl>();
  const [countries, setCountries] = useState<FormSelectItem[]>();

  const fetchCountries = useCallback(async () => {
    const { data: { value: { items } } } = await api.ulke.getAll(0, 1000);
    setCountries(items.map(x => ({ label: x.adi, value: String(x.id) })));
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const onSuccess = () => {
    if (selectedItem) {
      alert("Başarıyla güncellendi !");
    } else {
      alert("Başarıyla eklendi !");
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };

  const deleteItem = useCallback(async (item: IIl) => {
    if (!window.confirm("Emin misin ?")) return;
    await api.il.delete(item.id as number);
    myTable.current?.refresh();
  }, []);

  const columns: ColumnProps[] = [
   
    {
      header: "Ülke",
      field: "ulkeAdi",  // Burada 'ulkeAdi' doğru property olmalı
      sortable: true,
      filter: true
    },
    {
      header: "Plaka Kodu",
      field: "plakaKodu",  // Burada 'plakaKodu' doğru property olmalı
      sortable: true,
      filter: true
    },
    {
      header: "İl",
      field: "adi",
      sortable: true,
      filter: true
    },
    {
      header: "İşlemler",
      body: (row: IIl) => {
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
      },
    },
  ];

  const modalItems = [
   
    {
      title: "Ülke",
      name: "ulkeId",
      type: FormItemTypes.select,
      options: countries
    },
    {
      title: "Adı",
      name: "adi",
      type: FormItemTypes.input
    },
    {
      title: "Plaka Kodu",
      name: "plakaKodu",  // Burada 'plakaKodu' doğru property olmalı
      type: FormItemTypes.input
    }
  ] as IFormItem[];

  return (
    <div className="container-fluid">
      <DynamicModal
        isShownig={isModalShowing}
        title="İl Ekle"
        api={api.il}
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
                  baseApi={api.il}
                  columns={columns}
                  key={"İller"}
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
