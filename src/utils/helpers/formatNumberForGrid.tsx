export const formatNumber= (value:number, decimalDigits:number)=> {
    return format(value,decimalDigits);
}

const format = (value: number, decimalDigits: number, locale = "tr-TR") => {
    return new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: decimalDigits,
      maximumFractionDigits: decimalDigits,
    }).format(value);
  };