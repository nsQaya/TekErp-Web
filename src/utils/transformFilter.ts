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
                      value: constraint.value,
                      logic: "and",
                  });
              }
          });
      } else {
          if (filter.value !== null && filter.value!='') {
              transformedFilters.push({
                  field: key,
                  operator: mapMatchModeToOperator(filter.matchMode || 'eq'),
                  value: filter.value,
                  logic: "and",
              });
          }
      }
  });

  if (transformedFilters.length === 0) {
    return {
      sort: transformedSort,
      filter: { field: 'Id', operator: 'gte', value: '0' },
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
      // Daha fazla eşleşme modu eklemek isterseniz buraya ekleyebilirsiniz
      default:
          return "eq";
  }
}

export { transformFilter };
