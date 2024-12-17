import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog";
import { IStokSayim } from "../../utils/types/stok/IStokSayim";
import { dateFilterTemplate } from "../../utils/helpers/CalendarHelper";


const SayimRehberDialog: React.FC<{ isVisible: boolean; onSelect: (item: IStokSayim) => void; onHide: () => void }> = (props) => {

//export default(props: {isVisible: boolean, onSelect: (item: any) => void, onHide: ()=> void})=>{
    const columns: ColumnProps[] = [
        {
          header: "No",
          field: "no",
          sortable: true,
          filter: true,
        },
        { header: "Tarih", field: "tarih", dataType: "date", sortable: true, filter: true, filterElement:dateFilterTemplate,
                  body: (row: IStokSayim) =>
                    row.tarih
                      ? new Date(row.tarih).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "",
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
            baseApi={api.sayim}
            columns={columns}
            returnField="id"
            onSelect={props.onSelect}
            defaultSortField="no"
            // externalFilters={{
            //   "USK_STATUS": { value: "T", matchMode: "notEquals" }, 
            // }}
          />
    )
};
export default SayimRehberDialog;