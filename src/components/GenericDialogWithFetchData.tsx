import  { useState, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable, DataTableStateEvent, SortOrder } from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { transformFilter } from "../utils/transformFilter";
import { debounce } from "lodash-es";

interface GenericDialogWithFetchDataProps<T> {
  visible: boolean;
  onHide: () => void;
  baseApi: any; // API objesi
  apiMethodName: string; // Çağrılacak metodun adı
  columns: ColumnProps[];
  onSelect: (selectedItem: T) => void;
  defaultSortField: keyof T;
  externalFilters?: Record<string, any>;
  rowPerPageOptions?: number[];
}

const GenericDialogWithFetchData = <T extends {}>(props: GenericDialogWithFetchDataProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const [sortField, setSortField] = useState<string | undefined>(undefined); 
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(undefined); 
  const [totalRows, setTotalRows] = useState(0);

  const [first, setFirst] = useState(1);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(
    (props.rowPerPageOptions && props.rowPerPageOptions[0]) || 10
  );

    // Dış ve iç filtreleri birleştirme fonksiyonu
    const mergeFilters = (
      internalFilters: Record<string, any>,
      externalFilters?: Record<string, any>
    ) => {
      if (!externalFilters) return internalFilters;
      return { ...externalFilters, ...internalFilters };
    };

    const initializeFilters = useCallback(() => {
      const newFilters = props.columns
        .filter((column) => column.filter && column.field)
        .reduce((acc: any, column) => {
          if (column.field) {
            let matchMode: FilterMatchMode;
    
            // Veri tipine göre uygun filtreleme modu seçimi
            switch (column.dataType) {
              case 'date':
                matchMode = FilterMatchMode.DATE_IS; // Tarih için
                break;
              case 'numeric':
                matchMode = FilterMatchMode.EQUALS; // Sayısal alanlar için
                break;
              default:
                matchMode = FilterMatchMode.CONTAINS; // Diğer tüm alanlar için
                break;
            }
    
            acc[column.field] = { value: null, matchMode,dataType:column.dataType };
          }
          return acc;
        }, {});
    
      setFilters(mergeFilters(newFilters, props.externalFilters));
    }, [props.columns, props.externalFilters]);

  useEffect(() => {
    initializeFilters();
  }, [initializeFilters]);

  const fetchData = useCallback(
    debounce(async () => {
      setLoading(true);      
      const combinedFilters = mergeFilters(filters, props.externalFilters);
      const dynamicQuery = transformFilter(
        combinedFilters,
        sortField || (props.defaultSortField as string),
        sortOrder ?? 1
      );
      if (props.baseApi && props.baseApi[props.apiMethodName]) {
        const result = await props.baseApi[props.apiMethodName](page, perPage, dynamicQuery);
        setData(result.data.value.items);
        setTotalRows(result.data.value.count);
      }
      setLoading(false);
    }, 300),
    [filters, page, perPage, sortField, sortOrder, props.externalFilters, props.baseApi]
  );

  useEffect(() => {
    if (props.visible) {
      fetchData();
    }
  }, [props.visible, filters, page, perPage, sortField, sortOrder, fetchData]);

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

    const newFilters = event.filters ? mergeFilters(event.filters, props.externalFilters) : filters;
    setFilters(newFilters);

    if (event.sortField) {
      setSortField(event.sortField); // Gelen sıralama alanını saklıyoruz
    }
    if (event.sortOrder !== undefined) {
      setSortOrder(event.sortOrder); // Gelen sıralama yönünü saklıyoruz
    }

    setFirst(event.first);
    setPage(event.page || 0);
    setPerPage(event.rows);

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
    const combinedFilters = mergeFilters({}, props.externalFilters);
    setFilters(combinedFilters);
    setSelectedItem(null);
    setData([]);
  };

  const handleHide = () => {
    resetState();
    props.onHide();
  };

  return (
    <Dialog visible={props.visible} onHide={handleHide} header="Rehber" resizable maximizable >
      <DataTable
      dataKey="id"
      lazy // Bu çok önemli, db den geleni de filtrelemeye çalışıyor filan muhabbeti
      scrollable
      paginator
      rowsPerPageOptions={props.rowPerPageOptions || [10, 25, 50, 100]}
      rows={perPage}
      first={first}
      totalRecords={totalRows}
      style={{  minHeight:'600px' }}
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
        sortField={sortField}
        sortOrder={sortOrder} 
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

export default GenericDialogWithFetchData;
