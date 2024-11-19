import { useState, useEffect, useCallback, useRef } from "react";
import { IBaseResponseValue, ICrudBaseAPI } from "../utils/types";
import Select, { Options } from "react-select";
import CreatableSelect from "react-select/creatable";
import { AxiosResponse } from "axios";
import { Calendar } from "primereact/calendar";
import GenericDropdown, { Filter } from "../components/GenericDropdown"; // GenericDropdown bileşenini import edin
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from "primereact/floatlabel";
import { Toast } from "primereact/toast";

export enum FormItemTypes {
  input,
  select,
  creatable,
  date,
  genericDropdown,
  boolean,
  rehber,
}

export interface FormSelectItem {
  label: string;
  value: string;
}

export interface IFormItem {
  type: FormItemTypes;
  title: string;
  name: string;
  value?: any;
  setValue?: (value: any) => void;
  options?: FormSelectItem[];
  hidden?: boolean;
  baseApi?: ICrudBaseAPI<any>;
  returnField?: string;
  returnItemName?: string;
  labelField?: string;
  additionalFilters?: Filter[];
  columnSize?: number;
  rehberComponent?: React.ComponentType<any>;
}

interface DynamicModalProps<T> {
  selectedItem?: any;
  title: string;
  api: ICrudBaseAPI<T>;
  items: IFormItem[];
  isShownig: boolean;
  classEki?: string;
  onDone?: Function;
  onHide: () => void;
  onChange?: (name: string, value: any) => void; 
  validator?: (formItems: IFormItem[]) => string | null;
}

