import { ColumnProps } from "primereact/column";
import api from "../../utils/api";
import GenericDialogWithFetchData from "../GenericDialogWithFetchData";
import { ITalepStokForSiparis } from "../../utils/types/fatura/ITalepStokForSiparis";
import { dateFilterTemplate } from "../../utils/helpers/CalendarHelper";
import { formatNumber } from "../../utils/helpers/formatNumberForGrid";
import { miktarDecimal } from "../../utils/config";




const TalepStokRehberDialog: React.FC<{
   isVisible: boolean;
   onSelect: (item: ITalepStokForSiparis) => void; onHide: () => void }> = (props) => {
    const columns: ColumnProps[] = [
        {
          header: "Belge No",
          field: "belgeNo",
          sortable: true,
          filter: true,
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
          dataType:"numeric",
          sortable: true,
          filter: true,
          body:((row:ITalepStokForSiparis) => 
            {return ( <div style={{ textAlign: "right" }}>  {formatNumber(row.miktar,miktarDecimal)} </div>)})
        },
        {
          header: "Kalan Miktar",
          field: "kalanMiktar",
          dataType:"numeric",
          sortable: true,
          filter: true,
          body:((row:ITalepStokForSiparis) => 
            {return ( <div style={{ textAlign: "right" }}>  {formatNumber(row.kalanMiktar,miktarDecimal)} </div>)})
        },
        // {
        //   header: "Sipariş Miktarrw",
        //   field: "siparisStokHarekets.belgeId",
        //   dataType:"numeric",
        //   sortable: true,
        //   filter: true,
        //   // body:((row:ITalepStokForSiparis) => 
        //   //   {return ( <div style={{ textAlign: "right" }}>  {formatNumber(row.siparisMiktar,miktarDecimal)} </div>)})
        // },
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
            externalFilters={{
              "KalanMiktar": { value: "0", matchMode: "gt" }, 
            }}
          />
    )
};
export default TalepStokRehberDialog;