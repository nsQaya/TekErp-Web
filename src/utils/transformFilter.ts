import { SortOrder } from "primereact/datatable";

type GridFilter = {
  value: any; // Belirli bir tip belirleyebilirsiniz, örneğin string, number, vb.
  matchMode?: string; // matchMode undefined olabileceği için optional yapıyoruz
};

type FilterMeta = {
  [key: string]: GridFilter | GridOperatorFilter; // Farklı tipleri desteklemek için union type kullanıyoruz
};

type GridOperatorFilter = {
  operator: string;
  constraints: GridFilter[];
};

export type TransformedFilter = {
  field: string;
  operator: string;
  value: any; 
  logic?: string; 
  filters?: TransformedFilter[]; 
};

export type TransformedSort=
{
  field:string;
  dir:string;
}

export type DynamicQuery={
  sort:TransformedSort[];
  filter:TransformedFilter;
}
function transformFilter(gridFilters: FilterMeta, sortColumn: string, sortDirection: SortOrder): DynamicQuery {
  const transformedFilters: TransformedFilter[] = [];
  const transformedSort: TransformedSort[] = [
    {
      field: sortColumn,
      dir: sortDirection === 1 ? 'asc' : 'desc',
    },
  ];

  Object.keys(gridFilters).forEach((key) => {
      const filter = gridFilters[key];
      if ('operator' in filter) {
          filter.constraints.forEach((constraint) => {
              if (constraint.value !== null && constraint.value!='') {
                  transformedFilters.push({
                      field: key,
                      operator: mapMatchModeToOperator(constraint.matchMode || 'eq'),
                      value: handleDateFilter(constraint.value).toString(),
                      //value: constraint.value.toString(),
                      logic: "and",
                  });
              }
          });
      } else {
          if (filter.value !== null && filter.value!='') {
              transformedFilters.push({
                  field: key,
                  operator: mapMatchModeToOperator(filter.matchMode || 'eq'),
                  value: handleDateFilter(filter.value).toString(),
                  //value: filter.value.toString(),
                  logic: "and",
              });
          }
      }
  });

  if (transformedFilters.length === 0) {
    return {
      sort: transformedSort,
      filter: { field: 'Id', operator: 'gte', value: '0',logic: " AND " },
    };
  }

  if (transformedFilters.length === 1) {
    return {
      sort: transformedSort,
      filter: transformedFilters[0],
    };
  }

  const mainFilter = transformedFilters.shift() as TransformedFilter;
  mainFilter.filters = transformedFilters;

  return {
    sort: transformedSort,
    filter: mainFilter,
  };
}

function mapMatchModeToOperator(matchMode: string): string {
  switch (matchMode) {
      case "equals":
          return "eq";
      case "startsWith":
          return "startswith";
      case "contains":
          return "contains";
      case "endsWith":
          return "endswith";
      case "gt":
          return "gt";
      case "dateIs":
          return "eq"; 
      case "dateIsNot":
           return "neq";
      case "dateBefore":
           return "lte";
      case "dateAfter":
           return "gte"; 

      default:
          return "eq";
  }
}
// Tarih filtresi için özel işleme
function handleDateFilter(value: any) {
  if (value instanceof Date) {
    // Tarih ise 3 saat ekleyelim
    const date = new Date(value);
    date.setHours(date.getHours() + 3); // 3 saat ekle
    return date.toISOString().split('T')[0]; // Yalnızca yyyy-MM-dd kısmını al

    // // YYYY-MM-DD formatında geri döndür
    // const year = date.getFullYear();
    // const month = String(date.getMonth() + 1).padStart(2, "0");
    // const day = String(date.getDate()).padStart(2, "0");

    // return `${year}-${month}-${day}`;
  }

  return value;
}

export { transformFilter };