function DynamicModal<T>(props: DynamicModalProps<T>) {
  const [isShowing, setShowing] = useState(false);
  const [formItems, setFormItems] = useState<IFormItem[]>([]);
  const [rehberVisible, setRehberVisible] = useState<{[key: string]: boolean;}>({}); 

  
  useEffect(() => {
    setShowing(props.isShownig);
  }, [props.isShownig]);

  useEffect(() => {
    const initializedItems = props.items.map((item) => ({
      ...item,
      //value: item.value || null,
      value: item.type === FormItemTypes.boolean ? item.value ?? 0 : item.value || null,
      setValue: (value: any) => {
        setFormItems((currentItems) =>
          currentItems.map((ci) =>
            ci.name === item.name ? { ...ci, value } : ci
          )
        );
        if (props.onChange) {
          props.onChange(item.name, value);
        }
      },
    }));
    setFormItems(initializedItems);
  }, [props.items]);

  useEffect(() => {
    if (props.selectedItem) {
      const keys = Object.keys(props.selectedItem);
      setFormItems((currentItems) =>
        currentItems.map((item) => ({
          ...item,
          value: keys.includes(item.name)
            ? props.selectedItem[item.name]
            : item.value,
        }))
      );
    }
  }, [props.isShownig, props.selectedItem, props.onChange]);

  const onSubmit = useCallback(async () => {


    if (props.validator) {
        const validationError = props.validator(formItems);
        if (validationError) {
            toast.current?.show({ severity: "error", summary: "Hata", detail: validationError, life: 3000 });

          return;
        }
      }


    var requestItems = formItems.reduce((result: any, item: any) => {
      result[item.name] = item.value?.value || item.value;
      return result;
    }, {});

    let response: AxiosResponse<IBaseResponseValue<any>, any>;

    if (requestItems.id) {
      response = await props.api.update(requestItems);
    } else {
      response = await props.api.create(requestItems);
    }

    if (!response.data.status) {
      const errorMessage = response.data.detail ||
      Object.entries(response.data.errors || {})
        .map(([key, messages]) => `${key}: ${messages.join(", ")}`)
        .join("\n") ||
      "Veriler kaydedilirken bir hata oluştu.";
        toast.current?.show({ severity: "error", summary: "Hata", detail: errorMessage, life: 3000 });
      //alert(response.data.detail);
      return;
    }

    if (props.onDone) {
      props.onDone();
    }
  }, [formItems, props.api, props.onDone, props.validator]);

  const modalClassName = `custom-modal-${props.classEki}`;

  const openRehberModal = (rehberName: string) => {
    setRehberVisible({ ...rehberVisible, [rehberName]: true }); // Belirtilen rehber için görünürlük açılıyor
  };

  const closeRehberModal = (rehberName: string) => {
    setRehberVisible({ ...rehberVisible, [rehberName]: false }); // Belirtilen rehber için görünürlük kapanıyor
  };
  const toast = useRef<Toast>(null);

  return (
    <Dialog
      visible={isShowing}
      onHide={props.onHide}
      className={modalClassName} 
      resizable 
      maximizable 
      //style={{ width: '600px',maxWidth:'600px'  }}
    >
        <Toast ref={toast} />
      <div className="container-fluid">
        <div className="p-fluid p-formgrid p-grid">
          <div className="row">
            {/* {JSON.stringify(formItems)} */}
            {formItems
              .filter((item) => !item.hidden)
              .map((item, index) =>
                item.type === FormItemTypes.input ? (
                  <div
                    className={`col-md-${item.columnSize || 12}  mt-4`}
                    key={index}
                  >
                    <FloatLabel>
                      <label htmlFor={item.name}>{item.title}</label>
                      <InputText
                        id={item.name}
                        className="form-control"
                        //placeholder={item.title}
                        value={item.value || ""}
                        onChange={(e) =>
                          item.setValue && item.setValue(e.target.value)
                        }
                        required
                      />
                    </FloatLabel>
                  </div>
                ) : item.type === FormItemTypes.select && item.options ? (
                  <div
                    className={`col-md-${item.columnSize || 12}  mt-4`}
                    key={index}
                  >
                    <FloatLabel>
                      <label htmlFor={item.name}>{item.title}</label>
                      {/* <Dropdown 
                                   value={item.value}
                                   options={item.options}
                                   onChange={(e) => item.setValue && item.setValue(e.value)}
                                   placeholder={item.title}
                                   showClear={true}
                                   appendTo="self" 
                                /> */}
                      <Select
                        defaultValue={item.options.find(
                          (x) => x.value == item.value
                        )}
                        placeholder={item.title}
                        onChange={(selected: any) =>
                          item.setValue && item.setValue(selected)
                        }
                        options={item.options as Options<any>}
                        isClearable={true}
                      />
                    </FloatLabel>
                  </div>
                ) : item.type === FormItemTypes.creatable ? (
                  <div
                    className={`col-md-${item.columnSize || 12}  mt-4`}
                    key={index}
                  >
                    <CreatableSelect
                      placeholder={item.title}
                      isMulti
                      onChange={(items: any) =>
                        item.setValue &&
                        item.setValue(items.map((x: any) => x.value))
                      }
                    />
                  </div>
                ) : item.type === FormItemTypes.date ? (
                  <div
                    className={`col-md-${item.columnSize || 12}  mt-4`}
                    key={index}
                  >
                    <Calendar
                      placeholder={item.title}
                      onChange={(e) => {
                        if (e.value) {
                          const formattedDate =
                            e.value.toLocaleDateString("en-US");
                          item.setValue && item.setValue(formattedDate);
                        } else {
                          item.setValue && item.setValue("");
                        }
                      }}
                      dateFormat="mm/dd/yy"
                      mask="99/99/9999"
                    />
                  </div>
                ) : item.type === FormItemTypes.boolean ? (
                  <div
                    className={`col-md-${item.columnSize || 12}  mt-4`}
                    key={index}
                  >
                    {/* <label htmlFor="ingredient1" className="ml-2">{item.title}</label> */}
                    {/* <Checkbox
                                    onChange={(e) => item.setValue && item.setValue(e.target.value)}
                                    checked={item.value}
                                >
                                </Checkbox> */}
                    <span style={{ marginRight: "10px" }}>{item.title}</span>

                    <InputSwitch
                      checked={item.value === 1}
                      onChange={(e) => {
                        const newValue = e.value ? 1 : 0;
                        item.setValue && item.setValue(newValue);
                      }
                      }
                    />
                  </div>
                ) : item.type === FormItemTypes.genericDropdown &&
                  item.baseApi &&
                  item.returnField &&
                  item.labelField ? (
                  <div
                    className={`col-md-${item.columnSize || 12}  mt-4`}
                    key={index}
                  >
                    {/* {JSON.stringify(item.additionalFilters?.map(x=>({...x,value: formItems.find(y=>y.name==x.item)?.value})))} */}
                    <GenericDropdown
                      value={item.value}
                      onChange={(selected) => {
                        item.setValue && item.setValue(selected?.value);
                        if (props.onChange) {
                          props.onChange(item.name, selected?.value || null);
                        }
                      }}
                      baseApi={item.baseApi}
                      returnField={item.returnField}
                      labelField={item.labelField}
                      placeholder={item.title}
                      additionalFilters={item.additionalFilters?.map((x) => ({
                        ...x,
                        value:
                          formItems.find((y) => y.name == x.item)?.value || -1,
                      }))}
                      className="custom-dropdown"
                    />
                  </div>
                ) : item.type === FormItemTypes.rehber &&
                  item.rehberComponent &&
                  item.labelField &&
                  item.returnField &&
                  item.returnItemName ? (
                  <div
                    className={`col-md-${item.columnSize || 12}  mt-4`}
                    key={index}
                  >
                    <FloatLabel>
                      <label htmlFor={item.name}>{item.title}</label>
                      <div className="p-inputgroup">
                        <InputText
                          id={item.name}
                          value={
                            item.value && item.labelField
                              ? item.value[item.labelField] || ""
                              : ""
                          } // Değer kontrolü yapılır
                          onChange={(e) =>
                            item.setValue && item.setValue(e.target.value)
                          }
                          disabled
                        />
                        {item.value && (
                          <Button
                            type="button"
                            icon="pi pi-filter-slash"
                            label=""
                            outlined
                            onClick={() => {
                              item.setValue && item.setValue("");
                              const relatedItem = formItems.find(
                                (ci) => ci.name === item.returnItemName
                              );
                              if (relatedItem) {
                                relatedItem.setValue &&
                                  relatedItem.setValue("");
                              }
                            }}
                          />
                        )}
                        <Button
                          icon="pi pi-search"
                          onClick={() => openRehberModal(item.name)} // Rehber modalını açma
                        />
                      </div>
                      {/* Rehber modalı */}
                      <item.rehberComponent
                        isVisible={rehberVisible[item.name]} // Rehber modal görünürlüğü state'den yönetiliyor
                        onHide={() => closeRehberModal(item.name)} // Rehber modali kapatma işlemi
                        onSelect={(selectedValue: any) => {
                          const returnValue = item.returnField
                            ? selectedValue[item.returnField]
                            : selectedValue;

                          const relatedItem = formItems.find(
                            (ci) => ci.name === item.returnItemName
                          );
                          if (relatedItem) {
                            relatedItem.setValue &&
                              relatedItem.setValue(returnValue);
                          }
                          item.setValue && item.setValue(selectedValue);

                          if (props.onChange) {
                            props.onChange(item.name, returnValue);
                          }

                          closeRehberModal(item.name);
                        }}
                      />
                    </FloatLabel>
                  </div>
                ) : null
              )}
          </div>
        </div>
        <div className={`col-md-12 mt-4`}>
          <Button severity="info" onClick={props.onHide}>
            Kapat
          </Button>
          <Button severity="success" onClick={() => onSubmit()}>
            Kaydet
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default DynamicModal;
