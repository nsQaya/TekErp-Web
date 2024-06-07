import React, { useState, useEffect, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable, DataTableStateEvent, SortOrder } from 'primereact/datatable';
import { Column, ColumnProps } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ICrudBaseAPI } from '../utils/types';
import { transformFilter } from '../utils/transformFilter';


interface GenericDialogProps {
    visible: boolean;
    onHide: () => void;
    baseApi: ICrudBaseAPI<any>;
    columns: ColumnProps[];
    returnField: string;
    onSelect: (selectedItem: any) => void;
}

const GenericDialog: React.FC<GenericDialogProps> = ({ visible, onHide, baseApi, columns, returnField, onSelect }) => {
    const [data, setData] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (visible) {
            fetchData();
        }
    }, [visible, filters, search]);

    const fetchData = async () => {
        setLoading(true);
        const dynamicQuery = transformFilter(filters || {}, "Id",1 as SortOrder );

        const response = await baseApi.getAllForGrid(
            0,10,
          dynamicQuery
        );

        setData(response.data.value.items);
        setLoading(false);
    };

    const onRowSelect = (e: any) => {
        setSelectedItem(e.data);
    };

    const onRowUnselect = () => {
        setSelectedItem(null);
    };

    const handleTableEvent = useCallback((event: DataTableStateEvent) => {

        if (event.filters) {
          setFilters(event.filters);
        }
        //console.log(event);
      }, []);

    const applyFilter = () => {
        fetchData();
    };

    const handleConfirm = () => {
        if (selectedItem) {
            onSelect(selectedItem[returnField]);
            onHide();
        }
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Select Item">
              <div className="p-grid">
                <div className="p-col-12 p-md-4">
                    <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
                </div>
                <div className="p-col-12 p-md-4">
                    <Button label="Search" icon="pi pi-search" onClick={applyFilter} />
                </div>
            </div>
            <DataTable 
            size="small"
            value={data} 
            tableStyle={{ minWidth: '50rem' }}
            filterDisplay="row" 
            loading={loading} 
            selectionMode={"radiobutton"} 
            globalFilterFields={['adi', 'kodu']} 
            onRowSelect={onRowSelect}
            onRowUnselect={onRowUnselect}
            onPage={handleTableEvent}
            onFilter={handleTableEvent}
            onSort={handleTableEvent}
            >
                {columns.map((col, index) => (
                    <Column key={index} {...col} />
                ))}
            </DataTable>
            <div className="p-d-flex p-jc-end">
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
                <Button label="Select" icon="pi pi-check" onClick={handleConfirm} disabled={!selectedItem} />
            </div>
        </Dialog>
    );
};

export default GenericDialog;
