
import { Calendar } from "primereact/calendar";
import { ColumnFilterElementTemplateOptions } from "primereact/column";



export const dateFilterTemplate = (
  options: ColumnFilterElementTemplateOptions
) => {
  return (
    <Calendar
      value={options.value} // Calendar'ın seçilen değeri
      onChange={(e) => {
        options.filterApplyCallback(e.value);
      }} // Tarih değişimini callback ile bildiriyoruz
      dateFormat="dd/mm/yy" // Türkçe tarih formatı
      placeholder="gg/aa/yyyy"
      mask="99/99/9999"
      showIcon // Takvim simgesi
      locale="tr" // Türkçe yerelleştirme kullan
    />
  );
};
