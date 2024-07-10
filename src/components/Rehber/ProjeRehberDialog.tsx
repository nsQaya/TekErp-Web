import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog"



export default(props: {isVisible: boolean, onSelect: (item: any) => void, onHide: ()=> void})=>{
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
}