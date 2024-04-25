import Nav from 'react-bootstrap/Nav';
import SideBarItem from './Sidebar/Item'
import { useState } from 'react';


export default () => {

  const [tanimPages, _] =useState([
    {title: "Ülke", href: "/"},
    {title: "İl", href: "/"},
    {title: "İlçe", href: "/"},
    {title: "Depo", href: "/"},
    {title: "Hücre", href: "/"},
    {title: "Döviz Tipi", href: "/"},
    {title: "Plasiyer Kodu", href: "/"},
    {title: "Proje Kodu", href: "/"},
    {title: "Ünite Kodu", href: "/"},
  ]);

  const [kullaniciPages, __] =useState([
    {title: "Kullanıcılar", href: "/"},
    {title: "Yetkiler", href: "/"},
    {title: "Kullanıcı Yetkileri", href: "/"},
  ]);

  const [stokPages, ___] =useState([
    {title: "Stoklar", href: "/stok/stoks"},
    {title: "Grup Kodu", href: "/"},
    {title: "Kod 1", href: "/stok/code1"},
    {title: "Kod 2", href: "/stok/code2"},
    {title: "Kod 3", href: "/stok/code3"},
    {title: "Kod 4", href: "/stok/code4"},
    {title: "Kod 5", href: "/stok/code5"},
    {title: "Hareketler", href: "/stok/"},
  ]);

  const [cariPages, ____] =useState([
    {title: "Cariler", href: "/cari/caris"},
    {title: "Grup Kodu", href: "/"},
    {title: "Kod 1", href: "/cari/code1"},
    {title: "Kod 2", href: "/cari/code2"},
    {title: "Kod 3", href: "/cari/code3"},
    {title: "Kod 4", href: "/cari/code4"},
    {title: "Kod 5", href: "/cari/code5"},
    {title: "Hareketler", href: "/"},
  ]);

  const [faturaPages, _____] =useState([
    {title: "Satış Faturası", href: "/"},
    {title: "Alış Faturası", href: "/"},
    {title: "Satış İrsaliyesi", href: "/"},
    {title: "Alış İrsaliyesi", href: "/"},
    {title: "Ambar Çıkış Fişi", href: "/"},
    {title: "Ambar Giriş Fişi", href: "/"},
    {title: "Depolar Arası Transfer", href: "/"},
  ]);

  const [eBelgePages, ______] =useState([
    {title: "E-Fatura", href: "/"},
    {title: "E-İrsaliye", href: "/"},
  ]);

  const [aktarimPages, _______] =useState([
    {title: "Stok Aktarım", href: "/"},
    {title: "Stok Kod1 Aktarım", href: "/"},
    {title: "Stok Kod2 Aktarım", href: "/"},
    {title: "Stok Kod3 Aktarım", href: "/"},
    {title: "Stok Kod4 Aktarım", href: "/"},
    {title: "Stok Kod5 Aktarım", href: "/"},
    {title: "Cari Aktarım", href: "/"},
    {title: "Cari Kod1 Aktarım", href: "/"},
    {title: "Cari Kod2 Aktarım", href: "/"},
    {title: "Cari Kod3 Aktarım", href: "/"},
    {title: "Cari Kod4 Aktarım", href: "/"},
    {title: "Cari Kod5 Aktarım", href: "/"},
    {title: "Proje Kodu Aktarım", href: "/"},
    {title: "Ünite Kodu Aktarım", href: "/"},
    {title: "Depo Aktarım", href: "/"},
    {title: "Hücre Aktarım", href: "/"},
    {title: "Döviz Tipi Aktarım", href: "/"},
    {title: "Plasiyer Kodu Aktarım", href: "/"},
  ]);


  return (
    <aside className="left-sidebar">
      <div className="scroll-sidebar">
        <Nav as="nav" bsPrefix='sidebar-nav'>
          <ul id="sidebarnav">
            <li className="nav-small-cap">--- PERSONAL</li>
            <SideBarItem icon='icon-home' name='Anasayfa' href='/' />
            <SideBarItem icon='ti-settings' name='Tanımlamalar' items={tanimPages} count={4}/>
            <SideBarItem icon='ti-user' name='Kullanıcı' items={kullaniciPages} count={4}/>
            <SideBarItem icon='ti-dropbox' name='Stok' items={stokPages} count={4}/>
            <SideBarItem icon='ti-id-badge' name='Cari' items={cariPages} count={4}/>
            <SideBarItem icon='ti-write' name='Fatura' items={faturaPages} count={4}/>
            <SideBarItem icon='ti-cloud-up' name='E-Belge' items={eBelgePages} count={4}/>
            <SideBarItem icon='ti-exchange-vertical' name='Aktarım' items={aktarimPages} count={4}/>
          </ul>
        </Nav>
      </div>
    </aside>
  );
};
