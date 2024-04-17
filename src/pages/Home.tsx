import { Link } from "react-router-dom";

export default () => {
  return (
    <div className="container-fluid">
      <div className="row page-titles">
        <div className="col-md-5 align-self-center">
          <h4 className="text-themecolor">Dashboard 1</h4>
        </div>
        <div className="col-md-7 align-self-center text-end">
          <div className="d-flex justify-content-end align-items-center">
            <ol className="breadcrumb justify-content-end">
              <li className="breadcrumb-item">
                <a href="javascript:void(0)">Home</a>
              </li>
              <li className="breadcrumb-item active">Dashboard 1</li>
            </ol>
            <button
              type="button"
              className="btn btn-info d-none d-lg-block m-l-15 text-white"
            >
              <i className="fa fa-plus-circle"></i> Create New
            </button>
          </div>
        </div>
      </div>
      <div className="row g-0">
        <div className="col-lg-3 col-md-6">
          <div className="card border">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex no-block align-items-center">
                    <div>
                      <h3>
                        <i className="icon-screen-desktop"></i>
                      </h3>
                      <p className="text-muted">MYNEW CLIENTS</p>
                    </div>
                    <div className="ms-auto">
                      <h2 className="counter text-primary">23</h2>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="progress">
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
