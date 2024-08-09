import  { useState, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable, DataTableStateEvent, SortOrder } from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { ICrudBaseAPI } from "../utils/types";
import { transformFilter } from "../utils/transformFilter";
import { debounce } from "lodash-es";

interface GenericDialogProps<T> {
  visible: boolean;
  onHide: () => void;
  baseApi: ICrudBaseAPI<T>;
  columns: ColumnProps[];
  returnField: keyof T;
  onSelect: (selectedItem: T) => void;
}

const GenericDialog = <T extends {}>(props: GenericDialogProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const initializeFilters = useCallback(() => {
    const newFilters = props.columns
      .filter((column) => column.filter && column.field)
      .reduce((acc: any, column) => {
        if (column.field) {
          acc[column.field] = { value: null, matchMode: FilterMatchMode.CONTAINS };
        }
        return acc;
      }, {});
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    initializeFilters();
  }, [initializeFilters]);

  const fetchData = useCallback(
    debounce(async () => {
      setLoading(true);
      const dynamicQuery = transformFilter(filters || {}, "Id", 1 as SortOrder);
      const response = await props.baseApi.getAllForGrid(0, 10, dynamicQuery);
      setData(response.data.value.items);
      setLoading(false);
    }, 300),
    [filters, props.baseApi]
  );

  useEffect(() => {
    if (props.visible) {
      fetchData();
    }
  }, [props.visible, filters, fetchData]);

  useEffect(() => {
    if (!props.visible) {
      initializeFilters();
    }
  }, [props.visible, initializeFilters]);

  const onRowSelect = (e: any) => {
    setSelectedItem(e.data);
  };

  const onRowUnselect = () => {
    setSelectedItem(null);
  };

  const handleTableEvent = (event: DataTableStateEvent) => {
    if (event.filters) {
      setFilters(event.filters);
    }
    fetchData();
  };

  const handleConfirm = () => {
    if (selectedItem) {
      props.onSelect(selectedItem);
      props.onHide();
    }
  };

  const handleRowDoubleClick = (e: any) => {
    props.onSelect(e.data);
    props.onHide();
  };

  const resetState = () => {
    initializeFilters();
    setSelectedItem(null);
    setData([]);
  };

  const handleHide = () => {
    resetState();
    props.onHide();
  };

  return (
    <Dialog visible={props.visible} onHide={handleHide} header="Rehber">
      <DataTable
        size="small"
        value={data}
        tableStyle={{ minWidth: "50rem" }}
        filterDisplay="row"
        loading={loading}
        selectionMode="single"
        selection={selectedItem}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
        onPage={handleTableEvent}
        onFilter={handleTableEvent}
        onSort={handleTableEvent}
        filters={filters}
        onRowDoubleClick={handleRowDoubleClick}
      >
        {props.columns.map((col, index) => (
          <Column key={index} {...col} />
        ))}
      </DataTable>
      <div className="p-d-flex p-jc-end">
        <Button
          label="Kapat"
          icon="pi pi-times"
          className="p-button-text"
          onClick={props.onHide}
        />
        <Button
          label="Seç"
          icon="pi pi-check"
          onClick={handleConfirm}
          disabled={!selectedItem}
        />
      </div>
    </Dialog>
  );
};

export default GenericDialog;
