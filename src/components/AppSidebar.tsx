import Nav from 'react-bootstrap/Nav';
import SideBarItem from './Sidebar/Item'

export default () => {
  return (
    <aside className="left-sidebar">
      <div className="scroll-sidebar">
        <Nav as="nav" bsPrefix='sidebar-nav'>
          <ul id="sidebarnav">
            <li className="nav-small-cap">--- PERSONAL</li>
            <SideBarItem/>
            <li>
              <a className="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false">
                <i className="icon-speedometer"></i>
                <span className="hide-menu">Dashboard
                  <span className="badge rounded-pill bg-cyan ms-auto">4</span>
                </span>
              </a>
              <ul aria-expanded="false" className="collapse">
                <li><a href="index.html">Minimal </a></li>
                <li><a href="index2.html">Analytical</a></li>
                <li><a href="index3.html">Demographical</a></li>
                <li><a href="index4.html">Modern</a></li>
              </ul>
            </li>

            <li>
              <a className="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false">
                <i className="ti-layout-grid2"></i>
                <span className="hide-menu">Apps</span>
              </a>
              <ul aria-expanded="false" className="collapse">
                <li><a href="app-calendar.html">Calendar</a></li>
                <li><a href="app-chat.html">Chat app</a></li>
                <li><a href="app-ticket.html">Support Ticket</a></li>
                <li><a href="app-contact.html">Contact / Employee</a></li>
                <li><a href="app-contact2.html">Contact Grid</a></li>
                <li><a href="app-contact-detail.html">Contact Detail</a></li>
                <li> <a className="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false"><span className="hide-menu">Inbox</span></a>
                  <ul aria-expanded="false" className="collapse">
                    <li><a href="app-email.html">Mailbox</a></li>
                    <li><a href="app-email-detail.html">Mailbox Detail</a></li>
                    <li><a href="app-compose.html">Compose Mail</a></li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </Nav>
      </div>
    </aside>
  );
};
