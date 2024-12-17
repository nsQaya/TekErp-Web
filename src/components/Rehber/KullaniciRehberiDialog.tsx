import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog";
import { IKullanici } from "../../utils/types/kullanici/IKullanici";


const KullaniciRehberDialog: React.FC<{ isVisible: boolean; onSelect: (item: IKullanici) => void; onHide: () => void }> = (props) => {

//export default(props: {isVisible: boolean, onSelect: (item: any) => void, onHide: ()=> void})=>{
    const columns: ColumnProps[] = [
        {
          header: "Kullanıcı Adı",
          field: "firstName",
          sortable: true,
          filter: true,
        },
        {
          header: "Soyadı",
          field: "lastName",
           sortable: true,
          filter: true,
          //hidden:true
        },
       
      ];

    return (
        <GenericDialog<IKullanici>
            visible={props.isVisible}
            onHide={props.onHide}
            baseApi={api.kullanici}
            columns={columns}
            returnField="firstName"
            onSelect={props.onSelect}
            defaultSortField="firstName"
            // externalFilters={{
            //   "USK_STATUS": { value: "T", matchMode: "notEquals" }, 
            // }}
          />
    )
};
export default KullaniciRehberDialog;