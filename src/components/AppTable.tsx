import React, {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ICrudBaseAPI } from "../utils/types";
import {
  DataTableRowClassNameOptions,
  DataTableRowData,
  DataTableSelectionMultipleChangeEvent,
  DataTableStateEvent,
  DataTableValue,
  DataTableValueArray,
  DataTable,
  SortOrder,
} from "primereact/datatable";
import { Column, ColumnHeaderOptions, ColumnProps } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button } from "primereact/button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import { transformFilter } from "../utils/transformFilter";
import { FilterMatchMode } from "primereact/api";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (
      columns: {
        title: ReactNode | ((options: ColumnHeaderOptions) => ReactNode);
        dataKey: string | undefined;
      }[],
      data: any
    ) => jsPDF;
  }
}

interface ITableProps {
  columns: ColumnProps[];
  baseApi: ICrudBaseAPI<any>;
  rowStyles?(
    data: DataTableRowData<DataTableValueArray>,
    options: DataTableRowClassNameOptions<DataTableValueArray>
  ): object | string | undefined;
  rowPerPageOptions?: number[];
  rowSelectable?: boolean;
  onChangeSelected?: (data: DataTableValue[]) => void;
  appendHeader?: () => React.ReactNode;
  globalFilter?: string | null;
}

export interface ITableRef<T> {
  refresh: () => Promise<void>;
  data: T[];
}

function ITable(
  props: ITableProps,
  ref: ForwardedRef<ITableRef<DataTableValue>>
) {
  const [selectedItems, setSelectedItems] = useState<DataTableValue[]>([]);
  const table = useRef<DataTable<DataTableValue[]>>(null);
  const [data, setData] = useState<DataTableValue[]>([]);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(
    (props.rowPerPageOptions && props.rowPerPageOptions[0]) || 10
  );
  const [sortColumn, setSortColumn] = useState<string>("Id");
  const [sortDirection, setSortDirection] = useState<SortOrder>(0);
  const [filters, setFilters] = useState(() => {
    return props.columns
      .filter((column) => column.filter && column.field)
      .reduce((acc: any, column) => {
        if (column.field) {
          acc[column.field] = {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          };
        }
        return acc;
      }, {} as any);
  });

  const exportColumns = props.columns.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const fetchItems = useCallback(async () => {
    setLoading(true);

    const dynamicQuery = transformFilter(
      filters || {},
      sortColumn,
      sortDirection
    );

    const response = await props.baseApi.getAllForGrid(
      page,
      perPage,
      dynamicQuery
    );
    setLoading(false);
    setData(response.data.value.items);
    setTotalRows(response.data.value.count);
  }, [page, perPage, sortColumn, sortDirection, props.baseApi, filters]);

  const handleTableEvent = useCallback((event: DataTableStateEvent) => {
    setFirst(event.first);
    setPage(event.page || 0);
    setPerPage(event.rows);

    if (event.sortField) {
      setSortColumn(event.sortField);
      setSortDirection(event.sortOrder);
    }

    if (event.filters) {
      setFilters(event.filters);
    }
    //console.log(event);
  }, []);

  const refresh = useCallback(async () => {
    await fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useImperativeHandle(ref, () => ({
    refresh,
    data,
  }));

  const exportCSV = (selectionOnly: boolean) => {
    table.current?.exportCSV({ selectionOnly });
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.autoTable(exportColumns, data);
    doc.save("products.pdf");
  };

  const exportExcel = async () => {
    const xlsx = await import("xlsx");
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAsExcelFile(excelBuffer, "products");
  };

  const saveAsExcelFile = (buffer: any, fileName: string) => {
    const data = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(data, `${fileName}.xlsx`);
  };

  const header = (
    <div className="flex justify-content-between align-items-center gap-2">
      {/* Butonlar sola hizalanacak */}
      <div className="flex gap-2 justify-content-start">
        <Button
          type="button"
          rounded
          onClick={() => exportCSV(false)}
          data-pr-tooltip="CSV"
        >
          CSV
        </Button>
        <Button
          type="button"
          severity="success"
          rounded
          onClick={exportExcel}
          data-pr-tooltip="XLS"
        >
          EXCEL
        </Button>
        <Button
          type="button"
          severity="warning"
          rounded
          onClick={exportPdf}
          data-pr-tooltip="PDF"
        >
          PDF
        </Button>
      </div>

      {/* Genel arama sağa hizalanacak */}
      {props.appendHeader && (
        <div className="flex justify-content-end">{props.appendHeader()}</div>
      )}
    </div>
  );

  return (
    <div className="mb-3">
      <DataTable
        reorderableColumns={true}
        resizableColumns
        globalFilter={props.globalFilter}
        size="small"
        frozenWidth="200px"
        stripedRows
        //scrollHeight="620px"
        tableStyle={{ minWidth: "50rem" }}
        scrollable
        scrollHeight="flex"
        ref={table}
        rowClassName={props.rowStyles}
        header={header}
        value={data as DataTableValue[]}
        showGridlines
        paginator
        filters={filters}
        rows={perPage}
        loading={loading}
        dataKey="id"
        filterDisplay="row"
        emptyMessage="Kayıt yok."
        rowsPerPageOptions={props.rowPerPageOptions || [10, 25, 50, 100]}
        totalRecords={totalRows}
        lazy
        onPage={handleTableEvent}
        onFilter={handleTableEvent}
        onSort={handleTableEvent}
        sortField={sortColumn}
        sortOrder={sortDirection}
        first={first}
        //virtualScrollerOptions={{ itemSize: 46 }} //Buna bakmak gerekiyor, uzun raporlarda, alt kısmı getirdiğinde sayfa çok yavaşlıyor.
        onSelectionChange={(
          e: DataTableSelectionMultipleChangeEvent<DataTableValue[]>
        ) => {
          setSelectedItems(e.value);
          props.onChangeSelected && props.onChangeSelected(e.value);
        }}
        selectionMode={props.rowSelectable ? "multiple" : null}
        selection={selectedItems}
      >
        {props.rowSelectable && (
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "1rem" }}
            key="selectionMode"
           // header={<input type="checkbox" />}
          />
        )}
        {props.columns.map((column, index) => (
          <Column key={index} {...column} />
        ))}
      </DataTable>
    </div>
  );
}

export default forwardRef(ITable);
