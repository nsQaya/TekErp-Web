import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog"
import { INetsisSirket } from "../../utils/types/tanimlamalar/INetsisSirket";



const NetsisSirketRehberDialog: React.FC<{ isVisible: boolean; onSelect: (item: INetsisSirket) => void; onHide: () => void }> = (props) => {
    const columns: ColumnProps[] = [
        {
          header: "sirketAdi",
          field: "sirketAdi",
          sortable: true,
          filter: true,
        }
      ];

    return (
        <GenericDialog
            visible={props.isVisible}
            onHide={props.onHide}
            baseApi={api.netsisSirket}
            columns={columns}
            returnField="sirketAdi"
            onSelect={props.onSelect}
            defaultSortField="sirketAdi"
          />
    )
};
export default NetsisSirketRehberDialog;