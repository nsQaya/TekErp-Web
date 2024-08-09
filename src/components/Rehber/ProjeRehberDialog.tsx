import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog"
import { IProje } from "../../utils/types/tanimlamalar/IProje";



const ProjeRehberDialog: React.FC<{ isVisible: boolean; onSelect: (item: IProje) => void; onHide: () => void }> = (props) => {
    const columns: ColumnProps[] = [
        {
          header: "Kodu",
          field: "kodu",
          // sortable: true,
          filter: true,
        },
        {
          header: "Açıklama",
          field: "aciklama",
          // sortable: true,
          filter: true,
        },
      ];

    return (
        <GenericDialog
            visible={props.isVisible}
            onHide={props.onHide}
            baseApi={api.proje}
            columns={columns}
            returnField="kodu"
            onSelect={props.onSelect}
          />
    )
};
export default ProjeRehberDialog;