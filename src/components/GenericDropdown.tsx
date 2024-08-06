import React, { useState, useEffect, useCallback } from "react";
import { ICrudBaseAPI } from "../utils/types";
import { transformFilter } from "../utils/transformFilter";
import { SortOrder } from "primereact/datatable";
import Select from "react-select";

export interface Filter {
  item: string;
  value: any;
  matchMode: string;
}

interface GenericDropdownProps {
  value: any;
  onChange: (selectedOption: any) => void;
  baseApi: ICrudBaseAPI<any>;
  returnField: string;
  labelField: string;
  placeholder?: string;
  additionalFilters?: Filter[];
  className?: string;
}

const GenericDropdown: React.FC<GenericDropdownProps> = (props) => {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filter[]>([]);


  useEffect(()=>{
    if(props.additionalFilters) setFilters(props.additionalFilters);
    console.log(props.additionalFilters)
  },[props.additionalFilters])


  const fetchData = useCallback(async () => {
    setLoading(true);
    const nFilters = filters.reduce((acc : any, { item, value, matchMode }) => {
      acc[item] = { item, value, matchMode };
      return acc;
    }, {});
    const dynamicQuery = transformFilter(nFilters || {}, "Id", 1 as SortOrder);
    const response = await props.baseApi.getAllForGrid(0, 9999, dynamicQuery);
    setOptions(response.data.value.items.map((item: any) => ({
      label: item[props.labelField],
      value: item[props.returnField],
    })));
    setLoading(false);
  }, [filters]);

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
