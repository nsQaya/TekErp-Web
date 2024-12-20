import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialog from "../GenericDialog";

import { dateFilterTemplate } from "../../utils/helpers/CalendarHelper";
import { IStokSayimYetki } from "../../utils/types/stok/IStokSayimYetki";
import { getUserIdFromToken } from "../../store/userIdFromToken";


const StokSayimYetkiRehberiDialog: React.FC<{ isVisible: boolean; onSelect: (item: IStokSayimYetki) => void; onHide: () => void }> = (props) => {

//export default(props: {isVisible: boolean, onSelect: (item: any) => void, onHide: ()=> void})=>{
    const columns: ColumnProps[] = [
        {
          header: "No",
          field: "sayim.no",
          sortable: true,
          filter: true,
        },
        { header: "Tarih", field: "tarih", dataType: "date", sortable: true, filter: true, filterElement:dateFilterTemplate,
                  body: (row: IStokSayimYetki) =>
                    row.sayim.tarih
                      ? new Date(row.sayim.tarih).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "",
                },
        {
          header: "Açıklama",
          field: "sayim.aciklama",
          sortable: true,
          filter: true, 
        },
      
      ];

    return (
        <GenericDialog
            visible={props.isVisible}
            onHide={props.onHide}
            baseApi={api.sayimYetki}
            columns={columns}
            returnField="id"
            onSelect={props.onSelect}
            defaultSortField="id"
            externalFilters={{
              "Sayim.Kilit": { value: "0", matchMode: "equals" }, 
              "Gorme":{ value: "1", matchMode: "equals" }, 
              "UserId":{ value: getUserIdFromToken(), matchMode: "equals" }, 
            }}
          />
    )
};
export default StokSayimYetkiRehberiDialog;