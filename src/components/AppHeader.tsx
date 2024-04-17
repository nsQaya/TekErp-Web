import logo from '../assets/images/logo-icon.png'
import lightLogo from '../assets/images/logo-light-icon.png'
import textLogo from '../assets/images/logo-text.png'
import textLightLogo from '../assets/images/logo-light-text.png'
import userLogo from '../assets/images/users/1.jpg';

export default () => {
  
  return (
    <header className="topbar">
      <nav className="navbar top-navbar navbar-expand-md navbar-dark">
        <div className="navbar-header">
          <a className="navbar-brand" href="index.html">
            <b>
              <img
                src={logo}
                alt="homepage"
                className="dark-logo"
              />

              <img
                src={lightLogo}
                alt="homepage"
                className="light-logo"
              />
            </b>
            <span>
              <img
                src={textLogo}
                alt="homepage"
                className="dark-logo"
              />

              <img
                src={textLightLogo}
                className="light-logo"
                alt="homepage"
              />
            </span>
          </a>
        </div>

        <div className="navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a
                className="nav-link nav-toggler d-block d-md-none waves-effect waves-dark"
                href="javascript:void(0)"
              >
                <i className="ti-menu"></i>
              </a>
            </li>
            <li className="nav-item">
              
              <a
                className="nav-link sidebartoggler d-none d-lg-block d-md-block waves-effect waves-dark"
                href="javascript:void(0)"
              >
                <i className="icon-menu"></i>
              </a>
            </li>
          </ul>

          <ul className="navbar-nav my-lg-0">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle waves-effect waves-dark"
                href=""
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                
                <i className="ti-email"></i>
                <div className="notify">
                  
                  <span className="heartbit"></span>
                  <span className="point"></span>
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-end mailbox animated bounceInDown">
                <ul>
                  <li>
                    <div className="drop-title">Notifications</div>
                  </li>
                  <li>
                    <div className="message-center">
                      <a href="javascript:void(0)">
                        <div className="btn btn-danger btn-circle text-white">
                          <i className="fa fa-link"></i>
                        </div>
                        <div className="mail-contnet">
                          <h5>Luanch Admin</h5>
                          <span className="mail-desc">
                            Just see the my new admin!
                          </span>
                          <span className="time">9:30 AM</span>
                        </div>
                      </a>

                      <a href="javascript:void(0)">
                        <div className="btn btn-success btn-circle text-white">
                          <i className="ti-calendar"></i>
                        </div>
                        <div className="mail-contnet">
                          <h5>Event today</h5>
                          <span className="mail-desc">
                            Just a reminder that you have event
                          </span>
                          <span className="time">9:10 AM</span>
                        </div>
                      </a>

                      <a href="javascript:void(0)">
                        <div className="btn btn-info btn-circle text-white">
                          <i className="ti-settings"></i>
                        </div>
                        <div className="mail-contnet">
                          <h5>Settings</h5>
                          <span className="mail-desc">
                            You can customize this template as you want
                          </span>
                          <span className="time">9:08 AM</span>
                        </div>
                      </a>

                      <a href="javascript:void(0)">
                        <div className="btn btn-primary btn-circle">
                          <i className="ti-user"></i>
                        </div>
                        <div className="mail-contnet">
                          <h5>Pavan kumar</h5>
                          <span className="mail-desc">
                            Just see the my admin!
                          </span>
                          <span className="time">9:02 AM</span>
                        </div>
                      </a>
                    </div>
                  </li>
                  <li>
                    <a
                      className="nav-link text-center link"
                      href="javascript:void(0);"
                    >
                      
                      <strong>Check all notifications</strong>
                      <i className="fa fa-angle-right"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </li>

           
            <li className="nav-item dropdown u-pro">
              <a
                className="nav-link dropdown-toggle waves-effect waves-dark profile-pic"
                href=""
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  src={userLogo}
                  alt="user"
                  className=""
                />
                <span className="hidden-md-down">
                  Mark &nbsp;<i className="fa fa-angle-down"></i>
                </span>
              </a>
              <div className="dropdown-menu dropdown-menu-end animated flipInY show">
                <a href="javascript:void(0)" className="dropdown-item">
                  <i className="ti-user"></i> My Profile
                </a>

                <a href="javascript:void(0)" className="dropdown-item">
                  <i className="ti-wallet"></i> My Balance
                </a>

                <a href="javascript:void(0)" className="dropdown-item">
                  <i className="ti-email"></i> Inbox
                </a>

                <div className="dropdown-divider"></div>

                <a href="javascript:void(0)" className="dropdown-item">
                  <i className="ti-settings"></i> Account Setting
                </a>
                <div className="dropdown-divider"></div>
                <a href="login.html" className="dropdown-item">
                  <i className="fa fa-power-off"></i> Logout
                </a>
              </div>
            </li>

          </ul>
        </div>
      </nav>
    </header>
  );
};
