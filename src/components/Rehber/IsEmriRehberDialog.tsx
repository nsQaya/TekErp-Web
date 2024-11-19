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
          sortable: true,
          filter: true,
        },
        {
          header: "isEmriNoId",
          field: "isEmriNoId",
          // sortable: true,
          filter: true,
          hidden:true
        },
        {
          header: "Stok Kodu",
          field: "stokKodu",
          sortable: true,
          filter: true,
        },
        {
          header: "Stok Adı",
          field: "stokAdi",
          sortable: true,
          filter: true,
        },
        {
          header: "Miktar",
          field: "miktar",
          //sortable: true,
          filter: true,
        },
        {
          header: "Proje Kodu",
          field: "projeKodu",
          sortable: true,
          filter: true,
        },
        {
          header: "Tarih",
          field: "tarih",
          filter: true,
          // filterFunction: (value, filter) => {
          //   // Tarihi 'dd-MM-yyyy' formatına çevir
          //   const formattedDate = new Date(value).toLocaleDateString('tr-TR', {
          //     day: '2-digit',
          //     month: '2-digit',
          //     year: 'numeric',
          //   }).replace(/\./g, '-'); // Noktaları tire ile değiştir
        
          //   return formattedDate.includes(filter);
          // },
          //  body: (rowData) => {
          //    // Tarihi 'dd-MM-yyyy' formatında göster
          //    const formattedDate = new Date(rowData.tarih).toLocaleDateString('tr-TR', {
          //      day: '2-digit',
          //      month: '2-digit',
          //      year: 'numeric',
          //    }).replace(/\./g, '-'); // Noktaları tire ile değiştir
        
          //    return formattedDate;
          //  }
        }
      ];

    return (
        <GenericDialog<IIsEmri>
            visible={props.isVisible}
            onHide={props.onHide}
            baseApi={api.isEmri}
            columns={columns}
            returnField="isEmriNo"
            onSelect={props.onSelect}
            defaultSortField="isEmriNo"
          />
    )
};
export default IsEmriRehberDialog;