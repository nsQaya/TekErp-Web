import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog"
import { IDepo } from "../../utils/types/tanimlamalar/IDepo";


const DepoRehberDialog: React.FC<{ isVisible: boolean; onSelect: (item: IDepo) => void; onHide: () => void }> = (props) => {
    const columns: ColumnProps[] = [
        {
          header: "Kodu",
          field: "kodu",
          sortable: true,
          filter: true,
        },
        {
          header: "Adi",
          field: "adi",
          sortable: true,
          filter: true,
        }


      ];

    return (
        <GenericDialog
            visible={props.isVisible}
            onHide={props.onHide}
            baseApi={api.depo}
            columns={columns}
            returnField="kodu"
            onSelect={props.onSelect}
            defaultSortField="kodu"
          />
    )
};
export default DepoRehberDialog;