import Nav from 'react-bootstrap/Nav';
import SideBarItem from './Sidebar/Item'
import { useState } from 'react';


export default () => {


  const [cariPages, _] =useState([
    {title: "Stoklar", href: "/stok/stoks"},
    {title: "Grup Kodu", href: "/"},
    {title: "Kod 1", href: "/stok/code1"},
    {title: "Kod 2", href: "/"},
    {title: "Kod 3", href: "/"},
    {title: "Kod 4", href: "/"},
    {title: "Kod 5", href: "/"},
    {title: "Hareketler", href: "/"},
  ]);

  return (
    <aside className="left-sidebar">
      <div className="scroll-sidebar">
        <Nav as="nav" bsPrefix='sidebar-nav'>
          <ul id="sidebarnav">
            <li className="nav-small-cap">--- PERSONAL</li>
            <SideBarItem icon='icon-home' name='Anasayfa' href='/' />

            <SideBarItem icon='ti-eye' name='Stok' items={cariPages} count={4}/>
          </ul>
        </Nav>
      </div>
    </aside>
  );
};
