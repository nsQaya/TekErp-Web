import DataTable, {
  ConditionalStyles,
  SortOrder,
  TableColumn,
} from "react-data-table-component";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { ICrudBaseAPI } from "../utils/types";
// import DataTableExtensions from 'react-data-table-component-extensions';

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}

interface ITableProps<T> {
  columns: TableColumn<T>[];
  baseApi: ICrudBaseAPI<T>;
  rowStyles?: ConditionalStyles<T>[];
  rowPerPageOptions?: number[];
  rowSelectable?:boolean;
  onChangeSelected?: (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: T[];
  })=> void;
}

export interface ITableRef<T> {
  refresh: () => Promise<void>;
  data: T[]
}

function ITable<T>(props: ITableProps<T>, ref: ForwardedRef<ITableRef<T>>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('Id');
  const [sortDirection, setSortDirection] = useState<SortOrder>("asc" as SortOrder);

  const fetchItems = useCallback(
    async (
      page: number,
      take: number,
      sortColumn?: string,
      sortDirection?: SortOrder
    ) => {
      setLoading(true);
      const response = await props.baseApi.getAllForGrid(
        page,
        take,
        sortColumn,
        sortDirection
      );
      setLoading(false);
      setData(response.data.value.items as T[]);
      setTotalRows(response.data.value.count);
    },
    []
  );

  const handlePageChange = async (page: number) => {
    setPage(page);
  };

  const handlePerRowsChange = useCallback(
    async (perPage: number) => {
      setPerPage(perPage);
    },
    [setPerPage]
  );

  const handleSort = useCallback(
    (column: TableColumn<T>, sortDirection: SortOrder) => {
      console.log(column.name)
      if (column.selector)
        {
          setSortColumn(column.selector.toString());
          setSortDirection(sortDirection);
        }
    },
    []
  );

  const refresh = useCallback(async () => {
    await fetchItems(page - 1, perPage, sortColumn, sortDirection);
  }, [page, perPage, sortColumn, sortDirection, fetchItems]);

  useEffect(() => {
    fetchItems(page - 1, perPage, sortColumn, sortDirection);
  }, [perPage, page, sortColumn, sortDirection, fetchItems]);

  useImperativeHandle(ref, () => ({
    refresh, data
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
          onSort={handleSort}
          sortServer
          paginationPerPage={perPage}
          progressPending={loading}
          conditionalRowStyles={props.rowStyles}
          paginationRowsPerPageOptions={props.rowPerPageOptions}
          selectableRows={props.rowSelectable || false}
          onSelectedRowsChange={props.onChangeSelected ? props.onChangeSelected : undefined}
        />
  );
}

export default forwardRef(ITable);
