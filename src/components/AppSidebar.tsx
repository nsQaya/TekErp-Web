import Nav from 'react-bootstrap/Nav';
import SideBarItem from './Sidebar/Item'
import { useState } from 'react';

export default () => {
  const [examplePages, _] =useState([{title: "Minimal", href: "index.html"}]);
  return (
    <aside className="left-sidebar">
      <div className="scroll-sidebar">
        <Nav as="nav" bsPrefix='sidebar-nav'>
          <ul id="sidebarnav">
            <li className="nav-small-cap">--- PERSONAL</li>
            <SideBarItem icon='icon-speedometer' name='Dashboard' items={examplePages} />
            <SideBarItem icon='"ti-layout-grid2' name='Apps' items={examplePages} count={4}/>
          </ul>
        </Nav>
      </div>
    </aside>
  );
};
