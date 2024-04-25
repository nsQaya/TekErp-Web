import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import api from "../../../utils/api";
import { IBaseResponseValue, IIl } from "../../../utils/types";
import { AxiosResponse } from "axios";


interface IStokKodModalProps {
  show: boolean;
  selected?: IIl
  onHide?: Function;
  onSuccess?: Function;
}

export default (props: IStokKodModalProps) => {
  const [isShowing, setShowing] = useState(false);
  const [id, setID]= useState(0);
  const [code, setCode]= useState("");
  const [name, setName]= useState("");
  const [ulkeId, setUlkeId]= useState(0);
  const [isPending, setPending]= useState(false);

  useEffect(()=>{
    setName(props.selected?.adi || "");
    setCode(props.selected?.plakaKodu || "");
    setUlkeId(props.selected?.ulkeId || 0);
    setID(props.selected?.id || 0)
  },[props.selected])

  useEffect(() => {
    setShowing(props.show);
  }, [props.show]);

  const onSubmit= useCallback(async()=>{
    setPending(true);
  
    let response : AxiosResponse<IBaseResponseValue<IIl>, any>;

    if(id==0){
      response= await api.il.create({
        adi: name,
        plakaKodu: code,
        ulkeId:ulkeId,
        aktarimDurumu: 0,
      });
    }else{
      response= await api.il.update({
        id: id,
        adi: name,
        plakaKodu: code,
        ulkeId:ulkeId,
        aktarimDurumu: 0
      });
    }

    setPending(false);

    if(!response.data.status){
      alert(response.data.detail)
      return;
    }
    
    if(props.onSuccess) props.onSuccess();
    if(props.onHide) props.onHide();

  },[id, code, name]);

  return (
    <Modal show={isShowing} onHide={() => props.onHide && props.onHide()}>
      <Modal.Header closeButton>
        <Modal.Title>İl Ekle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="form-horizontal form-material">
          <div className="form-group">
          <div className="col-md-12 m-b-20">
              <input type="text" className="form-control" placeholder="Ulke" value={ulkeId} onChange={(e)=>[setUlkeId(e.target.valueAsNumber)]} required/>
            </div>
            <div className="col-md-12 m-b-20">
              <input type="text" className="form-control" placeholder="Kodu" value={code} onChange={(e)=>[setCode(e.target.value)]} required/>
            </div>
            <div className="col-md-12 m-b-20">
              <input type="text" className="form-control" placeholder="Adı"  value={name} onChange={(e)=>[setName(e.target.value)]} required/>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" disabled={isPending} onClick={() => props.onHide && props.onHide()}>
            Kapat
          </Button>
          <Button variant="primary" onClick={(e) => [e.preventDefault(), onSubmit()]} disabled={isPending}>
            {isPending && "Oluşturuluyor..."}
            {(!isPending && !id) && "Oluştur"}
            {(!isPending && id) && "Güncelle"}
          </Button>
        </Modal.Footer>
    </Modal>
  );
};
