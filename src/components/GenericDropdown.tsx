import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { ICrudBaseAPI } from "../utils/types";
import { transformFilter } from "../utils/transformFilter";
import { SortOrder } from "primereact/datatable";

export interface Filter {
  value: any;
  matchMode: string;
}

export interface Filters {
  [key: string]: Filter;
}

interface GenericDropdownProps {
  value: any;
  onChange: (selectedOption: any) => void;
  baseApi: ICrudBaseAPI<any>;
  returnField: string;
  labelField: string;
  placeholder?: string;
  additionalFilters?: Filters;
  className?: string;
}

const GenericDropdown: React.FC<GenericDropdownProps> = (props) => {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({});

  const initializeFilters = useCallback(() => {
    const newFilters: Filters = {
      [props.returnField]: { value: null, matchMode: "contains" },
      [props.labelField]: { value: null, matchMode: "contains" },
      ...props.additionalFilters
    };
    setFilters(newFilters);
  }, [props.returnField, props.labelField, props.additionalFilters]);

  useEffect(() => {
    initializeFilters();
  }, [initializeFilters]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const dynamicQuery = transformFilter(filters || {}, "Id", 1 as SortOrder);
    const response = await props.baseApi.getAllForGrid(0, 9999, dynamicQuery);
    setOptions(response.data.value.items.map((item: any) => ({
      label: item[props.labelField],
      value: item[props.returnField],
    })));
    setLoading(false);
  }, [filters, props.baseApi, props.labelField, props.returnField]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Select
      value={options.find(option => option.value === props.value)}
      onChange={props.onChange}
      options={options}
      isLoading={loading}
      placeholder={props.placeholder || "Select an option"}
      className={props.className}
      isClearable={true} // Clearable özelliği eklendi
    />
  );
};

export default GenericDropdown;
