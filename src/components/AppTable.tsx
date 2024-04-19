import DataTable, { TableColumn } from "react-data-table-component";
import { ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { ICrudBaseAPI } from "../utils/types";


declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}

interface ITableProps<T> {
  columns: TableColumn<T>[];
  baseApi: ICrudBaseAPI<T>;
}

export interface ITableRef{
  refresh: () => Promise<void>;
}

function ITable<T>(props: ITableProps<T>, ref: ForwardedRef<ITableRef>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchItems = useCallback(async (page: number, take: number) => {
    setLoading(true);
    const response = await props.baseApi.getAll(page, take);
    setLoading(false);
    setData(response.data.value.items as T[]);
    setTotalRows(response.data.value.count);
  }, []);

  const handlePageChange = async (page: number) => {
    setPage(page);
  };

  const handlePerRowsChange = useCallback(
    async (perPage: number) => {
      setPerPage(perPage);
    },[setPerPage]
  );

  const refresh= useCallback(async()=>{
    await fetchItems(page - 1, perPage);
  },[page, perPage])

  useEffect(() => {
    fetchItems(page - 1, perPage);
  }, [perPage, page]);

  useImperativeHandle(ref, () => ({
    refresh
  }));

  return (
    <DataTable
      columns={props.columns}
      data={data}
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerRowsChange}
      paginationPerPage={perPage}
      progressPending={loading}
    />
  );
};


export default forwardRef(ITable);