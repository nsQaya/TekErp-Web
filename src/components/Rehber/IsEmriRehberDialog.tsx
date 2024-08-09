import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog"
import { IIsEmri } from "../../utils/types/planlama/IIsEmri";


const IsEmriRehberDialog: React.FC<{ isVisible: boolean; onSelect: (item: IIsEmri) => void; onHide: () => void }> = (props) => {

//export default(props: {isVisible: boolean, onSelect: (item: any) => void, onHide: ()=> void})=>{
    const columns: ColumnProps[] = [
        {
          header: "Is Emri No",
          field: "isEmriNo",
          // sortable: true,
          filter: true,
        },
        {
          header: "isEmriNoId",
          field: "isEmriNoId",
          // sortable: true,
          filter: true,
          hidden:false
        },
        {
          header: "Stok Kodu",
          field: "stokKodu",
          // sortable: true,
          filter: true,
        },
        {
          header: "Stok Adı",
          field: "stokAdi",
          // sortable: true,
          filter: true,
        },
        {
          header: "Miktar",
          field: "miktar",
          // sortable: true,
          filter: true,
        },
        {
          header: "Proje Kodu",
          field: "projeKodu",
          // sortable: true,
          filter: true,
        },
        {
          header: "Tarih",
          field: "tarih",
          // sortable: true,
          filter: true,
        },
      ];

    return (
        <GenericDialog<IIsEmri>
            visible={props.isVisible}
            onHide={props.onHide}
            baseApi={api.isEmri}
            columns={columns}
            returnField="isEmriNo"
            onSelect={props.onSelect}
          />
    )
};
export default IsEmriRehberDialog;