import logo from '../assets/images/logo-icon.png'
import lightLogo from '../assets/images/logo-light-icon.png'
import textLogo from '../assets/images/logo-text.png'
import textLightLogo from '../assets/images/logo-light-text.png'
import userLogo from '../assets/images/users/1.jpg';
import Dropdown from 'react-bootstrap/Dropdown';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavbarToggle from 'react-bootstrap/NavbarToggle'
import { useCallback, useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';

export default () => {

  const [isSidebarShowing, setSidebarShowing]= useState(false);

  const onSidebarToggle= useCallback((e: React.MouseEvent<HTMLElement>)=>{
    e.preventDefault();
    window.dispatchEvent(new Event("toggleSidebar"));
  },[]);

  const onToggleSidebar= ()=>{
    setSidebarShowing(!isSidebarShowing);
  }

  const resetUserStore = useUserStore(state => state.reset);

  const handleLogout = () => {
    resetUserStore();
     window.location.href = '/';
  };

  useEffect(() => {
    window.addEventListener("toggleSidebar", onToggleSidebar);

    return () => {
      window.removeEventListener("toggleSidebar", onToggleSidebar);
    };
  }, [onToggleSidebar]);

  return (
    <header className="topbar">
      <Navbar className="top-navbar" expand="md" variant='dark'>

        <div className="navbar-header">

          <Navbar.Brand href="index.html">
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
            <span className='hidden-sm-down'>
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
          </Navbar.Brand>
        </div>

        <Navbar.Collapse>
          <Nav className="me-auto" as={'ul'}>
            <Nav.Item as={'li'}>
              <NavbarToggle className='d-block d-md-none waves-effect waves-dark nav-link' as='a' onClick={onSidebarToggle}>
                <i className={!isSidebarShowing ? "ti-menu": "ti-close"}></i>
              </NavbarToggle>
            </Nav.Item>
            <Nav.Item as={'li'}>
              <Nav.Link href='#' className='sidebartoggler d-none waves-effect waves-dark'>
                <i className="icon-menu"></i>
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Nav className="my-lg-0" as="ul">
            <Dropdown as={'li'} className='nav-item'>
              <Dropdown.Toggle as={'a'} className='nav-link waves-effect waves-dark'>
                <i className="ti-email"></i>
                <div className="notify">
                  <span className="heartbit"></span>
                  <span className="point"></span>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className='animated mailbox bounceInDown' align={'end'}>
                <ul>
                  <li>
                    <div className="drop-title">Notifications</div>
                  </li>
                  <li>
                    <div className='message-center'>
                      <Dropdown.Item href="#">
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
                      </Dropdown.Item>
                    </div>
                  </li>
                  <li>
                    <a className="nav-link text-center link" href="#">
                      <b>Check all notifications</b>
                      <i className="fa fa-angle-right"></i>
                    </a>
                  </li>
                </ul>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown as={'li'} className='nav-item u-pro'>
              <Dropdown.Toggle as={'a'} className='nav-link waves-effect waves-dark profile-pic'>
                <img
                  src={userLogo}
                  alt="user"
                  className="me-2"
                />
                <span className="hidden-md-down">
                  Mark &nbsp;<i className="fa fa-angle-down"></i>
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className='animated flipInY' align='end'>
                <Dropdown.Item href="#">
                  <i className="ti-user"></i> My Profile
                </Dropdown.Item>
                <Dropdown.Item href="#">
                  <i className="ti-wallet"></i> My Balance
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={handleLogout}>
                  <i className="fa fa-power-off"></i> Logout
                </Dropdown.Item>
              </Dropdown.Menu>

            </Dropdown>

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};
