import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog"
import { ITalepTeklifStokHareket } from "../../utils/types/fatura/ITalepTeklifStokHareket";



const CariRehberDialog: React.FC<{ isVisible: boolean; onSelect: (item: ITalepTeklifStokHareket) => void; onHide: () => void }> = (props) => {
    const columns: ColumnProps[] = [
        {
          header: "BelgeNo",
          field: "belge.no",
          sortable: true,
          filter: true,
        },
        {
          header: "Adı",
          field: "adi",
          sortable: true,
          filter: true,
        },
        {
          header: "Vergi Dairesi",
          field: "vergiDairesi",
          // sortable: true,
          filter: true,
        },
        {
          header: "Vergi Numarası",
          field: "vergiNumarasi",
          // sortable: true,
          filter: true,
        },
        {
          header: "TC Kimlik No",
          field: "tcKimlikNo",
          // sortable: true,
          filter: true,
        },

      ];

    return (
        <GenericDialog
            visible={props.isVisible}
            onHide={props.onHide}
            baseApi={api.talepTeklifStokHareket}
            columns={columns}
            returnField="belgeId"
            onSelect={props.onSelect}
            defaultSortField="belgeId"
            externalFilters={{
              belgeTipi: { value: "907", matchMode: "equals" }, 
            }}
          />
    )
};
export default CariRehberDialog;