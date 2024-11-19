import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog"
import { IUnite } from "../../utils/types/tanimlamalar/IUnite";



const UniteRehberDialog: React.FC<{ isVisible: boolean; onSelect: (item: IUnite) => void; onHide: () => void }> = (props) => {
    const columns: ColumnProps[] = [
        {
          header: "Kodu",
          field: "kodu",
          sortable: true,
          filter: true,
        },
        {
          header: "Açıklama",
          field: "aciklama",
          sortable: true,
          filter: true,
        },
      ];

    return (
        <GenericDialog
            visible={props.isVisible}
            onHide={props.onHide}
            baseApi={api.unite}
            columns={columns}
            returnField="kodu"
            onSelect={props.onSelect}
            defaultSortField="kodu"
          />
    )
};
export default UniteRehberDialog;