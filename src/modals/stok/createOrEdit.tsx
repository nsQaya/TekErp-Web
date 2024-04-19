import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

interface IStokModalProps {
  show: boolean;
  onHide?: Function;
}

export default (props: IStokModalProps) => {
  const [isShowing, setShowing] = useState(false);

  useEffect(() => {
    setShowing(props.show);
  }, [props.show]);

  return (
    <Modal show={isShowing} onHide={() => props.onHide && props.onHide()}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="form-horizontal form-material">
          <div className="form-group">
            <div className="col-md-12 m-b-20">
              <input
                type="text"
                className="form-control"
                placeholder="Type name"
              />
            </div>
            <div className="col-md-12 m-b-20">
              <input type="text" className="form-control" placeholder="Email" />
            </div>
            <div className="col-md-12 m-b-20">
              <input type="text" className="form-control" placeholder="Phone" />
            </div>
            <div className="col-md-12 m-b-20">
              <input
                type="text"
                className="form-control"
                placeholder="Designation"
              />
            </div>
            <div className="col-md-12 m-b-20">
              <input type="text" className="form-control" placeholder="Age" />
            </div>
            <div className="col-md-12 m-b-20">
              <input
                type="text"
                className="form-control"
                placeholder="Date of joining"
              />
            </div>
            <div className="col-md-12 m-b-20">
              <input
                type="text"
                className="form-control"
                placeholder="Salary"
              />
            </div>
            <div className="col-md-12 m-b-20">
              <div className="fileupload btn btn-primary btn-rounded waves-effect waves-light">
                <span>
                  <i className="ion-upload m-r-5"></i>Upload Contact Image
                </span>
                <input type="file" className="upload" />
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={() => props.onHide && props.onHide()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => props.onHide && props.onHide()}>
            Save Changes
          </Button>
        </Modal.Footer>
    </Modal>
  );
};
