import { ColumnFilterElementTemplateOptions } from "primereact/column";
import { EAktarimDurumu } from "../types/enums/EAktarimDurumu";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { EAmbarFisiCikisYeri } from "../types/enums/EAmbarFisiCikisYeri";
import { EAmbarHareketTur } from "../types/enums/EAmbarHareketTur";
import { EBelgeTip } from "../types/enums/EBelgeTip";


const kilitliMiOptions = [
  { label: "Evet", value: "1" },
  { label: "Hayır", value: "0" }
];

export const kilitliMiDDFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
  return (
    <Dropdown
      value={options.value}
      options={kilitliMiOptions}
      onChange={(e: DropdownChangeEvent) => {
        options.filterApplyCallback(e.value);
      }}
      placeholder="Seçiniz"
    />
  );
};

// Dropdown filtresi
const aktarimDurumuOptions = Object.keys(EAktarimDurumu)
  //.filter((key) => !isNaN(Number(EAktarimDurumu[key as keyof typeof EAktarimDurumu])))
  .filter((key) => isNaN(Number(key)))
  .map((key) => ({
    label: key,
    value: EAktarimDurumu[key as keyof typeof EAktarimDurumu],
  }));

export const aktarimDurumuDDFilterTemplate = (options: ColumnFilterElementTemplateOptions,
  defaultValue?: keyof typeof EAktarimDurumu
) => {

    return (
      <Dropdown 
      value={options.value || EAktarimDurumu[defaultValue as keyof typeof EAktarimDurumu]}
      options={aktarimDurumuOptions}
      onChange={(e: DropdownChangeEvent) => {
            options.filterApplyCallback(e.value);
      }}
      placeholder="Seçiniz"
      
      />
    );
  };

  const ambarFisiCikisYeriOptions = Object.keys(EAmbarFisiCikisYeri)
  //.filter((key) => !isNaN(Number(EAktarimDurumu[key as keyof typeof EAktarimDurumu])))
  .filter((key) => isNaN(Number(key)))
  .map((key) => ({
    label: key,
    value: EAmbarFisiCikisYeri[key as keyof typeof EAmbarFisiCikisYeri],
  }));

export const ambarFisiCikisYeriDDFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {

    return (
      <Dropdown 
      value={options.value}
      options={ambarFisiCikisYeriOptions}
      onChange={(e: DropdownChangeEvent) => {
            options.filterApplyCallback(e.value);
      }}
      placeholder="Seçiniz"
      
      />
    );
  };

  const ambarHareketTurOptions = Object.keys(EAmbarHareketTur)
  //.filter((key) => !isNaN(Number(EAktarimDurumu[key as keyof typeof EAktarimDurumu])))
  .filter((key) => isNaN(Number(key)))
  .map((key) => ({
    label: key,
    value: EAmbarHareketTur[key as keyof typeof EAmbarHareketTur],
  }));

export const ambarHareketTurDDFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {

    return (
      <Dropdown 
      value={options.value}
      options={ambarHareketTurOptions}
      onChange={(e: DropdownChangeEvent) => {
            options.filterApplyCallback(e.value);
      }}
      placeholder="Seçiniz"
      
      />
    );
  };

  const belgeTipOptions = Object.keys(EBelgeTip)
  //.filter((key) => !isNaN(Number(EAktarimDurumu[key as keyof typeof EAktarimDurumu])))
  .filter((key) => isNaN(Number(key)))
  .map((key) => ({
    label: key,
    value: EBelgeTip[key as keyof typeof EBelgeTip],
  }));

export const belgeTipDDFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {

    return (
      <Dropdown 
      value={options.value}
      options={belgeTipOptions}
      onChange={(e: DropdownChangeEvent) => {
            options.filterApplyCallback(e.value);
      }}
      placeholder="Seçiniz"
      
      />
    );
  };