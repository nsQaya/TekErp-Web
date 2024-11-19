import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog"
import { IHucre } from "../../utils/types/tanimlamalar/IHucre";

const HucreRehberDialog: React.FC<{ isVisible: boolean; onSelect: (item: IHucre) => void; onHide: () => void }> = (props) => {
    const columns: ColumnProps[] = [
        {
          header: "Kodu",
          field: "kodu",
          sortable: true,
          filter: true,
        }

      ];

    return (
        <GenericDialog
            visible={props.isVisible}
            onHide={props.onHide}
            baseApi={api.hucre}
            columns={columns}
            returnField="kodu"
            onSelect={props.onSelect}
            defaultSortField="kodu"
          />
    )
};
export default HucreRehberDialog;