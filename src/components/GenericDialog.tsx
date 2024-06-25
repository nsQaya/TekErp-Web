import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import {
  DataTable,
  DataTableStateEvent,
  SortOrder,
} from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { ICrudBaseAPI } from "../utils/types";
import { transformFilter } from "../utils/transformFilter";
import { FilterMatchMode } from "primereact/api";

interface GenericDialogProps {
  visible: boolean;
  onHide: () => void;
  baseApi: ICrudBaseAPI<any>;
  columns: ColumnProps[];
  returnField: string;
  onSelect: (selectedItem: any) => void;
}

const GenericDialog: React.FC<GenericDialogProps> = (props) => {
  const [data, setData] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(()=>{
    setFilters(props.columns
        .filter(column => column.filter && column.field)
        .reduce((acc: any, column) => {
          if(column.field){
            acc[column.field] = { value: null, matchMode: FilterMatchMode.CONTAINS };
          }
          return acc;
        }, {} as any));
  },[props.columns]);
  
  useEffect(() => {
    if (props.visible) {
      fetchData();
    }
  }, [props.visible, filters]);

  useEffect(()=>{
    if(props.visible) return;
    setFilters({});
  },[props.visible]);

  const fetchData = async () => {
    setLoading(true);
    const dynamicQuery = transformFilter(filters || {}, "Id", 1 as SortOrder);

    const response = await props.baseApi.getAllForGrid(0, 10, dynamicQuery);

    setData(response.data.value.items);
    setLoading(false);
  };

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
        props.onSelect(selectedItem[props.returnField]);
        props.onHide();
    }
  };

  const handleRowDoubleClick = (e: any) => {
    props.onSelect(e.data[props.returnField]);
    props.onHide();
  };

  const resetState = () => {
    setFilters({});
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
