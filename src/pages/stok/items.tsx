import { useCallback, useEffect, useState } from "react";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import DataTable, { TableColumn } from "react-data-table-component";
import api from "../../utils/api";
import { IStok } from "../../utils/types";
import CreateOrEditModal from "../../modals/stok/createOrEdit";

const columns: TableColumn<IStok>[] = [
  {
    name: "#",
    selector: (row: IStok) => row.id,
    sortable: true,
  },
  {
    name: "Adı",
    selector: (row: IStok) => row.adi,
    sortable: true,
  },
  {
    name: "işlemler",
    button: true,
    cell: (row: IStok) => {
      return (
        <>
          <button className="btn btn-primary">
            <i className="ti-eye"></i>
          </button>
          <button className="btn btn-info ms-1">
            <i className="ti-pencil"></i>
          </button>
          <button className="btn btn-danger ms-1">
            <i className="ti-trash"></i>
          </button>
        </>
      );
    },
  },
];

export default () => {
  const [data, setData] = useState<IStok[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isModalShowing, setModalShowing] = useState(false);

  const fetchItems = useCallback(async (page: number, take: number) => {
    setLoading(true);
    const response = await api.stok.getAll(page, take);
    setLoading(false);
    setData(response.data.value.items);
    setTotalRows(response.data.value.count);
  }, []);

  const handlePageChange = async (page: number) => {
    setPage(page);
  };

  const handlePerRowsChange = useCallback(
    async (perPage: number) => {
      setPerPage(perPage);
    },
    [setPerPage]
  );

  useEffect(() => {
    fetchItems(page - 1, perPage);
  }, [perPage, page]);

  return (
    <div className="container-fluid">
      <CreateOrEditModal
        show={isModalShowing}
        onHide={() => setModalShowing(false)}
      />

      <AppBreadcrumb title="Stoklar" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Data Export</h4>
              <h6 className="card-subtitle">
                Export data to Copy, CSV, Excel, PDF & Print
              </h6>
              <button
                type="button"
                className="btn btn-info btn-rounded m-t-10 float-end text-white"
                onClick={(e) => [e.preventDefault(), setModalShowing(true)]}
              >
                Yeni Stok Ekle
              </button>
              <div className="table-responsive m-t-40">
                <DataTable
                  columns={columns}
                  data={data}
                  pagination
                  paginationServer
                  paginationTotalRows={totalRows}
                  onChangePage={handlePageChange}
                  onChangeRowsPerPage={handlePerRowsChange}
                  paginationPerPage={perPage}
                  progressPending={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
