import { createRef, useCallback, useEffect, useState } from "react";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import api from "../../../utils/api";
import AppTable, { ITableRef } from "../../../components/AppTable";
import DynamicModal, {
  FormItemTypes,
  IFormItem,
} from "../../../modals/DynamicModal";
import { ColumnProps } from "primereact/column";
import { IBelgeSeri } from "../../../utils/types/tanimlamalar/IBelgeSeri";
import { EBelgeTip } from "../../../utils/types/enums/EBelgeTip";

export default () => {
  const myTable = createRef<ITableRef<IBelgeSeri>>();
  const [isModalShowing, setModalShowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IBelgeSeri>();
  const [belges, setBelges] = useState<any[]>([]);

  // Enum değerlerini alıp 900 ile başlayanları filtreleyen fonksiyon
  const getFilteredEnumValues = () => {
    return Object.entries(EBelgeTip)
      .filter(([key, value]) => typeof value === "number" && value >= 900)
      .map(([key, value]) => ({ label: key, value: Number(value) }));
  };

  useEffect(() => {
    const filteredItems = getFilteredEnumValues();
    setBelges(filteredItems);
  }, []);

  const onSuccess = () => {
    if (selectedItem) {
      alert("Başarıyla güncellendi !");
    } else {
      alert("Başarıyla eklendi !");
    }
    myTable.current?.refresh();
    setModalShowing(false);
  };

  const deleteItem = useCallback(async (item: IBelgeSeri) => {
    if (!window.confirm("Emin misin ?")) return;
    await api.belgeSeri.delete(item.id as number);
    myTable.current?.refresh();
  }, []);

  const columns: ColumnProps[] = [
    {
      header: "#",
      field: "id",
      sortable: true,
    },
    {
      header: "Belge Tipi",
      field: "belgeTip",
      sortable: true,
      filter: true,
    },
    {
      header: "Seri",
      field: "seri",
      sortable: true,
      filter: true,
    },
    {
      header: "No",
      field: "no",
      sortable: true,
    },
    {
      header: "BelgeNo",
      field: "belgeNo",
      sortable: true,
      filter: true,
    },
    {
      header: "işlemler",
      body: (row) => {
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
      name: "id",
      type: FormItemTypes.input,
      hidden: true,
    },
    {
      title: "Belge Tip",
      name: "belgeTip",
      type: FormItemTypes.select,
      options: belges
    },
    {
      title: "Seri",
      name: "seri",
      type: FormItemTypes.input,
    },

  ] as IFormItem[];

  return (
    <div className="container-fluid">
      <DynamicModal
        isShownig={isModalShowing}
        title="Ekle"
        api={api.belgeSeri}
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
              <div className="table-responsive m-t-50">
                <AppTable
                  baseApi={api.belgeSeri}
                  columns={columns}
                  key={"BelgeSeriler"}
                  ref={myTable}
                  rowSelectable={true}
                  appendHeader={() => {
                    return (
                      <button
                        type="button"
                        className="btn btn-info btn-rounded m-t-10 float-end text-white"
                        onClick={(e) => [
                          e.preventDefault(),
                          setModalShowing(true),
                        ]}
                      >
                        Yeni
                      </button>
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
