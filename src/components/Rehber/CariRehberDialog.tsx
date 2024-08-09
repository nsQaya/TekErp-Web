import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog"
import { ICari } from "../../utils/types/cari/ICari";



const CariRehberDialog: React.FC<{ isVisible: boolean; onSelect: (item: ICari) => void; onHide: () => void }> = (props) => {
    const columns: ColumnProps[] = [
        {
          header: "Kodu",
          field: "kodu",
          // sortable: true,
          filter: true,
        },
        {
          header: "Adı",
          field: "adi",
          // sortable: true,
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
            baseApi={api.cari}
            columns={columns}
            returnField="kodu"
            onSelect={props.onSelect}
          />
    )
};
export default CariRehberDialog;