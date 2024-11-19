import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog"
import { INetsisCariOdemeKodu } from "../../utils/types/cari/INetsisCariOdemeKodu";



const CariRehberDialog: React.FC<{ isVisible: boolean; onSelect: (item: INetsisCariOdemeKodu) => void; onHide: () => void }> = (props) => {
    const columns: ColumnProps[] = [
        {
          header: "Ödeme Kodu",
          field: "odemeKodu",
          sortable: true,
          filter: true,
        },
        {
          header: "Açıklama",
          field: "aciklama",
          sortable: true,
          filter: true,
        }

      ];

    return (
        <GenericDialog
            visible={props.isVisible}
            onHide={props.onHide}
            baseApi={api.netsisCariOdemeKodu}
            columns={columns}
            returnField="odemeKodu"
            onSelect={props.onSelect}
            defaultSortField="odemeKodu"
          />
    )
};
export default CariRehberDialog;