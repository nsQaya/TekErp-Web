import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialogWithFetchData from "../GenericDialogWithFetchData";
import { ITalepStokForSiparis } from "../../utils/types/fatura/ITalepStokForSiparis";
import { dateFilterTemplate } from "../../utils/helpers/CalendarHelper";
import { formatNumber } from "../../utils/helpers/formatNumberForGrid";
import { miktarDecimal } from "../../utils/config";




const CariRehberDialog: React.FC<{
   isVisible: boolean;
   onSelect: (item: ITalepStokForSiparis) => void; onHide: () => void }> = (props) => {
    const columns: ColumnProps[] = [
        {
          header: "BelgeNo",
          field: "belge.no",
          sortable: true,
          filter: true,
        },
        {
          header: "Stok Kodu",
          field: "stokKarti.kodu",
          sortable: true,
          filter: true,
        },   
        {
          header: "Stok Adı",
          field: "stokKarti.adi",
          sortable: true,
          filter: true,
        },
        {
          header: "Miktar",
          field: "miktar",
          dataType:"numeric",
          sortable: true,
          filter: true,
          body:((row:ITalepStokForSiparis) => 
            {return ( <div style={{ textAlign: "right" }}>  {formatNumber(row.miktar,miktarDecimal)} </div>)})
        },
       
        {
          header: "Sipariş Miktar",
          field: "siparisMiktar",
          dataType:"numeric",
          sortable: true,
          filter: true,
          body:((row:ITalepStokForSiparis) => 
            {return ( <div style={{ textAlign: "right" }}>  {formatNumber(row.siparisMiktar,miktarDecimal)} </div>)})
        },
        {
          header: "Teslim Tarihi",
          field: "teslimTarihi",
          dataType: "date",
          sortable: true,
          filter: true,
          filterElement:dateFilterTemplate,
          body: (row: ITalepStokForSiparis) =>
            row.teslimTarihi
              ? new Date(row.teslimTarihi).toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "",
        },
       

      ];

    return (
        <GenericDialogWithFetchData
            visible={props.isVisible}
            onHide={props.onHide}
            baseApi={api.talepTeklifStokHareket}
            apiMethodName="getListTalepStokForSiparis"
            columns={columns}
            onSelect={props.onSelect}
            defaultSortField="id"
            // externalFilters={{
            //   belgeTipi: { value: "907", matchMode: "equals" }, 
            // }}
          />
    )
};
export default CariRehberDialog;