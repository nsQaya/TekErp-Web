import { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { IBaseResponseValue, ICrudBaseAPI } from "../utils/types";
import Select, { Options } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { AxiosResponse } from "axios";

export enum FormItemTypes {
    input,
    select,
    creatable
}
export interface FormSelectItem {
    label: string,
    value: string
}
export interface IFormItem {
    type: FormItemTypes,
    title: string;
    name: string;
    value?: string;
    setValue?: (value: string) => void;
    options?: FormSelectItem[];
    hidden?: boolean;
}

interface DynamicModalProps<T> {
    selectedItem?: any;
    title: string;
    api: ICrudBaseAPI<T>;
    items: IFormItem[]
    isShownig: boolean;
    onDone?: Function;
    onHide: ()=>void;
}

function DynamicModal<T>(props: DynamicModalProps<T>) {
    const [isShowing, setShowing] = useState(false);
    const [formItems, setFormItems] = useState<IFormItem[]>([]);

    useEffect(()=>{
        setShowing(props.isShownig);
    },[props.isShownig])

    useEffect(() => {
        const initializedItems = props.items.map(item => ({
            ...item,
            value: "",
            setValue: (value: string) => {
                setFormItems(currentItems => currentItems.map(ci =>
                    ci.name === item.name ? { ...ci, value } : ci
                ));
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
    }, [props.selectedItem]);

    const onSubmit= useCallback(async ()=>{
        var requestItems = formItems.reduce((result: any, item:any) => {
            result[item.name] = item.value.value || item.value;
            return result;
        }, {});


        let response : AxiosResponse<IBaseResponseValue<any>, any>;

        if(requestItems.id){
            response= await props.api.update(requestItems);
        }else{
            response= await props.api.create(requestItems);
        }

        if(!response.data.status){
            alert(response.data.detail)
            return;
        }

        if(props.onDone){
            props.onDone();
        }

    },[formItems]);

    return (
        <Modal show={isShowing} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form-horizontal form-material">
                    {formItems.filter(item=>!item.hidden).map((item, index) => (
                        item.type === FormItemTypes.input ? (
                            <div className="col-md-12 m-b-20" key={index}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={item.title}
                                    value={item.value}
                                    onChange={(e) => item.setValue && item.setValue(e.target.value)}
                                    required
                                />
                            </div>
                        ) : (item.type === FormItemTypes.select && item.options) ? (
                            <div className="col-md-12 m-b-20" key={index}>
                                <Select
                                    defaultValue={item.options.find(x=>x.value==item.value)}
                                    placeholder={item.title}
                                    

                                    onChange={(selected: any) => item.setValue && item.setValue(selected)}
                                    options={item.options as Options<any>}
                                />
                            </div>
                        ) : item.type === FormItemTypes.creatable ? (

                            <div className="col-md-12 m-b-20" key={index}>
                                <CreatableSelect
                                    
                                    placeholder={item.title}
                                    isMulti
                                    onChange={(items:any)=>item.setValue && item.setValue(items.map((x:any)=>x.value))}
                                />
                            </div>
                        ) : null
                    ))}
                </form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Kapat
                </Button>
                <Button variant="primary" onClick={()=>onSubmit()}>
                    Gönder
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DynamicModal;