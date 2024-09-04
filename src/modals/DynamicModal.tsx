import  { useState, useEffect, useCallback } from "react";
import { Button, Modal } from "react-bootstrap";
import { IBaseResponseValue, ICrudBaseAPI } from "../utils/types";
import Select, { Options } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { AxiosResponse } from "axios";
import { Calendar } from "primereact/calendar";
import GenericDropdown, { Filter } from "../components/GenericDropdown"; // GenericDropdown bileşenini import edin
import { Checkbox } from "primereact/checkbox";

export enum FormItemTypes {
    input,
    select,
    creatable,
    date,
    genericDropdown,
    boolean
}

export interface FormSelectItem {
    label: string,
    value: string
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
    labelField?: string;
    additionalFilters?: Filter[];
    columnSize?: number;
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
    onChange?: (name: string, value: any) => void; // onChange olayını ekledik
}

function DynamicModal<T>(props: DynamicModalProps<T>) {
    const [isShowing, setShowing] = useState(false);
    const [formItems, setFormItems] = useState<IFormItem[]>([]);

    useEffect(() => {
        setShowing(props.isShownig);
    }, [props.isShownig]);

    useEffect(() => {
        const initializedItems = props.items.map(item => ({
            ...item,
            value: item.value || null,
            setValue: (value: any) => {
                setFormItems(currentItems => currentItems.map(ci =>
                    ci.name === item.name ? { ...ci, value } : ci
                ));
                if (props.onChange) {
                    props.onChange(item.name, value);
                }
            }
        }));
        setFormItems(initializedItems);
    }, [props.items]);

    useEffect(() => {
        if (props.selectedItem) {
            const keys = Object.keys(props.selectedItem);
            setFormItems(currentItems =>
                currentItems.map(item => ({
                    ...item,
                    value: keys.includes(item.name) ? props.selectedItem[item.name] : item.value
                }))
            );
        }
    }, [props.isShownig,props.selectedItem, props.onChange]);

    const onSubmit = useCallback(async () => {
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
            alert(response.data.detail);
            return;
        }

        if (props.onDone) {
            props.onDone();
        }

    }, [formItems, props.api, props.onDone]);

    const modalClassName = `custom-modal-${props.classEki}`; 

    return (
        <Modal show={isShowing} onHide={props.onHide} className={modalClassName}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <form className="form-horizontal form-material" >
                    <div className="row">
                        {/* {JSON.stringify(formItems)} */}
                    {formItems.filter(item => !item.hidden).map((item, index) => (
                        
                        item.type === FormItemTypes.input ? (
                            <div className={`col-md-${item.columnSize || 12} m-b-20`} key={index}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={item.title}
                                    value={item.value || ""}
                                    onChange={(e) => item.setValue && item.setValue(e.target.value)}
                                    required
                                />
                            </div>
                        ) : (item.type === FormItemTypes.select && item.options) ? (
                            <div className={`col-md-${item.columnSize || 12} m-b-20`} key={index}>
                                <Select
                                    defaultValue={item.options.find(x => x.value == item.value)}
                                    placeholder={item.title}
                                    onChange={(selected: any) => item.setValue && item.setValue(selected)}
                                    options={item.options as Options<any>}
                                    isClearable={true}
                                />
                            </div>
                        ) : item.type === FormItemTypes.creatable ? (
                            <div className={`col-md-${item.columnSize || 12} m-b-20`} key={index}>
                                <CreatableSelect
                                    placeholder={item.title}
                                    isMulti
                                    onChange={(items: any) => item.setValue && item.setValue(items.map((x: any) => x.value))}
                                />
                            </div>
                        ) : item.type === FormItemTypes.date ? (
                            <div className={`col-md-${item.columnSize || 12} m-b-20`} key={index}>
                                <Calendar
                                    placeholder={item.title}
                                    onChange={
                                        (e) => {
                                            if (e.value) {
                                                const formattedDate = e.value.toLocaleDateString('en-US');
                                                item.setValue && item.setValue(formattedDate);
                                            } else {
                                                item.setValue && item.setValue('');
                                            }
                                        }
                                    }
                                    dateFormat="mm/dd/yy"
                                    mask="99/99/9999"
                                />
                            </div>
                        ) : item.type === FormItemTypes.boolean ? (
                            <div className={`col-md-${item.columnSize || 12} m-b-20`} key={index}>
                                <label htmlFor="ingredient1" className="ml-2">{item.title}</label>
                                <Checkbox
                                    onChange={(e) => item.setValue && item.setValue(e.target.value)}
                                    checked={item.value}
                                >
                                </Checkbox>
                            </div>
                        ): item.type === FormItemTypes.genericDropdown && item.baseApi && item.returnField && item.labelField ? (
                            <div className={`col-md-${item.columnSize || 12} m-b-20`} key={index}>
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
                                    additionalFilters={item.additionalFilters?.map(x=>({...x,value: formItems.find(y=>y.name==x.item)?.value || -1}))}
                                    className="custom-dropdown"
                                />
                            </div>
                        ) : null
                    ))}
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Kapat
                </Button>
                <Button variant="primary" onClick={() => onSubmit()}>
                    Gönder
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DynamicModal;
