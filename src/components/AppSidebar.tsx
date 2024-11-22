import Nav from 'react-bootstrap/Nav';
import SideBarItem from './Sidebar/Item'
import { useState } from 'react';

export default () => {

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };
  
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };
  // const resetUserStore = useUserStore(state => state.reset);
  // const handleLogout = () => {
  //   resetUserStore();
  //    window.location.href = '/';
  // };

  const [tanimPages] =useState([
    {title: "Ülke", href: "/tanimlamalar/ulkes"},
    {title: "İl", href: "/tanimlamalar/ils"},
    {title: "İlçe", href: "/tanimlamalar/ilces"},
    {title: "Depo", href: "/tanimlamalar/depoes"},
    {title: "Hücre", href: "/tanimlamalar/hucres"},
    {title: "Döviz Tipi", href: "/tanimlamalar/dovizTipis"},
    {title: "Plasiyer Kodu", href: "/tanimlamalar/plasiyers"},
    {title: "Proje Kodu", href: "/tanimlamalar/projes"},
    {title: "Ünite Kodu", href: "/tanimlamalar/unites"},
    {title: "Belge Seri", href: "/tanimlamalar/belgeSeris"},
  ]);

  const [kullaniciPages] =useState([
    {title: "Kullanıcılar", href: "/kullanicilar/kullanici"},
    {title: "Yetkiler", href: "/"},
    {title: "Kullanıcı Yetkileri", href: "/kullanicilar/kullaniciyetki"},
  ]);

  const [stokPages] =useState([
    {title: "Stoklar", href: "/stok/stoks"},
    {title: "Grup Kodu", href: "/stok/groupCode"},
    {title: "Kod 1", href: "/stok/code1"},
    {title: "Kod 2", href: "/stok/code2"},
    {title: "Kod 3", href: "/stok/code3"},
    {title: "Kod 4", href: "/stok/code4"},
    {title: "Kod 5", href: "/stok/code5"},
    {title: "Hareketler", href: "/stok/stokHareketler"},
  ]);

  const [cariPages] =useState([
    {title: "Cariler", href: "/cari/caris"},
    {title: "Grup Kodu", href: "/cari/groupCode"},
    {title: "Kod 1", href: "/cari/code1"},
    {title: "Kod 2", href: "/cari/code2"},
    {title: "Kod 3", href: "/cari/code3"},
    {title: "Kod 4", href: "/cari/code4"},
    {title: "Kod 5", href: "/cari/code5"},
    // {title: "Hareketler", href: "/"},
  ]);

  const [faturaPages] =useState([
   // {title: "Satış Faturası", href: "/fatura/satisfaturaliste"},
   // {title: "Alış Faturası", href: "/fatura/alisfaturaliste"},
   // {title: "Satış İrsaliyesi", href: "/fatura/satisirsaliyeliste"},
   // {title: "Alış İrsaliyesi", href: "/fatura/alisirsaliyeliste"},
    {title: "Ambar Çıkış Fişi", href: "/fatura/ambarcikisfisiliste"},
   // {title: "Ambar Giriş Fişi", href: "/fatura/ambargirisfisiliste"},
    {title: "Depolar Arası Transfer", href: "/fatura/depolararasitransferliste"},
    {title: "Netsis Siparis Fatura Onay", href: "/fatura/netsisSiparisFaturaOnay"},
  ]);

  const [talepSiparis] =useState([
    {title: "Satın Alma Talep", href: "/talepsiparis/satinalmatalepliste"},
    {title: "Satın Alma Sipariş", href: "/talepsiparis/satinalmasiparisliste"},
    {title: "Satın Alma Sipariş", href: "/talepsiparis/satinalmasiparisfisi"},
    {title: "Sipariş Açma Kapama", href: "/talepsiparis/siparisacmakapama"},
  ]);

  // const [eBelgePages] =useState([
  //   {title: "E-Fatura", href: "/"},
  //   {title: "E-İrsaliye", href: "/"},
  // ]);

  const [aktarimPages] =useState([
    {title: "Stok Aktarım", href: "/"},
    // {title: "Stok Kod1 Aktarım", href: "/"},
    // {title: "Stok Kod2 Aktarım", href: "/"},
    // {title: "Stok Kod3 Aktarım", href: "/"},
    // {title: "Stok Kod4 Aktarım", href: "/"},
    // {title: "Stok Kod5 Aktarım", href: "/"},
    // {title: "Cari Aktarım", href: "/"},
    // {title: "Cari Kod1 Aktarım", href: "/"},
    // {title: "Cari Kod2 Aktarım", href: "/"},
    // {title: "Cari Kod3 Aktarım", href: "/"},
    // {title: "Cari Kod4 Aktarım", href: "/"},
    // {title: "Cari Kod5 Aktarım", href: "/"},
    // {title: "Proje Kodu Aktarım", href: "/"},
    // {title: "Ünite Kodu Aktarım", href: "/"},
    // {title: "Depo Aktarım", href: "/"},
    // {title: "Hücre Aktarım", href: "/"},
    // {title: "Döviz Tipi Aktarım", href: "/"},
    // {title: "Plasiyer Kodu Aktarım", href: "/"},
  ]);

  const [raporPages] =useState([
    {title: "İhtiyaç Planlama", href: "/rapor/ihtiyacPlanlamaRapor"},
    {title: "Sac Planlama", href: "/planlama/sacPlanlama"}
  ]);

  const [uretimPages] =useState([
    {title: "Üretim Sonu Kaydı Listesi", href: "/uretim/netsisUretimSonuKaydiListe"},
    {title: "Üretim Sonu Kaydı", href: "/uretim/netsisUretimSonuKaydi"},
    {title: "Depo İzin", href: "/uretim/netsisDepoIzin"},
    
  ]);

  const [planlamaPages] =useState([
    {title: "İhtiyaç Planlama", href: "/planlama/ihtiyacPlanlama"},
    {title: "Sac Planlama", href: "/planlama/sacPlanlama"}
  ]);
  const [profilPages] =useState([
    {title: "Oturumu Kapat",href:"/kullanicilar/logout"},
    //{ title: "Tablet Tam Ekran", onClick: toggleFullscreen }
  ]);
  


  return (
    <aside className="left-sidebar">
      <div className="scroll-sidebar">
        <Nav as="nav" bsPrefix='sidebar-nav'>
          <ul id="sidebarnav">
            <li className="nav-small-cap">--- PERSONAL</li>
            <SideBarItem icon='icon-home' name='' href='/' />
            <SideBarItem icon='ti-settings' name='Tanımlamalar' items={tanimPages} count={1}/>
            <SideBarItem icon='ti-agenda' name='Kullanıcı' items={kullaniciPages} count={1}/>
            <SideBarItem icon='ti-dropbox' name='Stok' items={stokPages} count={1}/>
            <SideBarItem icon='ti-id-badge' name='Cari' items={cariPages} count={1}/>
            <SideBarItem icon='ti-write' name='Fatura' items={faturaPages} count={1}/>
            <SideBarItem icon='ti-pencil-alt' name='Talep Sipariş' items={talepSiparis} count={1}/>
            {/* <SideBarItem icon='ti-cloud-up' name='E-Belge' items={eBelgePages} count={1}/> */}
            <SideBarItem icon='ti-hummer' name='Üretim' items={uretimPages} count={1}/>
            <SideBarItem icon='ti-clipboard' name='Planlama' items={planlamaPages} count={1}/>
            <SideBarItem icon='ti-exchange-vertical' name='Aktarım' items={aktarimPages} count={1}/>
            <SideBarItem icon='ti-printer' name='Rapor' items={raporPages} count={1} />
            <SideBarItem icon='ti-user' name='Profil' items={profilPages} count={1} />
            <li>
            <button onClick={toggleFullscreen} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
   Tablet Tam Ekran</button>
            </li>
          
            {/* <li>
            <button onClick={handleLogout} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
            Çıkış </button>
            </li> */}
          </ul>
        </Nav>
      </div>
    </aside>
  );
};
